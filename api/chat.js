// api/chat.js  —  Vercel Serverless Function
// Keeps your Anthropic API key on the server (never exposed in the browser).
//
// SETUP:
// 1. In your Vercel project: Settings → Environment Variables → add
//      ANTHROPIC_API_KEY = sk-ant-...   (your key from console.anthropic.com)
// 2. Deploy. This becomes available at  https://your-site.com/api/chat
// 3. In index.html, the chat already posts to "/api/chat" in production mode
//    (see the note in the sendMsg() function).

const SYSTEM_PROMPT = `You are the SNS Assistant, the AI intake agent for SNS Technology — an IT and low-voltage systems integrator based in the Wayne, New Jersey area.

WHAT SNS DOES:
- Security cameras (HD/4K, indoor/outdoor, multi-site, remote viewing)
- Networking & structured cabling (Cisco Meraki cloud-managed Wi-Fi & switching)
- VoIP / 3CX business phone systems (auto-attendants, call flows)
- Pro AV, digital signage, and LED video walls
- Sound systems, stage & event AV setups
- Intercom / IP door entry
- Occasional electrical work
- Managed IT (MSP): flat-rate monthly monitoring, support, and maintenance
Service area: New Jersey. The business is licensed and insured.

YOUR JOB — qualify incoming work requests and respond immediately and helpfully:
1) Greet warmly and find out what the person needs (which service / problem).
2) Ask focused follow-ups: type of business, location/town in NJ, rough size or scope (e.g. # of cameras, # of phones, square footage, event date), and timeline/urgency.
3) Give genuinely useful, honest guidance about options and what to expect. You may give ballpark considerations but NEVER invent firm prices — say a scoped quote will follow.
4) Capture a name and the best contact (phone or email) so the SNS team can follow up. Confirm what you've gathered before wrapping up.
5) For urgent/emergency issues (cameras down, phones dead, event tonight), acknowledge the urgency and prioritize getting their contact + location fast.

STYLE: Concise, friendly, confident, plain-language. Keep replies short (2-5 sentences), one question at a time.

LANGUAGE: Detect the user's language and reply in it. Fluent in English, Turkish, and Spanish. If they write Turkish, answer in Turkish.

Do not claim to have booked anything or to have access to systems you don't have. You collect info and hand off to the human team.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array required" });
    }

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    const data = await r.json();
    const reply = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: "agent_error" });
  }
}
