export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // 1. Если это главный домен - отдаем как есть
  if (hostname === 'cgcasino.app' || hostname === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  // 2. Определяем поддомен (beton, kent и т.д.)
  const sub = hostname.split('.')[0];
  
  // 3. Строим внутренний путь. 
  // Если зашли на корень, берем /sub/index.html, иначе /sub/путь
  const targetPath = url.pathname === '/' ? `/${sub}/index.html` : `/${sub}${url.pathname}`;
  
  // 4. Генерируем новый URL для запроса ассетов
  const newUrl = new URL(targetPath, url.origin);

  // 5. Пробуем достать файл
  const response = await env.ASSETS.fetch(new Request(newUrl, request));

  // 6. Если файл в папке поддомена не найден (404), 
  // отдаем файл из корня (на всякий случай)
  if (response.status === 404) {
    return env.ASSETS.fetch(request);
  }

  return response;
}
