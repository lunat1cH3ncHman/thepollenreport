const path = require("path");
const debug = process.env.NODE_DEV !== "production";
const webpack = require('webpack');

module.exports = {
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : null,
    entry:  './public/js/scripts.js',
    module: {
      loaders:[
        {
          loader: "babel-loader",

          // Skip any files that don't need babel
          include: [
            path.resolve(__dirname, "public/js/commentbox.js")
          ],
          exclude: /node_modules/,
          // ony run '.js' and '.jsx' files through babel
          test: /\.jsx?$/,

          query: {
            plugins: ['transform-runtime'],
            presets: ['es2015', 'react']
          }
        }
      ]
    },
    output: {
        path: __dirname + "/public/js",
        filename: 'scripts.min.js'
    },
    plugins: debug ? [new webpack.DefinePlugin({
                        'COMMENTS_API_URL': JSON.stringify('http://localhost:3000/api/v1/comments')
                      })]
                    :
                      [new webpack.DefinePlugin({
                        'COMMENTS_API_URL': JSON.stringify('http://thepollenreport.herokuapp.com/api/v1/comments')
                      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false})
    ]
};
