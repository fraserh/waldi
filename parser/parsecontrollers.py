 #!/usr/bin/env python

"""
Collection of helper functions to help parse data
"""

def getInnerHTML(node):
	"""Get InnerHTML
    Return the inside of a node (i.e. remove tags)
    """
	return node.decode_contents(formatter="html")

def prettifyString(text):
	return text.strip().lower()