export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Получаем поддомен (например, 'betera')
  const host = url.hostname;
  const sub = host.split('.')[0];

  // Игнорируем главный домен и технические адреса
  if (sub === 'cgcasino' || sub === 'www' || sub === '12-c54') {
    return context.next();
  }

  // Принудительно меняем путь к папке с сайтом
  // Теперь запрос к 'betera.cgcasino.app/' превратится в /sites/betera/index.html
  url.pathname = `/sites/${sub}${url.pathname === '/' ? '/index.html' : url.pathname}`;

  return fetch(new Request(url, request));
}
