/**
 * Item
 *  - title
 *  - price_per_kle
 *  - kle
 *  - unit_price
 *  - unit_volume
 *  - amount
 */

var async = require("async");
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
exports.matchTitle = matchTitle = function(title, callback) {
  externalStore.matchTitle(title, callback);
};

// Get an item's matches
exports.matches = matches = function(title, n, callback) {
  externalStore.matches(title, n, callback);
};

// Gets information about a group of items
exports.items = function(items, callback) {
  items = JSON.parse(items);
  async.map(items, function(i, innerCallback) {

    matchTitle(i, function(err, data) {
      innerCallback(err, data);
    });
  }, function(err, results) {
    callback(err, results);
  });
};

// Provides autocomplete suggestions given a partial title
exports.autocomplete = function(partialTitle, n, callback) {
  externalStore.autocomplete(partialTitle, n, callback);
};