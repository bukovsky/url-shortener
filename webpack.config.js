var webpack = require('webpack');

module.exports = {
    entry: "./client/main.js",
    output: {
      path: __dirname + '/public/build/',
      publicPath: "build/",
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: {
            loader: "babel-loader"
          },
          exclude: [/node_modules/, /public/]
        },
        {
          test: /\.less$/,
          use: [
            {loader: "style-loader"},
            {loader: "css-loader"},
            {loader: "less-loader"}
          ],
          exclude: [/node_modules/, /public/]
        }
      ]
    }
}