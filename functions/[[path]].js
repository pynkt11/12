export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const host = url.hostname;
  const sub = host.split('.')[0];

  // Если это главный домен - просто отдаем контент
  if (sub === 'cgcasino' || sub === 'www' || sub === '12-c54') {
    return context.next();
  }

  // Внутренняя магия: переписываем путь скрытно
  // Если пользователь зашел на betera.cgcasino.app/
  // Мы подменяем путь на /sites/betera/index.html
  // Но в браузере он всё еще будет видеть betera.cgcasino.app/
  
  let newPath = url.pathname === '/' ? `/sites/${sub}/index.html` : `/sites/${sub}${url.pathname}`;
  
  const newRequest = new Request(new URL(newPath, url.origin), request);
  return fetch(newRequest);
}
