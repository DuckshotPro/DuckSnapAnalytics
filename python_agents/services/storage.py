"""
Storage Service

This module provides a storage interface for database operations using PostgreSQL.
"""

import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Optional, Dict, Any
from dataclasses import dataclass

@dataclass
class User:
    """User data model"""
    id: int
    username: str
    snapchat_client_id: Optional[str] = None
    snapchat_api_key: Optional[str] = None

class StorageService:
    """
    Storage service for managing user data and analytics via PostgreSQL.
    """
    
    def __init__(self):
        self.db_url = os.environ.get("DATABASE_URL")
        if not self.db_url:
            print("⚠️ DATABASE_URL environment variable is not set. StorageService will fail.")

    def _get_connection(self):
        return psycopg2.connect(self.db_url, cursor_factory=RealDictCursor)

    async def get_user(self, user_id: int) -> Optional[User]:
        """
        Get user by ID
        """
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "SELECT id, username, snapchat_client_id, snapchat_api_key FROM users WHERE id = %s",
                        (user_id,)
                    )
                    row = cur.fetchone()
                    if row:
                        return User(
                            id=row['id'],
                            username=row['username'],
                            snapchat_client_id=row.get('snapchat_client_id'),
                            snapchat_api_key=row.get('snapchat_api_key')
                        )
            return None
        except Exception as e:
            print(f"❌ Database Error (get_user): {e}")
            return None

    async def save_snapchat_data(self, user_id: int, data: Dict[str, Any]) -> bool:
        """
        Save Snapchat data for a user
        """
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO snapchat_data (user_id, data, fetched_at) VALUES (%s, %s, NOW())",
                        (user_id, json.dumps(data))
                    )
                conn.commit()
            return True
        except Exception as e:
            print(f"❌ Database Error (save_snapchat_data): {e}")
            return False

    async def save_ai_insight(self, user_id: int, insight: str) -> bool:
        """
        Save AI-generated insight for a user
        """
        try:
            with self._get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO ai_insights (user_id, insight, created_at) VALUES (%s, %s, NOW())",
                        (user_id, insight)
                    )
                conn.commit()
            return True
        except Exception as e:
            print(f"❌ Database Error (save_ai_insight): {e}")
            return False

# Global storage service instance
storage = StorageService()
