var ColesIndexer = require('./Indexer/Coles');
var WoolworthsIndexer = require('./Indexer/Woolworths');

var bs = require('nodestalker');
var client = bs.Client('0.0.0.0:11300');

if (process.argv.length != 3) {
  console.log('Usage: node fillQueue.js (coles|woolworths)');
  return;
}

var store = process.argv[2];

console.log(store);

if (store === 'coles') {
  // Coles
  fillColes();
} else if (store === 'woolworths') {
  // Woolworths
  fillWoolworths();
}

function fillColes() {
  var colesIndexer = new ColesIndexer();
  var colesURLs = colesIndexer.index();
  var colesTube = 'default';

  fillQueue(colesTube, colesURLs, function() {
    console.log('Coles queue filled with', colesURLs.length, 'URLs.');
    process.exit();
  });
}

function fillWoolworths() {
  var woolworthsIndexer = new WoolworthsIndexer(18);
  var woolworthsURLs = woolworthsIndexer.index();
  var woolworthsTube = 'woolworths';
  
  fillQueue(woolworthsTube, woolworthsURLs, function() {
    console.log('Woolworths queue filled with', woolworthsURLs.length, 'URLs.');
    process.exit();
  });
}

function fillQueue(tube, URLs, callback) {
  client.use(tube).onSuccess(function(data) {
    for (var i = 0; i < URLs.length; i++) {
      console.log('put ', URLs[i], 'into', tube);
      client.put(URLs[i]);
    }

    return callback();
  });
}