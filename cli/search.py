import sys

with open("data.csv","rt") as f:
  data = f.read()

data = data.split('\n')

if (len(sys.argv)<3):
  print "Usage: ./search.py search_term_1 search_term_2 "

search_term = [sys.argv[1],sys.argv[2]]
results = []

for item in data:
  if search_term[0] in item and search_term[1] in item:
    print item