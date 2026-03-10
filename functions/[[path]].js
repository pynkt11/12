export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const host = url.hostname;
  const sub = host.split('.')[0];

  // Если это главный домен - отдаем как обычно
  if (sub === 'cgcasino' || sub === 'www' || sub === '12-c54') {
    return context.next();
  }

  // СОБИРАЕМ ПУТЬ
  const targetPath = `/sites/${sub}/index.html`;

  // ДИАГНОСТИКА: выводим путь прямо в браузер, если сайт не грузится
  return new Response(`Ищу файл по пути: ${targetPath} | Хост: ${host}`, {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8" }
  });
}
