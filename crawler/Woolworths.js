var Crawler = require('./Crawler');
var WoolworthsIndexer = require('./Indexer/Woolworths');

// The Woolies site says 15 per page, but they actually display 18. Weirdos.
var woolworthsIndexer = new WoolworthsIndexer(18);
console.log(woolworthsIndexer);
var woolworthsURLs = woolworthsIndexer.index();
console.log(woolworthsURLs);
var someBasePath = 'woolworths';

var woolworthsCrawler = new Crawler(woolworthsURLs, someBasePath);

woolworthsCrawler.crawl();

woolworthsCrawler.on(woolworthsCrawler.Events.finished, function() {
  console.log('Coles has finished.');
});
