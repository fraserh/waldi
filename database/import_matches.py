#!/usr/bin/python
import csv
import sys
sys.path.append("/usr/local/lib/python2.7/site-packages")
import redis

r = redis.StrictRedis(host='localhost', port=6379, db=0)

# Generate Redis import commands for a match csv

def validate_args(arguments):
  if len(arguments) != 2:
    print "Usage: ./import_matches.py <input_csv>"
    sys.exit()

def line_to_redis(line):
  # A line like '2 melon fruit salad tub 300g, fresh apple pink lady, 0.0'
  # should convert to the following Redis command
  # ZADD "match:2 melon fruit salad tub 300g" "0.0" "fresh apply pink lady"
  
  # fields = line.split(',')
  (anchor, tail, rating) = line

  anchor = anchor.replace(":", "")
  tail = tail.replace(":", "")

  redis_command = "ZADD"
  r.zadd("match:" + anchor, rating, tail)
  return (redis_command + " \"match:%s\" \"%s\" \"%s\"" % (anchor, rating, tail))


def main():
  filename = sys.argv[1]
  with open(filename, 'rb') as csvfile:
    for row in csv.reader(csvfile, skipinitialspace=True):
      print line_to_redis(row)

if __name__ == '__main__':
  validate_args(sys.argv)
  main()