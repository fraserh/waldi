echo "CREATE DATABASE waldi" | sudo mysql
mysql waldi < sql_schema.sql
python sql_import_items.py
