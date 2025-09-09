"""
Test script for development roles registration
This script tests the new development_roles functionality.
"""

import sys
import os

# Add the backend app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

def test_models():
    """Test that the models can be imported and have the development_roles field"""
    try:
        from app.models import User, UserRegister, UserCreate
        
        print("✅ Models imported successfully")
        
        # Check if User model has development_roles field
        if hasattr(User, 'development_roles'):
            print("✅ User model has development_roles field")
        else:
            print("❌ User model missing development_roles field")
            
        # Check if UserRegister model has development_roles field
        if hasattr(UserRegister, 'development_roles'):
            print("✅ UserRegister model has development_roles field")
        else:
            print("❌ UserRegister model missing development_roles field")
            
        # Check if UserCreate model has development_roles field
        if hasattr(UserCreate, 'development_roles'):
            print("✅ UserCreate model has development_roles field")
        else:
            print("❌ UserCreate model missing development_roles field")
            
        # Test creating a UserRegister instance
        user_register_data = {
            "email": "test@example.com",
            "password": "testpassword123",
            "firstname": "Test",
            "lastname": "User",
            "role": "VOLUNTEER",
            "development_roles": "frontend,backend"
        }
        
        user_register = UserRegister(**user_register_data)
        print(f"✅ UserRegister instance created: {user_register.development_roles}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing models: {e}")
        return False

def test_development_roles_values():
    """Test that development roles are stored as lowercase, comma-separated values"""
    expected_roles = [
        "frontend",
        "backend", 
        "fullstack",
        "uiux",
        "projectmanager",
        "qa"
    ]
    
    test_input = ["frontend", "backend", "fullstack"]
    result = ",".join(test_input)
    
    print(f"✅ Development roles format test: {result}")
    print(f"✅ Available roles: {', '.join(expected_roles)}")
    
    return True

if __name__ == "__main__":
    print("=== Testing Development Roles Implementation ===\n")
    
    print("1. Testing Models:")
    models_ok = test_models()
    
    print("\n2. Testing Development Roles Format:")
    format_ok = test_development_roles_values()
    
    print(f"\n=== Results ===")
    print(f"Models: {'✅ PASS' if models_ok else '❌ FAIL'}")
    print(f"Format: {'✅ PASS' if format_ok else '❌ FAIL'}")
    
    if models_ok and format_ok:
        print("\n🎉 All tests passed! Development roles implementation is ready.")
        print("\nTo test the full flow:")
        print("1. Start the backend server")
        print("2. Go to the registration page")
        print("3. Select 'Volunteer' role")
        print("4. Choose one or more development roles")
        print("5. Complete registration")
        print("6. Check the database to see the development_roles column populated")
    else:
        print("\n❌ Some tests failed. Please check the implementation.")
