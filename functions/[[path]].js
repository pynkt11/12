export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;

  // Основной домен не трогаем
  if (hostname === 'cgcasino.app' || hostname === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  // Поддомен (например 'kent', 'beton')
  const sub = hostname.split('.')[0];

  // Путь для fetch ассетов
  let assetPath = url.pathname;

  // Если корень поддомена, отдаём index.html в папке поддомена
  if (url.pathname === '/') {
    assetPath = `/${sub}/index.html`;
  } else {
    // Если путь не корень, просто оставляем его и ищем в папке поддомена
    // assetPath = `/${sub}${url.pathname}`;  <- не нужно, иначе будет /kent/kent/...
    assetPath = `/${sub}${url.pathname}`;
  }

  // Создаём fetch к ASSETS с переписанным путём
  const fetchRequest = new Request(assetPath, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });

  let response = await env.ASSETS.fetch(fetchRequest);

  // Если не нашли файл, fallback на основной ассет
  if (response.status === 404) {
    response = await env.ASSETS.fetch(request);
  }

  return response;
}
