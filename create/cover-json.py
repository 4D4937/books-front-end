import csv
import json

def convert_csv_to_json():
    print("请输入要转换的行数 (输入 all 转换所有行):")
    limit = input().strip()
    
    result = []
    with open('kx.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        count = 0
        
        for row in reader:
            if limit != 'all' and count >= int(limit):
                break
                
            # 构建书籍数据
            book_data = {
                'id': row['id'],
                'title': row['title'],
                'author': row['author'],
                'publisher': row['publisher'],
                'publish_date': row['publish_date'],
                'page_count': row['page_count'],
                'ISBN': row['ISBN']
            }
            
            # 移除空值
            book_data = {k: v for k, v in book_data.items() if v}
            
            # 严格按照 CF KV 格式要求构建数据
            kv_item = {
                'key': f'book:{row["id"]}',
                'value': json.dumps(book_data, ensure_ascii=False),
                'metadata': {'type': 'book'}  # 可选的元数据
            }
            
            result.append(kv_item)
            count += 1
    
    # 将结果写入文件，确保不进行格式化（避免多余的空格）
    with open('output.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, separators=(',', ':'))
    
    print(f"已转换 {count} 行数据到 output.json")

if __name__ == '__main__':
    convert_csv_to_json()