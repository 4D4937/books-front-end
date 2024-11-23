import os
from pathlib import Path

def generate_sitemap():
    # 获取当前目录的上级目录
    parent_dir = str(Path().absolute().parent)
    
    # 站点地图的头部
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # 只获取上级目录中的文件（不遍历子目录）
    for file in os.listdir(parent_dir):
        if file.endswith('.html'):
            # 获取文件名（不含.html后缀）
            file_name = file[:-5]  # 移除 '.html'
            
            # 将文件路径转换为URL格式
            url = f"https://liberpdf.top/{file_name}"
            
            # 添加URL到站点地图
            sitemap += '  <url>\n'
            sitemap += f'    <loc>{url}</loc>\n'
            sitemap += '  </url>\n'
    
    sitemap += '</urlset>'
    
    # 将站点地图写入文件
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap)

if __name__ == '__main__':
    generate_sitemap()