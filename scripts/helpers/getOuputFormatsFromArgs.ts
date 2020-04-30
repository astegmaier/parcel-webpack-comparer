import type { OutputFormat } from "source-map-explorer/dist/types";
import { argv } from "yargs";

/**
 * Returns an array of valid OutputFormats (e.g. "html", "tsv", and/or "json"), given the command line arguments.
 * If no formats are specified, it will output ["html"].
 * @example "node-ts analyze.ts html tsv" will return the array ["html", "tsv"].
 */
export function getOutputFormatsFromArgs(): OutputFormat[] {
  const formats: OutputFormat[] = [];
  if (argv._.includes("html")) {
    formats.push("html");
  }
  if (argv._.includes("tsv")) {
    formats.push("tsv");
  }
  if (argv._.includes("json")) {
    formats.push("json");
  }
  if (formats.length === 0) {
    formats.push("html");
  }
  return formats;
}
