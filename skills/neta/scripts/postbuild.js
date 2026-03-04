import { cp } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { glob } from "glob";

const sourceDir = join(import.meta.dirname, "../src");
const distDir = join(import.meta.dirname, "../bin");

const cmdYamlFiles = await glob(
  pathToFileURL(join(sourceDir, "**/*.cmd.*.yml")).href,
).then((files) =>
  files.map((file) =>
    pathToFileURL(file).href.replace(pathToFileURL(sourceDir).href, ""),
  ),
);
const schemaYamlFiles = await glob(
  pathToFileURL(join(sourceDir, "**/schema.*.yml")).href,
).then((files) =>
  files.map((file) =>
    pathToFileURL(file).href.replace(pathToFileURL(sourceDir).href, ""),
  ),
);

for (const cmdYamlFile of cmdYamlFiles) {
  await cp(join(sourceDir, cmdYamlFile), join(distDir, cmdYamlFile));
}

for (const schemaYamlFile of schemaYamlFiles) {
  await cp(join(sourceDir, schemaYamlFile), join(distDir, schemaYamlFile));
}
