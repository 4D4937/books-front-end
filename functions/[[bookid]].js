// 内联 CSS
const INLINE_STYLES = `
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Microsoft YaHei', sans-serif; line-height: 1.6; background-color: #f5f7fa; color: #2c3e50; }
.header { background: #ffffff; border-bottom: 1px solid #eaeaea; padding: 12px 0; position: sticky; top: 0; z-index: 100; }
.header-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 20px; font-weight: 500; color: #333; text-decoration: none; }
.nav-menu { display: flex; gap: 20px; list-style: none; }
.nav-item a { color: #666; text-decoration: none; font-size: 14px; transition: color 0.2s ease; }
.nav-item a:hover { color: #333; }
.container { max-width: 800px; margin: 40px auto; padding: 0 20px; }
.book-card { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); margin-bottom: 30px; }
.book-title { font-size: 32px; color: #1a202c; margin-bottom: 20px; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
.highlight-box { background: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0; }
.book-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 25px 0; }
.info-item { padding: 10px; }
.info-label { color: #718096; font-size: 14px; margin-bottom: 5px; }
.info-value { color: #2d3748; font-size: 16px; font-weight: 500; }
.buy-button { display: block; width: 100%; max-width: 300px; margin: 20px auto; padding: 15px 30px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; transition: all 0.3s ease; }
.buy-button:hover { background: #2980b9; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3); }
.features { margin-top: 30px; }
.feature-item { display: flex; align-items: center; margin: 10px 0; color: #4a5568; }
.feature-item:before { content: "✓"; color: #38a169; font-weight: bold; margin-right: 10px; }
.price-section { background: #ebf8ff; padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center; }
.original-price { color: #718096; text-decoration: line-through; font-size: 16px; }
.current-price { color: #e53e3e; font-size: 36px; font-weight: bold; margin: 10px 0; }
.discount-tag { background: #e53e3e; color: white; padding: 3px 8px; border-radius: 4px; font-size: 14px; margin-left: 10px; }
.related-books { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; }
.related-title { font-size: 20px; color: #2c3e50; margin-bottom: 15px; }
.related-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; }
.related-item { color: #3498db; text-decoration: none; padding: 10px 12px; background: #f8f9fa; border-radius: 6px; transition: all 0.3s ease; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; line-height: 1.4; }
.related-item:hover { background: #e9ecef; transform: translateY(-2px); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.related-item.loading { color: #666; background: #f0f0f0; animation: pulse 1.5s infinite; }
@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
.loading-text { text-align: center; color: #666; padding: 20px; }
@media screen and (max-width: 768px) {
  .header-container { padding: 0 15px; }
  .book-title { font-size: 24px; }
  .container { padding: 0 15px; margin: 20px auto; }
  .book-card { padding: 20px; }
  .current-price { font-size: 28px; }
  .book-info { grid-template-columns: 1fr; gap: 10px; }
  .nav-menu { gap: 15px; }
  .buy-button { padding: 12px 24px; font-size: 16px; }
  .related-list { grid-template-columns: 1fr; }
}
</style>`;

// Header 组件的 JS
const HEADER_SCRIPT = `
<script>
class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = \`
            <header class="header">
                <div class="header-container">
                    <a href="/" class="logo">LiberPDF</a>
                    <nav>
                        <ul class="nav-menu">
                            <li class="nav-item"><a href="/">首页</a></li>
                            <li class="nav-item"><a href="/books">分类</a></li>
                            <li class="nav-item"><a href="/about">关于</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        \`;
    }
}
customElements.define('site-header', Header);
</script>`;

const RELATED_BOOKS_SCRIPT = [
    '<script>',
    'async function loadRandomBooks() {',
    '    const relatedList = document.getElementById("relatedList");',
    '    relatedList.innerHTML = \'<div class="loading-text">正在加载推荐书籍...</div>\';',
    '    ',
    '    try {',
    '        const response = await fetch("/api/random-books", {',
    '            cache: "no-store",',
    '            headers: {',
    '                "Cache-Control": "no-cache",',
    '                "Pragma": "no-cache"',
    '            }',
    '        });',
    '        if (!response.ok) {',
    '            throw new Error("获取随机书籍失败");',
    '        }',
    '        ',
    '        const books = await response.json();',
    '        ',
    '        relatedList.innerHTML = books.map(book => ',
    '            \'<a href="/\' + book.id + \'" class="related-item">\' + book.title + \'</a>\'',
    '        ).join("");',
    '    } catch (error) {',
    '        console.error("加载推荐书籍失败:", error);',
    '        relatedList.innerHTML = \'<div class="loading-text">加载推荐书籍失败，请刷新页面重试</div>\';',
    '    }',
    '}',
    '',
    'document.addEventListener("DOMContentLoaded", loadRandomBooks);',
    '</script>'
].join('\n');

