var Coles = require('./Coles');

var coles = new Coles();
coles.basePath = 'coles';
coles.urlsToCrawl = ['blah'];

coles.crawl();