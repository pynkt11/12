export async function onRequest(context) {
  return new Response("SCRIPT IS RUNNING", {
    status: 200,
    headers: { "content-type": "text/plain" }
  });
}
