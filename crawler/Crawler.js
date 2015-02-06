/*
 * Directory Structure
 * Events
 * Archival
 */

var fs = require('fs');
// var Queue = require('./queue');
var async = require('./async');
var sanitize = require("sanitize-filename");
var bs = require('nodestalker');

// A pretty ugly global so that we can clear out the phantom instance.
var phantom = require('phantom'); // N.B. non-standard Phantom JS
var phantomInstance;

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

function Crawler(tubeName, basePath, waitTime) {
  this.tubeName = tubeName;

  this.client = require('nodestalker').Client('0.0.0.0:11300');

  this.basePath = basePath;

  this.Events = EventKeys;
  
  // waitTime is optional
  var fiveSeconds = 5000;
  this.waitTime = waitTime || fiveSeconds;
}

Crawler.prototype = new events.EventEmitter;

Crawler.prototype.nextURL = function(callback) {
  var that = this; // gross

  console.log('get nexturl');

  // this.client.use(this.tubeName)
  this.client.watch(this.tubeName)
    .onSuccess(function startCrawl() {
      console.log('Starting to crawl...');
      that.client.reserve()
        .onSuccess(function(job) {
          // Dangerously assumes that whatever the callback returns to
          // will succeed and we no longer need the item on the queue.
          that.client.deleteJob(job.id).onSuccess(function(del_msg) {
            callback(null, job.data);
          });
        })
        .onError(function(error) {
          callback(error);
        })
        .onEnd(function() {
          console.log('End');
          // that.emit(EventKeys.finished);
        });
  });


};

Crawler.prototype.crawl = function() {
  console.log('crawling...');
  var that = this; // gross
  this.nextURL(function(err, url) {
    if (err) {
      console.error(err);
    }

    that.loadPage(url);
  });
};

Crawler.prototype.loadPage = function(url) {
  var that = this; // gross
  console.log('loading', url);
  phantom.create(function (ph) {
    phantomInstance = ph;

    ph.createPage(function (page) {
      that.emit(EventKeys.startedURL, {
        URL: url
      });

      page.open(url, function (status) {
        if (status !== 'success') {
          throw(new Error(url, 'could not be opened.'));
        }

        setTimeout(function() {
          page.evaluate(function () {
            return {
              content: document.documentElement.outerHTML,
              URL: document.URL
            };
          }, function (result) {
            ph.exit();
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