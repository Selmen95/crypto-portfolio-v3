from cryptography.fernet import Fernet
import os
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

class SecurityManager:
    _key = None
    
    @classmethod
    def get_key(cls):
        if not cls._key:
            # In a real app, this should be an env var. 
            # For this demo, we generate a deterministic key from the secret key or use a file.
            # Let's use a hardcoded salt + app secret for MVP
            password = b"crypto_pro_secret_key"
            salt = b"somesalt"
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
            )
            cls._key = base64.urlsafe_b64encode(kdf.derive(password))
        return cls._key

    @staticmethod
    def encrypt(data: str) -> str:
        if not data: return None
        f = Fernet(SecurityManager.get_key())
        return f.encrypt(data.encode()).decode()

    @staticmethod
    def decrypt(token: str) -> str:
        if not token: return None
        f = Fernet(SecurityManager.get_key())
        return f.decrypt(token.encode()).decode()
