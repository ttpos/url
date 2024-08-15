import type { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const context = getRequestContext();

  const myKv = context.env.KV;
  const kv = await myKv.get("kv");

  const ps = context.env.DB.prepare("SELECT * from users");
  const data = await ps.first();

  return new Response(
    JSON.stringify({
      msg: "hello word",
      kv: kv,
      db: data,
    })
  );
}
