import csv
import os
from string import Template

def read_template(template_path):
    """读取HTML模板文件"""
    with open(template_path, 'r', encoding='utf-8') as f:
        return Template(f.read())

def generate_html_files(csv_path, template, output_dir, limit=None):
    """根据CSV数据生成HTML文件
    Args:
        csv_path: CSV文件路径
        template: HTML模板
        output_dir: 输出目录
        limit: 生成文件数量限制，None表示生成所有
    """
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 读取CSV文件
    count = 0
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # 检查是否达到生成数量限制
            if limit and count >= limit:
                break
                
            # 准备模板变量
            template_vars = {
                'title': row.get('title', ''),
                'author': row.get('author', ''),
                'publisher': row.get('publisher', ''),
                'publish_date': row.get('publish_date', ''),
                'isbn': row.get('ISBN', ''),
                'pages': row.get('page_count', '')
            }
            
            # 生成HTML内容
            html_content = template.safe_substitute(template_vars)
            
            # 生成文件名（使用书籍ID或标题）
            filename = f"{row.get('id', '').strip()}.html"
            if not filename.startswith('_'):  # 避免以下划线开头的文件名
                filepath = os.path.join(output_dir, filename)
                
                # 写入HTML文件
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                
                count += 1
    
    return count

def main():
    # 配置路径
    template_path = 't.html'  # HTML模板文件路径
    csv_path = 'kx.csv'  # CSV数据文件路径
    output_dir = 'output'  # 输出目录
    
    # 获取用户输入的生成数量
    while True:
        try:
            user_input = input('请输入要生成的文件数量（直接回车生成全部）: ').strip()
            if user_input == '':
                limit = None
                break
            limit = int(user_input)
            if limit > 0:
                break
            print('请输入大于0的数字')
        except ValueError:
            print('请输入有效的数字')
    
    # 读取模板
    template = read_template(template_path)
    
    # 生成HTML文件
    generated_count = generate_html_files(csv_path, template, output_dir, limit)
    
    print(f'已生成 {generated_count} 个HTML文件！')

if __name__ == '__main__':
    main()