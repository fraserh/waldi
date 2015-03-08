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
exports.mostCommon = function(n, callback) {
  externalStore.mostCommon(n, callback);
};

// Return a list of all titles similar to the one we have
exports.fullTitleSearch = function(title, callback) {
  externalStore.fullTitleSearch(title, callback);
};

// Performs an exact match against a title
exports.matchTitle = function(title, callback) {
  externalStore.matchTitle(title, callback);
};

// Get an item's matches
exports.matches = function(title, n, callback) {
  externalStore.matches(title, n, callback);
};

// Provides autocomplete suggestions given a partial title
exports.autocomplete = function(partialTitle, n, callback) {
  externalStore.autocomplete(partialTitle, n, callback);
};