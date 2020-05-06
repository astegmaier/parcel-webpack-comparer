const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode !== "development"; // default to production if nothing is specified.
  const useTsc = argv.compiler === "tsc"; // default to transpiling with babel unless tsc is specified.
  const typeCheck = false; // default to no typechecking (for apples-to-apples comparison with parcel).
  const raw = argv.raw; // if --raw is passed, disable minifcation in production so we can examine scope-hoisting behavior.

  const rules = useTsc
    ? [
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: !typeCheck || !isProduction, // In development typescript checking (if enabled) and linting are handled by ForkTsCheckerWebpackPlugin.
              onlyCompileBundledFiles: true,
            },
          },
          sideEffects: false, // This increases the effectiveness of tree-shaking (see: https://webpack.js.org/guides/tree-shaking/#conclusion)
          exclude: /node_modules/,
        },
      ]
    : [
        {
          test: /\.m?(j|t)sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        },
      ];

  /** Common configuration options. */
  const config = {
    mode: isProduction ? "production" : "development",
    entry: {
      main: "./src/index.ts",
    },
    devtool: "source-map",
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist-webpack"),
    },
    module: { rules },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.join(__dirname, "/src/index-webpack.html"),
        chunks: ["main"],
        inject: "body",
      }),
    ],
  };

  /** Additional configuration for production builds. */
  if (isProduction) {
    const { CleanWebpackPlugin } = require("clean-webpack-plugin");
    config.plugins.push(new CleanWebpackPlugin());
    if (raw) {
      config.optimization = Object.assign({}, config.optimization, {
        minimize: false,
      });
    }
  }

  /** Additional configuration for dev-mode builds. */
  if (!isProduction) {
    config.devServer = {
      contentBase: path.join(__dirname, "dist"),
      historyApiFallback: true,
      port: 3005,
      openPage: ["index.html"],
    };
    if (typeCheck) {
      const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
      config.plugins.push(new ForkTsCheckerWebpackPlugin());
    }
  }

  return config;
};
