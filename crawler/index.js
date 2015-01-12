var url = 'http://shop.coles.com.au/online/national/pantry/pantry#pageNumber=1000&currentPageSize=20';
var page = require('webpage').create();

page.open(url, function () {
    console.log(page.content); //page source
    phantom.exit();
});