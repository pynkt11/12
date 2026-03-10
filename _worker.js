export default {
  async fetch(request) {
    const url = new URL(request.url);
    // Проверяем, какой хост запросили
    if (url.hostname === 'cgcasino.app' || url.hostname === 'www.cgcasino.app') {
      return fetch(request); // Основной сайт отдаем как есть
    }

    // Если это поддомен (например, betera.cgcasino.app)
    const subdomain = url.hostname.split('.')[0];
    const newUrl = new URL(`/sites/${subdomain}/index.html`, url.origin);
    
    return fetch(new Request(newUrl, request));
  }
};
