from typing import List, Dict, Optional
from .asset import Asset

class Portfolio:
    """
    Manages a collection of assets.
    """
    def __init__(self):
        self.assets: List[Asset] = []

    def add_asset(self, asset: Asset):
        """Adds a new asset to the portfolio."""
        # Simple implementation for V0: Just append. 
        # V1 logic might merge same symbols and average buy price.
        self.assets.append(asset)

    def remove_asset(self, symbol: str):
        """Removes all instances of an asset by symbol."""
        self.assets = [a for a in self.assets if a.symbol != symbol]

    def get_assets(self) -> List[Asset]:
        return self.assets

    def to_dict(self) -> dict:
        return {
            "assets": [a.to_dict() for a in self.assets]
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Portfolio':
        portfolio = cls()
        if "assets" in data:
            for asset_data in data["assets"]:
                portfolio.add_asset(Asset.from_dict(asset_data))
        return portfolio
