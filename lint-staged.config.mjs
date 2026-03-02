/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  "*.{js,jsx,ts,tsx,cjs,mjs,json,jsonc}": "biome check --write --unsafe",
};
