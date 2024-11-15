// 标题缓存
const titleCache = new Map();

// 从HTML内容中提取标题
function extractTitle(html) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	const titleElement = doc.querySelector('.book-title');
	if (titleElement) {
		return titleElement.textContent.replace(' pdf', '');
	}
	return '';
}

// 获取页面内容和标题
async function fetchPageTitle(url) {
	// 检查缓存
	if (titleCache.has(url)) {
		return titleCache.get(url);
	}

	try {
		const response = await fetch(url);
		const html = await response.text();
		const title = extractTitle(html);
		
		// 存入缓存
		titleCache.set(url, title);
		
		return title;
	} catch (error) {
		console.error('获取页面标题失败:', url, error);
		return '';
	}
}

async function loadRandomBooks() {
	const relatedList = document.getElementById('relatedList');
	relatedList.innerHTML = '<div class="loading-text">正在加载推荐书籍...</div>';
	
	try {
		// 获取sitemap.xml
		const response = await fetch('/sitemap.xml');
		const text = await response.text();
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(text, 'text/xml');
		
		// 获取所有url节点
		const urls = Array.from(xmlDoc.getElementsByTagName('url'));
		const currentPath = window.location.pathname;
		
		// 过滤掉当前页面和非html页面
		const validUrls = urls.filter(url => {
			const loc = url.getElementsByTagName('loc')[0].textContent;
			return !loc.includes(currentPath);  // 只排除当前页面
		});

		// 随机选择10个url
		const randomUrls = [];
		const urlCount = validUrls.length;
		while (randomUrls.length < 9 && randomUrls.length < urlCount) {
			const randomIndex = Math.floor(Math.random() * validUrls.length);
			const url = validUrls[randomIndex];
			if (!randomUrls.includes(url)) {
				randomUrls.push(url);
				validUrls.splice(randomIndex, 1);
			}
		}

		// 显示加载中的占位符
		relatedList.innerHTML = randomUrls.map(() => 
			'<div class="related-item loading">正在加载...</div>'
		).join('');

		// 获取所有选中页面的标题
		const bookPromises = randomUrls.map(async (url, index) => {
			const loc = url.getElementsByTagName('loc')[0].textContent;
			const title = await fetchPageTitle(loc);
			
			// 更新对应的占位符
			const items = relatedList.getElementsByClassName('related-item');
			if (items[index]) {
				if (title) {
					items[index].outerHTML = `<a href="${loc}" class="related-item">${title}</a>`;
				} else {
					items[index].outerHTML = `<a href="${loc}" class="related-item">未知标题</a>`;
				}
			}
		});

		// 等待所有标题加载完成
		await Promise.all(bookPromises);

	} catch (error) {
		console.error('加载推荐书籍失败:', error);
		relatedList.innerHTML = '<div class="loading-text">加载推荐书籍失败，请刷新页面重试</div>';
	}
}

// 页面加载时加载随机书籍
loadRandomBooks();