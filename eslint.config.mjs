import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // `eslint-config-prettier` must come LAST: it intentionally turns off
  // ESLint's formatting rules so they never conflict with `prettier --write`
  // during lint-staged runs.
  prettierConfig,
];

export default eslintConfig;
