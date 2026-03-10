export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const host = url.hostname;
  const sub = host.split('.')[0];

  // Если основной домен - отдаем корень
  if (host === 'cgcasino.app' || host === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  // Для поддоменов - меняем путь к файлу внутри проекта
  // Теперь используем env.ASSETS, чтобы Cloudflare не "ругался"
  const newPath = `/sites/${sub}${url.pathname === '/' ? '/index.html' : url.pathname}`;
  const newRequest = new Request(new URL(newPath, url.origin), request);

  return env.ASSETS.fetch(newRequest);
}
