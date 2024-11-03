import os
from datetime import datetime
from urllib.parse import urljoin

def generate_sitemap(base_url):
    # 获取上级目录的路径
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # 只获取上级目录中的html文件（不包含子目录）
    html_files = []
    for file in os.listdir(parent_dir):
        if file.endswith('.html'):
            # 使用 os.path.join 构建完整路径
            full_path = os.path.join(parent_dir, file)
            # URL 路径就是文件名
            url_path = file
            html_files.append((full_path, url_path))

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
    base_url = 'https://liberpdf.top/'
    
    # 生成站点地图
    sitemap_content = generate_sitemap(base_url)
    
    # 保存到文件
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_content)
    
    print('站点地图已生成完成！')