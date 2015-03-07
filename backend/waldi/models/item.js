/**
 * Item
 *  - title
 *  - price_per_kle
 *  - kle
 *  - unit_price
 *  - unit_volume
 *  - amount
 */

var externalStore = require('../externalStore/externalStore');

// Create a new Item
function Item(title,
              price_per_kle,
              kle,
              unit_price,
              unit_volume,
              amount)
{
  return {
    title: title,
    price_per_kle: price_per_kle,
    kle: kle,
    unit_price: unit_price,
    unit_volume: unit_volume,
    amount: amount
  };
}

// Return a list of the n most common items
function mostCommon(n, callback) {
  externalStore.mostCommon(n, callback);
}

// Return a list of all titles similar to the one we have
function fullTitleSearch(title, callback) {
  externalStore.fullTitleSearch(title, callback);
}

exports.matchTitle = function(title, callback) {
  externalStore.matchTitle(title, callback);
};

exports.mostCommon = mostCommon;
exports.fullTitleSearch = fullTitleSearch;