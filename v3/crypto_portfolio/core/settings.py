from dataclasses import dataclass, field
from typing import List, Optional
import uuid

@dataclass
class AutoTradeSettings:
    enabled: bool = False
    take_profit_percentage: float = 5.0
    stop_loss_percentage: float = 2.0
    auto_cashout_enabled: bool = False
    cashout_percentage: float = 50.0
    min_profit_to_cashout: float = 100.0
    max_position_size: float = 1000.0
    trading_pairs: List[str] = field(default_factory=lambda: ['BTC/USDT'])
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "enabled": self.enabled,
            "take_profit_percentage": self.take_profit_percentage,
            "stop_loss_percentage": self.stop_loss_percentage,
            "auto_cashout_enabled": self.auto_cashout_enabled,
            "cashout_percentage": self.cashout_percentage,
            "min_profit_to_cashout": self.min_profit_to_cashout,
            "max_position_size": self.max_position_size,
            "trading_pairs": self.trading_pairs
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'AutoTradeSettings':
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            enabled=data.get("enabled", False),
            take_profit_percentage=data.get("take_profit_percentage", 5.0),
            stop_loss_percentage=data.get("stop_loss_percentage", 2.0),
            auto_cashout_enabled=data.get("auto_cashout_enabled", False),
            cashout_percentage=data.get("cashout_percentage", 50.0),
            min_profit_to_cashout=data.get("min_profit_to_cashout", 100.0),
            max_position_size=data.get("max_position_size", 1000.0),
            trading_pairs=data.get("trading_pairs", ['BTC/USDT'])
        )
