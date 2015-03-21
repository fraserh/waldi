
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', { title: 'index' });
};

exports.intro = function(req, res){
  res.render('intro/index.html', { title: 'intro' });
};