from typing import List, Optional
from ..extensions import db
from .models import User, Asset, Transaction, Goal, Alert, Simulation, Dividend, Post, AutoTradeSettings

class DBPortfolioAdapter:
    def __init__(self, user: User):
        self.user = user

    # --- Assets ---
    @property
    def assets(self):
        # Return list to maintain compatibility with list operations like iteration
        # accessing .pop() on this list won't delete from DB, so we must intercept delete operations in app.py
        return self.user.assets.all()

    def add_asset(self, asset: Asset):
        asset.user_id = self.user.id
        db.session.add(asset)
        # Commit is handled by save_portfolio alias

    def get_assets(self) -> List[Asset]:
        return self.assets

    def remove_asset(self, asset_id: str):
        # We need ID based removal now, old code used symbol potentially?
        # app.py delete_asset uses ID now.
        asset = Asset.query.filter_by(id=asset_id, user_id=self.user.id).first()
        if asset:
            db.session.delete(asset)

    # --- Transactions ---
    def add_transaction(self, transaction: Transaction):
        transaction.user_id = self.user.id
        db.session.add(transaction)

    def get_transactions(self) -> List[Transaction]:
        return self.user.transactions.order_by(Transaction.date.desc()).all()

    # --- Goals ---
    def add_goal(self, goal: Goal):
        goal.user_id = self.user.id
        db.session.add(goal)

    def get_goals(self) -> List[Goal]:
        return self.user.goals.all()

    def remove_goal(self, goal_id: str):
        goal = Goal.query.filter_by(id=goal_id, user_id=self.user.id).first()
        if goal:
            db.session.delete(goal)

    # --- Alerts ---
    def add_alert(self, alert: Alert):
        alert.user_id = self.user.id
        db.session.add(alert)

    def get_alerts(self) -> List[Alert]:
        return self.user.alerts.all()

    # --- Simulations ---
    def add_simulation(self, simulation: Simulation):
        simulation.user_id = self.user.id
        db.session.add(simulation)

    def get_simulations(self) -> List[Simulation]:
        return self.user.simulations.all()

    def remove_simulation(self, sim_id: str):
        sim = Simulation.query.filter_by(id=sim_id, user_id=self.user.id).first()
        if sim:
            db.session.delete(sim)

    # --- Dividends ---
    def add_dividend(self, dividend: Dividend):
        dividend.user_id = self.user.id
        db.session.add(dividend)

    def get_dividends(self) -> List[Dividend]:
        return self.user.dividends.order_by(Dividend.payment_date).all()

    # --- Posts ---
    def add_post(self, post: Post):
        # community posts might be global, but here we link to user if we want
        # for now, lets just save them
        if not post.user_id:
            post.user_id = self.user.id
        db.session.add(post)

    def get_posts(self) -> List[Post]:
        # Return ALL posts for community, not just user's?
        # Original code: self.posts which was local. 
        # Ideally community is global. 
        return Post.query.order_by(Post.date.desc()).all()

    # --- User Profile ---
    def get_user_profile(self):
        # The User model itself acts as profile
        return self.user

    def update_user_profile(self, data_obj):
        # data_obj is likely a User or UserProfile object or dict
        # We update self.user fields
        if hasattr(data_obj, 'to_dict'):
            data = data_obj.to_dict()
        else:
            data = data_obj.__dict__
        
        # Mapping
        if 'full_name' in data: self.user.full_name = data['full_name']
        if 'age' in data: self.user.age = data['age']
        if 'profession' in data: self.user.profession = data['profession']
        if 'total_net_worth' in data: self.user.total_net_worth = data['total_net_worth']
        # ... map other fields if needed

    # --- Settings ---
    def get_auto_trade_settings(self) -> AutoTradeSettings:
        if not self.user.auto_trade_settings:
            # Create default
            settings = AutoTradeSettings(user_id=self.user.id)
            db.session.add(settings)
            # Need flush to get ID if needed?
            return settings
        return self.user.auto_trade_settings

    def update_auto_trade_settings(self, settings):
        # Update existing
        current = self.get_auto_trade_settings()
        current.enabled = settings.enabled
        current.take_profit_percentage = settings.take_profit_percentage
        current.stop_loss_percentage = settings.stop_loss_percentage
        # ... copy other fields manually or via loop
        current.trading_pairs_str = ",".join(settings.trading_pairs) if isinstance(settings.trading_pairs, list) else settings.trading_pairs
