export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const host = url.hostname;

  if (host === 'cgcasino.app' || host === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  const sub = host.split('.')[0];
  let path = url.pathname;
  
  // Принудительно строим путь
  const assetPath = path === '/' ? `/sites/${sub}/index.html` : `/sites/${sub}${path}`;
  
  // Делаем запрос к конкретному файлу
  const response = await env.ASSETS.fetch(new Request(new URL(assetPath, url.origin), request));
  
  // ЕСЛИ ФАЙЛ НЕ НАЙДЕН, МЫ ДОЛЖНЫ ЭТО УВИДЕТЬ
  if (response.status === 404) {
    return new Response(`File not found: ${assetPath}`, { status: 404 });
  }

  return response;
}
