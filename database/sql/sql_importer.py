import pymysql.cursors
import import_stores
import import_items
import import_matches

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
    connection.commit()
  finally:
    connection.close()

if __name__ == '__main__':
  main()
