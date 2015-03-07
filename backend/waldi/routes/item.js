var item = require('../models/item');

exports.item = function(req, res) {
  var id = req.params.id;
  res.send("Item: " + id);
};

exports.common = function(req, res) {
  item.mostCommon(100, function(err, data) {
    console.log(err, data);
    res.send(data);
  });
};