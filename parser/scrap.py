from bs4 import BeautifulSoup
import parsecontrollers

soup = BeautifulSoup(open("fruit.html"));

"""
Generalised Web Scraper
"""

class pageParser(object):
  """New Page Parser """

  def __init__(self, html_doc):
  	self.html_doc = html_doc

	self.COLES_PARAMS = [{
	  	"element":"div",
	  	"classname": "detail",
	  	"extra_classname": "product-url",
	  	"extra_element": "a",
	  	"decode": 1,
	  	"prettify": 1
	  },
	  {
	  	"element":"div",
	  	"classname": "detail"
	  }
	  ]

  def get_container(self):
    """Get Container Class Names.
    Get the relevant class names of the containers to be searched.
    """
    results = self.html_doc.find_all(self.COLES_PARAM[0]["element"],self.COLES_PARAMS[0]["classname"])
    if ()
    print results

  def get_containers():
    """Get Container Class Names.
    Get the relevant class names of the containers to be searched.
    """
    x = ""

for product in soup.find_all("div","wrapper"):
  title_container = product.find_all("div","detail")[0]
  title = title_container.find_all("a","product-url")[0].decode_contents(formatter="html").strip().split("&nbsp")[0].lower()
  price_container =  product.find_all("div","price")
  price = ""
  for price_object in price_container:
   	price = price_object.decode_contents(formatter="html").split("</small>")[1]
  #print("%s,%s" %(title,price))

foo = pageParser(soup).get_container()





    