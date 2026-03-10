export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Основной домен, отдаем как есть
  if (hostname === "cgcasino.app" || hostname === "www.cgcasino.app") {
    return env.ASSETS.fetch(request);
  }

  // Берём поддомен
  const subdomain = hostname.split(".")[0];

  // Определяем путь для ассетов
  let assetPath = url.pathname;
  if (assetPath === "/") {
    assetPath = `/${subdomain}/index.html`;
  } else {
    assetPath = `/${subdomain}${assetPath}`;
  }

  try {
    // Создаём новый Request только с путём, без изменения host
    const assetRequest = new Request(assetPath, {
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
