import os
from pathlib import Path

def generate_sitemap():
    # 获取当前目录的上级目录
    parent_dir = str(Path().absolute().parent)
    
    # 站点地图的头部
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # 遍历上级目录中的所有文件
    for root, dirs, files in os.walk(parent_dir):
        for file in files:
            if file.endswith('.html'):
                # 获取文件的完整路径
                file_path = os.path.join(root, file)
                
                # 将文件路径转换为URL格式
                relative_path = os.path.relpath(file_path, parent_dir)
                url = f"https://liberpdf.top/{relative_path.replace(os.sep, '/')}"
                
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