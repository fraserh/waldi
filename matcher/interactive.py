#!/usr/bin/python

# Takes in a list of matches from a file, and allows the user 
# to rate each match from 1-5.

# usage: ./interactive.py input_file output_file

import sys

user_ratings = []

def main():
  with open(sys.argv[1]) as f:
    for line in f:
      print "Rate the following match rating from 1-5 (5 is higher)"
      print line
      rating = raw_input()
      rating_int = int(rating)
      if rating_int < 1 or rating_int > 5:
        print "Error: ratings from 1-5 only"
        sys.exit()
      line = line.rstrip() + ", " + rating
      print(line)
      user_ratings.append(line)
      print

  with open(sys.argv[2], "w") as g:
    for item in user_ratings:
      g.write("%s\n" % item)

if __name__ == '__main__':
  if len(sys.argv) != 3:
    print("usage: ./interactive.py input_file output_file")
    sys.exit()

  main()