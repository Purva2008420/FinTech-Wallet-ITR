import psycopg

try:
    conn = psycopg.connect(
        dbname="postgres",
        user="postgres",
        password="2634",  # <-- Put your actual PostgreSQL password here!
        host="127.0.0.1",
        port="5432",
        autocommit=True
    )
    cursor = conn.cursor()

    # Forcefully terminate any hidden active connections to the database
    cursor.execute("""
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = 'fintech_wallet'
          AND pid <> pg_backend_pid();
    """)

    # Drop and recreate cleanly
    cursor.execute("DROP DATABASE IF EXISTS fintech_wallet_v2;")
    cursor.execute("CREATE DATABASE fintech_wallet_v2;")

    print("🎉 Database successfully forced clean and recreated!")
    cursor.close()
    conn.close()
except Exception as e:
    print("❌ Error:", e)