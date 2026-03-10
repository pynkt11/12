export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Игнорируем основной домен, чтобы не зациклиться
  if (hostname === 'cgcasino.app' || hostname === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  // Поддомен (например, 'kent')
  const sub = hostname.split('.')[0];

  // Если корень поддомена — отдаем /sub/index.html
  let assetPath = url.pathname;
  if (url.pathname === '/') {
    assetPath = `/${sub}/index.html`;
  }

  // Создаем новый запрос к ассетам
  const newRequest = new Request(new URL(assetPath, request.url), request);
  let response = await env.ASSETS.fetch(newRequest);

  // Если файла нет — fallback на корень ассетов
  if (response.status === 404) {
    response = await env.ASSETS.fetch(request);
  }

  return response;
}
