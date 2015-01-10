from bs4 import BeautifulSoup
import parsecontrollers

soup = BeautifulSoup(open("fruit.html"));

for product in soup.find_all("div","wrapper"):
  title_container = product.find_all("div","detail")[0]
  title = title_container.find_all("a","product-url")[0].decode_contents(formatter="html").strip().split("&nbsp")[0].lower()
  price_container =  product.find_all("div","price")
  price = ""
  for price_object in price_container:
   	price = price_object.decode_contents(formatter="html").split("</small>")[1]
  print("%s,%s" %(title,price))

"""
Generalised Web Scraper
"""

class pageParser(html_doc):
  """New Page Parser """

  def get_container():
    """Get Container Class Names.
    Get the relevant class names of the containers to be searched.
    """

    p