export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const host = url.hostname;
  const sub = host.split('.')[0];

  // Если это главный домен - отдаем как обычно
  if (sub === 'cgcasino' || sub === 'www' || sub === 'app') {
    return next();
  }

  // Переписываем путь для поддомена
  url.pathname = `/sites/${sub}${url.pathname}`;
  
  // Если запрос к корню папки - добавляем index.html
  if (url.pathname.endsWith('/')) {
    url.pathname += 'index.html';
  }

  return fetch(new Request(url, request));
}
