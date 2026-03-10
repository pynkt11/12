export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Если это корень основного домена - ничего не трогаем
  if (hostname === 'cgcasino.app' || hostname === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  // Вычисляем поддомен (например, 'beton')
  const sub = hostname.split('.')[0];
  
  // Если в пути уже есть название папки (например, /beton/...), 
  // отдаем файл как есть, чтобы не зациклиться
  if (url.pathname.startsWith(`/${sub}/`)) {
    return env.ASSETS.fetch(request);
  }

  // ТИХАЯ ПОДМЕНА ПУТИ:
  // Формируем путь к файлу внутри папки, но НЕ меняем URL в браузере
  const targetPath = url.pathname === '/' ? `/${sub}/index.html` : `/${sub}${url.pathname}`;
  
  const newUrl = new URL(targetPath, url.origin);
  const response = await env.ASSETS.fetch(new Request(newUrl, request));

  // Если файл найден — отдаем, если нет — отдаем 404 или корень
  return response.status === 200 ? response : env.ASSETS.fetch(request);
}
