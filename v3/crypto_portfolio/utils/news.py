import requests
import xml.etree.ElementTree as ET
from datetime import datetime
import time

class FinancialNewsAPI:
    @staticmethod
    def fetch_crypto_news():
        """
        Fetches crypto news from CryptoPanic public API (simulated/public entry point).
        """
        try:
            # Note: CryptoPanic usually requires API key for full access, 
            # but we can use their public RSS or a simulated/public fetch.
            # Here we use a public crypto news RSS as fallback/primary.
            url = "https://cointelegraph.com/rss"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            root = ET.fromstring(response.content)
            news_items = []
            
            for item in root.findall('.//item')[:10]:
                news_items.append({
                    'title': item.find('title').text,
                    'link': item.find('link').text,
                    'published': item.find('pubDate').text,
                    'source': 'CoinTelegraph',
                    'category': 'Crypto'
                })
            return news_items
        except Exception as e:
            print(f"Error fetching crypto news: {e}")
            return []

    @staticmethod
    def fetch_finance_news():
        """
        Fetches general finance news from Yahoo Finance RSS.
        """
        try:
            url = "https://finance.yahoo.com/news/rssindex"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            root = ET.fromstring(response.content)
            news_items = []
            
            for item in root.findall('.//item')[:10]:
                news_items.append({
                    'title': item.find('title').text,
                    'link': item.find('link').text,
                    'published': item.find('pubDate').text,
                    'source': 'Yahoo Finance',
                    'category': 'Finance'
                })
            return news_items
        except Exception as e:
            print(f"Error fetching finance news: {e}")
            return []

    @classmethod
    def get_all_news(cls):
        """
        Combines news from all sources.
        """
        crypto = cls.fetch_crypto_news()
        finance = cls.fetch_finance_news()
        
        all_news = crypto + finance
        # Simple shuffle/sort by date if possible, but for now just interleaved
        return all_news
