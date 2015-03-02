#!/usr/bin/python

# usage: parse_to_match.py coles woolworths

# Parser's output CSV is like
# title, price per kle, kle, price per unit, unit size, num of units

import sys
import csv

if len(sys.argv) != 3:
  print """usage: parse_to_match.py coles_file woolworths_file
        ignored_list required_list"""
  sys.exit()

def file_to_list(filename):
  with open(filename) as f:
    lines = f.read().splitlines()
    return lines

def getKey(tuple):
  return tuple[2]

def nth_column(csv_reader, n):
  result = []
  for row in csv_reader:
    result.append(row[n])
  return result

def csv_reader(filename):
  with open(filename, 'rb') as f:
    return csv.reader(f)

def dict_from_csv(csv_reader, key_col, value_range):
  result = {}
  for row in csv_reader:
    result[row[key_col]] = row[value_range[0], value_range[1]]
  return result

# Writes to stdout in the format
# coles_title, price per kle, kle, price per unit, unit size, num of units, \
# woolworths_title, price per kle, kle, price per unit, unit size, \
# num of units, match_rating
def main():
  # Load the data
  coles = csv_reader(sys.argv[1])
  woolworths = csv_reader(sys.argv[2])
  ignored = file_to_list(sys.argv[3])
  required = file_to_list(sys.argv[4])

  no_coles_columns = len(next(coles))
  no_woolworths_columns = len(next(woolworths))

  coles_store = dict_from_csv(coles, 0, (1, no_coles_columns))
  woolworths_store = dict_from_csv(woolworths, 0, (1, no_woolworths_columns))

  # Get the titles
  coles_titles = nth_column(coles, 0)
  woolworths_titles = nth_column(woolworths, 0)

  # Compute the matches
  matches = match_products(coles_titles, woolworths_titles, ignored, required)

  final_data = []

  # Matches will be like
  # [("coles_title", "woolies_title", 0.765), ...]
  # We need to join the first entry with the coles lookup dict,
  # and the second entry with the woolworths one, and display all related
  # data in the required output format
  for match in matches:
    coles_title = match[0]
    woolworths_title = match[1]
    rating = match[2]

    coles_data = coles_store[coles_title]
    woolworths_data = woolworths_store[woolworths_title]

    coles_data = coles_data.insert(0, coles_title)
    woolworths_data = woolworths_data.insert(0, woolworths_title)

    final_data.append(coles_data.extend(woolworths_data).append(rating))
    
  print final_data.join(",")

if __name__ == '__main__':
  main()