var Crawler = require('./Crawler');
var WoolworthsIndexer = require('./Indexer/Woolworths');
var bs = require('nodestalker');
var client = bs.Client('0.0.0.0:11300');

var woolworthsTube = 'woolworths';

// The Woolies site says 15 per page, but they actually display 18. Weirdos.
var woolworthsIndexer = new WoolworthsIndexer(18);
var woolworthsURLs = woolworthsIndexer.index();
var someBasePath = 'woolworths';

var woolworthsCrawler = new Crawler(woolworthsTube, someBasePath);

// Add the URLs, then start crawling
// fillQueue(function() {
//   console.log('Queue filled.');
// });

startCrawling();
 
function fillQueue(callback) {
  client.use(woolworthsTube).onSuccess(function(data) {
    for (var i = 0; i < woolworthsURLs.length; i++) {
      client.put(woolworthsURLs[i]);
    }

    return callback();
  });
}

function startCrawling() {
  console.log('Starting to crawl.');
  woolworthsCrawler.crawl();
}

// woolworthsCrawler.on(woolworthsCrawler.Events.finished, function() {
//   console.log('Coles has finished.');
// });
