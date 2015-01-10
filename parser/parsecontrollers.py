 #!/usr/bin/env python

"""
Collection of helper functions to help parse data
"""

def getInnerHTML(node, foo, bar):
	"""Get InnerHTML
    Return the inside of a node (i.e. remove tags)
    """
	return node.decode_contents(formatter="html")

def prettifyString(text, foo, bar):
	return text.strip().lower()

def splitSplice(node, splitString, section):
	"""Get InnerHTML
    Splits a string at point splitString, and returns 'section' item of the resulting list
    """
	return node.split(splitString)[section]