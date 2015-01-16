var Crawler = require('./Crawler');
var ColesIndexer = require('./Indexer/Coles');

var colesIndexer = new ColesIndexer();
console.log(colesIndexer);
var colesURLs = colesIndexer.index();

// console.log(colesURLs);

var someList = colesURLs;
var someBasePath = 'basePath';

var colesCrawler = new Crawler(someList, someBasePath);

colesCrawler.crawl();
