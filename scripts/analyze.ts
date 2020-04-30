import { explore } from "source-map-explorer";
import rimraf from "rimraf";
import fs from "fs";
import assert from "assert";
import path from "path";
import { saveAdditionAnalyses, saveOutputs, getOutputFormatsFromArgs, BundleInfo } from "./helpers";

/** Where you want to output the analysis files. This script will clean this directory before outputting anything, so don't point it at a folder with files you want to keep! */
const OUTPUT_FOLDER: string = "analyses";

/** The location of the webpack bundle file */
const WEBPACK_BUNDLE_FILE: string = "dist-webpack/main.bundle.js";

/** The location of the folder containing parcel output. Because parcel will supply a different hash each time it builds, we will look for a .js file in this folder. */
const PARCEL_BUNDLE_FOLDER: string = "dist-parcel";

// Make sure we actually have a bundles to analyze.
const parcelOutput = fs.readdirSync("dist-parcel");
const parcelBundleFiles = parcelOutput.filter(fileName => path.extname(fileName) === ".js");
assert(parcelBundleFiles.length > 0, "We didn't find any parcel bundles to analyze. Try running 'yarn build:parcel'.");
assert(parcelBundleFiles.length === 1, "We found more than one parcel bundle in the parcel-dist folder. Delete the ones you don't want to analyze.")
const parcelBundleFile = path.join(PARCEL_BUNDLE_FOLDER, parcelBundleFiles[0]);
assert(fs.existsSync(WEBPACK_BUNDLE_FILE), "We didn't find any parcel bundles to analyze. Try running 'yarn build:webpack'.");

/** The location of the bundles you want to analyze and compare. */
const bundles: ReadonlyArray<BundleInfo> = [
  { bundleName: "parcel", bundleFile: parcelBundleFile },
  { bundleName: "webpack", bundleFile: WEBPACK_BUNDLE_FILE }
];

/**
 * We want to normalize file paths in a bundle result to eliminate differences between parcel and webpack output.
 * This allows us to correctly compare file sizes in between the two build tools.
 * Example webpack file path: webpack:///src/components/App.tsx
 * Example parcel file path: src/components/App.tsx
 */
const replaceMap = {
  "webpack:///": ""
};

/**
 * Uses source-map-explorer to analyze the tree-shaken, minified bundles in the BUNDLES constant.
 * It will output the analysis files to the folder defined in teh OUTPUT_FOLDER constant.
 * For each bundle pair, it will output "additionsTo" files in the desired formats that shows assets that are present in one bundle, but not in another.
 * For assets that are present in both bundles, the "additionsTo" will show the _increase_ in size in the first bundle, compared with the second.
 */
async function analyze() {
  console.log("Using source-map-explorer to analyze the bundles...");
  // Even though source-map-explorer, supports analyzing multiple bundles in a single "explore" call, we are not using this feature.
  // Each "result" here should have a _single_ bundle at <result>.bundles[0].
  const results = await Promise.all(bundles.map(bundleInfo => explore(bundleInfo.bundleFile, { replaceMap })));

  // If we were successful, delete the output directory and figure out what formats we need to save the results in.
  const outputFormats = getOutputFormatsFromArgs();
  rimraf.sync(OUTPUT_FOLDER);

  // Iterate through all the results and output the base and comparison results.
  results.forEach((baseResult, index, results) => {
    const baseName = bundles[index].bundleName;
    const baseBundle = baseResult.bundles[0];

    // Make sure we actually have a bundle to analyze.
    if (!baseBundle) {
      console.error(`source-map-explorer couldn't successfully analyze the ${baseName} bundle.`);
      return;
    }

    // Save the original result in the desired formats.
    saveOutputs(`${OUTPUT_FOLDER}/${baseName}`, baseResult, outputFormats);

    // Compare this result with all results to the right of it, and save them out.
    for (let comparisonIndex = index + 1; comparisonIndex < results.length; comparisonIndex++) {
      const comparisonBundle = results[comparisonIndex]?.bundles[0];
      const comparisonName = bundles[comparisonIndex]?.bundleName;

      // Don't continue with the comparison if (somehow), we don't have anything to compare it with.
      if (!comparisonBundle) break;

      // Save out an analysis of assets that are in the "comparison" results, but not in the "base" results.
      saveAdditionAnalyses(baseBundle, baseName, comparisonBundle, comparisonName, outputFormats, OUTPUT_FOLDER);

      // Save out an analysis of assets that are in the "base" results, but not in the "comparison" results.
      saveAdditionAnalyses(comparisonBundle, comparisonName, baseBundle, baseName, outputFormats, OUTPUT_FOLDER);
    }
  });
  console.log(`Done!`);
}

analyze().catch(e => console.error(e));
