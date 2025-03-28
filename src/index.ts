import reactComponentNameRule from "./rules/react-component-name.js";
import type {ESLint} from "eslint";

export const rules = {
  "react-component-name": reactComponentNameRule,
};

export const flatPlugin = {
  meta: {
    name: "react-component-name",
    version: "0.1.0",
  },
  rules,
} satisfies ESLint.Plugin;

export const configs = {
  recommended: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: {
      "react-component-name/react-component-name": [
        2,
        { targets: ["memo", "forwardRef"] },
      ],
    },
  },

  flat: {
    recommended: {
      plugins: {
        'react-component-name': flatPlugin,
      },
      rules: {
        "react-component-name/react-component-name": [
          2,
          { targets: ["memo", "forwardRef"] },
        ],
      },
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
  },
} satisfies {
  recommended: import('eslint').Linter.LegacyConfig,
  flat: {
    recommended: import('eslint').Linter.FlatConfig,
  }
};
