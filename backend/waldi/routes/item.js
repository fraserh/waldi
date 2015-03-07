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
  if (req.query.title) {
    // Title search
    var queryTitle = req.query.title;
    item.fullTitleSearch(queryTitle, function(err, data) {
      res.send(err || data);
    });
  } else {
    genericUnfoundError(res);
  }
};

exports.exactMatch = function(req, res) {
  if (req.query.title) {
    // Do an exact match lookup for the given title
    item.matchTitle(req.query.title, function(err, data) {
      respondWithErrorOrData(res, err, data);
    });
  } else {
    genericUnfoundError(res);
  }
};

exports.autocomplete = function(req, res) {
  if (req.query.title) {
    var itemsToReturn = 10;
    item.autocomplete(req.query.title, 10, function(err, data) {
      respondWithErrorOrData(res, err, data);
    });
  } else {
    genericUnfoundError(res);
  }
};

function respondWithErrorOrData(res, err, data) {
  if (err || !data) {
    res.send({
      code: 404
    });
  } else {
    res.send(data);
  }
}

function genericUnfoundError(res) {
  res.send({
    code: 400
  });
}