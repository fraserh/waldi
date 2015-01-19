var Crawler = require('./Crawler');
var WoolworthsIndexer = require('./Indexer/Woolworths');

var woolworthsIndexer = new WoolworthsIndexer(15);
console.log(woolworthsIndexer);
var woolworthsURLs = woolworthsIndexer.index();
console.log(woolworthsURLs);
var someBasePath = 'woolworths';

var woolworthsCrawler = new Crawler(woolworthsURLs, someBasePath);

woolworthsCrawler.crawl();

woolworthsCrawler.on(woolworthsCrawler.Events.finished, function() {
  console.log('Coles has finished.');
});
