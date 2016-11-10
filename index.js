/* eslint no-console: 0 */

const express = require('express');

const app = express();

const http = require('http').Server(app);
const path = require('path');
const compression = require('compression');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config');
const io = require('socket.io')(http);

app.use(compression());


io.on('connection', (socket) => {
  console.log('A user just connected!');

  socket.on('hoverOn', i => io.emit('hoverOn', i));
  socket.on('hoverOff', i => io.emit('hoverOff', i));
});


const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 4000 : process.env.PORT;

if (isDeveloping) {
  console.log('Development mode!');
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'public',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  app.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(path.join(__dirname, '/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

http.listen(port, () => console.log(`Running at http://localhost:${port}`));
