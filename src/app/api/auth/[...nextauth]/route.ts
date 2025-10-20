import { fetchMe } from "./../../../../../lib/apis";

export async function GET() {
  const me = await fetchMe();
  return Response.json(me);
}
