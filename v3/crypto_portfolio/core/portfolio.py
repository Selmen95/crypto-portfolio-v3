from typing import List, Dict, Optional
from .asset import Asset
from .alert import Alert
from .transaction import Transaction
from .goal import Goal
from .simulation import Simulation
from .settings import AutoTradeSettings
from .dividend import Dividend
from .user_profile import UserProfile
from .community import Post, Review

class Portfolio:
    """
    Manages a collection of assets, alerts, goals, transactions, simulations, and community content.
    """
    def __init__(self):
        self.assets: List[Asset] = []
        self.alerts: List[Alert] = []
        self.goals: List[Goal] = []
        self.transactions: List[Transaction] = []
        self.simulations: List[Simulation] = []
        self.dividends: List[Dividend] = []
        self.posts: List[Post] = []
        self.reviews: List[Review] = []
        self.user_profile: Optional[UserProfile] = None
        self.auto_trade_settings: Optional[AutoTradeSettings] = None

    # --- Alerts ---
    def add_alert(self, alert: Alert):
        self.alerts.append(alert)

    def get_alerts(self) -> List[Alert]:
        return self.alerts

    # --- Assets ---
    def add_asset(self, asset: Asset):
        """Adds a new asset to the portfolio."""
        self.assets.append(asset)

    def remove_asset(self, symbol: str):
        """Removes all instances of an asset by symbol."""
        self.assets = [a for a in self.assets if a.symbol != symbol]

    def get_assets(self) -> List[Asset]:
        return self.assets

    # --- Transactions ---
    def add_transaction(self, transaction: Transaction):
        self.transactions.append(transaction)
    
    def get_transactions(self) -> List[Transaction]:
        return sorted(self.transactions, key=lambda t: t.date, reverse=True)

    # --- Goals ---
    def add_goal(self, goal: Goal):
        self.goals.append(goal)
    
    def get_goals(self) -> List[Goal]:
        return self.goals
    
    def remove_goal(self, goal_id: str):
        self.goals = [g for g in self.goals if g.id != goal_id]

    # --- Simulations ---
    def add_simulation(self, simulation: Simulation):
        self.simulations.append(simulation)

    def get_simulations(self) -> List[Simulation]:
        return self.simulations
    
    def remove_simulation(self, sim_id: str):
        self.simulations = [s for s in self.simulations if s.id != sim_id]

    # --- Dividends ---
    def add_dividend(self, dividend: Dividend):
        self.dividends.append(dividend)

    def get_dividends(self) -> List[Dividend]:
        return sorted(self.dividends, key=lambda d: d.payment_date)

    def remove_dividend(self, dividend_id: str):
        self.dividends = [d for d in self.dividends if d.id != dividend_id]
        
    # --- Community (Posts & Reviews) ---
    def add_post(self, post: Post):
        self.posts.append(post)
        
    def get_posts(self) -> List[Post]:
        return sorted(self.posts, key=lambda p: p.date, reverse=True)
        
    def add_review(self, review: Review):
        self.reviews.append(review)
        
    def get_reviews(self) -> List[Review]:
        return sorted(self.reviews, key=lambda r: r.date, reverse=True)

    # --- User Profile ---
    def get_user_profile(self) -> UserProfile:
        if not self.user_profile:
            self.user_profile = UserProfile(full_name="Trader", email="trader@example.com")
        return self.user_profile

    def update_user_profile(self, profile: UserProfile):
        self.user_profile = profile

    # --- Settings ---
    def get_auto_trade_settings(self) -> AutoTradeSettings:
        if not self.auto_trade_settings:
            self.auto_trade_settings = AutoTradeSettings()
        return self.auto_trade_settings

    def update_auto_trade_settings(self, settings: AutoTradeSettings):
        self.auto_trade_settings = settings

    # --- Persistence ---
    def to_dict(self) -> dict:
        return {
            "assets": [a.to_dict() for a in self.assets],
            "alerts": [a.to_dict() for a in self.alerts],
            "goals": [g.to_dict() for g in self.goals],
            "transactions": [t.to_dict() for t in self.transactions],
            "simulations": [s.to_dict() for s in self.simulations],
            "dividends": [d.to_dict() for d in self.dividends],
            "posts": [p.to_dict() for p in self.posts],
            "reviews": [r.to_dict() for r in self.reviews],
            "user_profile": self.user_profile.to_dict() if self.user_profile else None,
            "auto_trade_settings": self.auto_trade_settings.to_dict() if self.auto_trade_settings else None
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Portfolio':
        portfolio = cls()
        if "assets" in data:
            for asset_data in data["assets"]:
                portfolio.add_asset(Asset.from_dict(asset_data))
        if "alerts" in data:
            for alert_data in data["alerts"]:
                portfolio.add_alert(Alert.from_dict(alert_data))
        if "goals" in data:
            for goal_data in data["goals"]:
                portfolio.add_goal(Goal.from_dict(goal_data))
        if "transactions" in data:
            for transaction_data in data["transactions"]:
                portfolio.add_transaction(Transaction.from_dict(transaction_data))
        if "simulations" in data:
            for simulation_data in data["simulations"]:
                portfolio.add_simulation(Simulation.from_dict(simulation_data))
        if "dividends" in data:
            for dividend_data in data["dividends"]:
                portfolio.add_dividend(Dividend.from_dict(dividend_data))
        if "posts" in data:
            for post_data in data["posts"]:
                portfolio.add_post(Post.from_dict(post_data))
        if "reviews" in data:
            for review_data in data["reviews"]:
                portfolio.add_review(Review.from_dict(review_data))
        if "user_profile" in data and data["user_profile"]:
            portfolio.update_user_profile(UserProfile.from_dict(data["user_profile"]))
        if "auto_trade_settings" in data and data["auto_trade_settings"]:
            portfolio.update_auto_trade_settings(AutoTradeSettings.from_dict(data["auto_trade_settings"]))
        
        return portfolio
