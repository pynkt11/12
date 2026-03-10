export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Основной домен отдаем как есть
  if (hostname === "cgcasino.app" || hostname === "www.cgcasino.app") {
    return env.ASSETS.fetch(request);
  }

  const subdomain = hostname.split(".")[0];

  // Определяем путь в папке поддомена
  let assetPath = url.pathname === "/" ? `/` : url.pathname;

  try {
    // Создаём новый Request и переписываем его путь в подпапку поддомена
    const assetRequest = new Request(new URL(`/${subdomain}${assetPath}`, request.url), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "manual"
    });

    let response = await env.ASSETS.fetch(assetRequest);

    // Если файл не найден, fallback на корень
    if (response.status === 404) {
      response = await env.ASSETS.fetch(request);
    }

    return response;
  } catch (err) {
    return new Response("Worker error: " + err.message, { status: 500 });
  }
}
