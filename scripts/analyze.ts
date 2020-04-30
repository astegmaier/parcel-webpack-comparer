import { explore } from "source-map-explorer";
import rimraf from "rimraf";
import { saveAdditionAnalyses, saveOutputs, getOutputFormatsFromArgs, BundleInfo } from "./helpers";

/** Where you want to output the analysis files. This script will clean this directory before outputting anything, so don't point it at a folder with files you want to keep! */
const OUTPUT_FOLDER: string = "analyses";

/** The location of the bundles you want to analyze and compare. */
const BUNDLES: ReadonlyArray<BundleInfo> = [
  { bundleName: "parcel", bundleFile: "dist-parcel/parcel-webpack-comparer.55b3e4f7.js" },
  { bundleName: "webpack", bundleFile: "dist-webpack/main.bundle.js" }
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
  const results = await Promise.all(BUNDLES.map(bundleInfo => explore(bundleInfo.bundleFile, { replaceMap })));

  // If we were successful, delete the output directory and figure out what formats we need to save the results in.
  const outputFormats = getOutputFormatsFromArgs();
  rimraf.sync(OUTPUT_FOLDER);

  // Iterate through all the results and output the base and comparison results.
  results.forEach((baseResult, index, results) => {
    const baseName = BUNDLES[index].bundleName;
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
      const comparisonName = BUNDLES[comparisonIndex]?.bundleName;

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
