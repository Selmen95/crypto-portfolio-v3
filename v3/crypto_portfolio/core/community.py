from dataclasses import dataclass, field
import uuid
from datetime import datetime
from typing import List, Optional

@dataclass
class Review:
    user_name: str
    rating: int  # 1 to 5
    comment: str
    date: datetime = field(default_factory=datetime.now)
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_name": self.user_name,
            "rating": self.rating,
            "comment": self.comment,
            "date": self.date.isoformat()
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Review':
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            user_name=data.get("user_name", "Anonymous"),
            rating=data.get("rating", 5),
            comment=data.get("comment", ""),
            date=datetime.fromisoformat(data["date"]) if "date" in data else datetime.now()
        )

@dataclass
class Post:
    author_name: str
    content: str
    likes: int = 0
    date: datetime = field(default_factory=datetime.now)
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    comments: List[str] = field(default_factory=list) # Simple list of strings for now

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "author_name": self.author_name,
            "content": self.content,
            "likes": self.likes,
            "date": self.date.isoformat(),
            "comments": self.comments
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Post':
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            author_name=data.get("author_name", "Anonymous"),
            content=data.get("content", ""),
            likes=data.get("likes", 0),
            date=datetime.fromisoformat(data["date"]) if "date" in data else datetime.now(),
            comments=data.get("comments", [])
        )
