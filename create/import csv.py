import csv
import requests
import json
import concurrent.futures
import time
from typing import List, Dict
import logging
from ratelimit import limits, sleep_and_retry

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('upload.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)

# 速率限制装饰器：每分钟最多1000次调用（留出余量）
@sleep_and_retry
@limits(calls=1000, period=60)
def rate_limited_request(url, headers, data):
    return requests.put(url, headers=headers, data=data)

class CFKVUploader:
    def __init__(self, account_id: str, namespace_id: str, api_token: str):
        self.account_id = account_id
        self.namespace_id = namespace_id
        self.api_token = api_token
        self.base_url = f'https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values'
        self.headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }

    def read_csv_data(self, filename: str) -> List[Dict]:
        """读取CSV文件数据"""
        books = []
        try:
            with open(filename, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # 清理数据，移除空白字符
                    book = {
                        'id': row['id'].strip(),
                        'title': row['title'].strip(),
                        'author': row['author'].strip(),
                        'publisher': row['publisher'].strip(),
                        'publish_date': row['publish_date'].strip(),
                        'page_count': row['page_count'].strip(),
                        'ISBN': row['ISBN'].strip()
                    }
                    books.append(book)
            logging.info(f'成功读取 {len(books)} 条记录')
            return books
        except Exception as e:
            logging.error(f'读取CSV文件失败: {str(e)}')
            raise

    def upload_book(self, book: Dict) -> bool:
        """上传单本书籍数据到CF KV"""
        try:
            key = f'book:{book["id"]}'
            value = json.dumps(book, ensure_ascii=False)
            url = f'{self.base_url}/{key}'
            
            # 添加重试机制
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    # 使用速率限制的请求函数
                    response = rate_limited_request(url, self.headers, value)
                    
                    if response.status_code == 200:
                        logging.info(f'成功上传书籍 ID: {book["id"]}')
                        return True
                    else:
                        logging.warning(f'上传失败 ID: {book["id"]}, 状态码: {response.status_code}, 响应: {response.text}')
                        if attempt < max_retries - 1:
                            time.sleep(1)  # 重试前等待1秒
                            continue
                        return False
                except requests.exceptions.RequestException as e:
                    if attempt < max_retries - 1:
                        time.sleep(1)
                        continue
                    logging.error(f'请求异常 ID: {book["id"]}, 错误: {str(e)}')
                    return False
        except Exception as e:
            logging.error(f'上传过程发生异常 ID: {book["id"]}, 错误: {str(e)}')
            return False

    def upload_books_parallel(self, books: List[Dict], max_workers: int = 10):
        """并行上传所有书籍数据"""
        total = len(books)
        success_count = 0
        fail_count = 0
        
        logging.info(f'开始上传 {total} 本书籍数据，使用 {max_workers} 个线程')
        start_time = time.time()

        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            # 提交所有上传任务
            future_to_book = {executor.submit(self.upload_book, book): book for book in books}
            
            # 处理完成的任务
            for future in concurrent.futures.as_completed(future_to_book):
                book = future_to_book[future]
                try:
                    if future.result():
                        success_count += 1
                    else:
                        fail_count += 1
                except Exception as e:
                    logging.error(f'任务执行失败 ID: {book["id"]}, 错误: {str(e)}')
                    fail_count += 1

        end_time = time.time()
        duration = end_time - start_time
        
        # 输出统计信息
        logging.info(f'''
上传完成:
- 总数: {total}
- 成功: {success_count}
- 失败: {fail_count}
- 耗时: {duration:.2f}秒
- 平均速度: {total/duration:.2f}条/秒
''')

def main():
    # 配置信息
    ACCOUNT_ID = '0e016704dc5552d28010732c3d050a64'
    NAMESPACE_ID = '0090ce0bc6ea47e1a1e295d5c3d23974'
    API_TOKEN = 'vGIC8lEIfaj0s-Y1obkAEZOq9gjY51vOchGvrdLT'
    
    try:
        # 创建上传器实例
        uploader = CFKVUploader(ACCOUNT_ID, NAMESPACE_ID, API_TOKEN)
        
        # 读取CSV数据
        books = uploader.read_csv_data('kx.csv')
        
        # 并行上传数据，使用10个线程
        uploader.upload_books_parallel(books, max_workers=10)
        
    except Exception as e:
        logging.error(f'程序执行失败: {str(e)}')

if __name__ == '__main__':
    main()