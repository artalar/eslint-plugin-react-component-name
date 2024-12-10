import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import rule from "./react-component-name.js";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const options = [{ targets: ["memo", "forwardRef", "observer"] }];
const errors = [{ messageId: "noAnonymousFunction" }];

ruleTester.run(
  "react-component-name",
  // @ts-ignore TODO
  rule,
  {
    valid: [
      {
        code: "const MyComponent = () => <div />;",
        options,
      },
      {
        code: "const MyComponent = React.memo(function MyComponent() { return <div />; });",
        options,
      },
      {
        code: "const MyComponent = React.forwardRef(function MyComponent() { return <div />; });",
        options,
      },
      {
        code: "const MyComponent = observer(function MyComponent() { return <div />; });",
        options,
      },
      {
        code: "const MyComponent = observer(SomeOtherComponent);",
        options,
      },
      {
        code: "export default memo(function MyComponent() { return <div />; });",
        options,
      },
      {
        code: "const MyComponent = memo(forwardRef(SomeOtherComponent));",
        options,
      },
      {
        code: "const MyComponent = memo(forwardRef(function MyComponent() { return <div />; }));",
        options,
      },
    ],
    invalid: [
      {
        code: "const MyComponent = React.memo(() => <div />);",
        options,
        errors,
        output:
          "const MyComponent = React.memo(function MyComponent() { return <div />; });",
      },
      {
        code: "const MyComponent = React.forwardRef((props, ref) => <div />);",
        options,
        errors,
        output:
          "const MyComponent = React.forwardRef(function MyComponent(props, ref) { return <div />; });",
      },
      {
        code: "const MyComponent = observer<T>(function Lalala(props) { return <div>{props.text}</div>; });",
        options,
        errors,
        output:
          "const MyComponent = observer<T>(function MyComponent(props) { return <div>{props.text}</div>; });",
      },
      {
        code: "const MyComponent = observer(() => { return <div />; });",
        options,
        errors,
        output:
          "const MyComponent = observer(function MyComponent() { return <div />; });",
      },
      {
        code: "export default observer(function () { return <div />; });",
        options,
        errors,
      },
      {
        code: `const MyComponent = observer(
  ({text}: {text: string}) => <div>{text}</div>,
);`,
        options,
        errors,
        output: `const MyComponent = observer(
  function MyComponent({text}: {text: string}) { return <div>{text}</div>; },
);`,
      },
      {
        code: "const MyComponent = memo(forwardRef<T>((props, ref) => <div />));",
        options,
        errors,
        output:
          "const MyComponent = memo(forwardRef<T>(function MyComponent(props, ref) { return <div />; }));",
      },
    ],
  }
);
