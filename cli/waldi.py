#!/usr/bin/python

import sys
import csv

# usage: ./waldi.py match_file coles_data woolies_data input_file

# Returns a dict indexed by the first column
def load_data(filename):
  d = {}
  with open(filename, 'rb') as csvfile:
    for row in csv.reader(csvfile, skipinitialspace=True):
      d[row[0]] = row[1:]
  return d

# Returns a dict of matches indexed by coles title, i.e.
# {
#   coles_title: [(woolies_title, match_rating), ...],
#   ...
# }
def load_matches(filename):
  matches = {}
  with open(filename, 'rb') as csvfile:    
    for row in csv.reader(csvfile, skipinitialspace=True):
      value = (row[1], row[2])

      if matches.get(row[0]):
        matches[row[0]].append(value)
      else:
        matches[row[0]] = [value]

  return matches

def validate_arguments():
  if len(sys.argv) != 5:
    print "usage: ./waldi.py match_file coles_data woolies_data input_file"
    sys.exit()

def match_second(item):
  return item[1]

def output_string(coles_item, woolies_item, match_rating):
  return str(coles_item) + str(woolies_item) + str(match_rating)

# Note that input_file only works with coles items
def main(match_file, coles_data, woolies_data, input_file):
  matches = load_matches(match_file)
  coles_data = load_data(coles_data)
  woolies_data = load_data(woolies_data)

  with open(input_file, 'r') as items:
    for item in items:
      item = item.rstrip()
      item_matches = sorted(matches[item], key=match_second, reverse=True)

      print item
      item_coles = coles_data[item]
      print item_coles
      print "Top 5 matches"

      for i in range(0, 5):
        best_match = item_matches[i]
        print("\t%s\t%s" % (best_match[0], best_match[1]))
        item_woolies = woolies_data[best_match[0]]
        print item_woolies

      print
      print

if __name__ == '__main__':
  validate_arguments()
  main(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
