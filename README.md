# eslint-plugin-react-component-name

## Motivation

- **Autofix** based on variable name.
- **Better error traces** in console for debug.
- **Support for any High-order components** and compositions (e.g. MobX's `observer`, Reatom's `reatomComponent` or nesting like `memo(forwardRef(() => <div />))`)
- **Universal** solution based solely on ESLint.

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
        "targets": ["memo", "forwardRef", "reatomComponent" || "observer"]
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
