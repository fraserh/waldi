from product_match import *
from multiprocessing import Process, Queue
import config

CATEGORIES_TO_MATCH = [
  "meat",
  "fruit-veg",
  "bread"
]

def match_all():
  required_words = file_to_list("required-words")
  ignored_words = config.CATEGORY_IGNORE_WORDS["all"]#file_to_list("ignored-words.text")
  matches = []
  q1 = Queue()
  q2 = Queue()
  for cat in CATEGORIES_TO_MATCH:
    print "Matching " + cat
    first_list = file_to_list("../parsed_categories/" + cat + "_coles_db.csv")
    second_list = file_to_list("../parsed_categories/" + cat + "_woolies_db.csv")
    matches.append(match_products(
      first_list, 
      second_list, 
      ignored_words, 
      required_words
    ))
  print len(matches)
  open('../matcher/results.txt', 'w').close()  
  with open("../matcher/results.txt", "at") as f:
    for match in matches:
      for item in match:
        if (item[2]>0.5):
          f.write("%s, %s, %s\n" % (item[0],item[1],str(item[2])))


if __name__ == '__main__':
  match_all()
