import { ImageResponse } from "@vercel/og";
import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseServer = createClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let score = 0;
  if (id) {
    const { data } = await supabaseServer
      .from("games")
      .select("total_score")
      .eq("id", id)
      .single();
    score = data?.total_score ?? 0;
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #b91c1c, #7f1d1d)",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 4, marginBottom: 16, opacity: 0.9 }}>
          CORNELLGUESSR
        </div>
        <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1 }}>
          {score.toLocaleString()}
        </div>
        <div style={{ fontSize: 24, opacity: 0.7, marginTop: 12 }}>
          out of 25,000 points
        </div>
        <div style={{ fontSize: 16, opacity: 0.5, marginTop: 32 }}>
          Can you beat me? cornellguessr.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
