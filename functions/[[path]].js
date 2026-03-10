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
  
  // 3. Если мы УЖЕ в папке поддомена (защита от циклов), отдаем как есть
  if (url.pathname.startsWith(`/${sub}/`)) {
    return env.ASSETS.fetch(request);
  }

  // 4. Генерируем внутренний путь
  // Если зашли на корень поддомена, берем /sub/index.html
  const newPath = url.pathname === '/' ? `/${sub}/index.html` : `/${sub}${url.pathname}`;
  const newUrl = new URL(newPath, url.origin);

  // 5. Запрашиваем файл напрямую из системы ассетов
  const response = await env.ASSETS.fetch(new Request(newUrl, request));

  // 6. Если в папке поддомена файла НЕТ (404), пробуем отдать из корня
  if (response.status === 404) {
    return env.ASSETS.fetch(request);
  }

  return response;
}
