/*
* Directory Structure

This module creates a directory structure as follows:
  base_path/
    nightly/
      url_one.html
      url_two.html
      ...
    release/
      url_one.html
      url_two.html
      ...
    archive/
      date_archived/
        url_one.html
        url_two.html
        ...

  - Nightly contains in-action crawling periods, which may be incomplete.
  - Release contains the latest complete crawling action.
  - Archive are old crawling actions, which are subject to be deleted.

* Class Hierarchy

`Crawler` is the base class. It provides the following methods and properties:
  - crawl
  - loadPage(url, callback)
  - savePage(content, path, callback)
  - waitTime
  - urlsToCrawl
  - basePath

  Notes:
    - callback has the form (error, object)

Each store then subclasses `Crawler`.
 */

// TODO: Directory structure
// TODO: Moving directories once replaced
// TODO: Actually run this code.

var fs = require('fs');

/**
 * crawl loads each webpage in the urlsToCrawl list and saves them to a file
 */

function Crawler(urlsToCrawl, basePath, waitTime) {
  this.urlsToCrawl = urlsToCrawl;
  this.basePath = basePath;
  
  // waitTime is optional
  var fiveSeconds = 5000;
  this.waitTime = waitTime || fiveSeconds;
}

Crawler.prototype.crawl = function() {
  var urls = this.urlsToCrawl;

  // Load each URL
  // TODO: Fix so async doesn't break.
  // TODO: Add monadic error handling
  for (var i = 0, len = urls.length; i < len; i++) {
    this.loadPage(urls[i], function(err, data) {
      if (err) {
        console.error(err);
      } else {
        // Save each URL
        // TODO: Make file path valid
        this.savePage(data, urls[i] + '.html', function(err, data) {
          if (err) {
            console.error(err);
          } else {
            console.log('Saved', urls[i]);
          }
        });
      }
    });
  }
};

/**
 * loadPage requests a webpage's HTML content
 * @param  {String}   url      The page's URL
 * @param  {Function} callback callback on completion with (error, data)
 */
Crawler.prototype.loadPage = function(url, callback) {
  var page = require('webpage').create();

  page.open(url, function (status) {
    if (status !== 'success') {
      callback(new Error(url, 'could not be opened.'));
      return phantom.exit();
    }

    setInterval(function() {
      callback(null, page.content);
      return phantom.exit();
    }, Crawler.waitTime());
  });
};

Crawler.prototype.savePage = function(content, path, callback) {
  fs.writeFile(content, path, callback);
};

/*
Export Crawler
 */
module.exports = Crawler;