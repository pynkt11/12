
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname;
    const sub = host.split('.')[0];

    // Если это главный домен - отдаем корень
    if (sub === 'cgcasino' || sub === 'www' || sub === 'app') {
      return fetch(request);
    }

    // Просто меняем путь на жесткий путь к папке
    const newUrl = new URL(url.origin + '/sites/' + sub + url.pathname);
    return fetch(new Request(newUrl, request));
  }
};
