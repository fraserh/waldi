/* 
 * Abstracts away the implementation of the external store 
 * from the models.
 * This is done so that we can change from Redis to MySQL—or similar—
 * without having to touch code anywhere else.
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

exports.matchTitle = function(title, callback) {
  client.hgetall("item:" + title, function(err, result) {
    if (err || !result) return callback(err, result);
    result.title = title;
    callback(err, result);
  });
};

// Autocomplete suggestions
// http://oldblog.antirez.com/post/autocomplete-with-redis.html
// https://github.com/jedp/redis-completer/blob/master/completer.js
exports.autocomplete = function(partialTitle, n, callback) {
  var collectionName = "autocomplete";
  var trailingMarker = "*";

  /*
  Not entirely sure what rangeLength should be. antirez has a comment
  on his snippet '# This is not random, try to get replies < MTU size'.
  I guess we can play with it if performance is an issue.
   */
  var longestTitle = 100; // seems very arbitrary
  var rangeLength = n * longestTitle;


  var results = [];

  client.zrank(collectionName, partialTitle, function(err, index) {
    if (err) return callback(err);

    client.zrange(collectionName, index, index + rangeLength - 1, function(err, items) {
      // Fill up the results array with n matches
      while (results.length <= n) {
        if (!items || items.length === 0) {
          break;
        }

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var minimumLength = Math.min(item.length, partialTitle.length);
          
          if (item.slice(0, minimumLength) !== partialTitle.slice(0, minimumLength)) {
            return callback(null, results);
          }

          if (item[item.length - 1] === '*' && results.length <= n) {
            results.push(item.slice(0, -1));
          }
        }
      }

      return callback(null, results);
    });
  });
};

// Matches
exports.matches = function(title, n, callback) {
  client.zrevrange("match:" + title, 0, n, function(err, data) {
    callback(err, data);
  });
};

exports.incrementMatchRating = function(anchor, match, incrementBy, callback) {
  // Get the current match rating
  console.log(anchor, match, incrementBy);
  client.zscore("match:" + anchor, match, function(err, rating) {
    console.log(err, rating);

    if (err || !rating) return callback(err, rating);
    var newRating = parseFloat(rating) + incrementBy;
    console.log(newRating);
    client.zadd("match:" + anchor, newRating, match, function(err, data) {
      return callback(err, data);
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