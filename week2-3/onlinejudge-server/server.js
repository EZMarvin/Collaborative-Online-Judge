var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://user:user@ds153719.mlab.com:53719/onlinejudge');

var restRouter = require('./routes/rest.js');
var indexRouter = require('./routes/index.js');
var path = require('path');

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);

app.use('/api/v1', restRouter);

app.use(function(req, res, next) {
  res.sendfile('index.html', {root: path.join(__dirname, '../public')});
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
