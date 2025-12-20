from ..extensions import socketio, db
from .models import Asset
from ..utils.api import CoinGeckoAPI

def background_price_fetch(app):
    """
    Background task to fetch prices and emit updates.
    """
    with app.app_context():
        print("Starting background price fetcher...")
        
    while True:
        socketio.sleep(15) 
        try:
            with app.app_context():
                # Get unique coin IDs
                assets = db.session.query(Asset.coin_id).distinct().filter(Asset.coin_id != None).all()
                coin_ids = [r[0] for r in assets if r[0]]
                
                if coin_ids:
                    # Fetch prices
                    prices = CoinGeckoAPI.get_prices(coin_ids)
                    if prices:
                        # Emit to all clients
                        socketio.emit('price_update', prices)
                        # print(f"Emitted prices for {len(prices)} coins")
        except Exception as e:
            print(f"Error in background fetch: {e}")
