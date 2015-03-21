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
    invalidRequestError(res);
  }
};

exports.exactMatch = function(req, res) {
  if (req.query.title) {
    console.log(req.query);
    // Do an exact match lookup for the given title
    item.matchTitle(req.query.title, function(err, data) {
      respondWithErrorOrData(res, err, data);
    });
  } else {
    invalidRequestError(res);
  }
};

exports.autocomplete = function(req, res) {
  if (req.query.title) {
    item.autocomplete(req.query.title, req.query.size || 10, function(err, data) {
      respondWithErrorOrData(res, err, data);
    });
  } else {
    invalidRequestError(res);
  }
};

exports.match = function(req, res) {
  if (req.query.title) {
    item.matches(req.query.title, req.query.size || 10, function(err, data) {
      respondWithErrorOrData(res, err, data);
    });
  } else {
    invalidRequestError(res);
  }
};

exports.items = function(req, res) {
  if (req.body.items) {
    console.log(req.body.items);
    item.items(req.body.items, function(err, data) {
      respondWithErrorOrData(res, err, data);
    });
  } else {
    invalidRequestError(res);
  }
};

exports.prepopulate = function(req, res) {
  item.mostCommon(req.query.size || 1000, function(err, data) {
    // Map our data of the form 
    // {
    //   "price_per_kle": "17.2",
    //   "amount": "1",
    //   "unit_volume": "0.4KG",
    //   "unit_price": "6.88",
    //   "kle": "kg",
    //   "title": "aussie varieties dip 4 corners 400g"
    // }
    // 
    // to 
    // 
    // {
    //   "price": "25.00  ",
    //   "prod": "free range satay chicken breast skewers 300g",
    //   "id": 0
    // }
    var i = 0;

    data = data.map(function(d) {
      return {
        price: d.price_per_kle,
        prod: d.title,
        id: i++
      };
    });

    respondWithErrorOrData(res, err, data);
  });
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

function invalidRequestError(res) {
  res.send(400, {
    code: 400,
    message: "Invalid request format."
  });
}