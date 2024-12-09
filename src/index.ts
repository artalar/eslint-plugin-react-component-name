import reactComponentNameRule from "./rules/react-component-name.js";

const rules = {
  "react-component-name": reactComponentNameRule,
};

const configs = {
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
};

export { rules, configs };
