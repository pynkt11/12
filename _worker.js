export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const sub = url.hostname.split('.')[0];
    
    // Если это главный домен - игнорируем
    if (sub === 'cgcasino' || sub === 'www') return fetch(request);

    // Если поддомен - просто меняем путь на папку
    url.pathname = `/sites/${sub}` + url.pathname;
    return fetch(new Request(url, request));
  }
};
