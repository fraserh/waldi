import match
import csv
import sys
sys.path.append("/usr/local/lib/python2.7/site-packages")

def insert_match(cursor, match):
  # Find the IDs of the match anchor and tail
  sql = "SELECT `id` FROM `item` WHERE `title` = '%s'"
  cursor.execute(sql, (match.anchor))
  anchor_id = cursor.fetchone()
  cursor.execute(sql, (match.tail))
  tail_id = cursor.fetchone()

  insertion = "INSERT INTO `match` (`item_one`, `item_two`, `rating`)\
   VALUES (%s, %s, %s)"
  cursor.execute(insertion, (anchor_id, tail_id, match.rating))

def insert_matches_from_csv(cursor, filename):
  with open(filename, 'rb') as csvfile:
    for row in csv.reader(csvfile, skipinitialspace=True):
      (anchor, tail, rating) = row
      i = match.Match(anchor, tail, rating)
      insert_match(cursor, i)
