export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname;
    const subdomain = host.split('.')[0];

    // Если это главный домен или www, просто отдаем контент (не трогаем его)
    if (subdomain === 'cgcasino' || subdomain === 'www') {
      return fetch(request);
    }

    // Для любых других поддоменов (betera, beton и т.д.) перенаправляем в папку
    const newUrl = new URL(`/sites/${subdomain}/index.html`, url.origin);
    return fetch(new Request(newUrl.toString(), request));
  }
};
