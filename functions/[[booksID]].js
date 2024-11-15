export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const bookId = url.pathname.slice(1); // 移除开头的 '/'
  
  if (!bookId) {
    return new Response('首页', { status: 200 }); // 可以在这里处理首页
  }
  
  // 读取数据文件
  const response = await fetch('https://liberpdf.top/data.json');
  const books = await response.json();
  
  // 查找对应的书籍
  const book = books[bookId];
  if (!book) {
    return new Response('书籍未找到', { status: 404 });
  }
  
  // 使用模板生成HTML
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
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    <site-header></site-header>

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
                <div class="current-price">
                    ¥9.9
                    <span class="discount-tag">限时特惠</span>
                </div>
            </div>

            <button class="buy-button" onclick="window.location.href='/buy.html'">立即下载PDF版本</button>

            <div class="features">
                <div class="feature-item">支持文字复制和检索</div>
                <div class="feature-item">支持各种设备阅读</div>
                <div class="feature-item">高清原版扫描</div>
            </div>

            <div class="related-books">
                <h2 class="related-title">相关书籍推荐</h2>
                <div id="relatedList" class="related-list">
                    <div class="loading-text">正在加载推荐书籍...</div>
                </div>
            </div>
        </div>
    </div>

    <script type="module" src="/js/header.js"></script>
    <script src="/js/related-books.js"></script>
</body>
</html>`;
}