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
    '        const response = await fetch("/api/random-books");',
    '        if (!response.ok) {',
    '            throw new Error(`HTTP error! status: ${response.status}`);',
    '        }',
    '        ',
    '        const data = await response.json();',
    '        // 从返回的数据中获取 results 数组',
    '        const books = data.results;',
    '        ',
    '        if (!Array.isArray(books) || books.length === 0) {',
    '            throw new Error("没有获取到推荐书籍数据");',
    '        }',
    '        ',
    '        relatedList.innerHTML = books.map(book => ',
    '            `<a href="/${book.id}" class="related-item">${book.title}</a>`',
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
    <meta name="description" content="\${title}，作者：\${author}，出版社：\${publisher}，出版时间：\${publish_data}，ISBN：\${ISBN}，全书\${page_count}页。提供PDF电子书下载，支持文字检索，阅读体验好。">
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
                    <div class="info-value">\${publish_data}</div>
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

            <button class="buy-button" onclick="window.location.href='buy'">立即下载PDF版本</button>

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
  
  // 路由处理优先级：
  // 1. 首页路由
  // 2. 站点地图
  // 3. 静态页面
  // 4. robots.txt
  // 5. 静态资源文件
  // 6. API 接口
  // 7. 书籍详情页
  
  try {
    // 1. 首页路由处理 ('/index.html' 或 '/')
    if (path === '/' || path === '/index.html') {
      return await context.next();
    }
    
    // 2. 站点地图路由处理 (匹配 sitemap.xml 或 sitemap1.xml 等格式)
    if (path.match(/^\/sitemap\d*\.xml$/)) {
      console.log('正在生成站点地图...');
      return await generateSitemap(env, request);
    }
    
    // 3. 静态页面路由处理
    const staticPages = ['buy', 'about', 'contact']; // 可配置的静态页面列表
    const pageName = path.slice(1).split('.')[0]; // 提取页面名称（移除'/'和文件扩展名）
    
    if (staticPages.includes(pageName)) {
      const response = await context.next();
      if (response) return response;
      throw new Error('静态页面不存在');
    }
    
    // 4. robots.txt 处理
    if (path === '/robots.txt') {
      return new Response(
        `User-agent: *
        Allow: /
        Sitemap: https://liberpdf.top/sitemap.xml`, {
        headers: { 
          'content-type': 'text/plain;charset=UTF-8',
          'Cache-Control': 'public, max-age=86400' // 24小时缓存
        }
      });
    }
    
    // 5. 静态资源文件处理 (.html, .css, .js)
    if (path.match(/\.(html|css|js)$/)) {
      const response = await context.next();
      if (response) return response;
      throw new Error('静态资源文件不存在');
    }
    
    // 6. API 路由处理
    if (path === '/api/random-books') {
      return await handleRandomBooks(env);
    }
    
    // 7. 书籍详情页处理（默认路由）
    return await handleBookDetail(path, env);
    
  } catch (error) {
    // 统一错误处理
    console.error(`路由处理错误: ${path}`, error);
    
    // 根据错误类型返回适当的状态码
    const status = error.message.includes('不存在') ? 404 : 500;
    const message = status === 404 ? '页面未找到' : '服务器内部错误';
    
    return new Response(message, {
      status,
      headers: { 'content-type': 'text/plain;charset=UTF-8' }
    });
  }
}


async function handleBookDetail(path, env) {
  const bookId = path.slice(1);
  if (!bookId) {
    return new Response("请提供书籍ID", { status: 400 });
  }

  try {
    const stmt = env.BOOKS_D1.prepare(
      `SELECT id, title, author, publisher, publish_data, 
      ISBN, CAST(page_count AS INTEGER) as page_count 
      FROM books WHERE id = ? LIMIT 1`
    );
    const result = await stmt.bind(bookId).first();
    
    if (!result) {
      return new Response("未找到该书籍", { status: 404 });
    }

    const renderedHtml = HTML_TEMPLATE.replace(/\${(\w+)}/g, (_, key) => result[key] || '');

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

async function handleRandomBooks(env) {
  try {
    const stmt = env.BOOKS_D1.prepare(`
      SELECT id, title 
      FROM books 
      ORDER BY RANDOM() 
      LIMIT 10
    `);
    
    const result = await stmt.all();
    // 直接返回 results 数组，不需要 .results
    return new Response(JSON.stringify(result), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (err) {
    console.error('获取随机书籍失败:', err);
    return new Response(JSON.stringify({ error: '获取随机书籍失败' }), {
      status: 500,
      headers: { 
        'content-type': 'application/json;charset=UTF-8'
      }
    });
  }
}


/**
 * 生成网站的站点地图
 * @param {Object} env - 环境变量对象，包含数据库连接
 * @param {Request} request - 请求对象
 * @returns {Response} 返回XML格式的站点地图
 */
async function generateSitemap(env, request) {
  try {
    // 验证环境变量
    if (!env?.BOOKS_D1) {
      throw new Error('数据库配置错误：缺少BOOKS_D1环境变量');
    }

    // 配置常量
    const URLS_PER_SITEMAP = 50000; // 每个站点地图包含的URL数量
    const baseUrl = 'https://liberpdf.top';
    const url = new URL(request.url);
    const path = url.pathname;
    
    // 查询数据库中的总记录数
    const countStmt = env.BOOKS_D1.prepare('SELECT COUNT(*) as count FROM books');
    const { count } = await countStmt.first();
    
    // 处理主站点地图索引文件 (/sitemap.xml)
    if (path === '/sitemap.xml') {
      const sitemapCount = Math.ceil(count / URLS_PER_SITEMAP);
      let indexContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
      indexContent += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // 生成所有分页站点地图的索引
      for (let i = 0; i < sitemapCount; i++) {
        indexContent += `  <sitemap>\n    <loc>${baseUrl}/sitemap${i}.xml</loc>\n  </sitemap>\n`;
      }
      
      indexContent += '</sitemapindex>';
      return new Response(indexContent, {
        headers: { 'Content-Type': 'application/xml;charset=UTF-8' }
      });
    }
    
    // 解析分页站点地图的页码 (/sitemap0.xml, /sitemap1.xml, ...)
    const matches = path.match(/\/sitemap(\d+)\.xml/);
    if (!matches) {
      return new Response('无效的站点地图URL', { status: 400 });
    }
    
    // 计算分页偏移量
    const sitemapIndex = parseInt(matches[1]);
    const offset = sitemapIndex * URLS_PER_SITEMAP;
    
    // 查询当前分页的图书记录
    const stmt = env.BOOKS_D1.prepare(
      'SELECT id FROM books LIMIT ? OFFSET ?'
    ).bind(URLS_PER_SITEMAP, offset);
    
    const results = await stmt.all();
    const rows = results.results || results;

    // 检查查询结果
    if (!rows?.length) {
      return new Response('未找到数据', { status: 404 });
    }

    // 生成分页站点地图的XML内容
    let sitemapContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemapContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // 为每本图书生成URL条目
    for (const row of rows) {
      if (row?.id) {
        sitemapContent += `  <url>\n    <loc>${baseUrl}/${row.id}</loc>\n  </url>\n`;
      }
    }
    
    sitemapContent += '</urlset>';

    return new Response(sitemapContent, {
      headers: { 'Content-Type': 'application/xml;charset=UTF-8' }
    });

  } catch (err) {
    console.error('站点地图生成失败:', err);
    return new Response(`站点地图生成失败: ${err.message}`, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }
    });
  }
}