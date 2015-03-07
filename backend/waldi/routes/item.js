var item = require('../models/item');

exports.item = function(req, res) {
  var id = req.params.id;
  res.send("Item: " + id);
};

exports.common = function(req, res) {
  item.mostCommon(100, function(err, data) {
    res.send(err || data);
  });
};

exports.search = function(req, res) {
  console.log(req.query);
  
  if (req.query.title) {
    // Title search
    var queryTitle = req.query.title;
    item.fullTitleSearch(queryTitle, function(err, data) {
      res.send(err || data);
    });
  } else {
    res.send({
      code: 400
    });
  }
};