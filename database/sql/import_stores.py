def insert_stores(cursor):
  sql = "INSERT INTO `store` (`name`) VALUES (%s)"
  cursor.execute(sql, ('coles'))
  cursor.execute(sql, ('woolworths'))
