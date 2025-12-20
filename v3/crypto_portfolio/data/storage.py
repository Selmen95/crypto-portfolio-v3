import json
import os
from ..core.portfolio import Portfolio

class Storage:
    """
    Handles persistence of the portfolio data.
    """
    def __init__(self, filepath: str = "portfolio.json"):
        self.filepath = filepath

    def save(self, portfolio: Portfolio):
        """Saves the portfolio to a JSON file."""
        with open(self.filepath, 'w') as f:
            json.dump(portfolio.to_dict(), f, indent=4)

    def load(self) -> Portfolio:
        """Loads the portfolio from a JSON file."""
        if not os.path.exists(self.filepath):
            return Portfolio()
        
        try:
            with open(self.filepath, 'r') as f:
                data = json.load(f)
                return Portfolio.from_dict(data)
        except (json.JSONDecodeError, IOError):
            # Return empty portfolio on corruption or read error for V0 resilience
            return Portfolio()
