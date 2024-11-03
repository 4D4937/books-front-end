import os
from datetime import datetime
from urllib.parse import urljoin

def generate_sitemap(base_url):
    # 获取当前目录下所有html文件
    html_files = []
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                # 使用 os.path.normpath 确保路径格式正确
                rel_path = os.path.normpath(os.path.join(root, file))
                # 转换为URL格式的路径
                url_path = rel_path.replace('\\', '/').lstrip('./')
                # 保存两种路径
                html_files.append((rel_path, url_path))

    # 生成sitemap XML
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for file_path, url_path in html_files:
        try:
            # 使用正确的文件路径获取修改时间
            last_modified = datetime.fromtimestamp(os.path.getmtime(file_path))
            last_modified = last_modified.strftime('%Y-%m-%d')

            # 构建完整URL
            full_url = urljoin(base_url, url_path)

            sitemap += '  <url>\n'
            sitemap += f'    <loc>{full_url}</loc>\n'
            sitemap += f'    <lastmod>{last_modified}</lastmod>\n'
            sitemap += '    <changefreq>weekly</changefreq>\n'
            sitemap += '    <priority>0.8</priority>\n'
            sitemap += '  </url>\n'
        except FileNotFoundError:
            print(f"警告: 找不到文件 {file_path}")
            continue

    sitemap += '</urlset>'
    return sitemap

if __name__ == '__main__':
    # 设置您的网站基础URL
    base_url = 'https://liberpdf.shop/'
    
    # 生成站点地图
    sitemap_content = generate_sitemap(base_url)
    
    # 保存到文件
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    
    print('站点地图已生成完成！')