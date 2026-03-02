import { readFileSync } from "node:fs";
import yaml from "yaml";
import type { ZodObject } from "zod";

const locale = "zh_cn";

export const parseMeta = <T extends ZodObject>(
  schema: T,
  importMeta: ImportMeta,
) => {
  const file = readFileSync(
    new URL(
      importMeta.filename.replace(/\.(ts|js)$/, `.${locale}.yml`),
      importMeta.url,
    ),
    "utf-8",
  );
  return schema.parse(yaml.parse(file));
};
