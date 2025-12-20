import requests
from typing import Dict, Optional

class CoinGeckoAPI:
    BASE_URL = "https://api.coingecko.com/api/v3"

    @staticmethod
    def get_price(coin_id: str, currency: str = "usd") -> Optional[float]:
        """
        Fetches the current price of a coin by its CoinGecko ID.
        """
        try:
            url = f"{CoinGeckoAPI.BASE_URL}/simple/price"
            params = {
                "ids": coin_id,
                "vs_currencies": currency
            }
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            if coin_id in data and currency in data[coin_id]:
                return data[coin_id][currency]
            return None
        except requests.RequestException:
            return None

    @staticmethod
    def search_coin(symbol: str) -> Optional[str]:
        """
        Searches for a coin by symbol and returns its CoinGecko ID.
        Returns the first exact symbol match or None.
        """
        try:
            url = f"{CoinGeckoAPI.BASE_URL}/search"
            params = {"query": symbol}
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            for coin in data.get("coins", []):
                if coin["symbol"].upper() == symbol.upper():
                    return coin["id"]
            return None
        except requests.RequestException:
            return None
