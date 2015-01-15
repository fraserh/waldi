function Indexer (categories, baseURL, itemsPerPage) {
  this.itemsPerPage = itemsPerPage || 100;
  this.categories = categories;
  this.baseURL = baseURL;
}

Indexer.prototype.index = function() {
  var allURLs = [];

  // For each category, get that category's bounds.
  // Then fill in the gaps.
  var bounds;
  for (category in categories) {
    bounds = this.categoryBounds(category);

    var categoryURLs = this.categoryURLs(category, bounds[0], bounds[1]);
    // push probably not right.
    allURLs.push(categoryURLs);
  }

  return allURLs;
};

// Returns a pseudo-tuple.
Indexer.prototype.categoryBounds = function(categoryName) {
  var numberOfItems = this.categories[categoryName];

  if (!numberOfItems) {
    return [1, 1];
  }

  return [1, Math.ceil(numberOfItems / this.itemsPerPage)];
};

// Should be overridden by instances.
Indexer.prototype.categoryURLs = function(category, lower, upper) {
  return;
};

/*
Export Indexer
 */
module.exports = Indexer;