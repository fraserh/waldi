var Indexer = require('./Indexer');

// category_name -> num_items

/*
This is _not_ a complete list of categories, because Woolies' category 
conventions are infuriating.
 */

var categories = {
  'bakery/bread': 98,
  'bakery/bulk-packs': 5,
  'bakery/cakes-muffins-cookies': 110,
  'bakery/crumpets-english-muffins': 26,
  'bakery/desserts': 27,
  'bakery/in-store-bakery': 99,
  'bakery/pastry': 39,
  'bakery/rolls-wraps-flatbreads': 76,
  'fruit-vegetables/fresh-juice': 1,
  'fruit-vegetables/fruit': 117,
  'fruit-vegetables/herbs': 48,
  'fruit-vegetables/nuts-snacks': 512,
  'fruit-vegetables/organic': 782,
  'fruit-vegetables/salad': 82,
  'fruit-vegetables/vegetables': 165,
  'dairy': 1022,
  'serviced-deli': 208,
  'chilled': 543,
  'meat/beef': 59,
  'meat/chicken': 81,
  'meat/duck': 4,
  'meat/ham': 10,
  'meat/kangaroo': 7,
  'meat/lamb': 26,
  'meat/mince': 14,
  'meat/organic': 18,
  'meat/pork': 22,
  'meat/quail': 1,
  'meat/rissoles-burgers': 18,
  'meat/sausages': 27,
  'meat/turkey': 13,
  'meat/veal': 2,
  'seafood/chilled': 50,
  'seafood/condiments-additives': 3,
  'seafood/fresh': 10,
  'seafood/thawed-for-your-convenience': 29
};

/**
 * Instantiate a new Coles indexer
 * @param {Int} itemsPerPage optional. Defaults to 100.
 * @param {Object} categories optional. If not specified, we provide the one above.
 */
function Woolworths(itemsPerPage, someCategories) {
  var baseURL = 'http://www2.woolworthsonline.com.au/Shop/Browse/';
  Indexer.call(this, someCategories || categories, baseURL, itemsPerPage);
}

Woolworths.prototype = Object.create(Indexer.prototype);
// Woolworths.prototype.constructor = Woolworths;

// http://www2.woolworthsonline.com.au/Shop/Browse/
//   fruit-vegetables/fruit#url=/Shop/Browse/fruit-vegetables/fruit?page=3
Woolworths.prototype.categoryURLs = function(categoryName, start, end) {
  // Possibly not <=. Not sure how the page numbering will turn out.
  var urls = [];
  for (var i = start; i <= end; i++) {
    urls.push(this.baseURL + categoryName + '?page=' + i);
  }
  return urls;
};

module.exports = Woolworths;
