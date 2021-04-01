import type { ExploreBundleResult, OutputFormat, ExploreResult, FileData } from "source-map-explorer/lib/types";
import { saveOutputs } from "./saveOutputs";

/**
 * Outputs "comparison" html/tsv/json files that reflect the increased size and number of assets in the "newBundle" compared with the "baselineBundle"
 * @param baseBundle The bundle you want to use as a baseline to understand what has been added to it.
 * @param baseBundleName A name for the baseline bundle.
 * @param comparisonBundle The bundle you want to compare to the "base" to see what additional assets/asset sizes it contains.
 * @param comparisonBundleName A name for the comparison bundle.
 * @param formats The desired format(s) of the resulting file(s) (e.g. ["html", "tsv"])
 * @param outputFolder The folder to which you want to save the analysis
 */
export function saveAdditionAnalyses(
  baseBundle: ExploreBundleResult,
  baseBundleName: string,
  comparisonBundle: ExploreBundleResult,
  comparisonBundleName: string,
  formats: OutputFormat[],
  outputFolder: string
) {
  const additionsToComparison = analyzeAdditions(baseBundle, comparisonBundle);
  const name = `${comparisonBundleName}.additionsTo.${baseBundleName}`;
  saveOutputs(`${outputFolder}/${name}`, additionsToComparison, formats, name);
}

/**
 * Builds a "comparison" ExploreResult that reflects the increased size and number of assets in the "comparisonBundle" compared with the "baseBundle"
 * @param baseBundle The bundle you want to use as a baseline to understand what has been added to it.
 * @param comparisonBundle The bundle you want to compare to the "base" to see what additional assets/asset sizes it contains.
 */
function analyzeAdditions(baseBundle: ExploreBundleResult, comparisonBundle: ExploreBundleResult): ExploreResult {
  // Create a baseline bundle where all the statistics reflect the difference between "baseline" and "new".
  const additionsBundle: ExploreBundleResult = {
    bundleName: comparisonBundle.bundleName,
    files: {},
    mappedBytes: Math.max(comparisonBundle.mappedBytes - baseBundle.mappedBytes, 0),
    unmappedBytes: Math.max((comparisonBundle.unmappedBytes ?? 0) - (baseBundle.unmappedBytes ?? 0), 0),
    eolBytes: Math.max(comparisonBundle.eolBytes - baseBundle.eolBytes, 0),
    sourceMapCommentBytes: Math.max(comparisonBundle.sourceMapCommentBytes - baseBundle.sourceMapCommentBytes, 0),
    totalBytes: Math.max(comparisonBundle.totalBytes - baseBundle.totalBytes, 0),
  };

  // Do the same analysis on each file.
  Object.entries(comparisonBundle.files).forEach(([newAssetName, newAssetInfo]) => {
    const baselineAssetInfo = baseBundle.files[newAssetName];
    // If a file is present on the baseline, calculate the increase in size in the new bundle.
    if (baselineAssetInfo) {
      const additionsAssetInfo: FileData = {
        size: Math.max(newAssetInfo.size - baselineAssetInfo.size, 0),
        coveredSize: Math.max((newAssetInfo.coveredSize ?? 0) - (baselineAssetInfo.coveredSize ?? 0), 0),
      };
      additionsBundle.files[newAssetName] = additionsAssetInfo;
    }

    // If the file is missing from the baseline, just copy its stats directly into the comparison.
    else {
      additionsBundle.files[newAssetName] = newAssetInfo;
    }
  });

  const additions: ExploreResult = { bundles: [], errors: [] };
  additions.bundles.push(additionsBundle);
  return additions;
}
