export async function requestNarrative(payload) {
  const endpoint = import.meta.env.VITE_AI_PROXY_URL || 'http://localhost:8787/api/narrative';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`AI proxy failed: ${res.status}`);
  return res.json();
}
