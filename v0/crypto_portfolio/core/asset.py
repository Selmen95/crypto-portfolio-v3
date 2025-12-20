from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime

@dataclass
class Asset:
    """
    Represents a financial asset in the portfolio.
    
    Attributes:
        symbol (str): The ticker symbol (e.g., BTC, AAPL).
        quantity (float): The amount held.
        buy_price (float): The price at which the asset was purchased (average if multiple).
        purchase_date (datetime): The date of purchase (defaults to now).
    """
    symbol: str
    quantity: float
    buy_price: float
    purchase_date: datetime = field(default_factory=datetime.now)

    def current_value(self, current_price: float) -> float:
        """Calculates value based on a provided current price."""
        return self.quantity * current_price

    def profit_loss(self, current_price: float) -> float:
        """Calculates P/L based on provided current price."""
        return self.current_value(current_price) - (self.quantity * self.buy_price)

    def to_dict(self) -> dict:
        """Serialization helper."""
        return {
            "symbol": self.symbol,
            "quantity": self.quantity,
            "buy_price": self.buy_price,
            "purchase_date": self.purchase_date.isoformat()
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Asset':
        """Deserialization helper."""
        return cls(
            symbol=data["symbol"],
            quantity=data["quantity"],
            buy_price=data["buy_price"],
            purchase_date=datetime.fromisoformat(data["purchase_date"])
        )
