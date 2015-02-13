#!/usr/bin/python

import sys
import re
# usage: match_output_to_cache_input output_file

# ('3 melon mix fruit salad tub 300g', 'fresh salad leaf lettuce oakleaf combo', 1)
# needs to change to
# 3 melon mix fruit salad tub 300g, fresh salad leaf lettuce oakleaf combo, 1
def match_to_cache(line):
  # matches = re.search(r'\(\'([^\,]+)[^\w]+([^\'\,]+)[^\w]+(\w+)\)', line)
  line = line.rstrip(')\n').lstrip('(')
  fields = line.split(',')
  
  if len(fields) != 3:
    print "Error extracting %s" % line
    sys.exit()

  a = fields[0].lstrip('\'').rstrip('\'')
  b = fields[1].lstrip(' \'').rstrip('\'')
  r = fields[2].lstrip().rstrip()

  return str(a) + ", " + str(b) + ", " + str(r)

def main():
  if len(sys.argv) != 2:
    print "usage: match_output_to_cache_input output_file"
    sys.exit()

  with open(sys.argv[1]) as f:
    for line in f:
      print match_to_cache(line)
  

if __name__ == '__main__':
  main()