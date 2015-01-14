var url = 'http://shop.coles.com.au/online/national/pantry/pantry#pageNumber=5&currentPageSize=20';
var page = require('webpage').create();

page.open(url, function () {
  setInterval(function() {
    console.log(page.content); //page source
    phantom.exit();
  }, 5000);
});