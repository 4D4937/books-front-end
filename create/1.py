import pandas as pd
import os
import datetime

def create_html_pages():
    try:
        # 获取当前工作目录
        current_dir = os.getcwd()
        parent_dir = os.path.dirname(current_dir)  # 获取上级目录
        print(f"当前工作目录: {current_dir}")
        print(f"上级目录: {parent_dir}")
        
        # 查看目录中的文件
        print("目录中的文件:", os.listdir(parent_dir))
        
        # 读取CSV文件
        df = pd.read_csv('kx.csv')
        print(f"总共有{len(df)}条数据")
        
        # 输入生成页面数量
        while True:
            try:
                num_pages = int(input("请输入要生成的页面数量(输入0生成所有): "))
                if 0 <= num_pages <= len(df):
                    break
                print(f"输入数量必须在0到{len(df)}之间")
            except ValueError:
                print("请输入有效的数字")
        
        if num_pages == 0:
            num_pages = len(df)
            
        output_dir = 'output_html'
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        # 检查上级目录是否已生成相同页面文件
        existing_files = [f for f in os.listdir(parent_dir) if f.endswith('.html')]
        existing_filenames = set(existing_files)  # 用集合去重，方便比较
        
        # 收集所有将要生成的文件名
        filenames = []
        for i in range(num_pages):
            row = df.iloc[i]
            filename = f"{row['id']}.html"
            filenames.append(filename)
        
        # 检测重复文件
        duplicate_files = [f for f in filenames if f in existing_filenames]
        duplicate_count = len(duplicate_files)
        
        overwrite = False
        if duplicate_files:
            print(f"发现{duplicate_count}个重复文件: {', '.join(duplicate_files)}")
            while True:
                choice = input("是否覆盖所有已存在的文件？(y: 覆盖 / n: 跳过): ").strip().lower()
                if choice == 'y':
                    overwrite = True
                    break
                elif choice == 'n':
                    overwrite = False
                    break
                else:
                    print("请输入 'y' 或 'n'")
        
        try:
            with open('t.html', 'r', encoding='utf-8') as f:
                template = f.read()
                
            # 分割模板,保护script部分
            parts = template.split('<script>')
            if len(parts) > 1:
                before_script = parts[0]
                script_and_after = '<script>' + ''.join(parts[1:])
            else:
                before_script = template
                script_and_after = ''
                
        except FileNotFoundError:
            print("错误: 找不到template.html模板文件")
            return
        except Exception as e:
            print(f"读取模板文件时发生错误: {str(e)}")
            return

        # 生成HTML页面
        for i in range(num_pages):
            try:
                row = df.iloc[i]
                
                data = {
                    'title': str(row['title']),
                    'author': str(row['author']) if pd.notna(row['author']) else '未知',
                    'publisher': str(row['publisher']) if pd.notna(row['publisher']) else '未知',
                    'publish_date': str(int(float(row['publish_date']))) if pd.notna(row['publish_date']) else '未知',
                    'isbn': str(row['ISBN']) if pd.notna(row['ISBN']) else '未知',
                    'pages': str(int(float(row['page_count']))) if pd.notna(row['page_count']) else '未知'
                }
                
                # 只替换script之前的部分
                html_content = before_script
                for key, value in data.items():
                    html_content = html_content.replace(f'${{{key}}}', value)
                
                # 添加回script部分
                html_content += script_and_after
                    
                filename = f"{row['id']}.html"
                file_path = os.path.join(output_dir, filename)
                
                if filename in existing_filenames:
                    if overwrite:
                        pass  # 允许覆盖
                    else:
                        print(f"跳过生成已有文件: {filename}")
                        continue  # 跳过当前文件的生成
                
                # 保存文件
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(html_content)
                    
                print(f"已生成 {i+1}/{num_pages}: {filename}")
                
            except Exception as e:
                print(f"处理第{i+1}个文件时发生错误: {str(e)}")
                continue
            
        print(f"\n完成! 已在 {output_dir} 目录生成 {num_pages} 个HTML文件")
        
    except FileNotFoundError as e:
        print(f"文件未找到错误: {str(e)}")
    except pd.errors.EmptyDataError as e:
        print(f"CSV文件为空错误: {str(e)}")
    except pd.errors.ParserError as e:
        print(f"CSV解析错误: {str(e)}")
    except Exception as e:
        print(f"其他错误: {str(e)}")
        print(f"错误类型: {type(e)}")
        import traceback
        print("详细错误信息:")
        print(traceback.format_exc())

if __name__ == "__main__":
    create_html_pages()
