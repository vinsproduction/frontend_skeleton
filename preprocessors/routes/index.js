
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


exports.upload = function(req, res){
  res.json({ success: 'загрузилось на сервак' })
};

exports.remove = function(req, res){
  res.json({ success: 'удалилось с сервака' })
};