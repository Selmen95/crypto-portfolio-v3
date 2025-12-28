import os
import sqlite3

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
            ("bio", "TEXT"),
            ("profile_picture_url", "VARCHAR(255)")
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
    dbs = [
        "instance/portfolio.db",
        "v3/instance/portfolio.db"
    ]
    
    for db in dbs:
        migrate_specific_db(db)
    print("Migration sequence complete.")
