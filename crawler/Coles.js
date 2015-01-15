var Crawler = require('./Crawler');
var Indexer = require('./Indexer');

var colesIndexer = new Indexer();

var colesCategories = {
  'pantry': 6603,
  // ...
};

var colesURLs = colesIndexer.index(colesCategories);

var someList = colesURLs;
var someBasePath = 'basePath';
var someWaitTime = 10000;

var colesCrawler = new Crawler(someList, someBasePath, someWaitTime);
colesCrawler.crawl();
