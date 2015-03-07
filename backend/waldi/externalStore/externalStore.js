/* 
 * Abstracts away the implementation of the external store 
 * from the models.
 */

var redis = require("redis");
var async = require("async");

var client = redis.createClient();

exports.fullTitleSearch = function(title, callback) {
  // Note that we probably shouldn't use client.keys in production
  client.keys("item:*" + title + "*", function(err, keys) {
    if (err) return callback(err);

    keys = keys.map(parseRedisTitleKey);
    callback(err, keys);
  });
};

exports.mostCommon = function(n, callback) {
  // For now, just get n items from redis, whatever they are.
  client.keys("item*", function(err, keys) {
    if (err) return callback(err);

    // Grab the first n items.
    var topTen = keys.slice(0, n);

    // Get each item's data
    async.map(topTen, client.hgetall.bind(client), function(err, results) {
      if (err) return callback(err);

      // Remove the 'item:' from the start of the keys
      keys = keys.map(parseRedisTitleKey);

      // Insert the cleaned up key as the title for the item
      results = mergeArrays(keys, results, function(x, y) {
        y.title = x;
        return y;
      });

      // And callback with the final list.
      return callback(err, results);
    });
  });
};

// Remove the 'item:' from the start of the keys
function parseRedisTitleKey(key) {
  return key.replace("item:", "");
}

// Merge two arrays with the function f
// 
// NOTE
// ====
// Only goes the length of the shorter list.
// 
function mergeArrays(xs, ys, f) {
  // Use the shorter of the two lists as the base
  var baseList = (xs.length < ys.length) ? xs : ys;
  var newList = [];

  for (var i = 0; i < baseList.length; i++) {
    newList.push(f(xs[i], ys[i]));
  }

  return newList;
}