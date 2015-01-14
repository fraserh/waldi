 #!/usr/bin/env python

"""
Collection of helper functions to help parse data
"""
import re

def getInnerHTML(node, foo, bar):
	"""Get InnerHTML
    Return the inside of a node (i.e. remove tags)
    """
	return node.decode_contents(formatter="html")

def prettifyString(text, foo, bar):
	return text.strip().lower()

def splitSplice(node, splitString, section):
	"""
    Splits a string at point splitString, and returns 'section' item of the resulting list
    """
	return node.split(splitString)[section]

def regexBetweenTwoStrings(node, s1, s2):
  regex_string = r""+re.escape(s1)+r"(.*)"+re.escape(s2)
  matchObj = re.search(regex_string, node)
  if matchObj.group(1):
    return matchObj.group(1)
  else:
    return " " 
