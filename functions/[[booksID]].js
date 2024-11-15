export async function onRequest(context) {
  // 读取 JSON 数据
  const response = await fetch('https://liberpdf.top/data.json');
  const books = await response.json();
  
  // 获取请求的路径
  const url = new URL(context.request.url);
  const path = url.pathname.slice(1); // 移除开头的 /
  
  // 如果没找到对应的书籍，返回 404
  const book = books.find(b => b.id === path);
  if (!path || !book) {
    return new Response('404 Not Found', { status: 404 });
  }

  // 渲染 HTML
  const html = generateHTML(book);
  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}

function generateHTML(book) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${book.title}，作者：${book.author}，出版社：${book.publisher}，出版时间：${book.publish_date}，ISBN：${book.isbn}，全书${book.pages}页。提供PDF电子书下载，支持文字检索，阅读体验好。">
    <title>${book.title} pdf</title>
    <style>
      /* 内联关键 CSS */
      .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
      .book-card { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      .book-title { font-size: 24px; margin-bottom: 20px; }
      .book-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
      .info-item { display: flex; flex-direction: column; gap: 5px; }
      .info-label { color: #666; }
      .price-section { margin: 20px 0; }
      .buy-button { background: #1890ff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
      .features { display: flex; gap: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="book-card">
            <h1 class="book-title">${book.title} pdf</h1>
            
            <div class="book-info">
                <div class="info-item">
                    <div class="info-label">作者</div>
                    <div class="info-value">${book.author}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">出版社</div>
                    <div class="info-value">${book.publisher}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">出版时间</div>
                    <div class="info-value">${book.publish_date}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">ISBN</div>
                    <div class="info-value">${book.isbn}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">页数</div>
                    <div class="info-value">${book.pages}页</div>
                </div>
            </div>
            
            <div class="price-section">
                <div class="original-price">原价: ¥29.9</div>
                <div class="current-price">¥9.9 <span class="discount-tag">限时特惠</span></div>
            </div>

            <button class="buy-button" onclick="window.location.href='buy.html'">立即下载PDF版本</button>

            <div class="features">
                <div class="feature-item">支持文字复制和检索</div>
                <div class="feature-item">支持各种设备阅读</div>
                <div class="feature-item">高清原版扫描</div>
            </div>
        </div>
    </div>
</body>
</html>`;
}