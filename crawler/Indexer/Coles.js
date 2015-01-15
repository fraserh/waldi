var Indexer = require('./Indexer');

/*
http://shop.coles.com.au/online/national/specials-offers/specials-offers
http://shop.coles.com.au/online/national/back-to-school/back-to-school
http://shop.coles.com.au/online/national/bread-bakery/bread-bakery
http://shop.coles.com.au/online/national/fruit-vegetables/fruit-vegetables
http://shop.coles.com.au/online/national/meat-seafood-deli/meat-seafood-deli
http://shop.coles.com.au/online/national/dairy--eggs-meals/dairy--eggs-meals
http://shop.coles.com.au/online/national/pantry/pantry
http://shop.coles.com.au/online/national/frozen/frozen
http://shop.coles.com.au/online/national/drinks/drinks
http://shop.coles.com.au/online/national/liquor/liquor
http://shop.coles.com.au/online/national/international-food/international-food
http://shop.coles.com.au/online/national/healthy-living/healthy-living
http://shop.coles.com.au/online/national/household/household
http://shop.coles.com.au/online/national/personal-care-chemist/personal-care-chemist
http://shop.coles.com.au/online/national/baby/baby
http://shop.coles.com.au/online/national/pet/pet
http://shop.coles.com.au/online/national/stationery-media/stationery-media
http://shop.coles.com.au/online/national/clothing/clothing
*/

// category_name -> num_items
var categories = {
  'bread-bakery': 510,
  'fruit-vegetables': 360,
  'meat-seafood-deli': 1000,
  'dairy--eggs-meals': 1400,
  'pantry': 6603,
  'frozen': 1033,
  'drinks': 1271,
  'international-food': 1550,
  'healthy-living': 3217,
  'household': 2130,
  'personal-care-chemist': 3902,
  'baby': 512,
  'pet': 782,
  'stationery-media': 629,
  'clothing': 283
};

/**
 * Instantiate a new Coles indexer
 * @param {Int} itemsPerPage optional. Defaults to 100.
 */
function Coles(itemsPerPage) {
  var baseURL = 'http://shop.coles.com.au/online/national/';
  Indexer.call(this, categories, baseURL, itemsPerPage);
}

Coles.prototype = Object.create(Indexer.prototype);
// Coles.prototype.constructor = Coles;

// var url = 'http://shop.coles.com.au/online/national/pantry/pantry#pageNumber=5&currentPageSize=20';
Coles.prototype.categoryURLs = function(categoryName, start, end) {
  // Possibly not <=. Not sure how the page numbering will turn out.
  var urls = [];
  for (var i = start; i <= end; i++) {
    urls.push(this.baseURL + categoryName + '/' + categoryName + '#pageNumber=' +
              i + '&currentPageSize' + this.itemsPerPage);
  }
  return urls;
};

module.exports = Coles;
