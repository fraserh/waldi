"""
Generalised Web Scraper
"""

from bs4 import BeautifulSoup
import parsecontrollers

soup = BeautifulSoup(open("fruit.html"));

class pageParser(object):
  """New Page Parser """

  def __init__(self, html_doc):
  	self.html_doc = html_doc

	self.COLES_PARAMS = {
	  	"elements_to_search":{
	  						"tag":["div","a"],
	  						"class": ["detail", "product-url"]
	  						},
	  	"extract_data": [parsecontrollers.getInnerHTML, parsecontrollers.prettifyString, parsecontrollers.splitSplice]
	}

  def get_container(self):
    """Get Container Class Names.
    Get the relevant class names of the containers to be searched.
    """

    results = list()
    results.append(self.html_doc)

    # TODO: Use get requests on ALL dictionary calls (fail safe) 
    for searchtag, searchclass in zip(self.COLES_PARAMS["elements_to_search"]["tag"],self.COLES_PARAMS["elements_to_search"]["class"]):
      results[:] = [match[0].find_all(searchtag,searchclass) for match in results]
    for extracter in self.COLES_PARAMS["extract_data"]:
      results[:] = [extracter(entry, "&nbsp", 0) for entry in results]

# Testing purposes.
foo = pageParser(soup).get_container()





    