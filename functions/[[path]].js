export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const host = url.hostname;
  
  // 1. Исключаем главный домен
  if (host === 'cgcasino.app' || host === 'www.cgcasino.app') {
    return env.ASSETS.fetch(request);
  }

  // 2. Вытаскиваем имя поддомена
  const sub = host.split('.')[0];

  // 3. ПЕРЕПИСЫВАЕМ ПУТЬ
  // Если пользователь зашел на корень (/) или любую страницу,
  // мы добавляем /sites/ИМЯ_ПОДДОМЕНА/ к началу пути.
  const newPath = `/sites/${sub}${url.pathname === '/' ? '/index.html' : url.pathname}`;
  
  // 4. Формируем новый запрос с измененным путем
  const newRequest = new Request(new URL(newPath, url.origin), request);

  // 5. Выполняем подмену внутри сети Cloudflare
  return env.ASSETS.fetch(newRequest);
}
