export async function onRequest() {
  return Response.json({ ok: true, service: "rolins-pages-functions" });
}
