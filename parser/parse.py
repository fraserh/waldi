#!/usr/bin/env python

""" Parse HTML.

Controller for parsing all HTML files that have been scraped.
"""

import sys
from bs4 import BeautifulSoup
import os
import re
import shutil
import config

import woolies_scrape, coles_scrape
from parse_utils import timethis
from woolies_scrape import WooliesPageParser
from coles_scrape import ColesPageParser

class Parse_HTML():
  """ Parse HTML
  
  Handles the parsing of all store files.
  """

  def __init__(self):
    self.init_db()
    coles_files = ["pages/coles/" + name for name in os.listdir("pages/coles")]
    woolies_files = ["pages/woolworths/woolworths/" + name for name in os.listdir("pages/woolworths/woolworths")]

    hashInt = 0
    i = 0

    for page in coles_files:
      print("%s out of %s coles files parsed" % (i, len(coles_files)))
      self.coles_page_handler(page)
      i += 1

    i = 0
    for page in woolies_files:
      print("%s out of %s coles files parsed" % (i, len(woolies_files)))
      i += 1
      category = re.match(r"pages/woolworths/woolworths/(.*)-[0-9]{1,3}\.html", page)
      if category:
        flag = False
        category = category.group(1)
        for keyword_dict in config.CATEGORY_KEYWORDS:
          for keyword in keyword_dict["keywords"]:
            if keyword in category:
              category = keyword_dict["category"]
              flag = True
              break
        if flag:
          self.woolies_html_doc = BeautifulSoup(open(page))
          self.woolies_parser_handler(category)

  def coles_page_handler(self, page):
    self.coles_html_doc = BeautifulSoup(open(page))
    category = re.match(r"pages/coles/(.*)-[0-9]{1,2}\.html", page)
    if category:
      category = "coles-"+category.group(1)
      for keyword_dict in config.CATEGORY_KEYWORDS:
        for keyword in keyword_dict["keywords"]:
          if keyword in category:
            category = keyword_dict["category"]
            break
      
      self.coles_parser_handler(category)

  def init_db(self):
    """ Init Database.
    Temp func to create fresh csv file to be appended to (eventually we should MySQL or similar)
    """
    # Delete prev tmp directory.
    shutil.rmtree("data")

    # Recreate tmp directory.
    os.mkdir("data")

  def woolies_parser_handler(self, category):
    # Parse the woolies page(s)self.
    woolies_parser = WooliesPageParser(self.woolies_html_doc)
    woolies_items = woolies_parser.get_data()

    self.write_to_db(woolies_items, "data/" + category + "_woolies_db.csv", category)

  def coles_parser_handler(self, category):
    # Parse the coles page(s)
    coles_parser = ColesPageParser(self.coles_html_doc)
    coles_items = coles_parser.get_data()

    self.write_to_db(coles_items, "data/" + category + "_coles_db.csv", category)

  def write_to_db(self, items, file_name, category):
    """Write Items to DB.
    Takes a list of items to be written to the db.
    TODO: Rewrite this to write to check for duplicates, append to MySQL tables
    """

    with open(file_name, "at") as f:
      for item in items:
        f.write(item+'\n')


if __name__ == "__main__":
  Parse_HTML()