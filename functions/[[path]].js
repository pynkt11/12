export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const host = url.hostname;

  // Если это не поддомен (главный домен), отдаем корень как есть
  if (!host.includes('.')) return env.ASSETS.fetch(request);

  const sub = host.split('.')[0];
  
  // Принудительно задаем путь к файлу внутри папки поддомена
  const newPath = `/${sub}${url.pathname === '/' ? '/index.html' : url.pathname}`;
  
  // Создаем новый запрос с ПРЯМЫМ путем
  const newRequest = new Request(new URL(newPath, url.origin), request);
  
  // Возвращаем результат fetch
  return env.ASSETS.fetch(newRequest);
}
