from app import app, db
from crypto_portfolio.core.models import PortfolioSnapshot, User

def fix_db():
    print("Attempting to fix database...")
    with app.app_context():
        # Create all tables
        db.create_all()
        print("db.create_all() executed.")
        
        # Check if PortfolioSnapshot table works
        try:
            count = PortfolioSnapshot.query.count()
            print(f"PortfolioSnapshot table exists. Row count: {count}")
            
            # Check if user exists
            user_count = User.query.count()
            print(f"User count: {user_count}")
            
        except Exception as e:
            print(f"Error accessing tables: {e}")

if __name__ == "__main__":
    fix_db()
