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

exports.mostCommon = mostCommon;