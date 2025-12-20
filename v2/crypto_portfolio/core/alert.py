from dataclasses import dataclass

@dataclass
class Alert:
    """
    Represents a price alert for a specific asset.
    """
    symbol: str
    target_price: float
    condition: str = "above"  # "above" or "below"

    def check(self, current_price: float) -> bool:
        """
        Checks if the alert condition is met.
        """
        if self.condition == "above":
            return current_price >= self.target_price
        elif self.condition == "below":
            return current_price <= self.target_price
        return False

    def to_dict(self) -> dict:
        return {
            "symbol": self.symbol,
            "target_price": self.target_price,
            "condition": self.condition
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Alert':
        return cls(
            symbol=data["symbol"],
            target_price=data["target_price"],
            condition=data.get("condition", "above")
        )
