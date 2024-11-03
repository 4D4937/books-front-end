import pandas as pd
import os
from string import Template

def create_html_pages(csv_file, template_file, output_dir, num_pages):
    # 读取CSV文件
    df = pd.read_csv(csv_file, encoding='utf-8')
    
    # 获取总行数并检查用户输入的数量是否合法
    total_rows = len(df)
    if num_pages > total_rows:
        print(f"警告：要生成的数量({num_pages})超过了可用数据数量({total_rows})，将使用全部可用数据")
        num_pages = total_rows
    elif num_pages <= 0:
        print("错误：生成数量必须大于0")
        return
    
    # 只取用户指定数量的数据
    df = df.head(num_pages)
    print(f"\n将生成 {num_pages} 个HTML文件...")
    
    # 获取上级目录路径
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(output_dir)))
    
    # 预先检查重复文件
    duplicate_files = []
    for index, row in df.iterrows():
        filename = f"{row['id']}.html"
        parent_file_path = os.path.join(parent_dir, filename)
        if os.path.exists(parent_file_path):
            duplicate_files.append(filename)
    
    # 如果存在重复文件，询问用户是否继续
    skip_duplicates = False
    if duplicate_files:
        print(f"\n在上级目录中发现 {len(duplicate_files)} 个重名文件:")
        for file in duplicate_files:
            print(f"- {file}")
        while True:
            choice = input("\n是否继续生成这些重名文件？(y/n): ").lower()
            if choice in ['y', 'n']:
                break
            print("请输入 y 或 n!")
        skip_duplicates = (choice == 'n')
    
    # 读取HTML模板
    with open(template_file, 'r', encoding='utf-8') as f:
        template_content = f.read()
    
    # 创建Template对象
    template = Template(template_content)
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    # 计数器
    success_count = 0
    error_count = 0
    skip_count = 0
    
    # 遍历选定的数据行生成HTML文件
    for index, row in df.iterrows():
        try:
            filename = f"{row['id']}.html"
            
            # 如果文件重复且用户选择跳过，则继续下一个
            if skip_duplicates and filename in duplicate_files:
                skip_count += 1
                print(f"进度: [{success_count + skip_count}/{num_pages}] 已跳过: {filename}")
                continue
            
            # 准备模板所需的数据
            try:
                pages = int(row['page_count'])
                publish_date = int(row['publish_date'])
            except (ValueError, TypeError):
                pages = 0  # 页数默认值
                publish_date = 0  # 出版时间默认值
                
            page_data = {
                'title': row['title'],
                'author': row['author'],
                'publisher': row['publisher'],
                'publish_date': publish_date,
                'isbn': row['ISBN'],
                'pages': pages
            }
            
            # 生成HTML内容
            html_content = template.substitute(page_data)
            
            # 写入HTML文件
            file_path = os.path.join(output_dir, filename)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
                
            success_count += 1
            print(f"进度: [{success_count + skip_count}/{num_pages}] 已生成: {filename} (标题: {row['title']})")
            
        except Exception as e:
            error_count += 1
            print(f"错误: 处理第 {index + 1} 行数据时失败: {str(e)}")
    
    # 打印最终统计信息
    print("\n生成完成！统计信息：")
    print(f"请求生成数量: {num_pages}")
    print(f"成功生成: {success_count}")
    print(f"跳过数量: {skip_count}")
    print(f"失败数量: {error_count}")
    print(f"HTML文件保存在: {os.path.abspath(output_dir)}")

def get_valid_number():
    while True:
        try:
            num = int(input("请输入要生成的HTML文件数量: "))
            return num
        except ValueError:
            print("请输入有效的数字！")

def main():
    # 配置参数
    csv_file = 'kx.csv'  # CSV文件路径
    template_file = 't.html'  # 模板文件路径
    output_dir = 'output'  # 输出目录
    
    try:
        # 获取用户输入的生成数量
        num_pages = get_valid_number()
        
        # 开始生成文件
        create_html_pages(csv_file, template_file, output_dir, num_pages)
    except Exception as e:
        print(f"程序执行出错: {str(e)}")

if __name__ == '__main__':
    main()