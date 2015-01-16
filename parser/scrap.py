"""
Generalised Web Scraper
"""

from bs4 import BeautifulSoup
import parsecontrollers
import constants
import re

soup = BeautifulSoup(open("fruit.html"));

class pageParser(object):
  """New Page Parser """

  def __init__(self, html_doc):
    self.html_doc = html_doc

  def get_data(self):
    """Get Container Class Names.
    Get the relevant class names of the containers to be searched.
    """

    all_data = self.get_all_container_nodes()
    prices = []
    titles = []
    metrics = []

    # Extract titles from nodes.
    for node in all_data:
      titles.append(self.parse_from_containers(constants.COLES_PARAMS[0], node))
      titles.append(self.extract_data(titles.pop(),constants.COLES_PARAMS[0]))
    # Loop through nodes and extract price per kilo.
    for node in all_data:
      prices.append(self.parse_from_containers(constants.COLES_PARAMS[1], node))
      prices.append(self.extract_data(prices.pop(),constants.COLES_PARAMS[1]))
    for node in all_data:
      metrics.append(self.parse_from_containers(constants.COLES_PARAMS[2], node))
      metrics.append(self.extract_data(metrics.pop(),constants.COLES_PARAMS[2]))

    for title, price, metric in zip(titles,prices, metrics):
      print(("%s, %s, %s")% (title,price, metric))
    
  def get_all_container_nodes(self):
    return self.html_doc.find_all(constants.COLES_CONTAINER_DIV["tag"],constants.COLES_CONTAINER_DIV["class"])

  def parse_from_containers(self, params, node):
    for searchtag, searchclass in zip(params["elements_to_search"]["tag"],params["elements_to_search"]["class"]):
      result = node.find_all(searchtag, searchclass)
      if result:
        node = node.find_all(searchtag, searchclass)[0]
      else:
        node = ""#self.parse_edge_container(node, params)
    return node

  def parse_edge_container(self, node, params):
    result = node.find_all(params["backup_elements"]["tag"],params["backup_elements"]["class"])
    if result:
      return result[0]
    else:
      return "INVALID_ENTRY"

  def extract_data(self, node, params):
    for task in params["extract_data"]:
      if node:
        node  = task["func"](node, task["params"])
    if node:
      return node
    else:
      return "INVALID_ENTRY"


foo = pageParser(soup)
foo.get_data()





    