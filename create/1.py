import pandas as pd
import os
import datetime

def create_html_pages():
    try:
        print("当前工作目录:", os.getcwd())
        print("目录中的文件:", os.listdir())
        
        df = pd.read_csv('kx.csv')
        print(f"总共有{len(df)}条数据")
        
        while True:
            try:
                num_pages = int(input("请输入要生成的页面数量(输入0生成所有): "))
                if num_pages <= len(df):
                    break
                print(f"输入数量超过可用数据量{len(df)}")
            except ValueError:
                print("请输入有效的数字")
        
        if num_pages == 0:
            num_pages = len(df)
            
        output_dir = 'output_html'
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
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
            
        for i in range(num_pages):
            try:
                row = df.iloc[i]
                
                data = {
                    'title': str(row['title']),
                    'author': str(row['author']) if pd.notna(row['author']) else '未知',
                    'publisher': str(row['publisher']) if pd.notna(row['publisher']) else '未知',
                    'publish_date': str(row['publish_date']) if pd.notna(row['publish_date']) else '未知',
                    'isbn': str(row['ISBN']) if pd.notna(row['ISBN']) else '未知',
                    'pages': str(row['page_count']) if pd.notna(row['page_count']) else '未知'
                }
                
                # 只替换script之前的部分
                html_content = before_script
                for key, value in data.items():
                    html_content = html_content.replace(f'${{{key}}}', value)
                
                # 添加回script部分
                html_content += script_and_after
                    
                filename = f"{row['id']}.html"
                file_path = os.path.join(output_dir, filename)
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