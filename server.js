import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_, res) => res.json({ ok: true, service: 'deliver-ai-proxy' }));

app.post('/api/narrative', async (req, res) => {
  try {
    const { state, decision, memory } = req.body || {};
    if (!state) return res.status(400).json({ error: 'Missing game state.' });

    // Safe fallback narrative. Replace callProvider() with OpenAI/Anthropic if API keys are configured.
    const narrative = await callProvider({ state, decision, memory }).catch(() => null);
    if (narrative) return res.json(narrative);

    return res.json({
      narrative: 'The organization reacts cautiously. Your decision changes trust, pressure, and delivery confidence. The next move will reveal whether the system absorbs the shock or exposes deeper structural weakness.',
      stakeholderMemory: 'Stakeholders remember whether you escalated with clarity, protected capacity, or hid risk.',
      coaching: 'Good project leadership separates pressure from commitment. Never confuse urgency with evidence.',
      riskSignal: 'Watch delivery health, stakeholder trust, and burnout together. One weak metric can recover. Three weak metrics create collapse.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Narrative engine failed.', detail: err.message });
  }
});

async function callProvider(payload) {
  // Production hook. Keep provider keys only on the server.
  // Implement OpenAI or Anthropic here, then return strict JSON.
  if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) return null;
  return null;
}

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`DELIVER AI proxy running on ${port}`));
