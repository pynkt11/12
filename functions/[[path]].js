export async function onRequest({ request }) {
  const url = new URL(request.url);
  const subdomain = url.hostname.split('.')[0];

  // Если основной домен - отдаем стандартный index.html из корня
  if (subdomain === 'cgcasino' || subdomain === 'www') {
    return fetch(request);
  }

  // Переписываем путь на внутреннюю папку
  const newUrl = new URL(`/sites/${subdomain}${url.pathname}`, url.origin);
  
  // Если запрос к корню поддомена, добавляем index.html
  if (url.pathname === '/') {
    newUrl.pathname = `/sites/${subdomain}/index.html`;
  }

  return fetch(newRequest(newUrl, request));
}

function newRequest(url, request) {
  return new Request(url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
}
