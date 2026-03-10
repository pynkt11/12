export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const host = url.hostname;
  
  // 1. Если это главный домен - работаем как обычно
  if (host === 'cgcasino.app' || host === 'www.cgcasino.app') {
    return context.next();
  }

  // 2. Вытаскиваем поддомен
  const sub = host.split('.')[0];
  
  // 3. Формируем путь к файлу в папке sites
  const newPath = `/sites/${sub}/index.html`;

  // 4. ДЕЛАЕМ ПЕРЕНАПРАВЛЕНИЕ (внутреннее)
  // Мы используем fetch, чтобы "подтянуть" содержимое из нужной папки
  return fetch(new Request(new URL(newPath, url.origin), request));
}
