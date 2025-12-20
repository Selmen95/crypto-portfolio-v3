import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
from datetime import datetime, timedelta
from ..utils.api import CoinGeckoAPI

class AIPredictor:
    """
    Simple AI service to forecast crypto prices using Polynomial Regression.
    """
    
    @staticmethod
    def predict_future(coin_id: str, days_history=30, days_future=7):
        """
        Fetches history and returns (dates, historical_prices, future_dates, predicted_prices).
        """
        raw_data = CoinGeckoAPI.get_coin_history(coin_id, days=days_history)
        if not raw_data or len(raw_data) < 10:
            return None
            
        # Parse data [timestamp, price]
        # X = days from start, y = price
        data = np.array(raw_data)
        timestamps = data[:, 0]
        prices = data[:, 1]
        
        # Normalize time to "days since start"
        start_time = timestamps[0]
        X = (timestamps - start_time).reshape(-1, 1) / (1000 * 3600 * 24) # ms to days
        y = prices
        
        # Model: Polynomial Regression (Degree 2 or 3 for curves)
        degree = 2
        model = make_pipeline(PolynomialFeatures(degree), LinearRegression())
        model.fit(X, y)
        
        # Predict Future
        last_day = X[-1][0]
        future_days = np.array([last_day + i for i in range(1, days_future + 1)]).reshape(-1, 1)
        
        # Combine X for full timeline plotting
        all_days = np.concatenate((X, future_days))
        all_predictions = model.predict(all_days)
        
        # Convert days back to dates
        historical_dates = [datetime.fromtimestamp(ts/1000).strftime('%Y-%m-%d') for ts in timestamps]
        future_dates_list = [datetime.fromtimestamp((start_time + d[0]*24*3600*1000)/1000).strftime('%Y-%m-%d') for d in future_days]
        
        return {
            "historical_dates": historical_dates,
            "historical_prices": prices.tolist(),
            "future_dates": future_dates_list,
            "predicted_prices": all_predictions[len(X):].tolist(),
            "trend": "up" if all_predictions[-1] > prices[-1] else "down",
            "confidence": 85 # Mock confidence
        }
