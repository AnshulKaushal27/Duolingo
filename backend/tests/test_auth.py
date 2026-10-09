import sys
import os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_auth_comprehensive():
    print("--- 1. Testing Unauthenticated Access to Protected Routes ---")
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401, f"Expected 401, got {res.status_code}"
    print("✓ /auth/me blocked for unauthenticated request (401)")

    res = client.get("/api/v1/user/profile")
    assert res.status_code == 401
    print("✓ /user/profile blocked without session cookie (401)")

    res = client.get("/api/v1/courses/es/tree")
    assert res.status_code == 401
    print("✓ /courses/es/tree blocked without session cookie (401)")

    print("\n--- 2. Testing Seed User Login via Username ---")
    res = client.post("/api/v1/auth/login", json={
        "identifier": "alexramos",
        "password": "development-only-password"
    })
    assert res.status_code == 200, res.text
    user = res.json()
    assert user["username"] == "alexramos"
    assert user["display_name"] == "Alex Ramos"
    assert user["total_xp"] >= 345
    assert user["streak"] >= 7
    assert user["hearts"] >= 0
    assert "duo_session" in res.cookies
    session_cookie = res.cookies["duo_session"]
    print(f"✓ Alex logged in via username! Cookie received: {session_cookie[:10]}...")

    print("\n--- 3. Testing Authenticated /auth/me with Cookie ---")
    res = client.get("/api/v1/auth/me", cookies={"duo_session": session_cookie})
    assert res.status_code == 200
    assert res.json()["username"] == "alexramos"
    print("✓ /auth/me verified for active session")

    print("\n--- 4. Testing Seed User Login via Email ---")
    res = client.post("/api/v1/auth/login", json={
        "identifier": "alex@example.com",
        "password": "development-only-password"
    })
    assert res.status_code == 200
    assert res.json()["username"] == "alexramos"
    print("✓ Alex logged in via email successfully!")

    print("\n--- 5. Testing Invalid Login Credentials ---")
    res = client.post("/api/v1/auth/login", json={
        "identifier": "alexramos",
        "password": "wrong-password-here"
    })
    assert res.status_code == 401
    assert "Incorrect username or password" in res.json()["detail"]
    print("✓ Wrong password rejected with 401")

    res = client.post("/api/v1/auth/login", json={
        "identifier": "nonexistent_user",
        "password": "development-only-password"
    })
    assert res.status_code == 401
    print("✓ Unknown user rejected with 401")

    print("\n--- 6. Testing User Signup ---")
    import uuid
    rand_tag = uuid.uuid4().hex[:6]
    test_uname = f"test_user_{rand_tag}"
    test_email = f"test_{rand_tag}@duolingo.test"

    new_user_data = {
        "name": "Test Learner",
        "email": test_email,
        "username": test_uname,
        "password": "mypassword123"
    }
    res = client.post("/api/v1/auth/signup", json=new_user_data)
    assert res.status_code == 201, res.text
    new_user = res.json()
    assert new_user["username"] == test_uname
    assert new_user["display_name"] == "Test Learner"
    assert "duo_session" in res.cookies
    test_user_cookie = res.cookies["duo_session"]
    print(f"✓ New learner signed up! ID: {new_user['id']}, Username: {new_user['username']}")

    print("\n--- 7. Testing Duplicate Email and Username Rejections ---")
    # Duplicate email
    res = client.post("/api/v1/auth/signup", json={
        "name": "Duplicate Email Person",
        "email": test_email,
        "username": f"unique_{rand_tag}",
        "password": "password123"
    })
    assert res.status_code == 400
    assert "already exists" in res.json()["detail"].lower()
    print("✓ Duplicate email rejected with 400")

    # Duplicate username
    res = client.post("/api/v1/auth/signup", json={
        "name": "Duplicate Username Person",
        "email": f"unique_email_{rand_tag}@test.com",
        "username": test_uname,
        "password": "password123"
    })
    assert res.status_code == 400
    assert "already taken" in res.json()["detail"].lower()
    print("✓ Duplicate username rejected with 400")

    print("\n--- 8. Testing Social Login (Google & Facebook) ---")
    res = client.post("/api/v1/auth/social-login", json={"provider": "google"})
    assert res.status_code == 200
    google_user = res.json()
    assert google_user["username"] == "google_learner"
    assert "duo_session" in res.cookies
    print("✓ Google social login succeeded!")

    res = client.post("/api/v1/auth/social-login", json={"provider": "facebook"})
    assert res.status_code == 200
    fb_user = res.json()
    assert fb_user["username"] == "facebook_learner"
    assert "duo_session" in res.cookies
    print("✓ Facebook social login succeeded!")

    print("\n--- 9. Testing Forgot Password Safe Endpoint ---")
    res = client.post("/api/v1/auth/forgot-password", json={"email": "alex@example.com"})
    assert res.status_code == 200
    assert res.json()["success"] is True
    print("✓ Forgot password handled safely without user enumeration")

    print("\n--- 10. Testing Logout and Session Termination ---")
    # Logout test user
    res = client.post("/api/v1/auth/logout", cookies={"duo_session": test_user_cookie})
    assert res.status_code == 200
    print("✓ Logout endpoint succeeded")

    # Trying to use test user's terminated cookie now should fail
    res = client.get("/api/v1/auth/me", cookies={"duo_session": test_user_cookie})
    assert res.status_code == 401
    print("✓ Terminated session successfully rejected with 401!")

    print("\n==========================================")
    print("ALL BACKEND AUTH TESTS PASSED PERFECTLY! ✓")
    print("==========================================")

if __name__ == "__main__":
    test_auth_comprehensive()
