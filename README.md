# parcel-webpack-comparer

This project aims to make it a bit easier to compare bundle size and build times between Parcel2 and webpack.

There is a single app in the "src" folder. You can build it with Parcel2 (with default babel config) by running `yarn build:parcel`, and with webpack (with babel) by running `yarn build:webpack`.

After the build output is generated, you can run `yarn analyze` to generate a comparison of the build output using `source-map-explorer`. It will put `html` and `tsv` files in the `analyses` folder that show you makeup of each build output, plus two sets of diffs (showing things that are present in parcel's build, but not webpack's, and vice versa).

## simple-export branch

This branch is intended to test parcel and webpack's ability to tree-shake modules that contain re-export statements.

`src/node_modules/fake-package` contains a fake module that has the following re-export:

```js
export * from "./stuff";
```

`stuff.js` contains two functions:

```js
export function addStuff(a, b) {
  console.log("Adding some stuff:", a, b);
  return a + b;
}

export function multiplyStuff(a, b) {
  console.log("Multiplying some stuff:", a, b);
  return a * b;
}
```

Only one of those function is actually used by the app. The goal is to see if parcel and webpack will tree-shake the unused function.
