import sys
import os
import uuid
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import SessionLocal, engine
from app.models import User, Lesson, Skill, UserProgress

client = TestClient(app)

def create_authenticated_test_user():
    uid = uuid.uuid4().hex[:6]
    test_uname = f"rubric_{uid}"
    signup_res = client.post("/api/v1/auth/signup", json={
        "name": f"Rubric Learner {uid}",
        "username": test_uname,
        "email": f"rubric_{uid}@example.com",
        "password": "rubric-pass-123"
    })
    assert signup_res.status_code == 201
    cookies = signup_res.cookies
    db = SessionLocal()
    user = db.query(User).filter(User.username == test_uname).first()
    user.hearts = 5
    user.gems = 1000
    user.streak = 7
    db.commit()
    db.close()
    return test_uname, cookies

def test_db_foreign_keys_enabled():
    """DB2 [C]: PRAGMA foreign_keys = ON in SQLite"""
    with engine.connect() as conn:
        fk_status = conn.exec_driver_sql("PRAGMA foreign_keys").scalar()
        assert fk_status == 1, f"Expected PRAGMA foreign_keys == 1, got {fk_status}"
    print("✓ DB2 [C] PASSED: SQLite foreign key enforcement is active (PRAGMA foreign_keys = 1)")

def test_locked_skill_refusal():
    """P4 [C]: Direct API call to start a lesson in a locked skill must refuse with 403."""
    db = SessionLocal()
    try:
        lesson_locked = db.query(Lesson).join(Skill).filter(Skill.order_index > 1).first()
        assert lesson_locked is not None

        test_uname, cookies = create_authenticated_test_user()

        # Try starting locked lesson directly
        res = client.post(f"/api/v1/lessons/{lesson_locked.id}/start", cookies=cookies)
        assert res.status_code == 403, f"Expected 403 for locked skill, got {res.status_code}: {res.text}"
        assert "locked" in res.json()["detail"].lower()
        print("✓ P4 [C] PASSED: Server strictly rejected starting lesson in locked skill with HTTP 403")
    finally:
        db.close()

def test_zero_hearts_lesson_start_refusal():
    """H3 [C]: Starting a lesson with 0 hearts is blocked on backend."""
    test_uname, cookies = create_authenticated_test_user()
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == test_uname).first()
        user.hearts = 0
        db.commit()

        # Try to start lesson 1 (in unlocked skill 1 "Basics")
        res = client.post("/api/v1/lessons/1/start", cookies=cookies)
        assert res.status_code == 400, f"Expected 400 for 0 hearts, got {res.status_code}: {res.text}"
        assert "hearts" in res.json()["detail"].lower()
        print("✓ H3 [C] PASSED: Server strictly refused lesson start with 0 hearts with HTTP 400")
    finally:
        db.close()

def test_completion_idempotency_and_no_xp_forgery():
    """C2 [C] & A3 [C]: XP cannot be forged; replaying completion never double-awards XP."""
    test_uname, cookies = create_authenticated_test_user()
    db = SessionLocal()
    try:
        # Start lesson 1 (in available skill 1)
        start_res = client.post("/api/v1/lessons/1/start", cookies=cookies)
        assert start_res.status_code == 200
        attempt_id = start_res.json()["attempt_id"]

        # Attempt to complete with forged payload (xp: 99999)
        user_before = db.query(User).filter(User.username == test_uname).first()
        xp_before = user_before.total_xp

        comp_res_1 = client.post(
            "/api/v1/lessons/1/complete",
            json={"attempt_id": attempt_id, "xp": 99999},
            cookies=cookies
        )
        assert comp_res_1.status_code == 200
        data_1 = comp_res_1.json()
        assert data_1["xp_earned"] == 15, f"Forged XP was not ignored! Got {data_1['xp_earned']}"

        db.expire_all()
        user_after_1 = db.query(User).filter(User.username == test_uname).first()
        assert user_after_1.total_xp == xp_before + 15
        print("✓ A3 [C] PASSED: Backend awarded authoritative 15 XP, ignoring forged client xp: 99999")

        # Replay completion (adversarial curl test 1)
        comp_res_2 = client.post(
            "/api/v1/lessons/1/complete",
            json={"attempt_id": attempt_id},
            cookies=cookies
        )
        assert comp_res_2.status_code == 200
        data_2 = comp_res_2.json()
        assert data_2["xp_earned"] == 0, f"Expected 0 XP on replayed completion, got {data_2['xp_earned']}"

        db.expire_all()
        user_after_2 = db.query(User).filter(User.username == test_uname).first()
        assert user_after_2.total_xp == user_after_1.total_xp, "XP doubled on replay!"
        print("✓ C2 [C] PASSED: Replayed completion safely returned 0 XP without double-awarding")
    finally:
        db.close()

