import axe from 'axe-core';
import * as jsxA11y from 'eslint-plugin-jsx-a11y';

export const runAxe = (context: axe.ElementContext, options?: axe.RunOptions) => {
  return axe.run(context, options);
};

export const eslintPluginJsxA11y = jsxA11y;

console.log('Accessibility Devkit Audit package loaded.');
