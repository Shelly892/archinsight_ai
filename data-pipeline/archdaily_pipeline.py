import re
from playwright.sync_api import sync_playwright
import cloudinary
import cloudinary.uploader
from openai import OpenAI
import psycopg2
from pgvector.psycopg2 import register_vector

# ==========================================
# 1. 配置区域 (请替换为你自己的真实配置)
# ==========================================

# Cloudinary 配置
cloudinary.config(
    cloud_name="your_cloud_name",
    api_key="your_api_key",
    api_secret="your_api_secret"
)

# OpenAI 配置
openai_client = OpenAI(api_key="sk-your-openai-api-key")

# PostgreSQL 连接配置
DB_PARAMS = {
    "dbname": "your_db_name",
    "user": "your_db_user",
    "password": "your_db_password",
    "host": "localhost", # 线上环境请填写真实的 Host
    "port": "5432"
}