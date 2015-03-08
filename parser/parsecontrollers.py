#!/usr/bin/env python

"""
Collection of helper functions to help parse data
All funcs should have params of:
1) node - This is the node with data to be processed.
2) params - This should be a list of optional parameters (regex strings etc).
"""
import re

COLES_IGNORE_LIST = ["rspca approved", "1 each", "1kg", "prepacked", "approx.", "2kg"]
WOOLIES_IGNORE_LIST = ["fresh", "organic", "imported", "select"]
WOOLIES_US_IGNORE_LIST = ["min. ", "large "," punnet"," cup", " bag", " bunch"]

def getInnerHTML(node, foo):
  """Get InnerHTML
  Return the inside of a node (i.e. remove tags)
  """
  if type(node) is str:
    return constants.INVALID_ENTRY
  return node.decode_contents(formatter="html")

def prettifyString(node, foo):
  """
  Removes all whitespace and html space chars
  """
  return re.sub('\s+',' ', node).lower().strip().replace("&nbsp;","").replace("&amp;","and")

def ignore_words(node, params):
  params = params[0]
  for statement in params:
    node = node.replace(statement, "").strip()
  return node.replace("per kg","1kg")

def get_unit_size_woolies(node, params):
  """
  Helper function to extract the size of the product (e.g. 500g of mince should return 0.5kg)
  """
  for statement in WOOLIES_US_IGNORE_LIST:
    node = node.replace(statement, "")
  return convert_to_SI(node, [])

def convert_to_SI(node, params):
  """
  Helper function to process any volume to SI (e.g. KG or L instead of mL and g).
  TODO: Rewrite this to be way more readable.
  """
  node = node.lower()
  if re.search(r"[0-9][0-9 ]{0,3}ml", node):
    return str(float(re.search(r"[0-9][0-9 ]{0,3}ml",node).group(0).split("ml")[0])/1000) + "L"
  elif re.search(r"[0-9][0-9 ]{0,3}g", node):
    return str(float(re.search(r"[0-9][0-9 ]{0,3}g",node).group(0).split("g")[0])/1000) + "KG"
  else:
    return node
  
def get_unit_woolies(node, params):
  """
  Woolworths specific - given the surrounding chars, this will parse the unit per item (i.e. each or kg)
  """
  if "1EA" in node or "1ea" in node:
    return "1ea"
  elif "1KG" in node or "1kg" in node:
    return "1kg"
  return convert_to_SI(node, [])

def get_unit_coles(node, params):
  if "1Ea" in node or "1ea" in node:
    return "1ea"
  elif "1KG" in node or "1kg" in node:
    return "1kg"
  return convert_to_SI(node, [])

def splitSplice(node, params):
  """
  Splits a string at point splitString, and returns 'section' item of the resulting list
  """
  split_string = params[0]
  section = params[1]
  result = node.split(split_string)
  if (len(result)>1):
    return result[section]
  else:
    return ""

def coles_special_prices(node, params):
  """
  Splits a string at point splitString, and returns 'section' item of the resulting list
  """
  results = []
  return []
  results.append(re.search(r"for \$(.*)", str(node)).group(1))
  results.append(re.search(r"(.*) for", str(node)).group(1))
  return results

def regexBetweenTwoStrings(node, params):
  s1 = params[0]
  s2 = params[1]
  regex_string = r""+re.escape(s1)+r"(.*)"+re.escape(s2)
  matchObj = re.search(regex_string, node)
  if not matchObj or not matchObj.group(1):
    return constants.INVALID_ENTRY
  if "100g" in node:
    return float(matchObj.group(1).replace(',',''))*10 
  return matchObj.group(1)

def each_or_kilo(node, params):
  each = ("per 1Ea" in node)
  if (each):
    return "ea"
  else:
    return "kg"
