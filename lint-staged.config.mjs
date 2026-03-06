/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  "*.{ts,tsx,json,jsonc}": "biome check --write --unsafe",
};
