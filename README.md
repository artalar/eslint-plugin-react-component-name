# eslint-plugin-react-component-name

## Introduction: Why This Rule Matters

React components and higher-order functions like `memo` or `forwardRef` often rely on naming conventions for better stack traces and debugging. The default ESLint rules for React suggest adding a `displayName` property to components. However, this approach has significant drawbacks:  
1. **Anonymous Functions in Stack Traces**: Despite adding `displayName`, error stack traces may still show "anonymous functions," making debugging challenging.  
2. **Redundant Configuration**: Adding `displayName` is a manual and error-prone process.  

Instead, **eslint-plugin-react-component-name** enforces proper function naming directly in your codebase, ensuring consistent, readable stack traces. ESLint is already a common tool in modern development workflows, making this approach more practical than relying on additional bundler plugins.

By using this plugin, you avoid ambiguous stack traces and streamline your development experience, ensuring your code adheres to best practices with minimal effort.

---

## Installation

Install the package using npm or yarn:

```bash
npm install eslint-plugin-react-component-name --save-dev
```

or

```bash
yarn add eslint-plugin-react-component-name --dev
```

---

## Usage

Add the plugin to your `.eslintrc` configuration:

```json
{
  "plugins": ["function-naming-rule"],
  "rules": {
    "function-naming-rule/function-naming-rule": [
      "error",
      {
        "targets": ["memo", "forwardRef", "observer"]
      }
    ]
  }
}
```

- **`targets`**: An array of React higher-order function names where named functions should be enforced. Defaults to `["memo"]`.

---

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

---

## Rule Details

This rule ensures that functions used with React helpers like `memo`, `forwardRef`, or `observer` are explicitly named. Unnamed (anonymous) functions are flagged, and ESLint can provide auto-fix suggestions by converting them into named functions that match the variable they are assigned to.

### Why Naming Matters
1. **Improved Stack Traces**: Named functions provide meaningful names in error stack traces, simplifying debugging.  
2. **Code Clarity**: Explicit naming enhances code readability, making it easier for developers to understand the intent.  

---

## Motivation for ESLint-Based Enforcement

Using ESLint for this task is more efficient and consistent than bundler-based solutions:  
- **Ecosystem Integration**: ESLint is already widely used for code linting, ensuring you don't need to rely on additional plugins or tools.  
- **Static Analysis**: ESLint enforces rules at the source code level, making it easier to detect and fix issues before they reach runtime.  
- **Tool Consolidation**: Avoids adding unnecessary complexity to your build pipeline with bundler plugins.

This plugin seamlessly integrates into your existing ESLint setup, enforcing best practices without additional overhead.
