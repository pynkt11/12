export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const host = url.hostname;
  
  if (host === 'cgcasino.app' || host === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  const sub = host.split('.')[0];
  
  // Достаем оригинальный путь (например, /style.css или /)
  let path = url.pathname;
  if (path === '/') path = '/index.html';
  
  // Создаем путь к файлу внутри папки поддомена
  const assetPath = `/sites/${sub}${path}`;
  
  // Пытаемся получить этот конкретный файл
  const response = await env.ASSETS.fetch(new Request(new URL(assetPath, url.origin), request));
  
  // Если файл найден (статус 200), отдаем его
  if (response.status === 200) {
    return response;
  }
  
  // Если файла нет, возвращаем 404, чтобы не отдавать главную
  return new Response("Not Found", { status: 404 });
}
