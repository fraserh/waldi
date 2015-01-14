"""
Generalised Web Scraper
"""

from bs4 import BeautifulSoup
import parsecontrollers
import constants

soup = BeautifulSoup(open("pantry.html"));

class pageParser(object):
  """New Page Parser """

  def __init__(self, html_doc):
    self.html_doc = html_doc

  def get_data(self):
    """Get Container Class Names.
    Get the relevant class names of the containers to be searched.
    """

    all_data = self.get_all_container_nodes()
    # TODO: Use get requests on ALL dictionary calls (fail safe) 

    # Hacky attempt to fix the edge case by using if statements.
    # This loops through the nested classes that we must search to find the actual data
    prices = []
    titles = []
    # Parse title nodes
    for node in all_data:
      titles.append(self.parse_from_containers(constants.COLES_PARAMS[0], node))
      titles.append(self.extract_data(constants.COLES_PARAMS[0],titles.pop()))
    # for data_set in self.COLES_PARAMS:
    #   results = None
    #   for searchtag,searchclass in zip(data_set["elements_to_search"]["tag"],data_set["elements_to_search"]["class"]):
    #     if results is None:
    #       results = self.html_doc.find_all(searchtag, searchclass)
    #     else:
    #       results[:] = [entry.find_all(searchtag, searchclass)[0] for entry in results]
      
    #   # Loops through the functions to process the data once it has been found.
    #   for extracter in data_set["extract_data"]:
    #     if (extracter==parsecontrollers.regexBetweenTwoStrings):
    #       results[:] = [extracter(entry, data_set["regex_strings"][0], data_set["regex_strings"][1]) for entry in results]
    #     else:
    #       results[:] = [extracter(entry, data_set["split_params"][0], data_set["split_params"][1]) for entry in results]
    #   all_data.append(results)
    
    
    
  def get_all_container_nodes(self):
    return self.html_doc.find_all(constants.COLES_CONTAINER_DIV["tag"],constants.COLES_CONTAINER_DIV["class"])

  def parse_from_containers(self, params, node):
    for searchtag, searchclass in zip(params["elements_to_search"]["tag"],params["elements_to_search"]["class"]):
      node = node.find_all(searchtag, searchclass)[0]
    return node

  def extract_data(self, params, node):
    for task in params:
      task["func"](task["params"])

# Testing purposes.
foo = pageParser(soup)
foo.get_data()





    