# parcel-webpack-comparer

This project aims to make it a bit easier to compare bundle size and build times between Parcel2 and webpack.

There is a single app in the "src" folder. You can build it with Parcel2 (with default babel config) by running `yarn build:parcel`, and with webpack (with babel) by running `yarn build:webpack`.

After the build output is generated, you can run `yarn analyze` to generate a comparison of the build output using `source-map-explorer`. It will put `html` and `tsv` files in the `analyses` folder that show you makeup of each build output, plus two sets of diffs (showing things that are present in parcel's build, but not webpack's, and vice versa).

## Bundle Size Test Results

| Scenario                                                                                      | Bundle Size |
| --------------------------------------------------------------------------------------------- | ----------- |
| Build with parcel (default babel config with scope-hoisting and minification)                 | 1.11 MB     |
| Build with webpack (`babel-loader` with scope-hoisting and minification)                      | 660 KiB     |
| Build with webpack (`ts-loader` with `module: es6` with scope-hoisting and minification)      | 660 KiB     |
| Build with webpack (`ts-loader` with `module: commonjs` with scope-hoisting and minification) | 1.21 KiB    |

By running `yarn analyze` after building both webpack and parcel, you can use `source-map-explorer` to see what is driving the increase in bundle size between parcel and webpack:

## Performance Test Results

Here's a comparison of Parcel v. Webpack build times in various scenarios.

All scenarios (both parcel and webpack) are:

- doing production builds (i.e. including tree-shaking, scope-hoisting, and minification)
- using babel for transpilation (with default config in `parcel` and `babel-loader` for webpack).
- generating sourcemaps.
- not doing any typechecking.
- On a MacBook Pro (13-inch, Early 2015) with 2.7 GHz Dual-Core Intel Core i5 and 16 GB RAM.

| Scenario                                     | Trial 1 | Trial 2 | Trial 3 | Average   |
| -------------------------------------------- | ------- | ------- | ------- | --------- |
| parcel build - no cache                      | 44.8s   | 43.7s   | 46.7s   | **45.1s** |
| parcel build - with cache, no changes        | 2.2s    | 2.2s    | 2.1s    | **2.2s**  |
| parcel build - with cache, one string change | 24.1s   | 24.3s   | 23.2s   | **23.9s** |
| webpack build - after clearing Terser cache  | 13.7s   | 13.2s   | 13.8s   | **13.6s** |
| webpack build - with Terser cache            | 7.4s    | 7.6s    | 7.9s    | **7.6s**  |
