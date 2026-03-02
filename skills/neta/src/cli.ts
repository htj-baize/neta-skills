#!/usr/bin/env node
import { program } from "@commander-js/extra-typings";
import dotenv from "dotenv-flow";
import pkg from "../package.json" with { type: "json" };
import { buildCommands, loadCommands } from "./commands/load.ts";

// Load environment variables
dotenv.config();

program
  .name("neta")
  .description("NETA CLI - Neta API Client")
  .version(pkg.version);

const commands = await loadCommands(["verse", "community"]);
await buildCommands(
  program
    .option(
      "--token <string>",
      "neta token (default: from env NETA_TOKEN)",
      process.env["NETA_TOKEN"],
    )
    .option(
      "--api_base_url <string>",
      "api base url (default: from env NETA_API_BASE_URL)",
      process.env["NETA_API_BASE_URL"] || "https://api.talesofai.cn",
    )
    .option(
      "--manuscript_uuid <string>",
      "manuscript uuid (default: from env NETA_MANUSCRIPT_UUID)",
      process.env["NETA_MANUSCRIPT_UUID"],
    ),
  commands,
);
program.parse(process.argv);
