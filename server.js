var express = require('express')
var http = require('http')
var path = require('path')
var reload = require('reload')
var bodyParser = require('body-parser')
var logger = require('morgan')
const livereload = require("livereload");



var connectLivereload = require("connect-livereload");




var liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
var app = express()

var publicDir = path.join(__dirname, 'public')
 
app.set('port', process.env.PORT || 3000)
app.use(logger('dev'))
app.use(bodyParser.json()) // Parses json, multi-part (file), url-encoded
 
app.use(connectLivereload());

app.get('/', function (req, res) {
  res.sendFile(path.join(publicDir, 'index.html'))
})
 
var server = http.createServer(app)
 
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

// Reload code here
reload(app).then(function (reloadReturned) {
  // reloadReturned is documented in the returns API in the README
 
  // Reload started, start web server
  server.listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
  })
}).catch(function (err) {
  console.error('Reload could not start, could not start server/sample app', err)
})

