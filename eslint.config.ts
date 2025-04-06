import eslint from "@eslint/js";
import type { Linter } from "eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";
import airbnbTypescript from "eslint-config-airbnb-typescript";
import unicorn from "eslint-plugin-unicorn";

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  airbnbTypescript,
  eslintConfigPrettier,
  {
    ignores: [
      "**/.history",
      "**/.husky",
      "**/.vscode",
      "**/coverage",
      "**/dist",
      "**/node_modules",
    ],
  },
  {
    plugins: {
      typescriptEslint: tseslint.plugin,
      prettier,
      unicorn,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "import/prefer-default-export": "off",
      "no-console": "warn",
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": ["error"],
      "class-methods-use-this": "off",
      "no-underscore-dangle": "off",
      "unicorn/no-array-callback-reference": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-null": "off",
      "unicorn/number-literal-case": "off",
      "unicorn/numeric-separators-style": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          "allowList": {
            "acc": true,
            "env": true,
            "i": true,
            "j": true,
            "props": true,
            "Props": true
          }
        }
      ],
    },
  },
] satisfies Linter.Config[];
