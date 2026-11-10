const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  devtool: "eval-source-map",
  devServer: {
    static: "./dist",
    port: 8080,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      title: "Little List"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};