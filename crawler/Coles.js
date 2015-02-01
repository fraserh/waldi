var Crawler = require('./Crawler');
var ColesIndexer = require('./Indexer/Coles');
var memwatch = require('memwatch');

var colesIndexer = new ColesIndexer();
console.log(colesIndexer);
var colesURLs = colesIndexer.index();

var someBasePath = 'coles';

var colesCrawler = new Crawler(colesURLs, someBasePath);

colesCrawler.crawl();

colesCrawler.on(colesCrawler.Events.finished, function() {
  console.log('Coles has finished.');
});

memwatch.on('leak', function(info) {
  console.log(info);
});

memwatch.on('stats', function(stats) {
  console.log(stats);
});