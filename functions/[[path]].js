export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const host = url.hostname;

  if (host.includes('cgcasino.app')) {
    const sub = host.split('.')[0];
    const path = url.pathname;

    // Если запрос уже внутри папки поддомена — просто отдаем файл
    if (path.startsWith(`/${sub}/`)) {
      return env.ASSETS.fetch(request);
    }

    // ТИХАЯ ПОДМЕНА: переписываем запрос внутри сервера
    const newPath = path === '/' ? `/${sub}/index.html` : `/${sub}${path}`;
    return env.ASSETS.fetch(new Request(new URL(newPath, url.origin), request));
  }

  return env.ASSETS.fetch(request);
}
