import pymysql.cursors
import import_stores
import import_items
import import_matches
import import_categories

# Connect to the database
connection = pymysql.connect(host='localhost',
                             user='waldi',
                             passwd='password',
                             db='waldi',
                             cursorclass=pymysql.cursors.DictCursor)

def main():
  try:
    with connection.cursor() as cursor:
      import_stores.insert_stores(cursor)
      import_categories.insert_dummy_categories(cursor)
      import_items.insert_items_from_csv(cursor, "sql_test/meat_coles_db.csv", "coles", "meat")
      import_items.insert_items_from_csv(cursor, "sql_test/meat_woolies_db.csv", "woolworths", "meat")
      import_matches.insert_matches_from_csv(cursor, "sql_test/meat_matches")
    connection.commit()
  finally:
    connection.close()

if __name__ == '__main__':
  main()
