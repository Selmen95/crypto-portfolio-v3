from dataclasses import dataclass, field
from datetime import datetime
import uuid

@dataclass
class Goal:
    title: str
    target_amount: float
    current_amount: float
    deadline: str # YYYY-MM-DD
    category: str
    description: str = ""
    status: str = "active" # active, completed
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

    @property
    def target_date(self) -> str:
        return self.deadline

    @property
    def progress_percent(self) -> float:
        if self.target_amount <= 0: return 0
        return min(100, (self.current_amount / self.target_amount) * 100)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "target_amount": self.target_amount,
            "current_amount": self.current_amount,
            "deadline": self.deadline,
            "target_date": self.deadline, # React uses target_date
            "category": self.category,
            "description": self.description,
            "status": self.status
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Goal':
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            title=data["title"],
            target_amount=data["target_amount"],
            current_amount=data["current_amount"],
            deadline=data.get("deadline") or data.get("target_date"),
            category=data["category"],
            description=data.get("description", ""),
            status=data.get("status", "active")
        )
