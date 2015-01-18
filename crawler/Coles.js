var Crawler = require('./Crawler');
var ColesIndexer = require('./Indexer/Coles');

var colesIndexer = new ColesIndexer();
console.log(colesIndexer);
var colesURLs = colesIndexer.index();

var someBasePath = 'basePath';

var colesCrawler = new Crawler(colesURLs, someBasePath);

colesCrawler.crawl();

colesCrawler.on(colesCrawler.Events.finished, function() {
  console.log('Coles has finished.');
});
