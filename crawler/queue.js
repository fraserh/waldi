/*!
* queue-adt
* v0.1.2 - 2014-08-03
* https://github.com/pasangsherpa/queue-adt
* (c) Pasang Sherpa <pgyalzen@gmail.com> (https://github.com/pasangsherpa)
* MIT License
*/
!function(){"use strict";var a=function(a){function b(a){if(f()===i)throw new Error("enqueue(): Queue is full.");return j.push(a)}function c(){if(e())throw new Error("dequeue(): Queue is empty.");return j.shift()}function d(){if(e())throw new Error("first(): Queue is empty.");return j[0]}function e(){return 0===f()}function f(){return j.length}function g(){for(;j.length;)j.pop();return j.length}function h(){function a(){return j.length!==c}function b(){if(!a())throw new Error("next(): No such element.");return j[c++]}var c=0;return{hasNext:a,next:b}}var i=a||1/0,j=[];return{enqueue:b,dequeue:c,first:d,isEmpty:e,size:f,empty:g,iterator:new h}};"function"==typeof define&&define.amd?define(function(){return a}):"undefined"!=typeof module&&module.exports?module.exports=a:window.Queue=a}();