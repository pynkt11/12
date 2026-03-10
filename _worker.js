export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname;
    const sub = host.split('.')[0]; // Получаем имя поддомена

    // Если это главный домен, просто отдаем что есть
    if (sub === 'cgcasino' || sub === 'www' || sub === 'app') {
      return fetch(request);
    }

    // "Магическая" подмена пути
    // Запрос к beton.cgcasino.app/style.css станет запросом к /sites/beton/style.css
    url.pathname = `/sites/${sub}${url.pathname}`;
    
    // Если запрос был просто к корню (например, beton.cgcasino.app/), добавляем index.html
    if (url.pathname.endsWith('/')) {
      url.pathname += 'index.html';
    }

    return fetch(new Request(url, request));
  }
};
