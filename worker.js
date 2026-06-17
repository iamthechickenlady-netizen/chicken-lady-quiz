export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method === "GET") {
      return new Response(JSON.stringify({ status: "Chicken Lady Proxy is alive!" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      if (!env.GROQ_API_KEY) {
        return new Response(JSON.stringify({ error: "GROQ_API_KEY secret is missing" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await request.json();
      const action = body.action || "quiz";

      // ── ACTION: generate quiz result via Groq ──
      if (action === "quiz") {
        const { prompt } = body;
        if (!prompt) {
          return new Response(JSON.stringify({ error: "No prompt provided" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + env.GROQ_API_KEY,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0.85,
            max_tokens: 600,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        const groqText = await groqRes.text();
        if (!groqRes.ok) {
          return new Response(JSON.stringify({ error: "Groq error", details: groqText }), {
            status: groqRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(groqText, {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // ── ACTION: generate image via Google Imagen ──
      if (action === "image") {
        if (!env.GOOGLE_API_KEY) {
          return new Response(JSON.stringify({ error: "GOOGLE_API_KEY secret is missing" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { imagePrompt } = body;
        if (!imagePrompt) {
          return new Response(JSON.stringify({ error: "No imagePrompt provided" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const imgRes = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=" + env.GOOGLE_API_KEY,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              instances: [{ prompt: imagePrompt }],
              parameters: {
                sampleCount: 1,
                aspectRatio: "1:1",
                safetySetting: "block_only_high",
              },
            }),
          }
        );

        const imgText = await imgRes.text();
        if (!imgRes.ok) {
          return new Response(JSON.stringify({ error: "Imagen error", details: imgText }), {
            status: imgRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const imgData = JSON.parse(imgText);
        const b64 = imgData.predictions && imgData.predictions[0] && imgData.predictions[0].bytesBase64Encoded;
        if (!b64) {
          return new Response(JSON.stringify({ error: "No image returned", raw: imgText }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ image: b64 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
