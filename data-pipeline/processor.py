import uuid
import requests
from config import s3_client, R2_BUCKET, R2_DOMAIN, openai_client
import io

def process_images(raw_urls):
    """Downloads images from source URLs and re-uploads them to your R2 bucket."""
    secure_urls = []
    for raw_url in raw_urls:
        try:
            high_res_url = raw_url.replace('/thumb_', '/large_').replace('/medium_', '/large_')
            print(f"  -> [Processor] Uploading image to R2...")
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            response = requests.get(high_res_url, headers=headers, timeout=30)
            if response.status_code == 200:
                if len(response.content) < 10240: 
                    print(f"  -> [Warning] Image too small ({len(response.content)} bytes), skipping...")
                    continue
                ext = high_res_url.split('.')[-1][:3] if '.' in high_res_url else 'jpg' 
                file_name = f"archdaily/{uuid.uuid4().hex}.{ext}" 
                
                img_data = io.BytesIO(response.content)
                s3_client.upload_fileobj(
                    img_data, 
                    R2_BUCKET, 
                    file_name,
                    ExtraArgs={'ContentType': response.headers.get('content-type', 'image/jpeg')}
                )
                secure_urls.append(f"{R2_DOMAIN}/{file_name}")
        except Exception as e:
            print(f"  -> [Processor] Image processing failed: {e}")
    return secure_urls

def generate_embedding(data):
    """Converts project text into an AI embedding vector for semantic search."""
    print(f"  -> [Processor] Generating embedding via OpenRouter...")
    text_to_embed = f"Title: {data['title']}. Architect: {data['architect']}. Location: {data['location']}. Description: {data['description']}"
    text_to_embed = text_to_embed.replace("\n", " ") 
    
    response = openai_client.embeddings.create(
        input=[text_to_embed],
        model="openai/text-embedding-3-small" 
    )
    return response.data[0].embedding