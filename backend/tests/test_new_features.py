import sys
import os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_new_features():
    print("--- 1. Authenticate as Alex Ramos ---")
    login_res = client.post("/api/v1/auth/login", json={
        "identifier": "alexramos",
        "password": "development-only-password"
    })
    assert login_res.status_code == 200
    cookies = login_res.cookies
    print("✓ Alex authenticated")

    print("\n--- 2. Testing Unit Guidebook Endpoint ---")
    res = client.get("/api/v1/courses/units/1/guidebook", cookies=cookies)
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["unit_number"] == 1
    assert "key_phrases" in data and len(data["key_phrases"]) > 0
    assert "grammar_tips" in data and len(data["grammar_tips"]) > 0
    print(f"✓ Unit 1 Guidebook fetched successfully: {len(data['key_phrases'])} phrases, {len(data['grammar_tips'])} grammar tips")

    print("\n--- 3. Testing Milestone Chest Claim Endpoint ---")
    res = client.post("/api/v1/user/chest/claim", cookies=cookies)
    assert res.status_code == 200, res.text
    chest_data = res.json()
    assert chest_data["success"] is True
    assert chest_data["reward"] == 25
    assert chest_data["gems"] >= 25
    print(f"✓ Milestone chest claimed successfully! Rewarded: +{chest_data['reward']} gems, new total: {chest_data['gems']}")

    print("\n--- 4. Testing Unit Jump-Ahead Endpoint ---")
    res = client.post("/api/v1/courses/units/2/jump-ahead", cookies=cookies)
    assert res.status_code == 200, res.text
    jump_data = res.json()
    assert jump_data["success"] is True
    print(f"✓ Jump-ahead to Unit 2 succeeded: {jump_data['message']}")

    print("\n==========================================")
    print("ALL NEW PRODUCT SPEC TESTS PASSED 100%! ✓")
    print("==========================================")

if __name__ == "__main__":
    test_new_features()