// 内联模板
const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="\${title}，作者：\${author}，出版社：\${publisher}，出版时间：\${publish_date}，ISBN：\${ISBN}，全书\${page_count}页。提供PDF电子书下载，支持文字检索，阅读体验好。">
    <title>\${title} pdf</title>
    ${INLINE_STYLES}
	${HEADER_SCRIPT}
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
                    <div class="info-value">\${ISBN}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">页数</div>
                    <div class="info-value">\${page_count}页</div>
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

    ${RELATED_BOOKS_SCRIPT}
</body>
</html>`;

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 静态文件处理
  if (path.match(/\.(html|css|js)$/)) {
    try {
      // 从 public 目录获取静态文件
      const response = await context.next();
      if (!response) {
        return new Response("文件未找到", { 
          status: 404,
          headers: { 'content-type': 'text/plain;charset=UTF-8' }
        });
      }
      return response;
    } catch (err) {
      return new Response("获取静态文件失败", { 
        status: 500,
        headers: { 'content-type': 'text/plain;charset=UTF-8' }
      });
    }
  }

  // API 路由处理
  if (path === '/api/random-books') {
    return await handleRandomBooks(env);
  }

  // 书籍详情处理
  return await handleBookDetail(path, env);
}

async function handleRandomBooks(env) {
  try {
    const totalBooks = parseInt(env.TOTAL_BOOKS_COUNT);
    if (!totalBooks || isNaN(totalBooks)) {
      throw new Error('书籍总数配置无效');
    }

    const limit = 20;
    const targetCount = 10;
    
    // 修改：移除 cursor，改用 list_complete 方式获取
    const { keys } = await env.BOOKS_KV.list({
      limit: limit
    });

    if (!keys || !keys.length) {
      throw new Error('未能获取到书籍列表');
    }

    // 随机选择书籍
    const randomBooks = await Promise.all(
      keys
        .sort(() => Math.random() - 0.5)
        .slice(0, targetCount)
        .map(async key => {
          try {
            const bookData = await env.BOOKS_KV.get(key.name);
            return bookData ? JSON.parse(bookData) : null;
          } catch (err) {
            console.error(`处理书籍数据失败: ${key.name}`, err);
            return null;
          }
        })
    );

    const validBooks = randomBooks
      .filter(Boolean)
      .map(book => ({
        id: book.id,
        title: book.title
      }));

    if (!validBooks.length) {
      throw new Error('没有有效的书籍数据');
    }

    return new Response(
      JSON.stringify(validBooks), 
      {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'cache-control': 'public, max-age=300'
        }
      }
    );
  } catch (err) {
    console.error('获取随机书籍失败:', err);
    return new Response(
      JSON.stringify({ 
        error: '获取随机书籍失败',
        message: err.message,
        timestamp: new Date().toISOString()
      }), 
      {
        status: 500,
        headers: { 'content-type': 'application/json;charset=UTF-8' }
      }
    );
  }
}

// 处理书籍详情请求
async function handleBookDetail(path, env) {
  const bookId = path.slice(1);
  if (!bookId) {
    return new Response("请提供书籍ID", { status: 400 });
  }

  try {
    const bookData = await env.BOOKS_KV.get(`book:${bookId}`);
    if (!bookData) {
      return new Response("未找到该书籍", { status: 404 });
    }

    const bookInfo = JSON.parse(bookData);
    const renderedHtml = HTML_TEMPLATE.replace(/\${(\w+)}/g, (_, key) => bookInfo[key] || '');

    return new Response(renderedHtml, {
      headers: { 'content-type': 'text/html;charset=UTF-8' }
    });
  } catch (err) {
    return new Response(`服务器错误: ${err.message}`, { 
      status: 500,
      headers: { 'content-type': 'text/plain;charset=UTF-8' }
    });
  }
}