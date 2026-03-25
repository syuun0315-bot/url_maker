export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "Vercel API running" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const userMessage = req.body?.message?.trim();

    if (!userMessage) {
      return res.status(400).json({ error: "message required" });
    }

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: userMessage,
      }),
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(500).json({
        error: "OpenAI request failed",
        status: openaiRes.status,
        openai: data,
      });
    }

    let reply = "";

    if (typeof data.output_text === "string" && data.output_text.trim()) {
      reply = data.output_text.trim();
    } else if (Array.isArray(data.output)) {
      for (const item of data.output) {
        if (item.type === "message" && Array.isArray(item.content)) {
          for (const c of item.content) {
            if (c.type === "output_text" && c.text) {
              reply += c.text;
            }
          }
        }
      }
      reply = reply.trim();
    }

    if (!reply) {
      return res.status(500).json({
        error: "No reply text in OpenAI response",
        openai: data,
      });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({
      error: "server error",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}
