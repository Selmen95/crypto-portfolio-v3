import requests
from typing import Dict, Optional

class CoinGeckoAPI:
    BASE_URL = "https://api.coingecko.com/api/v3"

    @staticmethod
    def get_price(coin_id: str, currency: str = "usd") -> Optional[float]:
        """
        Fetches the current price of a coin by its CoinGecko ID.
        """
        res = CoinGeckoAPI.get_prices([coin_id], currency)
        return res.get(coin_id)

    @staticmethod
    def get_prices(coin_ids: list[str], currency: str = "usd") -> Dict[str, float]:
        """
        Fetches current prices for multiple coins.
        Returns dict {coin_id: price}
        """
        try:
            if not coin_ids: return {}
            url = f"{CoinGeckoAPI.BASE_URL}/simple/price"
            params = {
                "ids": ",".join(coin_ids),
                "vs_currencies": currency
            }
            response = requests.get(url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            results = {}
            for cid in coin_ids:
                if cid in data and currency in data[cid]:
                    results[cid] = data[cid][currency]
            return results
        except requests.RequestException:
            return {}


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
            return None
        except requests.RequestException:
            return None

    @staticmethod
    def get_coin_history(coin_id: str, days: int = 30, currency: str = "usd") -> Optional[list]:
        """
        Get historical market data. returns list of [timestamp, price].
        """
        try:
            url = f"{CoinGeckoAPI.BASE_URL}/coins/{coin_id}/market_chart"
            params = {
                "vs_currency": currency,
                "days": days,
                "interval": "daily"
            }
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            return data.get("prices", [])
        except requests.RequestException:
            return None
