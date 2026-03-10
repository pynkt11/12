export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const sub = url.hostname.split('.')[0];

  // Если запрос к корню поддомена — ищем его index.html
  if (url.pathname === '/') {
    return env.ASSETS.fetch(new Request(new URL(`/${sub}/index.html`, url.origin), request));
  }

  // Если запрос к файлу (стили, скрипты) — ищем в подпапке
  return env.ASSETS.fetch(new Request(new URL(`/${sub}${url.pathname}`, url.origin), request));
}
