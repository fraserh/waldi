""" Generalised Web Parser - Woolworths

Parses a given html doc for container nodes, and the data within them.
"""

from bs4 import BeautifulSoup
import parse_utils
import constants
import re
import sys
import time

from parse_utils import timethis

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

    # Get a list of all container nodes.
    all_data = self.get_all_container_nodes()

    prices_per_kilo = []
    prices_per_unit = []
    unit_sizes = []
    titles = []
    metrics = []
    kilo_litre_each = []
    item_list = []

    # Extract data from nodes.
    print "Parsing woolies data from nodes..."
    for node in all_data:
      titles.append(self.parse_from_containers(constants.WOOLIES_PARAMS[0], node))
      titles.append(self.extract_data(titles.pop(),constants.WOOLIES_PARAMS[0]))
      prices_per_kilo.append(self.parse_from_containers(constants.WOOLIES_PARAMS[1], node))
      prices_per_kilo.append(self.extract_data(prices_per_kilo.pop(),constants.WOOLIES_PARAMS[1]))
      prices_per_unit.append(self.parse_from_containers(constants.WOOLIES_PARAMS[2], node))
      prices_per_unit.append(self.extract_data(prices_per_unit.pop(),constants.WOOLIES_PARAMS[2]))
      unit_sizes.append(self.parse_from_containers(constants.WOOLIES_PARAMS[3], node))
      unit_sizes.append(self.extract_data(unit_sizes.pop(),constants.WOOLIES_PARAMS[3]))
      kilo_litre_each.append(self.parse_from_containers(constants.WOOLIES_PARAMS[4], node))
      kilo_litre_each.append(self.extract_data(kilo_litre_each.pop(),constants.WOOLIES_PARAMS[4]))

    print "Creating list of items..."
    for title,price_per_kle, kle, unit_size,price_per_unit in \
        zip(titles,prices_per_kilo,kilo_litre_each, unit_sizes, prices_per_unit):
      item_list.append(("%s, %s, %s, %s, %s, 1") % (
        title,
        price_per_kle,
        kle,
        price_per_unit,
        unit_size
      ))

    return item_list
    
  def get_all_container_nodes(self):
    """Get Container Nodes.
    Helper function which grabs all nodes which contain data we want to extract (title, price, size etc) 
    """
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
      return constants.INVALID_ENTRY

  def extract_data(self, node, params):
    for task in params["extract_data"]:
      if node:
        node  = task["func"](node, task["params"])
    if node:
      return node
    else:
      return constants.INVALID_ENTRY





    