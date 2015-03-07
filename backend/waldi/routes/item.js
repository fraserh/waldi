var item = require('../models/item');

exports.item = function(req, res) {
  var id = req.params.id;
  res.send("Item: " + id);
};

exports.common = function(req, res) {
  item.mostCommon(req.query.size || 20, function(err, data) {
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
    item.autocomplete(req.query.title, req.query.size || 10, function(err, data) {
      respondWithErrorOrData(res, err, data);
    });
  } else {
    genericUnfoundError(res);
  }
};

exports.match = function(req, res) {
  if (req.query.title) {
    item.matches(req.query.title, req.query.size || 10, function(err, data) {
      respondWithErrorOrData(res, err, data);
    });
  } else {
    genericUnfoundError(res);
  }
};

function respondWithErrorOrData(res, err, data) {
  if (err || !data) {
    res.send(404, {
      code: 404,
      message: "Item not found."
    });
  } else {
    res.send(data);
  }
}

function genericUnfoundError(res) {
  res.send(400, {
    code: 400
  });
}