var Indexer = require('./Indexer');

// category_name -> num_items
var categories = {
  'bakery/bread': 510,
  'fruit/veg': 360,
  // etc.
};

function Coles(categories, itemsPerPage) {
  var baseURL = 'http://shop.coles.com.au/online/national/';
  Indexer.call(this, categories, baseURL, itemsPerPage);
}

Coles.prototype = Object.create(Coles.prototype);
Coles.prototype.constructor = Coles;

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
