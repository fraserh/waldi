from product_match import *

CATEGORIES_TO_MATCH = [
  "bread",
  "fruit-veg",
  "meat"
]

def match_all():
  required_words = file_to_list("required-words")
  ignored_words = file_to_list("ignored-words.text")
  matches = []
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

  open('../matcher/results.txt', 'w').close()  
  with open("../matcher/results.txt", "at") as f:
    for match in matches:
      if (match[2]>0.5):
        f.write(match[0] + ", " + match[1] + ", " + str(match[2])+'\n')

if __name__ == '__main__':
  match_all()
