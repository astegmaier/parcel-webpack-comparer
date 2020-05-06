# parcel-webpack-comparer

This project aims to make it a bit easier to compare bundle size and build times between Parcel2 and webpack.

There is a single app in the "src" folder. You can build it with Parcel2 (with default babel config) by running `yarn build:parcel`, and with webpack (with babel) by running `yarn build:webpack`.

After the build output is generated, you can run `yarn analyze` to generate a comparison of the build output using `source-map-explorer`. It will put `html` and `tsv` files in the `analyses` folder that show you makeup of each build output, plus two sets of diffs (showing things that are present in parcel's build, but not webpack's, and vice versa).

## simple-export branch

This branch is intended to help narrow down the root cause of [issue #4565](https://github.com/parcel-bundler/parcel/issues/4565) and find the set of conditions where webpack will succeed at tree-shaking, but parcel will fail.

`src/node_modules/fake-package` has the following:

1. An index file that re-exports everything another file:

**index.js**

```js
export * from "./messages";
```

2. The file re-exported by `index.js` contains statement that re-export the default exports of some other files:

**messages.js**

```js
export { default as message1 } from "./message1";
export { default as message2 } from "./message2";
```

3. The default exports are the things returned by executing a function:

**message1.js**

```js
const getMessage1 = () => "Hello World!";
export default getMessage1();
```

**message2.js**

```js
const getMessage2 = () => "Goodbye World!";
export default getMessage2();
```

Then, in the main app, we import an use only one of the exports (`message1`):

**index.ts**

```ts
import { message1 } from "fake-package";

ready(() => {
  const root = document.getElementById("root");
  if (root) {
    root.textContent = message1;
  }
});

function ready(fn: () => void) {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
```

When the bundle is built by webpack with tree-shaking, but without minification (`yarn build:webpack:raw`), you can see that the output was successfully tree-shaked - `message2` / "Goodbye World!" is not present.

When the same bundle is built by parcel2 (`parcel build src/index.ts --noMinify`), `message2` / "Goodbye World!" is still in the bundle even though it is unused by the app.

Here is the bundle out put from parcel:

```js
(function () {
  // ASSET: /Users/Andrew/Projects/parcel-webpack-comparer/src/node_modules/fake-package/messages.js
  // ASSET: /Users/Andrew/Projects/parcel-webpack-comparer/src/node_modules/fake-package/message1.js
  const $ddbb96709a4990d332eedf0727c5879$var$getMessage1 = () => "Hello World!";

  var $ddbb96709a4990d332eedf0727c5879$export$default = $ddbb96709a4990d332eedf0727c5879$var$getMessage1();

  const $d3a229d82d83fefab2a3266a3adfcbac$var$getMessage2 = () =>
    "Goodbye World!";

  var $d3a229d82d83fefab2a3266a3adfcbac$export$default = $d3a229d82d83fefab2a3266a3adfcbac$var$getMessage2();
  $b04660a404e967a338647ceb28cef6e$var$ready(function () {
    var root = document.getElementById("root");

    if (root) {
      root.textContent = $ddbb96709a4990d332eedf0727c5879$export$default;
    }
  });

  function $b04660a404e967a338647ceb28cef6e$var$ready(fn) {
    if (document.readyState != "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }
})();
//# sourceMappingURL=parcel-webpack-comparer.5ad8aacb.js.map
```
