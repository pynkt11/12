export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // 1. Игнорируем основной домен, чтобы не зациклиться
  if (hostname === 'cgcasino.app' || hostname === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  // 2. Вытаскиваем поддомен (например, 'beton')
  const sub = hostname.split('.')[0];

  // 3. Генерируем внутренний путь
  // Если зашли на корень поддомена, берем /sub/index.html
  // Но НЕ добавляем поддомен в путь для запроса
  const internalPath = url.pathname === '/' ? `/${sub}/index.html` : url.pathname;

  // 4. Запрашиваем файл напрямую из ассетов
  const newRequest = new Request(new URL(internalPath, request.url), request);
  let response = await env.ASSETS.fetch(newRequest);

  // 5. Если файла нет (404), пробуем отдать как fallback
  if (response.status === 404) {
    response = await env.ASSETS.fetch(request);
  }

  return response;
}
