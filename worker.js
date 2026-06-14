// ============================================================
//  The Chicken Lady — Groq Proxy Worker
//  Deployed on Cloudflare Workers
//  Your GROQ_API_KEY is stored as a Cloudflare Secret —
//  it never appears in this file or in any browser.
// ============================================================

export default {
  async fetch(request, env) {

    // Allow CORS so your quiz page can call this worker
    const corsHeaders = {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      // Get the prompt from the quiz page
      const body = await request.json();
      const { prompt } = body;

      if (!prompt) {
        return new Response(JSON.stringify({ error: "No prompt provided" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Call Groq — the key comes from Cloudflare Secrets, never exposed
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model:       "llama3-8b-8192",
          temperature: 0.85,
          max_tokens:  500,
          messages:    [{ role: "user", content: prompt }],
        }),
      });

      if (!groqResponse.ok) {
        const errText = await groqResponse.text();
        return new Response(JSON.stringify({ error: errText }), {
          status: groqResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await groqResponse.json();

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
