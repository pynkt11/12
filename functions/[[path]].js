export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const sub = url.hostname.split('.')[0];

  // Если это главный домен - отдаем стандартно
  if (sub === 'cgcasino' || sub === 'www' || sub === 'app') {
    return context.next();
  }

  // Внутренний роутинг: просто переписываем запрос
  url.pathname = `/sites/${sub}${url.pathname === '/' ? '/index.html' : url.pathname}`;
  
  return fetch(new Request(url, request));
}
