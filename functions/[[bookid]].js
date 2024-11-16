export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 提取 bookId 并构造完整的键名
  const bookId = path.slice(1); // 移除开头的 /
  const bookKey = `book:${bookId}`; // 添加 'book:' 前缀
  
  if (!bookId) {
    return new Response("请提供书籍ID", { status: 400 });
  }

  try {
    // 从 KV 读取数据
    const bookData = await env.BOOKS_KV.get(bookKey);
    if (!bookData) {
      return new Response("未找到该书籍", { status: 404 });
    }

    const bookInfo = JSON.parse(bookData);
    
    // 读取 HTML 模板
    const templateResponse = await fetch(new URL('/template.html', request.url));
    const html = await templateResponse.text();
    
    // 替换模板变量
    const renderedHtml = html
      .replace(/\${title}/g, bookInfo.title)
      .replace(/\${author}/g, bookInfo.author)
      .replace(/\${publisher}/g, bookInfo.publisher)
      .replace(/\${publish_date}/g, bookInfo.publish_date)
      .replace(/\${isbn}/g, bookInfo.isbn)
      .replace(/\${pages}/g, bookInfo.page_count);

    return new Response(renderedHtml, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    });
    
  } catch (err) {
    return new Response("服务器错误: " + err.message, { status: 500 });
  }
}