# parcel-webpack-comparer

This project aims to make it a bit easier to compare bundle size and build times between Parcel2 and webpack.

There is a single app in the "src" folder. You can build it with Parcel2 (with default babel config) by running `yarn build:parcel`, and with webpack (with babel) by running `yarn build:webpack`.

After the build output is generated, you can run `yarn analyze` to generate a comparison of the build output using `source-map-explorer`. It will put `html` and `tsv` files in the `analyses` folder that show you makeup of each build output, plus two sets of diffs (showing things that are present in parcel's build, but not webpack's, and vice versa).

## Bundle Size Test Results

See [Parcel issue #4565](https://github.com/parcel-bundler/parcel/issues/4565#issuecomment-624240434) for a conversation on how to improve this.

| Scenario                                                                                      | Bundle Size |
| --------------------------------------------------------------------------------------------- | ----------- |
| Build with parcel (default babel config with scope-hoisting and minification)                 | 1.11 MB     |
| Build with webpack (`babel-loader` with scope-hoisting and minification)                      | 660 KiB     |
| Build with webpack (`ts-loader` with `module: es6` with scope-hoisting and minification)      | 660 KiB     |
| Build with webpack (`ts-loader` with `module: commonjs` with scope-hoisting and minification) | 1.21 KiB    |

## Performance Test Results

See [Parcel issue #4566](https://github.com/parcel-bundler/parcel/issues/4566#issuecomment-624262651) for a conversation on how to improve this.

Here's a comparison of Parcel v. Webpack build times in various scenarios.

All scenarios (both parcel and webpack) are:

- doing production builds (i.e. including tree-shaking, scope-hoisting, and minification)
- using babel for transpilation (with default config in `parcel` and `babel-loader` for webpack).
- generating sourcemaps.
- not doing any typechecking.
- On a MacBook Pro (13-inch, Early 2015) with 2.7 GHz Dual-Core Intel Core i5 and 16 GB RAM.

| Scenario                                     | Trial 1 | Trial 2 | Trial 3 | Average |
| -------------------------------------------- | ------- | ------- | ------- | ------- |
| parcel build - no cache                      | 21.1s   | 15.1s   | 15.2s   |         |
| parcel build - with cache, no changes        |         | 0.8s    | 1.6s    |         |
| parcel build - with cache, one string change |         |         | 6.2s    |         |
| webpack build - after clearing Terser cache  | 13.3s   |         |         |         |
| webpack build - with Terser cache            |         |         |         |         |

## Old Test Results

Here's a comparison of Parcel v. Webpack build times in various scenarios.

All scenarios (both parcel and webpack) are:

- doing production builds (i.e. including tree-shaking, scope-hoisting, and minification)
- using babel for transpilation (with default config in `parcel` and `babel-loader` for webpack).
- generating sourcemaps.
- not doing any typechecking.
- On a MacBook Pro (13-inch, Early 2015) with 2.7 GHz Dual-Core Intel Core i5 and 16 GB RAM.

| Scenario                                             | Trial 1 | Trial 2 | Trial 3 | Average   |
| ---------------------------------------------------- | ------- | ------- | ------- | --------- |
| parcel build - no cache                              | 44.8s   | 43.7s   | 46.7s   | **45.1s** |
| parcel build - with cache, no changes                | 2.2s    | 2.2s    | 2.1s    | **2.2s**  |
| parcel build - with cache, one string change         | 24.1s   | 24.3s   | 23.2s   | **23.9s** |
| webpack build - after clearing Terser cache          | 13.7s   | 13.2s   | 13.8s   | **13.6s** |
| webpack build - with Terser cache                    | 7.4s    | 7.6s    | 7.9s    | **7.6s**  |
| webpack build - with Terser cache, one string change | 13.3s   | 13.2s   | 13.4s   | **13.3s** |

One of the drivers of the decreased parcel speed in the above tests is an issue ([#4565](https://github.com/parcel-bundler/parcel/issues/4565)) where parcel is not as successful at tree-shaking as webpack. This affects performance because the bundles that must be packaged and optimized are larger than they need to be (1.1MB for parcel v. 6.66KiB for webpack). If you change the style of importing components from `@fluentui/react-northstar` to be more granular:

```typescript
import Box from "@fluentui/react-northstar/dist/es/components/Box/Box";
import Provider from "@fluentui/react-northstar/dist/es/components/Provider/Provider";
import teamsTheme from "@fluentui/react-northstar/dist/es/themes/teams";
```

...parcel's bundle size is significantly smaller (631KiB) and more comparable to webpack's (622Kib).

Here's the results from the same performance tests in this scenario:

| Scenario                                             | Trial 1 | Trial 2 | Trial 3 | Average   |
| ---------------------------------------------------- | ------- | ------- | ------- | --------- |
| parcel build - no cache                              | 35.8s   | 33.5s   | 33.4s   | **34.2s** |
| parcel build - with cache, no changes                | 2.1s    | 2.0s    | 2.1s    | **2.1s**  |
| parcel build - with cache, one string change         | 18.1s   | 19.3s   | 17.8s   | **18.4s** |
| webpack build - after clearing Terser cache          | 12.1s   | 11.2s   | 11.3s   | **11.5s** |
| webpack build - with Terser cache                    | 6.2s    | 6.1s    | 6.2s    | **6.2s**  |
| webpack build - with Terser cache, one string change | 11.5s   | 11.4s   | 11.2s   | **11.4s** |
