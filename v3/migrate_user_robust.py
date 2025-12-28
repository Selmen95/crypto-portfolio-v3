import os
import sqlite3
from sqlalchemy import text

def migrate_specific_db(db_path):
    print(f"Targeting database: {db_path}")
    if not os.path.exists(db_path):
        print(f"Database not found: {db_path}")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check existing columns
        cursor.execute("PRAGMA table_info(user)")
        columns = [row[1] for row in cursor.fetchall()]
        
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
                    cursor.execute(f"ALTER TABLE user ADD COLUMN {col_name} {col_type}")
                    conn.commit()
                    print(f"Column {col_name} added successfully.")
                except Exception as e:
                    print(f"Error adding column {col_name}: {e}")
            else:
                print(f"Column {col_name} already exists.")
        
        conn.close()
    except Exception as e:
        print(f"Error during migration of {db_path}: {e}")

if __name__ == "__main__":
    # Target common paths found
    dbs = [
        "instance/portfolio.db",
        "v3/instance/portfolio.db",
        "portfolio.db",
        "v3/portfolio.db"
    ]
    
    for db in dbs:
        migrate_specific_db(db)
    print("Migration sequence complete.")
