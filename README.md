# parcel-webpack-comparer
This project aims to make it a bit easier to compare bundle size and build times between Parcel2 and webpack.

There is a single app in the "src" folder. You can build it with Parcel2 by running `yarn build:parcel`, and with webpack by running `yarn build:webpack`.

After the build output is generated, you can run `yarn analyze` to generate a comparison of the build output using `source-map-explorer`. It will put `html` and `tsv` files in the `analyses` folder that show you makeup of each build output, plus two sets of diffs (showing things that are present in parcel's build, but not webpack's, and vice versa).

## FluentUI Button Test Results

This branch tests the results of adding a single fluentUI `<button>` component.

Here's Parcel's build output (without a cache):
```
$ rimraf dist-parcel && parcel build src/index.html
✨ Built in 45.83s

dist-parcel/parcel-webpack-comparer.07d6a6b8.js                                       ⚠️  1.11 MB    20.24s
├── node_modules/react-dom/cjs/react-dom.production.min.js                              115.95 KB     1.58s
├── node_modules/popper.js/dist/esm/popper.js                                            86.41 KB     3.00s
├── node_modules/downshift/dist/downshift.esm.js                                         53.07 KB     4.18s
├── node_modules/@fluentui/react-northstar/dist/es/components/Dropdown/Dropdown.js       50.83 KB     1.25s
├── node_modules/@fluentui/react-bindings/dist/es/FocusZone/FocusZone.js                 36.25 KB     2.23s
├── node_modules/rtl-css-js/dist/esm/convert-096451b2.js                                 19.61 KB     1.84s
├── node_modules/@fluentui/react-northstar/dist/es/components/Popup/Popup.js             19.32 KB     2.68s
├── node_modules/@fluentui/react-bindings/dist/es/FocusZone/FocusTrapZone.js             19.03 KB     1.66s
├── node_modules/@fluentui/react-northstar/dist/es/components/Toolbar/Toolbar.js         18.58 KB     3.36s
└── node_modules/react-transition-group/esm/Transition.js                                16.26 KB     5.27s
└── + 1317 more assets                                                            

dist-parcel/index.html                                                                      263 B     1.95s
└── src/index.html                                                                          295 B      91ms
```

Here's Webpack's build output:
```
$ webpack --mode production --progress
Hash: bb64cdb78589655a7cf4
Version: webpack 4.43.0
Time: 24434ms
Built at: 04/30/2020 4:50:55 PM
             Asset       Size  Chunks                          Chunk Names
        index.html  238 bytes          [emitted]               
    main.bundle.js   1.21 MiB       0  [emitted]        [big]  main
main.bundle.js.map   3.44 MiB       0  [emitted] [dev]         main
Entrypoint main [big] = main.bundle.js main.bundle.js.map
 [22] ./node_modules/@fluentui/accessibility/dist/es/index.js + 15 modules 19.4 KiB {0} [built]
      |    16 modules
 [63] ./node_modules/@fluentui/react-northstar/dist/es/components/List/ListItem.js + 1 modules 9.56 KiB {0} [built]
      |    2 modules
 [70] ./node_modules/@fluentui/react-northstar/dist/es/components/Popup/Popup.js + 2 modules 20.2 KiB {0} [built]
      |    3 modules
[123] ./node_modules/@fluentui/react-northstar/dist/es/components/Chat/ChatMessage.js + 1 modules 12.3 KiB {0} [built]
      |    2 modules
[184] ./node_modules/@fluentui/react-northstar/dist/es/components/Provider/ProviderConsumer.js + 3 modules 1.65 KiB {0} [built]
      |    4 modules
[185] ./node_modules/@fluentui/react-northstar/dist/es/components/Animation/Animation.js + 3 modules 21.8 KiB {0} [built]
      |    4 modules
[186] ./node_modules/@fluentui/react-northstar/dist/es/components/Dropdown/Dropdown.js + 2 modules 112 KiB {0} [built]
      |    3 modules
[187] ./node_modules/@fluentui/react-northstar/dist/es/components/Checkbox/Checkbox.js + 1 modules 6.07 KiB {0} [built]
      |    2 modules
[188] ./node_modules/@fluentui/react-northstar/dist/es/components/Slider/Slider.js + 1 modules 8.98 KiB {0} [built]
      |    2 modules
[189] ./node_modules/@fluentui/react-northstar/dist/es/components/MenuButton/MenuButton.js + 1 modules 9.69 KiB {0} [built]
      |    2 modules
[262] ./node_modules/@fluentui/react-northstar/dist/es/components/Provider/Provider.js + 28 modules 35.4 KiB {0} [built]
      |    29 modules
[263] ./node_modules/@fluentui/react-northstar/dist/es/utils/createComponent.js + 1 modules 3.12 KiB {0} [built]
      |    2 modules
[264] ./node_modules/@fluentui/react-northstar/dist/es/components/Accordion/Accordion.js + 1 modules 12.4 KiB {0} [built]
      |    2 modules
[265] ./node_modules/@fluentui/react-northstar/dist/es/components/Debug/Debug.js + 1 modules 14.6 KiB {0} [built]
      |    2 modules
[643] ./src/index.tsx 493 bytes {0} [built]
    + 924 hidden modules
```

