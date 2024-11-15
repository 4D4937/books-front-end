import os
import re

# 获取当前目录
current_dir = os.getcwd()

# 遍历当前目录下的所有文件
for filename in os.listdir(current_dir):
    # 检查文件是否以.html结尾
    if filename.endswith('.html'):
        # 获取文件名（不含扩展名）
        name_without_ext = os.path.splitext(filename)[0]
        # 检查文件名是否只包含数字
        if name_without_ext.isdigit():
            # 构建完整的文件路径
            file_path = os.path.join(current_dir, filename)
            try:
                # 删除文件
                os.remove(file_path)
                print(f'已删除文件: {filename}')
            except Exception as e:
                print(f'删除文件 {filename} 时出错: {str(e)}')