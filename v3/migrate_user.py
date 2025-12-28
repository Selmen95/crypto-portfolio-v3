from app import app, db
from sqlalchemy import text

def migrate_db():
    print("Migrating database to add new user columns...")
    with app.app_context():
        # Get database connection
        conn = db.engine.connect()
        
        # Check existing columns
        result = conn.execute(text("PRAGMA table_info(user)"))
        columns = [row[1] for row in result]
        
        new_columns = [
            ("email", "VARCHAR(120)"),
            ("email_notifications", "BOOLEAN DEFAULT 1"),
            ("weekly_reports", "BOOLEAN DEFAULT 1"),
            ("default_currency", "VARCHAR(10) DEFAULT 'USD'"),
            ("language", "VARCHAR(10) DEFAULT 'fr'"),
            ("role", "VARCHAR(20) DEFAULT 'Investisseur'"),
            ("created_date", "DATETIME")
        ]
        
        for col_name, col_type in new_columns:
            if col_name not in columns:
                print(f"Adding column {col_name} to user table...")
                try:
                    conn.execute(text(f"ALTER TABLE user ADD COLUMN {col_name} {col_type}"))
                    conn.commit()
                    print(f"Column {col_name} added successfully.")
                except Exception as e:
                    print(f"Error adding column {col_name}: {e}")
            else:
                print(f"Column {col_name} already exists.")
        
        conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate_db()
