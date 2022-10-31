const path = require('path');
const nodeExternals = require('webpack-node-externals');

('use strict');

module.exports = {
  mode: 'development',
  externals: [nodeExternals({})],
  entry: './dist/main.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'bundle.js'
  },
  target: 'node'
};
