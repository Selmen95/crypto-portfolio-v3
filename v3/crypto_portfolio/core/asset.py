from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime
import uuid

@dataclass
class Asset:
    """
    Represents a financial asset in the portfolio.
    """
    symbol: str
    quantity: float
    buy_price: float
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    coin_id: Optional[str] = None
    asset_type: str = "crypto"
    purchase_date: datetime = field(default_factory=datetime.now)
    notes: str = ""
    location: str = ""
    broker: str = ""
    currency: str = "USD"

    def current_value(self, current_price: float) -> float:
        """Calculates value based on a provided current price."""
        return self.quantity * current_price

    def profit_loss(self, current_price: float) -> float:
        """Calculates P/L based on provided current price."""
        return self.current_value(current_price) - (self.quantity * self.buy_price)

    def to_dict(self) -> dict:
        """Serialization helper."""
        return {
            "id": self.id,
            "symbol": self.symbol,
            "name": self.name,
            "quantity": self.quantity,
            "buy_price": self.buy_price,
            "coin_id": self.coin_id,
            "asset_type": self.asset_type,
            "purchase_date": self.purchase_date.isoformat(),
            "notes": self.notes,
            "location": self.location,
            "broker": self.broker,
            "currency": self.currency
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Asset':
        """Deserialization helper."""
        # Handle date parsing safely
        p_date = datetime.now()
        if "purchase_date" in data:
            try:
                p_date = datetime.fromisoformat(data["purchase_date"])
            except:
                pass

        return cls(
            id=data.get("id", str(uuid.uuid4())),
            symbol=data.get("symbol", ""),
            name=data.get("name", ""),
            quantity=data.get("quantity", 0.0),
            buy_price=data.get("buy_price", 0.0),
            coin_id=data.get("coin_id"),
            asset_type=data.get("asset_type", "crypto"),
            purchase_date=p_date,
            notes=data.get("notes", ""),
            location=data.get("location", ""),
            broker=data.get("broker", ""),
            currency=data.get("currency", "USD")
        )
