import os
from dotenv import load_dotenv
import boto3
from openai import OpenAI

# 加载 .env 文件
load_dotenv(override=True)

# 初始化 Cloudflare R2 客户端
s3_client = boto3.client(
    's3',
    endpoint_url=f"https://{os.getenv('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com",
    aws_access_key_id=os.getenv('CLOUDFLARE_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('CLOUDFLARE_SECRET_ACCESS_KEY'),
    region_name='auto'
)
R2_BUCKET = os.getenv('CLOUDFLARE_BUCKET_NAME')
R2_DOMAIN = os.getenv('CLOUDFLARE_PUBLIC_DOMAIN')

# 初始化 OpenAI 客户端
openai_client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENAI_API_KEY"),
)

# 数据库参数
DB_PARAMS = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT")
}