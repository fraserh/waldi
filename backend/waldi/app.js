
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var item = require('./routes/item');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
// app.get('/users', user.list);

// Most common items
// GET localhost/commonItems?size=20
app.get('/commonItems', item.common);

// Search for an item
// GET localhost/item?title=pink%20lady%20apples
app.get('/search/item', item.search);

// Request a specific item (exact match search)
// GET localhost/item?title=pink%20lady%20apples
app.get('/item', item.exactMatch);

// Provide alphabetically ordered auto-complete
// GET localhost/autocomplete?title=pi
app.get('/search/autocomplete', item.autocomplete);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
