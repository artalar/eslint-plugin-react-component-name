import { Rule } from "eslint";
import { FunctionExpression, ArrowFunctionExpression } from "estree";

const handler =
  (context: Rule.RuleContext, target: string) =>
  (node: FunctionExpression | ArrowFunctionExpression): void => {
    // @ts-ignore TODO
    const parentVarName = (node.parent?.parent as any)?.id?.name; // Parent variable name
    // @ts-ignore TODO
    const functionName = node.id?.name; // Current function name

    if (!functionName || (parentVarName && functionName !== parentVarName)) {
      console.log('MATCH', target)
      context.report({
        node,
        message: "Function should have a name matching its parent variable.",
        fix: (fixer) => {
          const sourceCode = context.getSourceCode();
          const newName = parentVarName || "Anything";
          const params = node.params
            .map((param) => sourceCode.getText(param))
            .join(", ");

          if (node.type === "ArrowFunctionExpression") {
            const arrowBody = sourceCode.getText(node.body);
            const needsBrackets = node.body.type !== "BlockStatement";
            const newBody = needsBrackets
              ? `{ return ${arrowBody}; }`
              : arrowBody;
            return fixer.replaceText(
              node,
              `function ${newName}(${params}) ${newBody}`
            );
          }

          const functionBody = sourceCode.getText(node.body);
          return fixer.replaceText(
            node,
            `function ${newName}(${params}) ${functionBody}`
          );
        },
      });
    }
  };

const create: Rule.RuleModule["create"] = (context) => {
  const options = context.options[0] as { targets: string[] } | undefined;
  const targets = options?.targets || ["memo", "forwardRef"];

  const rules: Record<string, Rule.RuleListener> = {};
  for (const target of targets) {
    const selector = `CallExpression[callee.name="${target}"] > :function, CallExpression[callee.object.name="React"][callee.property.name="${target}"] > :function`;
    rules[selector] = handler(context, target);
  }

  return rules;
};

const rule: Rule.RuleModule = {
  create,
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure named functions are used with specific React helpers",
      category: "Best Practices",
      recommended: "error",
    },
    messages: {
      noAnonymousFunction:
        "Function should have a name matching its parent variable.",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          targets: {
            type: "array",
            items: { type: "string" },
            description: "List of React helpers to enforce named functions.",
          },
        },
        additionalProperties: false,
      },
    ],
  },
};

export default rule;
