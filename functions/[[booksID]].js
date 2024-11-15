export async function onRequest(context) {
  try {
    // 使用相对路径获取 data.json
    const response = await fetch(new URL('/data.json', context.request.url));
    if (!response.ok) {
      throw new Error('Failed to load data.json');
    }
    
    const books = await response.json();
    const url = new URL(context.request.url);
    const path = url.pathname.slice(1);
    
    // 如果是访问根路径，显示书籍列表
    if (!path) {
      return new Response(generateBookList(books), {
        headers: { 'content-type': 'text/html;charset=UTF-8' },
      });
    }
    
    const book = books.find(b => b.id === path);
    if (!book) {
      return new Response(generateError('未找到该书籍'), {
        status: 404,
        headers: { 'content-type': 'text/html;charset=UTF-8' },
      });
    }

    return new Response(generateHTML(book), {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    });
    
  } catch (error) {
    return new Response(generateError(error.message), {
      status: 500,
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    });
  }
}

// 生成书籍列表页面
function generateBookList(books) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>电子书列表</title>
    <style>
      .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
      .book-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
      .book-item { background: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .book-item a { color: #1890ff; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>电子书列表</h1>
        <div class="book-list">
            ${books.map(book => `
                <div class="book-item">
                    <h3><a href="/${book.id}">${book.title}</a></h3>
                    <p>作者：${book.author}</p>
                    <p>出版社：${book.publisher}</p>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
}

// 生成错误页面
function generateError(message) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>错误</title>
    <style>
      .error-container { max-width: 600px; margin: 100px auto; text-align: center; }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>出错了</h1>
        <p>${message}</p>
        <a href="/">返回首页</a>
    </div>
</body>
</html>`;
}

// generateHTML 函数保持不变