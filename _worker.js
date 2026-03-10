export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname;
    const sub = host.split('.')[0];

    // Если это главный домен - просто отдаем контент (без магии)
    if (sub === 'cgcasino' || sub === 'www') {
      return fetch(request);
    }

    // Если это поддомен (beton, betera и т.д.)
    // Мы принудительно переписываем путь
    url.pathname = `/sites/${sub}${url.pathname}`;

    // Если в конце пути слеш (запрос папки), добавляем index.html
    if (url.pathname.endsWith('/')) {
      url.pathname += 'index.html';
    }

    return fetch(new Request(url, request));
  }
};
