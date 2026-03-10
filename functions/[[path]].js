export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const host = url.hostname; // Это будет, например, 'betera.cgcasino.app'
  const parts = host.split('.');

  // Если это поддомен (например, betera.cgcasino.app)
  if (parts.length >= 3) {
    const sub = parts[0]; // 'betera'
    
    // Переписываем путь: из '/' делаем '/sites/betera/index.html'
    let path = url.pathname === '/' ? '/index.html' : url.pathname;
    url.pathname = `/sites/${sub}${path}`;
    
    // Возвращаем результат из этой же папки
    return context.next(new Request(url, request));
  }

  // Если это просто cgcasino.app - идем дальше (к статике)
  return context.next();
}
