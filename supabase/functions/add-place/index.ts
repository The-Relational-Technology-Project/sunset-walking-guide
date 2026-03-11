import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Validate API key
  const apiKey = req.headers.get("x-api-key");
  const curatorKey = Deno.env.get("CURATOR_API_KEY");

  if (!apiKey || apiKey !== curatorKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    // Validate required fields
    const required = ["id", "name", "lat", "lng", "time_layers", "description"];
    const missing = required.filter((f) => body[f] === undefined || body[f] === null);
    if (missing.length > 0) {
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${missing.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!Array.isArray(body.time_layers) || body.time_layers.length === 0) {
      return new Response(
        JSON.stringify({ error: "time_layers must be a non-empty array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role to bypass RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const place = {
      id: body.id,
      name: body.name,
      lat: body.lat,
      lng: body.lng,
      time_layers: body.time_layers,
      description: body.description,
      address: body.address ?? null,
      thumbnail: body.thumbnail ?? "/placeholder.svg",
      photo_credit: body.photo_credit ?? null,
      drawing: body.drawing ?? null,
      drawing_credit: body.drawing_credit ?? null,
      audio: body.audio ?? null,
      links: body.links ?? null,
      sort_order: body.sort_order ?? 0,
    };

    const { data, error } = await supabase.from("places").upsert(place, { onConflict: "id" }).select().single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, place: data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
