from datetime import datetime
import uuid
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import db

def generate_uuid():
    return str(uuid.uuid4())

class User(UserMixin, db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    
    # Profile Data
    full_name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True)
    age = db.Column(db.Integer)
    profession = db.Column(db.String(100))
    total_net_worth = db.Column(db.Float, default=0.0)
    monthly_contribution = db.Column(db.Float, default=0.0)
    
    # New preference fields
    email_notifications = db.Column(db.Boolean, default=True)
    weekly_reports = db.Column(db.Boolean, default=True)
    default_currency = db.Column(db.String(10), default='USD')
    language = db.Column(db.String(10), default='fr')
    role = db.Column(db.String(20), default='Investisseur')
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    bio = db.Column(db.Text)
    profile_picture_url = db.Column(db.String(255))
    
    # Relationships
    assets = db.relationship('Asset', backref='owner', lazy='dynamic')
    transactions = db.relationship('Transaction', backref='owner', lazy='dynamic')
    goals = db.relationship('Goal', backref='owner', lazy='dynamic')
    alerts = db.relationship('Alert', backref='owner', lazy='dynamic')
    simulations = db.relationship('Simulation', backref='owner', lazy='dynamic')
    dividends = db.relationship('Dividend', backref='owner', lazy='dynamic')
    auto_trade_settings = db.relationship('AutoTradeSettings', uselist=False, backref='owner')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'full_name': self.full_name or self.username,
            'email': self.email or f"{self.username}@example.com",
            'age': self.age,
            'profession': self.profession,
            'total_net_worth': self.total_net_worth,
            'monthly_contribution': self.monthly_contribution,
            'email_notifications': self.email_notifications,
            'weekly_reports': self.weekly_reports,
            'default_currency': self.default_currency,
            'language': self.language,
            'role': self.role,
            'created_date': self.created_date.isoformat() if self.created_date else None,
            'bio': self.bio or "",
            'profile_picture_url': self.profile_picture_url or "",
            'notifications_config': {
                'email_trades': self.email_notifications,
                'email_profits': True, # Default values for template compatibility
                'email_community': True
            }
        }

class Asset(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    
    symbol = db.Column(db.String(20)) # e.g. BTC
    name = db.Column(db.String(100))
    asset_type = db.Column(db.String(20)) # crypto, stock
    quantity = db.Column(db.Float, default=0.0)
    buy_price = db.Column(db.Float, default=0.0)
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow)
    coin_id = db.Column(db.String(50)) # coingecko id
    notes = db.Column(db.Text)
    location = db.Column(db.String(50))
    broker = db.Column(db.String(50))
    currency = db.Column(db.String(10), default='USD')
    
    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'name': self.name,
            'asset_type': self.asset_type,
            'quantity': self.quantity,
            'buy_price': self.buy_price,
            'purchase_date': self.purchase_date.isoformat() if self.purchase_date else None,
            'coin_id': self.coin_id,
            'notes': self.notes,
            'location': self.location,
            'broker': self.broker,
            'currency': self.currency
        }

class Transaction(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    
    symbol = db.Column(db.String(20))
    type = db.Column(db.String(20)) # buy, sell
    quantity = db.Column(db.Float)
    price = db.Column(db.Float)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    asset_name = db.Column(db.String(100))
    asset_type = db.Column(db.String(20))
    strategy = db.Column(db.String(50)) # manual, auto_trade
    profit_loss = db.Column(db.Float, default=0.0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'type': self.type,
            'quantity': self.quantity,
            'price': self.price,
            'date': self.date.isoformat(),
            'asset_name': self.asset_name,
            'asset_type': self.asset_type,
            'strategy': self.strategy,
            'profit_loss': self.profit_loss
        }

class Goal(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    
    title = db.Column(db.String(100))
    category = db.Column(db.String(50))
    target_amount = db.Column(db.Float)
    current_amount = db.Column(db.Float)
    deadline = db.Column(db.String(20)) # Keep as string for now to match UI iso format or change to Date
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='active')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'target_amount': self.target_amount,
            'current_amount': self.current_amount,
            'deadline': self.deadline,
            'description': self.description,
            'status': self.status
        }

class Alert(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    
    coin_id = db.Column(db.String(50))
    target_price = db.Column(db.Float)
    condition = db.Column(db.String(20)) # above, below
    is_active = db.Column(db.Boolean, default=True)

class ExchangeCredential(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    
    exchange_id = db.Column(db.String(50)) # e.g., 'binance', 'coinbase'
    api_key_enc = db.Column(db.Text)
    api_secret_enc = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationship to user
    user = db.relationship('User', backref=db.backref('exchanges', lazy='dynamic'))

    def to_dict(self):
        return {
            'id': self.id,
            'exchange_id': self.exchange_id,
            'is_active': self.is_active,
            'has_key': bool(self.api_key_enc)
        }

class Simulation(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    
    name = db.Column(db.String(100))
    symbol = db.Column(db.String(20))
    investment = db.Column(db.Float)
    quantity = db.Column(db.Float)
    current_price = db.Column(db.Float)
    current_value = db.Column(db.Float)
    profit_loss = db.Column(db.Float)
    asset_type = db.Column(db.String(20))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'symbol': self.symbol,
            'investment': self.investment,
            'quantity': self.quantity,
            'current_price': self.current_price,
            'current_value': self.current_value,
            'profit_loss': self.profit_loss,
            'asset_type': self.asset_type
        }

class Dividend(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    
    asset_name = db.Column(db.String(100))
    amount = db.Column(db.Float)
    payment_date = db.Column(db.DateTime)
    status = db.Column(db.String(20))

    def to_dict(self):
        return {
            'id': self.id,
            'asset_name': self.asset_name,
            'amount': self.amount,
            'payment_date': self.payment_date.isoformat(),
            'status': self.status
        }

class AutoTradeSettings(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    
    enabled = db.Column(db.Boolean, default=False)
    take_profit_percentage = db.Column(db.Float, default=5.0)
    stop_loss_percentage = db.Column(db.Float, default=2.0)
    auto_cashout_enabled = db.Column(db.Boolean, default=False)
    cashout_percentage = db.Column(db.Float, default=50.0)
    min_profit_to_cashout = db.Column(db.Float, default=100.0)
    max_position_size = db.Column(db.Float, default=1000.0)
    # Storing list as comma-separated string for SQLite simplicity
    trading_pairs_str = db.Column(db.String(200), default='BTC/USDT')
    
    def to_dict(self):
        return {
            'id': self.id,
            'enabled': self.enabled,
            'take_profit_percentage': self.take_profit_percentage,
            'stop_loss_percentage': self.stop_loss_percentage,
            'auto_cashout_enabled': self.auto_cashout_enabled,
            'cashout_percentage': self.cashout_percentage,
            'min_profit_to_cashout': self.min_profit_to_cashout,
            'max_position_size': self.max_position_size,
            'trading_pairs': self.trading_pairs_str.split(',') if self.trading_pairs_str else []
        }

class Post(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    # Community posts might be public or linked to user. Let's link but keep author_name separate for display persistence
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=True)
    author_name = db.Column(db.String(100))
    content = db.Column(db.Text)
    likes = db.Column(db.Integer, default=0)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'author_name': self.author_name,
            'content': self.content,
            'likes': self.likes,
            'date': self.date.isoformat()
        }

class PortfolioSnapshot(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'))
    date = db.Column(db.Date)
    total_value = db.Column(db.Float)

    def to_dict(self):
        return {
            'date': self.date.isoformat(),
            'total_value': self.total_value
        }
