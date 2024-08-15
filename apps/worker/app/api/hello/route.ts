import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  let responseText = 'Hello World'

  const myKv = getRequestContext().env.KV;
  await myKv.put("foo", "bar");
  const foo = await myKv.get("foo");

  return new Response(JSON.stringify({ responseText, foo }));
}
