import item
import csv
import sys
sys.path.append("/usr/local/lib/python2.7/site-packages")

categories = {}

def insert_item(cursor, item):
  get_store_id = "SELECT id FROM store WHERE name = %s"
  cursor.execute(get_store_id, (item.store))
  store_id = cursor.fetchone()["id"]

  sql = "INSERT INTO `item` (`store`, `title`, `price_per_kle`,\
         `kle`, `unit_price`, `unit_volume`, `amount`, `category`)\
         VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"

  # Eventually we'll check the categories dict for 
  # if item.category in categories:
    # category_id = categories[item.category]
  # else:
     # "SELECT `id` FROM `item` WHERE `title` = '%s'"
  getId = "SELECT category.id FROM category, store  WHERE category.title = %s\
           AND store.id = %s"
  cursor.execute(getId, (item.category, store_id))
  category_id = cursor.fetchone()["id"]

  cursor.execute(sql, (store_id, item.title, item.price_per_kle,
                       item.kle, item.unit_price, item.unit_volume,
                       item.amount, category_id))

def insert_items_from_csv(cursor, filename, store, category):
  # Reset the categories dict
  categories = {}
  with open(filename, 'rb') as csvfile:
    for row in csv.reader(csvfile, skipinitialspace=True):
      (title, price_per_kle, kle, unit_price, unit_volume, amount) = row
      try:
        i = item.Item(store, title, float(price_per_kle), kle,
               float(unit_price), unit_volume, float(amount), category)
        if len(unit_volume) > 10:
          raise ValueError('unit_volume too long to be valid')
        if len(kle) > 10:
          raise ValueError('kle too long to be valid')
      except Exception, e:
        sys.stderr.write("Invalid row: %s\n%s\n" % (row, e))
        continue
        # raise e

      insert_item(cursor, i)

