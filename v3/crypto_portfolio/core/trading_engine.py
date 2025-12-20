import ccxt
from typing import Optional, Dict, List
from .models import ExchangeCredential, User, Transaction, AutoTradeSettings
from ..utils.security import SecurityManager
from ..extensions import db
from datetime import datetime

class TradingEngine:
    """
    Handles interactions with CCXT exchanges.
    """
    
    @staticmethod
    def get_exchange_client(credential: ExchangeCredential):
        """
        Factory to return an authenticated ccxt exchange instance.
        """
        eid = credential.exchange_id.lower()
        if eid not in ccxt.exchanges:
            raise ValueError(f"Exchange {eid} not supported by CCXT")
            
        exchange_class = getattr(ccxt, eid)
        
        decrypted_key = SecurityManager.decrypt(credential.api_key_enc)
        decrypted_secret = SecurityManager.decrypt(credential.api_secret_enc)
        
        exchange = exchange_class({
            'apiKey': decrypted_key,
            'secret': decrypted_secret,
            'enableRateLimit': True,
        })
        
        # Load markets to verify connection
        # exchange.load_markets() # Can be slow, do on demand
        return exchange

    @staticmethod
    def verify_connection(credential: ExchangeCredential) -> bool:
        try:
            client = TradingEngine.get_exchange_client(credential)
            client.fetch_balance()
            return True
        except Exception as e:
            print(f"Connection verification failed: {e}")
            return False
            
    @staticmethod
    def execute_auto_trade(user: User):
        """
        Main logic for the Auto-Trading bot.
        Checking rules and executing orders.
        """
        settings = user.auto_trade_settings
        if not settings or not settings.enabled:
            return
            
        # Get active exchange credential (assume first active one for now)
        creds = user.exchanges.filter_by(is_active=True).first()
        if not creds:
            print(f"No active exchange for user {user.username}")
            return
            
        try:
            client = TradingEngine.get_exchange_client(creds)
            
            # Simple Strategy Example:
            # If "BTC/USDT" price < X (buy) -> Logic needs market data history which we have via API/Socket
            # For this Phase, we'll implement a 'test' trade or simple market buy/sell trigger from UI
            # Real bot logic requires loop. 
            pass
        except Exception as e:
            print(f"Auto trade error: {e}")

    @staticmethod
    def place_order(user: User, symbol: str, side: str, amount: float, price: float = None):
        """
        Manual or Auto order placement.
        """
        creds = user.exchanges.filter_by(is_active=True).first()
        if not creds:
            raise ValueError("No connected exchange")
            
        client = TradingEngine.get_exchange_client(creds)
        
        # Determine type
        order_type = 'limit' if price else 'market'
        
        try:
            if order_type == 'limit':
                order = client.create_order(symbol, order_type, side, amount, price)
            else:
                order = client.create_order(symbol, order_type, side, amount)
            
            # Log transaction to DB
            txn = Transaction(
                user_id=user.id,
                symbol=symbol,
                type=side,
                quantity=amount,
                price=order.get('price', price), # Market orders might vary
                asset_name=symbol, # Simplified
                asset_type='crypto',
                strategy='manual' if price else 'market_auto', 
                profit_loss=0
            )
            db.session.add(txn)
            db.session.commit()
            
            return order
        except Exception as e:
            print(f"Order failed: {e}")
            raise e
