export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Игнорируем основной домен
  if (hostname === 'cgcasino.app' || hostname === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  // Берем имя поддомена (например, 'beton')
  const sub = hostname.split('.')[0];
  
  // Формируем путь к файлу внутри папки
  const newPath = `/${sub}${url.pathname === '/' ? '/index.html' : url.pathname}`;
  
  // Создаем новый URL и запрашиваем его из ассетов
  const assetUrl = new URL(newPath, url.origin);
  return env.ASSETS.fetch(new Request(assetUrl, request));
}
