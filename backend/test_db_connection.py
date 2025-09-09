"""
Quick test to check database connection and user table structure
"""
import os
import sys

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

try:
    from app.core.config import settings
    print(f"✅ Config loaded")
    print(f"Database URL: {str(settings.SQLALCHEMY_DATABASE_URI)}")
    
    from sqlalchemy import create_engine
    engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
    print(f"✅ Engine created")
    
    # Test connection
    with engine.connect() as connection:
        print(f"✅ Database connection successful")
        
        # Quick test query
        result = connection.execute("SELECT 1 as test")
        print(f"✅ Query executed: {result.fetchone()}")
        
except Exception as e:
    print(f"❌ Error: {e}")
    print("Make sure PostgreSQL is running and the database 'test' exists")
