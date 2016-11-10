/* eslint no-console: 0 */

const app = require('express')();
const http = require('http').Server(app);
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./webpack.config');
const prodConfig = require('./webpack.production.config');

const c = process.env.NODE_ENV === 'production' ? prodConfig : config;

const compiler = webpack(c);
const middleware = webpackMiddleware(compiler, {
  publicPath: c.output.publicPath,
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

const port = process.env.PORT || 4000;
http.listen(port, () => console.log(`Running at http://localhost:${port}`));
