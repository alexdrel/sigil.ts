var webpack = require("webpack");

module.exports = {
  entry: {
    example: './examples/index.ts',
  },
  output: {
    filename: './examples/[name]/build/index.js'
  },

  resolve: {
    extensions: ['.ts' ]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
        }
      }
    ]
  },

  devtool: 'inline-source-map',
  devServer: {
    noInfo: false,
    stats: true
  }
}
