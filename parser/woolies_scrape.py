"""
Generalised Web Scraper - Woolworths
TODO: Make it more elegant/readable!
"""

from bs4 import BeautifulSoup
import parsecontrollers
import constants
import re

soup = BeautifulSoup(open("bread-woolies.html"));

class WooliesPageParser(object):
  """New Page Parser """

  def __init__(self, html_doc):
    self.html_doc = html_doc

  def get_data(self):
    """Get Container Class Names.
    Get the relevant class names of the containers to be searched.
    Woolies price extraction is different from coles - the edge case where
    there is no PER KG price means cup-price tags will be empty - therefore
    we must collect 2 span tags, and if one is empty, use the other (hence the
    "single_prices" variable
    """

    all_data = self.get_all_container_nodes()
    prices = []
    single_prices = []
    item_sizes = []
    titles = []
    metrics = []
    metric_units = []

    # Extract titles from nodes.
    for node in all_data:
      titles.append(self.parse_from_containers(constants.WOOLIES_PARAMS[0], node))
      titles.append(self.extract_data(titles.pop(),constants.WOOLIES_PARAMS[0]))
    # Loop through nodes and extract price per kilo.
    for node in all_data:
      prices.append(self.parse_from_containers(constants.WOOLIES_PARAMS[1], node))
      single_prices.append(self.parse_from_containers(constants.WOOLIES_PARAMS[2], node))
      single_prices.append(self.extract_data(single_prices.pop(),constants.WOOLIES_PARAMS[2]))
      prices.append(self.extract_data(prices.pop(),constants.WOOLIES_PARAMS[1]))
      item_sizes.append(self.parse_from_containers(constants.WOOLIES_PARAMS[3], node))
      item_sizes.append(self.extract_data(item_sizes.pop(),constants.WOOLIES_PARAMS[3]))
      metric_units.append(self.parse_from_containers(constants.WOOLIES_PARAMS[4], node))
      metric_units.append(self.extract_data(metric_units.pop(),constants.WOOLIES_PARAMS[4]))

    # Fix edge cases where parser cannot find any unit (assume product is sold as each)
    metric_units = ["1ea" if unit=="INVALID_ENTRY" else unit for unit in metric_units]
    item_sizes = ["each" if unit=="INVALID_ENTRY" else unit for unit in item_sizes]

    for title, price, metric_unit, metric_price, item_size in zip(titles,prices, metric_units, single_prices, item_sizes):
      print(("%s, %s, %s, %s, %s")% (title, metric_price, metric_unit, price, item_size))
    
  def get_all_container_nodes(self):
    return self.html_doc.find_all(constants.WOOLIES_CONTAINER_DIV["tag"],constants.WOOLIES_CONTAINER_DIV["class"])

  def parse_from_containers(self, params, node):
    for searchtag, searchclass in zip(params["elements_to_search"]["tag"],params["elements_to_search"]["class"]):
      result = node.find_all(searchtag, searchclass)
      if result:
        node = node.find_all(searchtag, searchclass)[0]
      else:
        node = self.parse_edge_container(node, params)
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

foo = WooliesPageParser(soup)
foo.get_data()





    