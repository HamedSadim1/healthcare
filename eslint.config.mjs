// Native flat-config — no `FlatCompat`.
//
// Earlier this config used `FlatCompat` from `@eslint/eslintrc` to bridge
// `next/core-web-vitals` and `next/typescript` into the ESLint 10 flat-config
// format. That crashed on every lint run with
// `TypeError: Converting circular structure to JSON` because `@eslint/eslintrc`
// v3 deep-stringifies configs during validation and trips over a self-reference
// inside `eslint-plugin-react` (cycle: plugins.react -> configs.flat -> plugins.react).
//
// `eslint-config-next@16` ships native flat-config arrays under subpath exports
// (`./core-web-vitals` and `./typescript`), so importing them directly side-steps
// FlatCompat's classic-config codepath and therefore the JSON.stringify cycle.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

// `eslint-plugin-react@7.x` (bundled by `eslint-config-next@16.2.10`) still
// relies on the legacy rule-context API (`context.getFilename()` etc.) that
// ESLint 10 removed. Each rule that touches those helpers aborts the whole
// lint run with `Error while loading rule: contextOrFilename.getFilename is
// not a function`. There is no v8+ of `eslint-plugin-react` on npm to upgrade
// to (latest is 7.37.5 — confirmed via `npm view eslint-plugin-react versions`).
//
// Strategy: disable the plugin's rules wholesale under ESLint 10, then
// re-enable a small set of correctness rules below that DO load cleanly.
// eslint-plugin-react is a TRANSITIVE dep of eslint-config-next and may not
// be hoisted to top-level node_modules, so we resolve it via `createRequire`
// anchored at eslint-config-next's package.json — npm hoisting becomes
// irrelevant.
import { createRequire } from "node:module";

// `import.meta.resolve("eslint-config-next/package.json")` would be the natural
// anchor but the package's `exports` map does NOT include `./package.json`,
// so Node rejects it with `ERR_PACKAGE_PATH_NOT_EXPORTED`. Using a subpath
// that IS in the exports map (`./core-web-vitals`) avoids that block.
const nextCoreWebVitalsUrl = import.meta.resolve(
  "eslint-config-next/core-web-vitals",
);

// eslint-plugin-react is a transitive dep of eslint-config-next and may not be
// hoisted to top-level node_modules. We try the nested copy first (anchored at
// eslint-config-next's directory) and fall back to top-level resolution if a
// future bump hoists it.
let react;
try {
  react = createRequire(nextCoreWebVitalsUrl)("eslint-plugin-react");
} catch {
  react = createRequire(import.meta.url)("eslint-plugin-react");
}

const reactRulesOff = Object.fromEntries(
  Object.keys(react.rules ?? {}).map((name) => [`react/${name}`, "off"]),
);

// Re-enable the correctness rules from eslint-plugin-react@7.x that DO load
// cleanly under ESLint 10 (they don't touch the removed context API).
for (const name of [
  "jsx-key",                // missing keys in lists (perf + correctness)
  "no-array-index-key",     // using array index as key (anti-pattern)
  "no-unknown-property",    // typo'd HTML attributes on JSX
  "jsx-no-undef",           // undeclared JSX components
  "no-danger",              // dangerouslySetInnerHTML usage
  "no-deprecated",          // deprecated React APIs
  "no-unescaped-entities",  // unescaped '>' / '}' / '>' in JSX text
  "jsx-no-duplicate-props", // duplicate attributes
]) {
  delete reactRulesOff[`react/${name}`];
}

// Fail LOUD if the override block came back empty. This guards against silent
// regression if a future bump of eslint-plugin-react / eslint-config-next
// changes the resolution path or the `react.rules` key shape.
if (Object.keys(reactRulesOff).length === 0) {
  throw new Error(
    "eslint.config.mjs: reactRulesOff is empty — the createRequire resolution " +
      "for eslint-plugin-react likely failed. Verify the package is reachable " +
      "from eslint-config-next/package.json.",
  );
}

export default [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      ...reactRulesOff,
      // TanStack Table (used in `components/table/DataTable.tsx`) is flagged
      // by `react-hooks/incompatible-library` under React 19. The warning is
      // overly cautious for our usage — the runtime is fully functional.
      "react-hooks/incompatible-library": "off",
      // Stylistic only. Many shadcn-style components use anonymous default
      // exports and we don't want to rename them all for a single lint
      // warning.
      "import/no-anonymous-default-export": "off",
    },
  },
  // `eslint-config-prettier` MUST come last: it intentionally turns off
  // ESLint's formatting rules so they never conflict with `prettier --write`
  // during lint-staged runs.
  prettierConfig,
];
