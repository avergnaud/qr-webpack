const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    bundle: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
}
