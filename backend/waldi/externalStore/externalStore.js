/* 
 * Abstracts away the implementation of the external store 
 * from the models.
 */

var redis = require("redis");
var async = require("async");

var client = redis.createClient();

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
      keys = keys.map(function(k) {
        return k.replace("item:", "");
      });

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