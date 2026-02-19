import { createFocusTrap } from 'focus-trap';

export const trapFocus = (element: HTMLElement) => {
  return createFocusTrap(element);
};

console.log('Accessibility Devkit Components package loaded.');
