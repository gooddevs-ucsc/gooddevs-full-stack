"""
Script to check if development_roles column exists in user table
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.config import settings

def check_development_roles_column():
    """Check if development_roles column exists in user table"""
    try:
        # Create database connection
        engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
        
        with engine.connect() as connection:
            # Check if development_roles column exists
            result = connection.execute(text("""
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'user' 
                AND column_name = 'development_roles'
            """))
            
            columns = result.fetchall()
            
            if columns:
                print("✅ development_roles column found!")
                for col in columns:
                    print(f"   Column: {col[0]}")
                    print(f"   Type: {col[1]}")
                    print(f"   Nullable: {col[2]}")
                return True
            else:
                print("❌ development_roles column NOT found in user table")
                
                # Let's check what columns exist in user table
                result = connection.execute(text("""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'user'
                    ORDER BY ordinal_position
                """))
                
                user_columns = result.fetchall()
                print("\n📋 Current columns in user table:")
                for i, col in enumerate(user_columns, 1):
                    print(f"   {i}. {col[0]} ({col[1]})")
                
                return False
                
    except Exception as e:
        print(f"❌ Error checking database: {e}")
        return False

if __name__ == "__main__":
    print("=== Checking development_roles column in database ===\n")
    
    exists = check_development_roles_column()
    
    if not exists:
        print("\n🔧 To fix this, run:")
        print("   python -m alembic upgrade head")
        print("\n   Or check if the migration file is correct and try again.")
