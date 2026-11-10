import { chunks } from '../../lib/chunks';

export const prerender = true;
export function GET() {
  return new Response(JSON.stringify({ chunks }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
