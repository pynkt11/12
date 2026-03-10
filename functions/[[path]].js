export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Игнорируем основной домен
  if (hostname === "cgcasino.app" || hostname === "www.cgcasino.app") {
    return env.ASSETS.fetch(request);
  }

  const subdomain = hostname.split(".")[0];

  // Определяем путь в ассетах
  let pathname = url.pathname === "/" ? `/${subdomain}/index.html` : `/${subdomain}${url.pathname}`;

  // Создаём новый URL для fetch с origin pages
  const assetUrl = new URL(pathname, request.url);

  try {
    const assetRequest = new Request(assetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "manual"
    });

    let response = await env.ASSETS.fetch(assetRequest);

    // Если 404 — fallback на корень
    if (response.status === 404) {
      response = await env.ASSETS.fetch(request);
    }

    return response;
  } catch (err) {
    return new Response("Worker error: " + err.message, { status: 500 });
  }
}
