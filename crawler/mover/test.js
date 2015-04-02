var sanitize = require("sanitize-filename");
var fullOne = 'http://shop.coles.com.au/online/national/stationery-media/stationery-media/#pageNumber=7&currentPageSize=100';
var fullTwo = 'http://shop.coles.com.au/online/national/clothing/clothing/#pageNumber=1&currentPageSize=100';

var sanitizeOne = sanitize(fullOne);
var sanitizeTwo = sanitize(fullTwo);

console.log(sanitizeOne);
console.log(sanitizeTwo);

var w1 = 'http://www2.woolworthsonline.com.au/Shop/Browse/toiletries?page=93';
var w2 = 'http://www2.woolworthsonline.com.au/Shop/Browse/home-outdoor?page=16';
console.log(sanitize(w1));
console.log(sanitize(w2));