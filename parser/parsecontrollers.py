#!/usr/bin/env python

"""
Collection of helper functions to help parse data
"""
import re

COLES_IGNORE_LIST = ["rspca approved"]

def getInnerHTML(node, foo):
  """Get InnerHTML
  Return the inside of a node (i.e. remove tags)
  """
  if type(node) is str:
    return "INVALID_ENTRY"
  return node.decode_contents(formatter="html")

def prettifyString(node, foo):
  """
  Removes all whitespace ascii and html
  """
  # Uses regex to remove all whitespace, then converts to lowercase, trailing whitespace(including spaces)
  # And finally html space
  return re.sub('\s+',' ', node).lower().strip().replace("&nbsp;","").replace("&amp;","and")

def ignore_words(node, params):
  for statement in params:
    node = node.replace(statement, "").strip()
  return node
  
def get_unit(node, params):
  s1 = params[0]
  s2 = params[1]
  regex_string = r""+re.escape(s1)+r"(.*)"+re.escape(s2)
  matchObj = re.search(regex_string, node)
  if not matchObj or not matchObj.group(1):
    return "ea"
  if "100g" in node:
    return "0.1kg"
  return matchObj.group(1)

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

def regexBetweenTwoStrings(node, params):
  s1 = params[0]
  s2 = params[1]
  regex_string = r""+re.escape(s1)+r"(.*)"+re.escape(s2)
  matchObj = re.search(regex_string, node)
  if not matchObj or not matchObj.group(1):
    return "INVALID_ENTRY"
  if "100g" in node:
    return float(matchObj.group(1))*10 
  return matchObj.group(1)

def each_or_kilo(node, params):
  each = ("per 1Ea" in node)
  if (each):
    return -1
  else:
    return 1