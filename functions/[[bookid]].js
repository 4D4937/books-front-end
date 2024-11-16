export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 如果是请求静态文件，让 Pages 平台自动处理
  if (path.endsWith('.html') || path.endsWith('.css') || path.endsWith('.js')) {
    return; // 返回 undefined 让 Pages 平台处理静态文件
  }
  
  const bookId = path.slice(1);
  const bookKey = `book:${bookId}`;
  
  if (!bookId) {
    return new Response("请提供书籍ID", { status: 400 });
  }

  try {
    const bookData = await env.BOOKS_KV.get(bookKey);
    
    if (!bookData) {
      return new Response("未找到该书籍", { status: 404 });
    }

    const bookInfo = JSON.parse(bookData);
    
    // 直接从平台获取模板
    const templateResponse = await fetch(new URL('/template.html', url.origin));
    
    if (!templateResponse.ok) {
      throw new Error(`无法加载模板文件: ${templateResponse.status}`);
    }
    
    const html = await templateResponse.text();
    
    // 替换模板变量
    const renderedHtml = html
      .replace(/\${title}/g, bookInfo.title || '')
      .replace(/\${author}/g, bookInfo.author || '')
      .replace(/\${publisher}/g, bookInfo.publisher || '')
      .replace(/\${publish_date}/g, bookInfo.publish_date || '')
      .replace(/\${isbn}/g, bookInfo.ISBN || '')
      .replace(/\${pages}/g, bookInfo.page_count || '');

    return new Response(renderedHtml, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    });
    
  } catch (err) {
    console.error('错误详情:', err);
    return new Response(`服务器错误: ${err.message}`, { 
      status: 500,
      headers: {
        'content-type': 'text/plain;charset=UTF-8',
      }
    });
  }
}