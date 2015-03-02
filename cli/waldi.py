#!/usr/bin/python

import sys
import csv

# CSV format
# coles_title, price_per_kle, kle, price_per_unit, unit_size, price_per_kle, kle, price_per_unit, unit_size, woolies_title, rating

# usage: ./waldi.py [csv_file] [input_file]

if len(sys.argv) != 3:
  print "usage: ./waldi.py [csv_file] [input_file]"
  sys.exit()

def load_csv_file(filename):
  items = {}
  with open(filename, 'rb') as csvfile:
    filereader = csv.reader(csvfile, delimiter = ',')
    for row in filereader:
      if items.get(row[0]):
        match = items[row[0]]
        # If the match is better
        if (row[9] > match[9]):
          items[row[0]] = row[1:]
      else:
        items[row[0]] = row[1:]

        
  return items

if __name__ == '__main__':
  items = load_csv_file(sys.argv[1])
  f = open(sys.argv[2])
  for line in f:
    item = items[line.rstrip()]
    difference = float(item[0]) - float(item[4])
    print("'%s' matches '%s' with rating %s" % (line.rstrip(), item[8], item[9]))
    print("Coles\t%s\t%s\t%s\t%s" % (item[0], item[1], item[2], item[3]))
    print("Woolw\t%s\t%s\t%s\t%s" % (item[4], item[5], item[6], item[7]))

    if (difference > 0):
      print("Coles by $%1.2f per kg" % (difference))
    else:
      print("Woolies by $%1.2f per kg" % (abs(difference)))

    print
