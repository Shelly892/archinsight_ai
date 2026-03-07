import uuid
import requests
from config import s3_client, R2_BUCKET, R2_DOMAIN, openai_client

def process_images(raw_urls):
    """把别人的图片下载下来，传到你的 R2 仓库"""
    secure_urls = []
    for raw_url in raw_urls:
        try:
            print(f"  -> [Processor] 正在转存图片至 R2...")
            response = requests.get(raw_url, stream=True, timeout=10)
            if response.status_code == 200:
                ext = raw_url.split('.')[-1][:3] if '.' in raw_url else 'jpg' 
                file_name = f"archdaily/{uuid.uuid4().hex}.{ext}" 
                
                s3_client.upload_fileobj(
                    response.raw, 
                    R2_BUCKET, 
                    file_name,
                    ExtraArgs={'ContentType': response.headers.get('content-type', 'image/jpeg')}
                )
                secure_urls.append(f"{R2_DOMAIN}/{file_name}")
        except Exception as e:
            print(f"  -> [Processor] 图片处理失败: {e}")
    return secure_urls

def generate_embedding(data):
    """把文本变成 AI 向量，方便以后搜索"""
    print(f"  -> [Processor] 正在调用 OpenRouter 生成 AI 向量...")
    text_to_embed = f"Title: {data['title']}. Architect: {data['architect']}. Location: {data['location']}. Description: {data['description']}"
    text_to_embed = text_to_embed.replace("\n", " ") 
    
    response = openai_client.embeddings.create(
        input=[text_to_embed],
        # 【核心修改】：使用 OpenRouter 特有的模型命名格式
        model="openai/text-embedding-3-small" 
    )
    return response.data[0].embedding