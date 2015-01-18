#!/usr/bin/python
# Blatantly stolen from http://stackoverflow.com/a/6859596/1695900

import sys

def get_bigrams(string):
  '''
  Takes a string and returns a list of bigrams
  '''
  s = string.lower()
  return [s[i:i+2] for i in xrange(len(s) - 1)]

def string_similarity(str1, str2):
  '''
  Perform bigram comparison between two strings
  and return a percentage match in decimal form
  '''
  pairs1 = get_bigrams(str1)
  pairs2 = get_bigrams(str2)
  union  = len(pairs1) + len(pairs2)
  hit_count = 0
  for x in pairs1:
      for y in pairs2:
          if x == y:
              hit_count += 1
              break
  return (2.0 * hit_count) / union

def load_file(filename):
  with open(filename) as f:
    lines = [line.strip() for line in f]

  return lines

def match_ratings(first_list, second_list):
  ratings = []

  for anchor in first_list:
    for tail in second_list:
      similarity = string_similarity(anchor, tail)
      ratings.append((anchor, tail, similarity))

  return ratings

# Usage: ./match.py file_one file_two

def rating_key(item):
  return item[2]

if __name__ == "__main__":
  if len(sys.argv) < 3:
    sys.exit("Usage: ./match.py file_one file_two")

  titles_one = load_file(sys.argv[1])
  titles_two = load_file(sys.argv[2])

  ratings = match_ratings(titles_one, titles_two)
  ratings = sorted(ratings, key = rating_key)

  print ratings