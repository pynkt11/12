export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const host = url.hostname;
  const sub = host.split('.')[0];

  // 1. Если это не поддомен (главный сайт) — просто отдаем контент
  if (host === 'cgcasino.app' || host === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  // 2. Формируем путь к файлу для поддомена
  // Если пользователь зашел на корень поддомена, ищем index.html в нужной папке
  const newPath = `/sites/${sub}${url.pathname === '/' ? '/index.html' : url.pathname}`;
  
  // Создаем новый URL на основе оригинального запроса
  const newUrl = new URL(newPath, url.origin);
  const newRequest = new Request(newUrl, request);

  // 3. Пытаемся получить файл
  const response = await env.ASSETS.fetch(newRequest);

  // 4. Если файл найден — отдаем его. 
  // Если 404 — попробуем вернуть главный сайт или ошибку
  return response;
}
