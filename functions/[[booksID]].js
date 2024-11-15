export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const bookId = url.pathname.slice(1);
  
  try {
    // 如果是根路径,显示首页
    if (!bookId) {
      return await handleHome();
    }
    
    // 获取数据文件
    const books = await loadBooks(url.origin);
    
    // 查找对应的书籍
    const book = books[bookId];
    if (!book) {
      return new Response('未找到该书籍', { 
        status: 404,
        headers: {
          'content-type': 'text/html;charset=UTF-8',
        }
      });
    }
    
    // 生成HTML
    const html = generateHTML(book);
    
    return new Response(html, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    });
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(`服务器错误: ${error.message}`, { 
      status: 500,
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      }
    });
  }
}

async function loadBooks(origin) {
  const response = await fetch(new URL('/data.json', origin));
  if (!response.ok) {
    throw new Error('Failed to load books data');
  }
  return response.json();
}

async function handleHome() {
  const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>电子书城</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <site-header></site-header>
      <div class="container">
        <h1>欢迎访问电子书城</h1>
        <div id="bookList" class="book-grid">
          正在加载书籍列表...
        </div>
      </div>
      <script type="module" src="/js/header.js"></script>
      <script src="/js/book-list.js"></script>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}

function generateHTML(book) {
  try {
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
  } catch (error) {
    console.error('Template Error:', error);
    throw new Error('模板渲染失败');
  }
}