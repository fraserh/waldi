"""
Generalised Web Parser
"""

from bs4 import BeautifulSoup
import parsecontrollers
import constants
import re
import sys

from parse_utils import timethis

class ColesPageParser(object):
  """New Page Parser """

  def __init__(self, html_doc):
    if len(sys.argv) > 1:
      self.html_doc = BeautifulSoup(open(sys.argv[1]))
      self.get_data()
    else:
      self.html_doc = html_doc

  def get_data(self):
    """Get Container Class Names.
    Get the relevant class names of the containers to be searched.
    """

    all_data = self.get_all_container_nodes()

    prices = []
    titles = []
    metrics = []
    unit_sizes = []
    single_prices = []
    prices_per_kilo = []
    prices_per_unit = []
    unit_sizes = []
    titles = []
    metrics = []
    kilo_litre_each = []
    item_list = []

    # Extract titles from nodes.
    for node in all_data:
      titles.append(self.parse_from_containers(constants.COLES_PARAMS[0], node))
      titles.append(self.extract_data(titles.pop(),constants.COLES_PARAMS[0]))

      prices_per_kilo.append(self.parse_from_containers(constants.COLES_PARAMS[1], node))
      prices_per_kilo.append(self.extract_data(prices_per_kilo.pop(),constants.COLES_PARAMS[1]))

      metrics.append(self.parse_from_containers(constants.COLES_PARAMS[2], node))
      metrics.append(self.extract_data(metrics.pop(),constants.COLES_PARAMS[2]))

      unit_sizes.append(self.parse_from_containers(constants.COLES_PARAMS[3], node))
      unit_sizes.append(self.extract_data(unit_sizes.pop(),constants.COLES_PARAMS[3]))

      prices_per_unit.append(self.parse_from_containers(constants.COLES_PARAMS[4], node))
      if len(prices_per_unit[len(prices_per_unit)-1]) != 2:
        prices_per_unit.append([self.extract_data(prices_per_unit.pop(),constants.COLES_PARAMS[4]),1])

    for title,prices_per_kilo, prices_per_unit, unit_size in zip(titles,prices_per_kilo, prices_per_unit, unit_sizes):
      item_list.append(("%s, %s, kg, %s, %s, %s") % (title,prices_per_kilo, prices_per_unit[0], unit_size, prices_per_unit[1]))

    return item_list

  def get_all_container_nodes(self):
    return self.html_doc.find_all(constants.COLES_CONTAINER_DIV["tag"],constants.COLES_CONTAINER_DIV["class"])

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
      if (params.get("backup_processing")):
        result = self.extract_data(result[0], params["backup_processing"])
        return result
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

foo = ColesPageParser(None)





    