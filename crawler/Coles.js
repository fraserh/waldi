var Crawler = require('./Crawler');
var ColesIndexer = require('./Indexer/Coles');

var bs = require('nodestalker');
var client = bs.Client('0.0.0.0:11300');

var colesTube = 'coles';

var colesIndexer = new ColesIndexer();

var colesURLs = colesIndexer.index();

// Set up our crawler
var someBasePath = 'coles';
var colesCrawler = new Crawler(colesTube, someBasePath);

// Add the URLs to the queue, then start crawling
// fillQueue(startCrawling);
startCrawling();

function fillQueue(callback) {
  client.use(colesTube).onSuccess(function(data) {
    for (var i = 0; i < colesURLs.length; i++) {
      client.put(colesURLs[i]);
    }

    return callback();
  });
}

function startCrawling() {
  console.log('queue is full');
  // client.disconnect();
  colesCrawler.crawl();
}

// colesCrawler.on(colesCrawler.Events.finished, function() {
//   console.log('Coles has finished.');
// });