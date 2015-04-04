var mysql = require('mysql');
var connection = mysql.createConnection(require('./sql-config'));

connection.connect();

exports.fullTitleSearch = function(title, callback) {
  var query = 'SELECT * FROM item WHERE item.title LIKE \'' + title + '\';';
  connection.query(query, function(err, rows, fields) {
    callback(err, rows);
  });
};

exports.mostCommon = function(n, callback) {
  var query = "SELECT id, store, title, price_per_kle, kle, unit_price," +
              "unit_volume, amount, category, uses FROM item" +
              "ORDER BY uses DESC LIMIT " + n;
  connection.query(query, function(err, rows, fields) {
    callback(err, rows);
  });
};

exports.matchTitle = function(title, callback) {
  var query = "SELECT id, store, title, price_per_kle, kle, unit_price," +
              "unit_volume, amount, category, uses FROM item" +
              "WHERE title = '" + title + "'";
  connection.query(query, function(err, rows, fields) {
    callback(err, rows);
  });
};

exports.autocomplete = function(partialTitle, n, callback) {
  var query = "SELECT title FROM item WHERE title = '" + partialTitle + "%'" +
              "ORDER BY uses LIMIT " + n;
  connection.query(query, function(err, rows, fields) {
    callback(err, rows);
  });
};

exports.matches = function(title, n, callback) {
  // Get the id for this record
  var getIdQuery = "SELECT id FROM item WHERE title = '" + title + "'";
  connection.query(getIdQuery, function(err, rows, fields) {
    if (rows.length <= 0 || err) return callback(err, null);

    var id = rows[0];

    // Get the IDs of the matches, in order 
    var getMatchesQuery = "SELECT item_two FROM match WHERE" +
                          " item_one = '" + id + "' ORDER BY" +
                          " (rating + user_increment) LIMIT " + n;


    connection.query(getMatchesQuery, function(err, rows, fields) {
      if (rows.length <= 0 || err) return callback(err, null);
      // Build up the parameter for SQL's IN statement
      // ... WHERE MID(CustomerName,1,1) IN ('B','M','X') ... 
      // Stop one short to avoid a trailing comma.
      var inString = '(';
      for (var i = 0; i < rows.length - 1; i++) {
        inString += "'" + rows[i] + "',";
      }

      // We stopped early. Add the last item, its quotes, and the trailing )
      inString += "'" + rows[i] + "')";

      var matchesTitlesQuery = "SELECT title FROM item WHERE" +
                          " id IN " + inString;
      connection.query(matchesTitlesQuery, function(err, rows, fields) {
        callback(err, rows);
      });
    });
  });
};

exports.incrementMatchRating = function(anchor, match, incrementBy, callback) {
  return callback(new Error("Method not yet implemented."));
};

exports.incrementUsageCount = function(title, callback) {
  var query = "UPDATE item SET uses = uses + 1 WHERE title = '" + title + "'";
  connection.query(query, function(err, rows, fields) {
    callback(err, rows);
  });
};