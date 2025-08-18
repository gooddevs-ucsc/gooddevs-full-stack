from app.core.db import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        result = conn.execute(text('SELECT version_num FROM alembic_version'))
        version = result.fetchone()
        if version:
            print(f"Current migration version: {version[0]}")
        else:
            print("No migration version found")
except Exception as e:
    print(f"Error: {e}")
