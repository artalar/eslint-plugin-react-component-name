# eslint-plugin-react-component-name

## Motivation

- The default ESLint rules for React checking `displayName` property of a component, but has no autofix.
- There is a few bundlers which support automatic `displayName` inlining, but it isn't universal, as eslint rule.
- We want to support all kind of decorators like `observer` from 'mobx-react' or `reatomComponent` from '@reatom/npm-react'.
- It is important to use **named function** instead of additional `displayName`, to avoid ambiguity in error **stack traces**.

---

## Installation

Install the package using npm or yarn:

```bash
npm install eslint-plugin-react-component-name --save-dev
```

## Usage

Add the plugin to your `.eslintrc` configuration:

```json
{
  "plugins": ["react-component-name"],
  "extends": ["plugin:react-component-name/recommended"]
}
```

You can change the default rule setting (`memo`, `forwardRef`) by adding `targets` option in the rules section.

Also, if you are using "prefer-arrow-callback" rule, it is required to add `allowNamedFunctions` option to it.

```json
{
  "plugins": ["react-component-name"],
  "rules": {
    "prefer-arrow-callback": ["error", { "allowNamedFunctions": true }],

    "react-component-name/react-component-name": [
      "error",
      {
        "targets": ["memo", "forwardRef", "observer"]
      }
    ]
  }
}
```

## Examples

### Wrong Code

```javascript
const MyComponent = memo(() => {
  return <div>Hello</div>;
});

const MyRef = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

### Fixed Code

```javascript
const MyComponent = memo(function MyComponent() {
  return <div>Hello</div>;
});

const MyRef = forwardRef(function MyRef(props, ref) {
  return <input ref={ref} {...props} />;
});
```
