import import_matches
from import_items import main

import os

def import_all():
  files = os.listdir("../parsed_categories")
  for csv_file in files:
    main("../parsed_categories/" + csv_file)

if __name__ == "__main__":
  import_all()