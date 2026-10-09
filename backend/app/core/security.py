import os
import hmac
import hashlib
import secrets
from datetime import datetime, timedelta

ITERATIONS = 100000

def hash_password(password: str) -> str:
    """Hashes a password using PBKDF2-HMAC-SHA256 with a secure random salt."""
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, ITERATIONS)
    return f"pbkdf2:sha256:{ITERATIONS}${salt.hex()}${key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored PBKDF2 hash safely."""
    if not hashed_password or not hashed_password.startswith("pbkdf2:sha256:"):
        return False
    try:
        parts = hashed_password.split("$")
        if len(parts) != 3:
            return False
        header, salt_hex, key_hex = parts
        iterations = int(header.split(":")[-1])
        salt = bytes.fromhex(salt_hex)
        expected_key = bytes.fromhex(key_hex)
        candidate_key = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, iterations)
        return hmac.compare_digest(expected_key, candidate_key)
    except Exception:
        return False

def generate_session_token() -> str:
    """Generates a cryptographically strong session token."""
    return secrets.token_urlsafe(32)

def get_session_expiry(days: int = 30) -> datetime:
    """Returns sliding session expiry timestamp."""
    return datetime.utcnow() + timedelta(days=days)
