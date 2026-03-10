export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const sub = url.hostname.split('.')[0];

  // Если это главный домен — работаем штатно
  if (url.hostname === 'cgcasino.app' || url.hostname === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  // ЖЕСТКАЯ ПОДМЕНА ПУТИ
  // Мы берем путь от корня папки /sites/{sub}/...
  let assetPath = url.pathname === '/' ? `/sites/${sub}/index.html` : `/sites/${sub}${url.pathname}`;
  
  // Создаем новый запрос с измененным путем
  const newRequest = new Request(new URL(assetPath, url.origin), request);

  // Возвращаем результат
  return env.ASSETS.fetch(newRequest);
}
