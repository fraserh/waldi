def insert_dummy_categories(cursor):
  # Work out the store IDs for coles and woolies
  store_id = "SELECT id FROM store WHERE name = %s"
  cursor.execute(store_id, "coles")
  coles_id = cursor.fetchone()["id"]

  cursor.execute(store_id, "woolworths")
  woolworths_id = cursor.fetchone()["id"]

  sql = "INSERT INTO `category` (`store`, `title`) VALUES (%s,%s)"
  cursor.execute(sql, (coles_id, "meat"))
  cursor.execute(sql, (woolworths_id, "meat"))
