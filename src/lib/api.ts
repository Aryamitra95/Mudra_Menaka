// Lightweight API helper to call the backend prediction endpoint

export async function predictGesture(keypoints: number[]): Promise<string> {
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || "";
  const url = `${backendBaseUrl}/api/predict`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keypoints }),
  });

  if (!response.ok) {
    throw new Error(`Prediction request failed: ${response.status}`);
  }

  const data = (await response.json()) as { label?: string };
  return data.label ?? "";
}


