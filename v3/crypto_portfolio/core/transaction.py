from dataclasses import dataclass, field
from datetime import datetime
import uuid

@dataclass
@dataclass
class Transaction:
    symbol: str
    type: str  # 'buy' or 'sell' (Backend uses 'buy'/'sell' or 'Achat'/'Vente')
    quantity: float
    price: float
    date: datetime = field(default_factory=datetime.now)
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    asset_name: str = "" # Added
    asset_type: str = "crypto" # Added
    fees: float = 0.0 # Added
    notes: str = "" # Added

    @property
    def total_value(self) -> float:
        return self.quantity * self.price

    @property
    def transaction_type(self) -> str:
        # Alias for React compatibility which expects transaction_type
        # Mapping 'Achat' -> 'buy', 'Vente' -> 'sell' or just returning type if already correct
        if self.type.lower() in ['achat', 'buy']: return 'buy'
        if self.type.lower() in ['vente', 'sell']: return 'sell'
        return self.type

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "symbol": self.symbol,
            "type": self.type,
            "transaction_type": self.transaction_type, # Exposed for frontend
            "quantity": self.quantity,
            "price": self.price,
            "total_amount": self.total_value,
            "date": self.date.isoformat(),
            "transaction_date": self.date.isoformat(), # Alias for React
            "asset_name": self.asset_name or self.symbol,
            "asset_type": self.asset_type,
            "fees": self.fees,
            "notes": self.notes
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Transaction':
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            symbol=data["symbol"],
            type=data["type"],
            quantity=data["quantity"],
            price=data["price"],
            date=datetime.fromisoformat(data.get("date", data.get("transaction_date", datetime.now().isoformat()))),
            asset_name=data.get("asset_name", ""),
            asset_type=data.get("asset_type", "crypto"),
            fees=data.get("fees", 0.0),
            notes=data.get("notes", "")
        )
