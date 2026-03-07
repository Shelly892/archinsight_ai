import psycopg2
from pgvector.psycopg2 import register_vector
from config import DB_PARAMS

def init_db():
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    cur.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255),
            architect VARCHAR(255),
            year INTEGER,
            location VARCHAR(255),
            area VARCHAR(100),
            description TEXT,
            gallery TEXT[],
            embedding vector(1536),
            url VARCHAR(512)
        );
    """)

    # 2. 【无损升级魔法】：为你现有的旧表安全地追加 url 列！
    try:
        cur.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS url VARCHAR(512);")
    except Exception:
        pass # 如果已经有了就不管它

    conn.commit()
    cur.close()
    conn.close()
    print("[DB] 数据库表已就绪。")


def check_url_exists(url):
    """【新增功能】：前置拦截器！只需 0.01 秒即可判断是否爬过"""
    conn = psycopg2.connect(**DB_PARAMS)
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM projects WHERE url = %s;", (url,))
        exists = cur.fetchone()
        return exists is not None
    except Exception as e:
        return False
    finally:
        cur.close()
        conn.close()


def insert_project(data):
    conn = psycopg2.connect(**DB_PARAMS)
    register_vector(conn)
    cur = conn.cursor()
    try:
        # 事后兜底：既查 url 也查 title
        cur.execute("SELECT id FROM projects WHERE url = %s OR title = %s;", (data['url'], data['title']))
        existing_project = cur.fetchone()

        # 2. 🚦 判断逻辑
        if existing_project:
            # 如果 existing_project 不是 None，说明查到了！
            print(f"[DB] ⚠️ 跳过重复项目: {data['title']} (已存在于数据库中)\n")
        else:
            # 如果是 None，说明是新项目，执行真正的插入操作
            cur.execute(
                """
                INSERT INTO projects 
                (title, architect, year, location, area, description, gallery, embedding,url)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s)
                """,
                (
                    data['title'], data['architect'], data['year'], 
                    data['location'], data['area'], data['description'], 
                    data['gallery'], data['embedding'],data['url']
                )
            )
            conn.commit()
            print(f"[DB] ✅ 成功入库: {data['title']}\n")
    except Exception as e:
        print(f"[DB] ❌ 入库失败: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()