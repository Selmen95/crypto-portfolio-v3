from dataclasses import dataclass, field
from datetime import datetime
import uuid

@dataclass
class Dividend:
    asset_name: str
    amount: float
    payment_date: datetime
    status: str = "upcoming"  # 'upcoming', 'received'
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "asset_name": self.asset_name,
            "amount": self.amount,
            "payment_date": self.payment_date.isoformat(),
            "status": self.status
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Dividend':
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            asset_name=data["asset_name"],
            amount=data["amount"],
            payment_date=datetime.fromisoformat(data["payment_date"]),
            status=data.get("status", "upcoming")
        )
