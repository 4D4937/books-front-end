export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 调试信息 1: 输出路径和构造的键名
  const bookId = path.slice(1);
  const bookKey = `book:${bookId}`;
  console.log(`访问路径: ${path}`);
  console.log(`查询键名: ${bookKey}`);
  
  if (!bookId) {
    return new Response("请提供书籍ID", { status: 400 });
  }

  try {
    // 调试信息 2: 检查 KV 绑定是否存在
    if (!env.BOOKS_KV) {
      return new Response("KV 绑定未配置", { status: 500 });
    }

    // 调试信息 3: 输出查询到的原始数据
    const bookData = await env.BOOKS_KV.get(bookKey);
    console.log(`查询结果: ${bookData}`);

    if (!bookData) {
      // 调试信息 4: 列出所有可用的键名
      const listResult = await env.BOOKS_KV.list();
      console.log('可用的键名:', listResult.keys);
      
      return new Response(`未找到该书籍 (键名: ${bookKey})`, { status: 404 });
    }

    // 调试信息 5: 输出解析后的数据
    const bookInfo = JSON.parse(bookData);
    console.log('解析后的数据:', bookInfo);

    // ... 其余代码保持不变 ...
  } catch (err) {
    // 调试信息 6: 输出详细错误信息
    console.error('错误详情:', err);
    return new Response(`服务器错误: ${err.message}\n${err.stack}`, { status: 500 });
  }
}