import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { webhookUrl, payload, secret, retries = 0 } = await req.json();

    if (!webhookUrl || !payload) {
      return new Response(
        JSON.stringify({ error: "Missing webhookUrl or payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (secret) {
      const signature = await crypto.subtle.sign(
        { name: "HMAC" },
        await crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(secret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        ),
        new TextEncoder().encode(JSON.stringify(payload))
      );

      const signatureHex = Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      headers["x-heysheet-signature"] = `sha256=${signatureHex}`;
    }

    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!webhookRes.ok) {
      console.error(
        `Webhook failed to send (attempt ${retries + 1}):`,
        webhookRes.status,
        webhookRes.statusText
      );

      // Implement retry logic with exponential backoff
      const MAX_RETRIES = 5;
      if (retries < MAX_RETRIES) {
        const delay = Math.pow(2, retries) * 1000; // Exponential backoff (1s, 2s, 4s, 8s, 16s)
        console.log(`Retrying in ${delay / 1000} seconds...`);
        // In a real-world scenario, you'd re-invoke the function with a delay
        // For this example, we'll just return an error and assume an external
        // retry mechanism (e.g., a queue or another function invocation)
        // would handle the actual delayed retry.
        // For now, we'll just indicate failure and the need for retry.
        return new Response(
          JSON.stringify({
            error: "Webhook delivery failed, retry needed",
            status: webhookRes.status,
            statusText: webhookRes.statusText,
            retries: retries + 1,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      } else {
        console.error("Max retries reached for webhook delivery.");
        // Log to a dead-letter queue or monitoring system
        return new Response(
          JSON.stringify({
            error: "Webhook delivery failed after max retries",
            status: webhookRes.status,
            statusText: webhookRes.statusText,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      console.log("Webhook sent successfully!");
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
