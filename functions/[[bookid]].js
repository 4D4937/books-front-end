// 内联模板
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="\${title}，作者：\${author}，出版社：\${publisher}，出版时间：\${publish_date}，ISBN：\${isbn}，全书\${pages}页。提供PDF电子书下载，支持文字检索，阅读体验好。">
    <title>\${title} pdf</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    <site-header></site-header>

    <div class="container">
        <div class="book-card">
            <h1 class="book-title">\${title} pdf</h1>

            <div class="book-info">
                <div class="info-item">
                    <div class="info-label">作者</div>
                    <div class="info-value">\${author}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">出版社</div>
                    <div class="info-value">\${publisher}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">出版时间</div>
                    <div class="info-value">\${publish_date}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">ISBN</div>
                    <div class="info-value">\${isbn}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">页数</div>
                    <div class="info-value">\${pages}页</div>
                </div>
            </div>
            
            <div class="price-section">
                <div class="original-price">原价: ¥29.9</div>
                <div class="current-price">
                    ¥9.9
                    <span class="discount-tag">限时特惠</span>
                </div>
            </div>

            <button class="buy-button" onclick="window.location.href='buy.html'">立即下载PDF版本</button>

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

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 如果是请求静态文件，让 Pages 平台自动处理
  if (path.endsWith('.html') || path.endsWith('.css') || path.endsWith('.js')) {
    return;
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
    
    // 使用内联模板直接渲染
    const renderedHtml = HTML_TEMPLATE
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