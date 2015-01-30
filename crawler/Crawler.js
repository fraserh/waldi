/*
 * Directory Structure
 * Events
 * Archival
 */

// TODO: Directory structure
// TODO: Moving directories once replaced

var fs = require('fs');
var Queue = require('./queue');
var async = require('./async');
var sanitize = require("sanitize-filename");

// A pretty ugly global so that we can clear out the phantom instance.
var phantom = require('phantom'); // N.B. non-standard Phantom JS
var phantomInstance;

phantom.cookiesEnabled = true;
// phantom.addCookie({
//   'name': 'ColesSearchPageSizeCookie',
//   'value': '100',
//   'domain': 'shop.coles.com.au'
// });

var events = require('events');

// Global event names because of scope issues.
var EventKeys = {
  startedURL: 'didStartLoadingURL',
  loadedURL: 'didLoadURL',
  savedPage: 'didSavePage',
  finished: 'didFinishCrawling'
};

/**
 * crawl loads each webpage in the urlsToCrawl list and saves them to a file
 */

function Crawler(urlsToCrawl, basePath, waitTime) {
  // Set up our queue of URLs to visit.
  this.urlsToCrawl = new Queue();

  for (var i = 0, len = urlsToCrawl.length; i < len; i++) {
    this.urlsToCrawl.enqueue(urlsToCrawl[i]);
  }

  this.basePath = basePath;

  this.Events = EventKeys;
  
  // waitTime is optional
  var fiveSeconds = 5000;
  this.waitTime = waitTime || fiveSeconds;
}

Crawler.prototype = new events.EventEmitter;

Crawler.prototype.loadPage = function(url) {
  var that = this; // gross
  phantom.create(function (ph) {
    phantomInstance = ph;

    ph.createPage(function (page) {
      that.emit(EventKeys.startedURL, {
        URL: url
      });

      page.open(url, function (status) {
        if (status !== 'success') {
          return callback(new Error(url, 'could not be opened.'));
        }

        setTimeout(function() {
          page.evaluate(function () {
            return {
              content: document.documentElement.outerHTML,
              URL: document.URL
            };
          }, function (result) {
            that.emit(EventKeys.loadedURL, result);
          });
        }, that.waitTime);
      });
    });
  });
};

Crawler.prototype.savePage = function(path, content) {
  console.log('\nSaving:', path, '.\n');

  // TODO: Remove the uses of `that`—I think we can do away with them with `bind`.
  var that = this;

  fs.writeFile(path, content, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Saved.");
    }

    that.emit(EventKeys.savedPage, {
      path: path,
      content: content
    });
  });
};

Crawler.prototype.crawl = function() {
  if (this.urlsToCrawl.isEmpty()) {
    // Clean up the phantom instance.
    if (phantomInstance) {
      phantomInstance.exit();
    }

    return this.emit(EventKeys.finished);
  }

  // Kick off the crawling.
  var item = this.urlsToCrawl.dequeue();
  this.loadPage(item);
};

Crawler.prototype.on(EventKeys.loadedURL, function(page) {
  var that = this;
  fs.exists('./' + this.basePath, function(exists) {
    if (exists) {
      that.savePage('./' + that.basePath + '/' + sanitize(page.URL) + '.html', page.content);
    } else {
      throw new Error('Directory does not exist.');
    }
  });
});

Crawler.prototype.on(EventKeys.savedPage, function(page) {
  // Start the next one.
  this.crawl();
});

/*
Export Crawler
 */
module.exports = Crawler;