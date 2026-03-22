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

    # Safely add the url column to any existing table without data loss
    try:
        cur.execute("ALTER TABLE projects ADD COLUMN IF NOT EXISTS url VARCHAR(512);")
    except Exception:
        pass  # Column already exists, nothing to do

    conn.commit()
    cur.close()
    conn.close()
    print("[DB] Database table is ready.")


def check_url_exists(url):
    """Pre-flight check: returns True if this URL has already been scraped."""
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
        # Secondary dedup check: match by URL or title to avoid duplicates
        cur.execute("SELECT id FROM projects WHERE url = %s OR title = %s;", (data['url'], data['title']))
        existing_project = cur.fetchone()

        if existing_project:
            # Project already exists — skip insertion
            print(f"[DB] ⚠️ Duplicate skipped: {data['title']} (already in database)\n")
        else:
            # New project — proceed with insertion
            cur.execute(
                """
                INSERT INTO projects 
                (title, architect, year, location, area, description, gallery, embedding, url)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    data['title'], data['architect'], data['year'], 
                    data['location'], data['area'], data['description'], 
                    data['gallery'], data['embedding'], data['url']
                )
            )
            conn.commit()
            print(f"[DB] ✅ Inserted: {data['title']}\n")
    except Exception as e:
        print(f"[DB] ❌ Insert failed: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()