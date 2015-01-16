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
var async = require('./async');

// PhantomJS doesn't support bind yet
Function.prototype.bind = Function.prototype.bind || function (thisp) {
    var fn = this;
    return function () {
        return fn.apply(thisp, arguments);
    };
};

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
  // In development, we don't really want to crawl the whole list
  var urls = this.urlsToCrawl.slice(1,3);

  console.log(urls);

  // Load the content at each URL
  async.mapSeries(urls, this.loadPage, function(err, contentsOfEach) {
    console.log('Finished.');
    console.log(err, contentsOfEach);
  });

  // Eventually, do this.
  // async.mapSeries(urls, this.loadPage, function(err, contentsOfEach) {
  //   console.log(err, contentsOfEach);
  //   async.mapSeries(contentsOfEach, this.savePage, function(err, statuses) {
  //     console.log(err, statuses);
  //     phantom.exit();
  //   });
  // });
};

/**
 * loadPage requests a webpage's HTML content
 * @param  {String}   url      The page's URL
 * @param  {Function} callback callback on completion with (error, data)
 */
Crawler.prototype.loadPage = function(url, callback) {
  var page = require('webpage').create();

  page.openPage(url, function (status) {
    if (status !== 'success') {
      return callback(new Error(url, 'could not be opened.'));
    }

    setTimeout(function() {
      var content = page.content;
      callback(null, content);
    }, this.waitTime);
  });
};

Crawler.prototype.savePage = function(content, callback) {
  console.log('\n\n', path, '\n\n\n');
  console.log(content);
  callback(null, null);
  // fs.writeFile(content, path, callback);
};

function asyncLoop(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

/*
Export Crawler
 */
module.exports = Crawler;