import { Rule } from "eslint";
import { FunctionExpression, ArrowFunctionExpression } from "estree";

const handler =
  (context: Rule.RuleContext, target: string) =>
  (node: FunctionExpression | ArrowFunctionExpression): void => {
    // @ts-ignore TODO
    let parent = node.parent?.parent;
    while (parent && parent.type !== "VariableDeclarator") {
      parent = parent.parent;
    }
    // @ts-ignore TODO
    const parentVarName = parent?.id?.name;

    // @ts-ignore TODO
    const functionName = node.id?.name;

    if (parentVarName ? functionName !== parentVarName : !functionName) {
      context.report({
        node,
        messageId: "noAnonymousFunction",
        fix:
          parentVarName &&
          ((fixer) => {
            const sourceCode = context.getSourceCode();
            const newName = parentVarName;
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
          }),
      });
    }
  };

const create: Rule.RuleModule["create"] = (context) => {
  const options = context.options[0] as { targets: string[] } | undefined;
  const targets = options?.targets || ["memo", "forwardRef"];

  const rules: Rule.RuleListener = {};
  for (const target of targets) {
    const selector = `CallExpression[callee.name="${target}"] > :function, CallExpression[callee.object.name="React"][callee.property.name="${target}"] > :function`;
    rules[selector] = handler(context, target);
  }

  return rules;
};

const rule = {
  create,
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure named functions are used with specific React helpers",
      category: "Best Practices",
      recommended: true,
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
            description:
              "List of a component decorators to enforce named functions.",
          },
        },
        additionalProperties: false,
      },
    ],
  },
} satisfies Rule.RuleModule;

export default rule;
