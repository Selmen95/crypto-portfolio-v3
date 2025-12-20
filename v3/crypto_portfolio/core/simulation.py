from dataclasses import dataclass, field
from datetime import datetime
import uuid

@dataclass
class Simulation:
    name: str
    symbol: str
    initial_investment: float # Renamed from investment to match React logic better, or alias it. Let's keep investment but mapping logic.
    quantity: float = 0.0
    current_price: float = 0.0
    current_value: float = 0.0
    profit_loss: float = 0.0
    status: str = "active" # active, archived
    notes: str = ""
    asset_type: str = "crypto"
    created_at: datetime = field(default_factory=datetime.now)
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "symbol": self.symbol,
            "initial_investment": self.investment, # React expects initial_investment
            "quantity": self.quantity,
            "current_price": self.current_price,
            "current_value": self.current_value,
            "profit_loss": self.profit_loss,
            "status": self.status,
            "target_price": self.target_price,
            "stop_loss": self.stop_loss,
            "notes": self.notes,
            "asset_type": self.asset_type,
            "created_at": self.created_at.isoformat()
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Simulation':
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            name=data["name"],
            symbol=data["symbol"],
            investment=data.get("initial_investment", data.get("investment", 0.0)),
            quantity=data.get("quantity", 0.0),
            current_price=data.get("current_price", 0.0),
            current_value=data.get("current_value", 0.0),
            profit_loss=data.get("profit_loss", 0.0),
            status=data.get("status", "active"),
            target_price=data.get("target_price", 0.0),
            stop_loss=data.get("stop_loss", 0.0),
            notes=data.get("notes", ""),
            asset_type=data.get("asset_type", "crypto"),
            created_at=datetime.fromisoformat(data.get("created_at", datetime.now().isoformat()))
        )
