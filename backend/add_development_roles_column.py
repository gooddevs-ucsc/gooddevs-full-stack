"""
Manual script to add development_roles column if migration failed
"""
import os
import sys
from sqlalchemy import create_engine, text

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.config import settings

def add_development_roles_column():
    """Manually add development_roles column to user table"""
    try:
        # Create database connection
        engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
        
        with engine.connect() as connection:
            # First check if column already exists
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'user' 
                AND column_name = 'development_roles'
            """))
            
            if result.fetchone():
                print("✅ development_roles column already exists!")
                return True
            
            # Add the column
            print("🔧 Adding development_roles column...")
            connection.execute(text("""
                ALTER TABLE "user" 
                ADD COLUMN development_roles VARCHAR(500) NULL
            """))
            
            connection.commit()
            print("✅ development_roles column added successfully!")
            
            # Verify it was added
            result = connection.execute(text("""
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'user' 
                AND column_name = 'development_roles'
            """))
            
            columns = result.fetchall()
            if columns:
                for col in columns:
                    print(f"   Column: {col[0]}")
                    print(f"   Type: {col[1]}")
                    print(f"   Nullable: {col[2]}")
            
            return True
            
    except Exception as e:
        print(f"❌ Error adding column: {e}")
        return False

if __name__ == "__main__":
    print("=== Manually adding development_roles column ===\n")
    add_development_roles_column()
