import { useEffect, useRef, useState } from "react";
// ONNX Runtime Web will be loaded via CDN as window.ort

// Loads a script tag only once per URL
function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

// Simple throttle helper
function shouldRun(lastRunRef: React.MutableRefObject<number>, intervalMs: number): boolean {
  const now = Date.now();
  if (now - lastRunRef.current >= intervalMs) {
    lastRunRef.current = now;
    return true;
  }
  return false;
}

const HANDS_CDN_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe";
// Pin ORT Web to a stable version to avoid SIMD/threaded JSEP issues on some CPUs
const ORT_VERSION = "1.14.0";
const ORT_CDN = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/ort.min.js`;
const MODEL_PATH = (import.meta as any).env?.VITE_ONNX_MODEL_PATH || "/model.onnx";

const HandGestureDetector = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState<string>("");
  const throttleRef = useRef<number>(0);
  const [started, setStarted] = useState<boolean>(false);

  // Allow external buttons (e.g., in DemoSection) to start/stop the detector
  useEffect(() => {
    const onStart = () => setStarted(true);
    const onStop = () => setStarted(false);
    window.addEventListener("start-detector", onStart);
    window.addEventListener("stop-detector", onStop);
    return () => {
      window.removeEventListener("start-detector", onStart);
      window.removeEventListener("stop-detector", onStop);
    };
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    let hands: any = null;
    let ortSession: any = null;
    let classLabels: string[] | null = null;
    let destroyed = false;

    async function init() {
      try {
        // Load MediaPipe bundles via CDN so we don't require npm deps
        await Promise.all([
          loadScriptOnce(`${HANDS_CDN_BASE}/hands/hands.js`),
          loadScriptOnce(`${HANDS_CDN_BASE}/camera_utils/camera_utils.js`),
          loadScriptOnce(`${HANDS_CDN_BASE}/drawing_utils/drawing_utils.js`),
          loadScriptOnce(ORT_CDN),
        ]);

         if (destroyed) return;

        const video = videoRef.current!;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get 2D context");
        ctxRef.current = ctx;

        // Proactively request camera permission and attach stream to video element
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
          video.srcObject = stream;
          // Autoplay policies: ensure video is ready
          await new Promise<void>((res) => {
            if (video.readyState >= 1) return res();
            video.onloadedmetadata = () => res();
          });
          await video.play().catch(() => {});
        } catch (camErr: any) {
          throw new Error(`Camera access failed: ${camErr?.message || camErr}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const HandsCtor: any = (window as any).Hands;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const drawConnectors: any = (window as any).drawConnectors;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const drawLandmarks: any = (window as any).drawLandmarks;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const HAND_CONNECTIONS: any = (window as any).HAND_CONNECTIONS;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ort: any = (window as any).ort;

        if (!HandsCtor) {
          throw new Error("MediaPipe Hands scripts not available");
        }
        if (!ort) {
          throw new Error("ONNX Runtime Web not available");
        }

        // Configure ORT Web to avoid cross-origin isolation requirements in dev
        // Use single-threaded, no proxy worker, and point to CDN for wasm binaries
        try {
          ort.env.wasm.wasmPaths = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VERSION}/dist/`;
          // Force non-SIMD, single-threaded build to avoid CPU feature issues
          ort.env.wasm.simd = false;
          ort.env.wasm.numThreads = 1;
          ort.env.wasm.proxy = false;
        } catch {
          // ignore env assignment errors
        }

        // Load class labels if available
        try {
          const resp = await fetch("/labels.json", { cache: "no-store" });
          if (resp.ok) {
            const arr = (await resp.json()) as string[];
            if (Array.isArray(arr) && arr.length > 0) {
              classLabels = arr;
              console.log("[DBG] Loaded class labels:", arr);
            }
          }
        } catch {
          // optional
        }

        // Initialize ONNX session with explicit WASM EP and conservative opts
        console.log("Loading ONNX model from:", MODEL_PATH);
        // Fetch as ArrayBuffer to avoid MIME/caching issues
        let modelBuffer: ArrayBuffer;
        try {
          const resp = await fetch(MODEL_PATH, { cache: "no-store" });
          if (!resp.ok) throw new Error(`model fetch ${resp.status}`);
          modelBuffer = await resp.arrayBuffer();
        } catch (fetchErr: any) {
          console.error("Model fetch failed:", fetchErr?.message || fetchErr);
          throw new Error("Failed to fetch ONNX model. See console.");
        }

        try {
          ortSession = await ort.InferenceSession.create(modelBuffer, {
            executionProviders: ["wasm"],
            graphOptimizationLevel: "disabled",
          });
          console.log("ORT session created. Inputs:", (ortSession as any).inputNames, "Outputs:", (ortSession as any).outputNames);
        } catch (sessErr: any) {
          console.error("ORT session create failed:", sessErr?.message || sessErr);
          throw new Error("Cannot create ONNX session (see console)");
        }

        hands = new HandsCtor({
          locateFile: (file: string) => `${HANDS_CDN_BASE}/hands/${file}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults(async (results: any) => {
          if (destroyed) return;
          const width = video.videoWidth;
          const height = video.videoHeight;
          canvas.width = width;
          canvas.height = height;
          ctx.save();
          ctx.clearRect(0, 0, width, height);
          // Draw the video frame
          ctx.drawImage(results.image, 0, 0, width, height);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const handLandmarks = results.multiHandLandmarks[0];
            // Draw landmarks
            if (drawConnectors && drawLandmarks && HAND_CONNECTIONS) {
              drawConnectors(ctx, handLandmarks, HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 3 });
              drawLandmarks(ctx, handLandmarks, { color: "#FF0000", lineWidth: 1 });
            }

            // Build 63-length keypoints [x,y,z] for 21 landmarks
            const keypoints: number[] = [];
            for (const lm of handLandmarks) {
              keypoints.push(lm.x, lm.y, lm.z);
            }

            if (keypoints.length === 63 && shouldRun(throttleRef, 100) && ortSession) {
                try {
                    // Prepare input tensor: [1,63] float32
                    const input = new Float32Array(63);
                    for (let i = 0; i < 63; i++) input[i] = keypoints[i];
                    const tensor = new ort.Tensor("float32", input, [1, 63]);
                  
                    // Run inference (assume single output)
                    const feeds: Record<string, any> = {};
                    const inputName = ortSession.inputNames?.[0] ?? "input";
                    feeds[inputName] = tensor;
                  
                    const ortResults = await ortSession.run(feeds);
                    const outNames = ortSession.outputNames?.length ? ortSession.outputNames : Object.keys(ortResults);
                  
                    let predictedLabel = "";
                  
                    for (const name of outNames) {
                      const candidate = (ortResults as any)[name];
                      if (candidate && candidate.data && typeof candidate.data.length === "number") {
                        const data = candidate.data;
                        console.log(
                          `[DBG] Output '${name}' shape=[${candidate.dims}], type=${candidate.type}, first values=[${Array.from(
                            data as any
                          )
                            .slice(0, Math.min(5, (data as any).length))
                            .join(",")}]`
                        );
                  
                        if ((data as any).length === 1) {
                          const singleVal = (data as any)[0];
                  
                          // ✅ Directly use string label from model
                          if (typeof singleVal === "string") {
                            predictedLabel = singleVal.replace(/\(\d+\)/, "").trim(); // remove "(1)" if present
                          } else if (typeof singleVal === "number") {
                            const idx = Math.round(singleVal);
                            predictedLabel =
                              classLabels && classLabels[idx]
                                ? classLabels[idx]
                                : `Gesture ${idx}`;
                          }
                        } else if ((data as any).length > 1) {
                          // Multi-element output: assume logits → take argmax
                          const arr = Array.from(data as any) as number[];
                          const maxIdx = arr.indexOf(Math.max(...arr));
                          predictedLabel =
                            classLabels && classLabels[maxIdx]
                              ? classLabels[maxIdx]
                              : `Gesture ${maxIdx}`;
                        }
                  
                        if (predictedLabel) break;
                      }
                    }
                  
                    if (predictedLabel) {
                      console.log(`[DBG] Predicted: ${predictedLabel}`);
                      if (!destroyed) setLabel(predictedLabel);
                    } else {
                      console.log("[DBG] No valid label found");
                    }
                  } catch (e) {
                    console.error("[DBG] Inference error:", e);
                  }
                  
            }
          }

          ctx.restore();
        });

        // Process frames using requestAnimationFrame
        const processFrame = async () => {
          if (destroyed) return;
          if (!video.videoWidth || !video.videoHeight) {
            rafId = requestAnimationFrame(processFrame);
            return;
          }
          try {
            await hands.send({ image: video });
          } finally {
            rafId = requestAnimationFrame(processFrame);
          }
        };
        rafId = requestAnimationFrame(processFrame);
      } catch (e: any) {
        setError(e?.message || "Failed to initialize hand detector");
      }
    }

    if (started) {
      init();
    }

    return () => {
      destroyed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      try {
        if (hands && hands.close) hands.close();
      } catch {
        // noop
      }
    };
  }, [started]);

  return (
    <div id="detector" className="w-full flex flex-col items-center gap-3 py-8">
      {error && <div className="text-red-500">{error}</div>}
      {!started ? (
        <button
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
          onClick={() => setStarted(true)}
        >
          Start Real-time Detection
        </button>
      ) : (
        <button
          className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground my-8"
          onClick={() => setStarted(false)}
        >
          Stop
        </button>
      )}
      <div className="relative w-full max-w-xl">
        {started && (
          <div className="relative flex flex-col mx-2 w-full overflow-hidden rounded-lg">
          <video
          ref={videoRef}
          className="w-full rounded-lg shadow-md"
          playsInline
          muted
          autoPlay
          style={{ transform: "scaleX(-1)" }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ transform: "scaleX(-1)" }}
        />
       
        </div>
        )}
         
      </div>
      <div className="text-sm text-muted-foreground">{label ? `Prediction: ${label}` : started ? "Show your hand to the camera" : "Click Start to initialize the model"}</div>
    </div>
  );
};

export default HandGestureDetector;


