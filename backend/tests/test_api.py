import sys
import os
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_api_workflow():
    print("--- 1. Testing Root & Health ---")
    res = client.get("/")
    assert res.status_code == 200, res.text
    print("✓ Health check OK:", res.json())

    print("\n--- 1b. Authenticate as Alex Ramos ---")
    from app.core.database import SessionLocal
    from app.models.user import User
    db = SessionLocal()
    u = db.query(User).filter(User.username == "alexramos").first()
    if u:
        u.hearts = 5
        u.gems = 1000
        db.commit()
    db.close()
    res = client.post("/api/v1/auth/login", json={
        "identifier": "alexramos",
        "password": "development-only-password"
    })
    assert res.status_code == 200, res.text
    print("✓ Alex authenticated for full workflow test")

    print("\n--- 2. Testing Course Tree ---")
    res = client.get("/api/v1/courses/es/tree")
    assert res.status_code == 200, res.text
    tree = res.json()
    assert tree["title"] == "Spanish"
    assert len(tree["units"]) == 3
    print("✓ Spanish course tree fetched with 3 units:")
    for u in tree["units"]:
        print(f"  - Unit {u['unit_number']}: {u['title']} ({len(u['skills'])} skills)")
        for s in u["skills"]:
            print(f"      * Skill '{s['title']}': status={s['status']}, crowns={s['crowns_earned']}/{s['total_crowns']}")

    # Check that skill 1 is 'completed'
    assert tree["units"][0]["skills"][0]["status"] == "completed"
    assert tree["units"][0]["skills"][1]["status"] in ["available", "completed"]

    print("\n--- 3. Testing User Profile ---")
    res = client.get("/api/v1/user/profile")
    assert res.status_code == 200, res.text
    user = res.json()
    assert user["username"] == "alexramos"
    assert user["streak"] == 7
    assert user["hearts"] == 5
    print(f"✓ Profile OK: {user['display_name']}, Streak: {user['streak']} days, Hearts: {user['hearts']}/5, XP: {user['total_xp']}")

    print("\n--- 4. Testing Start Lesson (Sanitized Payloads) ---")
    res = client.post("/api/v1/lessons/3/start")
    assert res.status_code == 200, res.text
    start_data = res.json()
    attempt_id = start_data["attempt_id"]
    exercises = start_data["exercises"]
    print(f"✓ Lesson started! Attempt ID: {attempt_id}, Exercises: {len(exercises)}")

    # Verify that solutions are NOT exposed in client payload
    for ex in exercises:
        assert "solution_payload" not in ex
        assert "correct_option_id" not in ex["client_payload"]
        assert "canonical_tokens" not in ex["client_payload"]
        assert "pairs" not in ex["client_payload"]
        assert "correct_option" not in ex["client_payload"]
        assert "canonical_answer" not in ex["client_payload"]
    print("✓ SECURITY VERIFIED: Zero answers/solutions exposed in client payload!")

    print("\n--- 5. Testing Backend-Authoritative Exercise Submission ---")
    # Exercise 1 in Lesson 3 is multiple choice: "How do you say 'Hello'?" -> "opt_1" ("Hola")
    ex1 = exercises[0]
    res = client.post(
        f"/api/v1/lessons/3/exercises/{ex1['id']}/submit",
        json={"attempt_id": attempt_id, "submitted_answer": "opt_1"}
    )
    assert res.status_code == 200, res.text
    eval_res = res.json()
    assert eval_res["is_correct"] is True
    assert eval_res["hearts_remaining"] == 5
    print(f"✓ Correct answer evaluated by backend! is_correct={eval_res['is_correct']}, hearts={eval_res['hearts_remaining']}")

    print("\n--- 6. Testing Duplicate Submission Protection ---")
    # Submitting the exact same exercise again in the same attempt
    res_dup = client.post(
        f"/api/v1/lessons/3/exercises/{ex1['id']}/submit",
        json={"attempt_id": attempt_id, "submitted_answer": "opt_1"}
    )
    assert res_dup.status_code == 200, res_dup.text
    dup_eval = res_dup.json()
    assert dup_eval["is_duplicate"] is True
    assert dup_eval["hearts_deducted"] == 0
    print("✓ DUPLICATE PROTECTION VERIFIED: Duplicate submission safely ignored with 0 penalty!")

    print("\n--- 7. Testing Incorrect Answer & Heart Loss ---")
    # Submit wrong answer on Exercise 2
    ex2 = exercises[1]
    res_wrong = client.post(
        f"/api/v1/lessons/3/exercises/{ex2['id']}/submit",
        json={"attempt_id": attempt_id, "submitted_answer": ["wrong", "tokens"]}
    )
    assert res_wrong.status_code == 200, res_wrong.text
    wrong_eval = res_wrong.json()
    assert wrong_eval["is_correct"] is False
    assert wrong_eval["hearts_deducted"] == 1
    assert wrong_eval["hearts_remaining"] == 4
    print(f"✓ Wrong answer handled correctly: is_correct=False, hearts={wrong_eval['hearts_remaining']}/5 (Solution: {wrong_eval['correct_solution']})")

    print("\n--- 8. Testing Lesson Completion & XP Reward ---")
    res_complete = client.post(
        "/api/v1/lessons/3/complete",
        json={"attempt_id": attempt_id}
    )
    assert res_complete.status_code == 200, res_complete.text
    comp_res = res_complete.json()
    assert comp_res["success"] is True
    assert comp_res["xp_earned"] == 15
    print(f"✓ Lesson completed! XP earned: +{comp_res['xp_earned']}, Total XP: {comp_res['total_xp']}, Accuracy: {comp_res['accuracy_percentage']}%")

    print("\n--- 9. Testing Leaderboard Standings ---")
    res_lb = client.get("/api/v1/leaderboard")
    assert res_lb.status_code == 200, res_lb.text
    lb_data = res_lb.json()
    assert lb_data["league"] == "Ruby"
    print(f"✓ Leaderboard ({lb_data['league']} League):")
    for entry in lb_data["entries"][:5]:
        marker = " 👈 (YOU)" if entry["is_current_user"] else ""
        print(f"   #{entry['rank']} {entry['display_name']} - {entry['weekly_xp']} XP{marker}")

    print("\n--- 10. Testing Hearts Refill ---")
    from app.core.database import SessionLocal
    from app.models.user import User
    db = SessionLocal()
    u = db.query(User).filter(User.username == "alexramos").first()
    if u and u.gems < 350:
        u.gems += 500
        db.commit()
    db.close()
    res_refill = client.post("/api/v1/user/hearts/refill")
    assert res_refill.status_code == 200, res_refill.text
    refill_data = res_refill.json()
    assert refill_data["hearts"] == 5
    print(f"✓ Hearts refill OK: {refill_data['hearts']}/5 hearts, remaining gems: {refill_data['gems']}")

    print("\n🎉 ALL BACKEND APIs, VALIDATION, AND GAMIFICATION TESTS PASSED 100%!")

if __name__ == "__main__":
    test_full_api_workflow()