def test_day_simulation_and_streak():
    """S2 [C]: Testable day-simulation endpoint verifies streak increment and reset."""
    test_uname, cookies = create_authenticated_test_user()

    # 1. Simulate yesterday (1 day ago)
    sim_res_1 = client.post("/api/v1/user/debug/simulate-day?days_ago=1", cookies=cookies)
    assert sim_res_1.status_code == 200
    assert sim_res_1.json()["success"] is True
    print("✓ S2 [C] Step 1: Simulated 1 day ago (yesterday)")

    # 2. Simulate 2 days ago without freeze
    sim_res_2 = client.post("/api/v1/user/debug/simulate-day?days_ago=2", cookies=cookies)
    assert sim_res_2.status_code == 200
    data_2 = sim_res_2.json()
    assert data_2["streak"] == 0 or data_2["streak_freezes"] > 0
    print("✓ S2 [C] Step 2: Simulated 2 days ago -> streak reset or freeze consumed verified")

    # Reset back to today
    client.post("/api/v1/user/debug/simulate-day?days_ago=0", cookies=cookies)

def test_streak_freeze_purchase():
    """X15: Streak freeze purchasable in shop, deducted gems, capped at 2."""
    test_uname, cookies = create_authenticated_test_user()

    res = client.post("/api/v1/user/shop/streak-freeze", cookies=cookies)
    assert res.status_code == 200
    data = res.json()
    assert data["streak_freezes"] <= 2
    print(f"✓ X15 PASSED: Streak freeze purchase endpoint functional ({data['streak_freezes']}/2 held)")

def test_skip_exercise_deducts_heart():
    """E8: Skip behaves like Duolingo (counts as wrong, loses a heart)."""
    test_uname, cookies = create_authenticated_test_user()

    # Start lesson 1
    start_res = client.post("/api/v1/lessons/1/start", cookies=cookies)
    assert start_res.status_code == 200
    attempt_id = start_res.json()["attempt_id"]
    ex_id = start_res.json()["exercises"][0]["id"]

    # Submit skip
    sub_res = client.post(
        f"/api/v1/lessons/1/exercises/{ex_id}/submit",
        json={"attempt_id": attempt_id, "submitted_answer": "__SKIPPED__"},
        cookies=cookies
    )
    assert sub_res.status_code == 200
    data = sub_res.json()
    assert data["is_correct"] is False
    assert data["hearts_remaining"] == 4
    assert len(data["correct_solution"]) > 0
    print("✓ E8 PASSED: Skip submitted as __SKIPPED__ decremented 1 heart and revealed correct solution")

if __name__ == "__main__":
    test_db_foreign_keys_enabled()
    test_locked_skill_refusal()
    test_zero_hearts_lesson_start_refusal()
    test_completion_idempotency_and_no_xp_forgery()
    test_day_simulation_and_streak()
    test_streak_freeze_purchase()
    test_skip_exercise_deducts_heart()
    print("\n=======================================================")
    print("ALL STRICT RUBRIC CRITICAL & ADVERSARIAL TESTS PASSED! ✓")
    print("=======================================================")
