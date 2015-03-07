#!/usr/bin/python
import csv
import sys
sys.path.append("/usr/local/lib/python2.7/site-packages")
import redis

r = redis.StrictRedis(host='localhost', port=6379, db=0)

# Generate Redis import commands for an item csv

def validate_args(arguments):
  if len(arguments) != 2:
    print "Usage: ./import_items.py <input_csv>"
    sys.exit()

def line_to_redis(line):
  # A line like 'lychees loose  400g, 12.90 , kg, 5.16, 0.4kg, 1'
  # should convert to the following Redis command
  # HMSET "item:lychees loose  400g" price_per_kle "12.90" kle "kg" \
  # unit_price "5.16" unit_volume "0.4kg" amount 1
  
  # fields = line.split(',')
  (title, price_per_kle, kle, unit_price, unit_volume, amount) = line

  title = title.replace(":", "")

  redis_command = "HMSET"
  r.hmset("item:" + title, {
    "price_per_kle": price_per_kle,
    "kle": kle,
    "unit_price": unit_price,
    "unit_volume": unit_volume,
    "amount": amount
    })

  # We also need to add the title to our autocomplete sorted set
  add_to_autocomplete(title)

  return (redis_command + " \"item:%s\" price_per_kle \"%s\" kle \"%s\"" \
  " unit_price \"%s\" unit_volume \"%s\" amount \"%s\"" % (title, price_per_kle, kle, unit_price, unit_volume, amount))

def add_to_autocomplete(title):
  collectionName = "autocomplete"
  # All items in this set have the same score
  # http://oldblog.antirez.com/post/autocomplete-with-redis.html
  # r.zadd("autocomplete", 0, title)

  # We need to add all of the prefixes, and then the full word followed by a *
  word = ""
  for char in title:
    word = word + char
    r.zadd(collectionName, 0, word)
  r.zadd(collectionName, 0, title + "*")

def main():
  filename = sys.argv[1]
  with open(filename, 'rb') as csvfile:
    for row in csv.reader(csvfile, skipinitialspace=True):
      print line_to_redis(row)

if __name__ == '__main__':
  validate_args(sys.argv)
  main()