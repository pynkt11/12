export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const host = url.hostname;
  const sub = host.split('.')[0];

  // 1. Если это главный домен - отдаем как обычно
  if (sub === 'cgcasino' || sub === 'www' || sub === '12-c54') {
    return context.next();
  }

  // 2. Если зашли на поддомен - переписываем путь
  // Мы делаем это ВНУТРИ Cloudflare, пользователь не увидит /sites/ в браузере
  url.pathname = `/sites/${sub}${url.pathname === '/' ? '/index.html' : url.pathname}`;

  // 3. Возвращаем контент по новому пути
  return fetch(new Request(url, request));
}
