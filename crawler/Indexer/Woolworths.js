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
  'seafood/frozen': 43,
  'seafood/thawed-for-your-convenience': 29,
  'baby/bath-time': 40,
  'baby/change-time': 49,
  'baby/clothing': 41,
  'baby/feed-time': 101,
  'baby/food-snacks': 191,
  'baby/formula': 40,
  'baby/medicinal': 14,
  'baby/nappies-nappy-pants': 96,
  'baby/play-time': 13,
  'baby/sleep-time': 36,
  'baking': 655,
  'beauty': 669,
  'beer-wine-spirits/beer': 470,
  'beer-wine-spirits/cider': 160,
  'beer-wine-spirits/gifting': 11,
  'beer-wine-spirits/ginger-beer-ice-tea': 20,
  'beer-wine-spirits/merchandise': 12,
  'beer-wine-spirits/premix-spirits': 213,
  'beer-wine-spirits/spirits': 265,
  'beer-wine-spirits/wine-cask': 53,
  'beer-wine-spirits/wine-fortified': 35,
  'beer-wine-spirits/wine-imported': 49,
  'beer-wine-spirits/wine-red': 328,
  'beer-wine-spirits/wine-sparkling-champagne': 150,
  'beer-wine-spirits/wine-white': 224,
  'biscuits-snacks': 852,
  'breakfast-foods': 267,
  'canned-packet-food': 1368,
  'condiments': 383,
  'confectionery': 554,
  'cooking-seasoning-gravy': 902,
  'desserts': 165,
  'drinks': 1383,
  'frozen-food': 918,
  'health-wellbeing': 670,
  'health-foods': 517,
  'home-outdoor': 3042,
  'household-cleaning': 1138,
  'international-food': 442,
  'jams-spreads': 200,
  'magazines-books': 129,
  'papergoods-wraps-bags': 190,
  'pet-care/care-accessories': 133,
  'pet-care/cats': 273,
  'pet-care/dogs': 302,
  'pet-care/small-animals': 39,
  'toiletries': 1671
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
