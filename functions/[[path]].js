export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // 1. Игнорируем основной домен
  if (hostname === 'cgcasino.app' || hostname === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  // 2. Определяем поддомен
  const sub = hostname.split('.')[0];
  
  // 3. Формируем путь строго к файлу, а не к папке
  // Если зашли в корень или по адресу /beton -> отдаем /beton/index.html
  let targetPath;
  if (url.pathname === '/' || url.pathname === `/${sub}`) {
    targetPath = `/${sub}/index.html`;
  } else {
    targetPath = `/${sub}${url.pathname}`;
  }

  // 4. Создаем новый запрос БЕЗ редиректа
  const newRequest = new Request(new URL(targetPath, url.origin), request);

  // 5. Отдаем файл
  return env.ASSETS.fetch(newRequest);
}
