declare module 'eslint-plugin-jsx-a11y' {
  import type { Rule } from 'eslint';

  const plugin: {
    rules: Record<string, Rule.RuleModule>;
    configs: {
      recommended: { rules: Record<string, string | [string, ...unknown[]]> };
      strict: { rules: Record<string, string | [string, ...unknown[]]> };
    };
  };
  export = plugin;
}
