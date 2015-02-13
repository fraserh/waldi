#!/usr/bin/python
# Blatantly stolen from http://stackoverflow.com/a/6859596/1695900
import sys
import os
sys.path.append(os.getcwd() + "/src/inflect")
import inflect
# from difflib import SequenceMatcher

p = inflect.engine()


def get_bigrams(string):
  '''
  Takes a string and returns a list of bigrams
  '''
  s = string.lower()
  return [s[i:i+2] for i in xrange(len(s) - 1)]

# def string_similarity(str1, str2):
#   '''
#   Perform bigram comparison between two strings
#   and return a percentage match in decimal form
#   '''
#   pairs1 = get_bigrams(str1)
#   pairs2 = get_bigrams(str2)
#   union  = len(pairs1) + len(pairs2)
#   hit_count = 0
#   for x in pairs1:
#       for y in pairs2:
#           if x == y:
#               hit_count += 1
#               break
#   return (2.0 * hit_count) / union

def intersect(a, b):
  return list(set(a) & set(b))

def union(a, b):
  return list(set(a) | set(b))

def compare_words_pluralise(a, a_plural, b, b_plural):
  if a == b:
    return True

  if a_plural == b:
    return True

  if a == b_plural:
    return True

  if a_plural == b_plural:
    return True

  return False

def string_similarity(str1, str2):
  hit_count = 0
  words1 = str1.split()
  words2 = str2.split()

  # print "string_start"

  # Clearly N*M where N, M, are the number of words
  # in each string.
  # Investigate if this becomes the bottleneck.
  for a in words1:
    a_plural = p.plural_noun(a)

    for b in words2:
      b_plural = p.plural_noun(b)
      # if p.compare_nouns(a, b):
      if compare_words_pluralise(a, a_plural, b, b_plural):
        hit_count += 1

  # print "string_end"

  return hit_count
  # common = intersect(words1, words2)

  # The rating R is given by the size of the 
  # intersection of the two sets I, multiplied
  # by two, and divided by the number of words in both sets.
  # r = (len(common) * 2) / (len(union(words1, words2)))
  # return len(common)
  # return len(common)

# def string_similarity(str1, str2):
#   return SequenceMatcher(None, str1, str2).ratio()


def load_file(filename):
  with open(filename) as f:
    lines = [line.strip() for line in f]

  return lines

def match_ratings(first_list, second_list):
  ratings = []

  i = 0
  length = len(first_list)

  sys.stderr.write("%d" % length)

  for anchor in first_list:
    sys.stderr.write("%d of %d\n" % (i, length))
    i += 1
    for tail in second_list:
      similarity = string_similarity(anchor, tail)
      ratings.append((anchor, tail, similarity))

  return ratings

# Usage: ./match.py file_one file_two

def rating_key(item):
  return item[2]

# if __name__ == "__main__":

#   coles_items = []
#   woolies_items = []



  # for f in open("coles_db.csv", "rt"):
  #   items = f.split('\n')
  #   for item in items:
  #     coles_items.append(item.split(','))
  # for f in open("woolies_db.csv", "rt"):
  #   items = f.split('\n')
  #   for item in items:
  #     woolies_items.append(item.split(','))
  #     # Weird split bug - gross band-aid fix.
  #     # TODO (Fraser): Fix the source of the bug.
  #     if woolies_items[len(woolies_items)-1]==[""]:
  #       woolies_items.pop()

  # ratings = match_ratings(coles_items, woolies_items)
  # ratings = sorted(ratings, key = rating_key)
  # i = 0
  # for rating in ratings:
  #   if rating[2]>0.6:
  #     i += 1
  #     print i
  #     print("%s vs %s\n\t\tcoles: $%s per %s\n\t\tWoolies: $%s per %s" % (rating[0][0],rating[1][0],rating[0][1],rating[0][2],rating[1][1], rating[1][2]))

  # print len(ratings)

















