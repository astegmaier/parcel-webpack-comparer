const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode !== "development"; // default to production if nothing is specified.

  /** Common configuration options. */
  const config = {
    mode: isProduction ? "production" : "development",
    entry: {
      main: "./src/index.tsx",
    },
    devtool: "source-map",
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist-webpack")
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: !isProduction, // In development typescript checking and linting are handled by ForkTsCheckerWebpackPlugin.
              onlyCompileBundledFiles: true
            }
          },
          sideEffects: false, // This increases the effectiveness of tree-shaking (see: https://webpack.js.org/guides/tree-shaking/#conclusion)
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.join(__dirname, "/src/index-webpack.html"),
        chunks: ["main"],
        inject: "body"
      })
    ]
  };

  /** Additional configuration for production builds. */
  if (isProduction) {
    const { CleanWebpackPlugin } = require("clean-webpack-plugin");
    config.plugins.push(new CleanWebpackPlugin());
  }

  /** Additional configuration for dev-mode builds. */
  if (!isProduction) {
    const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
    config.devServer = {
      contentBase: path.join(__dirname, "dist"),
      historyApiFallback: true,
      port: 3005,
      openPage: ["index.html"]
    };
    config.plugins.push(new ForkTsCheckerWebpackPlugin());
  }

  return config;
};
