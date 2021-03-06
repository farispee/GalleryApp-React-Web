const path = require('path');
const compression = require('compression')
const express = require('express');
const webpack = require('webpack');
const mime = require('mime');
const fs   = require("fs");
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../config/webpack.config.js');
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();
app.use(compression())

app.use('/dist', express.static(path.join(__dirname, '../dist')));
app.use('/assets', express.static(path.join(__dirname, './assets')));
app.use('/sw_init.js', express.static(path.join(__dirname, './assets/js/sw/init_sw.js')));
app.use('/serviceWorker.js', express.static(path.join(__dirname, './assets/js/sw/serviceWorker.js')));


if (isDeveloping) {

  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  
  app.get('/', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../dist/index.html')));
    res.end();
  });

} else {

  app.get('/', function response(req, res) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

}

app.get('/downloadSampleCsv', function(req, res){

  var file = req.query.type == "student" ? (path.join(__dirname, './assets/docs/studentList.csv')) : (path.join(__dirname, './assets/docs/staff.csv'))

  var filename = path.basename(file);
  var mimetype = mime.lookup(file);

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);

  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
  
});


app.listen(port, '0.0.0.0', function onStart(err) {

  if (err) {
    
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
