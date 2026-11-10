import { problems, tournaments } from '../../lib/data';

export const prerender = true;
export function GET() {
  return new Response(JSON.stringify({ problems, tournaments }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
