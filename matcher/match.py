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
      similarity = string_similarity(anchor[0], tail[0])
      ratings.append((anchor, tail, similarity))

  return ratings

def rating_key(item):
  return item[2]

def ppk_key(item):
  return item[1][1]

if __name__ == "__main__":

  coles_items = []
  woolies_items = []

  for f in open("data/fruit-veg_coles_db.csv", "rt"):
    items = f.split('\n')
    for item in items:
      coles_items.append(item.split(','))
  for f in open("data/fruit-veg_woolies_db.csv", "rt"):
    items = f.split('\n')
    for item in items:
      woolies_items.append(item.split(','))
      # Weird split bug - gross band-aid fix.
      # TODO (Fraser): Fix the source of the bug.
      if woolies_items[len(woolies_items)-1]==[""]:
        woolies_items.pop()

  ratings = match_ratings(coles_items, woolies_items)
  ratings = sorted(ratings, key = rating_key)



  i = 0
  match_list = []
  for rating in ratings:
    if rating[2]>0.65:
      i += 1
      match_list.append(("%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s" % (rating[0][0],rating[0][1],rating[0][2],rating[0][3],rating[0][4],rating[1][1],rating[1][2],rating[1][3],rating[1][4], rating[1][0],rating[2])))
      print("%s vs %s (%s)\n\t\tcoles: $%s per %s at $%s/%s\n\t\tWoolies: $%s per %s at $%s/%s" % 
        (rating[0][0].strip(),rating[1][0].strip(),rating[2],rating[0][1].strip(),rating[0][2].strip(),
         rating[0][3].strip(),rating[0][4],rating[1][1].strip(), rating[1][2].strip(), rating[1][3].strip(), rating[1][4]))
  
  # Remove duplicates.
  match_list = set(match_list)
  with open("match_db.csv", "at") as f:
    for item in match_list:
      f.write(item+'\n')


  print len(ratings)

















