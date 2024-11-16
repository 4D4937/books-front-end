export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  const bookId = path.slice(1);
  const bookKey = `book:${bookId}`;
  console.log(`访问路径: ${path}`);
  console.log(`查询键名: ${bookKey}`);
  
  if (!bookId) {
    return new Response("请提供书籍ID", { status: 400 });
  }

  try {
    const bookData = await env.BOOKS_KV.get(bookKey);
    console.log(`查询结果: ${bookData}`);

    if (!bookData) {
      return new Response("未找到该书籍", { status: 404 });
    }

    const bookInfo = JSON.parse(bookData);
    console.log('解析后的数据:', bookInfo);

    // 读取模板文件
    const templateUrl = new URL('/template.html', request.url);
    const templateResponse = await fetch(templateUrl);
    
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
      .replace(/\${isbn}/g, bookInfo.ISBN || '') // 注意这里 ISBN 大写
      .replace(/\${pages}/g, bookInfo.page_count || '');

    // 确保返回 Response 对象
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