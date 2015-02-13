#!/usr/bin/python

import sys
from match import *

# usage: product_match list_one list_two ignore_list required_list

def file_to_list(filename):
  with open(filename) as f:
    lines = f.read().splitlines()
    return lines

# Remove any word that's in the first list from the second list
# (This function tends to produce weird whitespace.)
def remove_words(ignored_words, input_list):
  # We only want to remove stand-alone words, not strings.
  # (e.g. don't remove "per" if it's in "perch")
  ignored_words = [" " + elem + " " for elem in ignored_words]
  
  # However, we also need to make sure that string has leading and 
  # trailing spaces, so that we don't miss anything.
  input_list = [" " + elem + " " for elem in input_list]

  # Returns a tuple of the original word and the word 
  # with the filter applied
  output_list = []
  for item in input_list:
    original = item
    for word in ignored_words:    
      item = item.replace(word, "")

    output_list.append((original, item))
  
  return output_list

def tuple_to_dict(tuples):
  d = {}
  for pair in tuples:
    d[pair[0]] = pair[1]
  return d

def tuple_to_list(tuples, i):
  return [e[i] for e in tuples]

def swap_keys_and_values(my_dict):
  return dict (zip(my_dict.values(),my_dict.keys()))

# Filter out any matches that do not satisfy the criteria of the 
# 'required' list
def filter_required(matches, required_list):
  result = []
  for match in matches:
    title_one = match[0]
    title_two = match[1]
    if satisfies_required(title_one, title_two, required_list):
      result.append(match)
  return result

# If a required word occurs in the first title, then it must also
# occur in the second title and vice versa.
# Note that it's okay for both titles to not contain the word
def satisfies_required(a, b, required_list):
  satisfies = False
  for word in required_list:
    if (word in a) and (word in b):
      satisfies = True
    elif (word not in a) and(word not in b):
      satisfies = True
  return satisfies

def key_value_from_line(line):
  line = line.split(",")
  return (line[0], line[1:])

def match_products(list_one, list_two, ignore_list, required_list):
  # We convert the original lists into lists stripped of anyting on the 
  # ignored list (however we must maintain memory of their original form).
  # Then we compute the match rating for those cleaned up versions.
  # Finally we convert the cleaned up versions back to their original form.
  
  # Split the csv lines into key-value tuples based on the title.
  kv_one = map(key_value_from_line, list_one)
  kv_two = map(key_value_from_line, list_two)
  titles_one = [x[0] for x in kv_one]
  titles_two = [x[0] for x in kv_two]

  clean_titles_one = remove_words(ignore_list, titles_one)
  clean_titles_two = remove_words(ignore_list, titles_two)

  # Get the cleaned strings from each pair
  # (remove_words returns the dirty/cleaned strings as tuples)
  clean_1d_one = tuple_to_list(clean_titles_one, 1)
  clean_1d_two = tuple_to_list(clean_titles_two, 1)

  # We need to form dicts from the pairs for O(1) lookup.
  # The tuples are like (original, cleaned), but we want the dictionary
  # to be indexed by the cleaned version, hence we swap them.
  lookup_one = swap_keys_and_values(tuple_to_dict(clean_titles_one))
  lookup_two = swap_keys_and_values(tuple_to_dict(clean_titles_two))

  # Now get matches for the cleaned versions
  matches = match_ratings(clean_1d_one, clean_1d_two)

  # And convert the cleaned strings back to their original forms
  originalised_matches = []

  for match in matches:
    original_phrase_one = lookup_one[match[0]]
    original_phrase_two = lookup_two[match[1]]
    originalised_matches.append((original_phrase_one.lstrip().rstrip(),
                                 original_phrase_two.lstrip().rstrip(), 
                                 match[2]))

  # If one title has a required word, then the other must contain that word
  originalised_matches = filter_required(originalised_matches, required_list)

  return originalised_matches

def nth_entries(n, list):
  result = []
  for x in list:
    result.append(x[n])
  return result

if __name__ == '__main__':
  if (len(sys.argv) != 5):
    print "usage: product_match list_one list_two ignore_list required_list"
    sys.exit()

  # Input phrases
  # first_list = map(title_from_line, file_to_list(sys.argv[1]))
  # second_list = map(title_from_line, file_to_list(sys.argv[2]))
  first_list = file_to_list(sys.argv[1])
  second_list = file_to_list(sys.argv[2])

  # Ignored/Required
  ignored_words = file_to_list(sys.argv[3])
  required_words = file_to_list(sys.argv[4])

  matches = match_products(first_list, second_list, ignored_words, required_words)

  for match in matches:
    if match[2] > 0:
      print match