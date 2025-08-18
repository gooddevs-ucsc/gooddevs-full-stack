from app.core.db import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        # Update the alembic version to the latest head we know about
        conn.execute(text("UPDATE alembic_version SET version_num = '26788788c5d2'"))
        conn.commit()
        print("Updated migration version to 26788788c5d2")
except Exception as e:
    print(f"Error: {e}")
