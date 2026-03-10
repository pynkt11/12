export default {
  async fetch(request, context) {
    const url = new URL(request.url);
    const host = url.hostname; 
    const subdomain = host.split('.')[0]; 

    // Если это основной домен или www, отдаем основной сайт
    if (subdomain === 'cgcasino' || subdomain === 'www') {
      return fetch(request);
    }

    // Если это поддомен (например, kent), направляем в папку /sites/kent/index.html
    const newUrl = new URL(`/sites/${subdomain}/index.html`, url.origin);
    return fetch(new Request(newUrl.toString(), request));
  }
};
