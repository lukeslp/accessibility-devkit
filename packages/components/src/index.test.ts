import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { AccessibleMenu } from './index';

describe('AccessibleMenu', () => {
  let trigger: HTMLButtonElement;
  let menuElement: HTMLDivElement;
  let outsideButton: HTMLButtonElement;
  let menu: AccessibleMenu | undefined;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="trigger" type="button">Open menu</button>
      <div id="menu"><button role="menuitem" type="button">First item</button></div>
      <button id="outside" type="button">Outside action</button>
    `;
    trigger = document.querySelector<HTMLButtonElement>('#trigger')!;
    menuElement = document.querySelector<HTMLDivElement>('#menu')!;
    outsideButton = document.querySelector<HTMLButtonElement>('#outside')!;
  });

  afterEach(() => {
    menu?.destroy();
    document.body.innerHTML = '';
  });

  it('does not refocus the trigger when an outside click occurs while closed', () => {
    menu = new AccessibleMenu(trigger, menuElement);
    outsideButton.focus();

    outsideButton.click();

    expect(document.activeElement).toBe(outsideButton);
  });

  it('uses the custom item selector when opening the menu', () => {
    menuElement.innerHTML = '<button class="action" type="button">Custom item</button>';
    const customItem = menuElement.querySelector<HTMLButtonElement>('.action')!;
    menu = new AccessibleMenu(trigger, menuElement, '.action');

    menu.open();

    expect(document.activeElement).toBe(customItem);
  });

  it('removes the trigger listener when destroyed', () => {
    menu = new AccessibleMenu(trigger, menuElement);
    menu.destroy();

    trigger.click();

    expect(menu.isOpen()).toBe(false);
  });

  it('removes document listeners when destroyed', () => {
    menu = new AccessibleMenu(trigger, menuElement);
    menu.destroy();
    menu.open();
    outsideButton.focus();

    outsideButton.click();

    expect(menu.isOpen()).toBe(true);
    expect(document.activeElement).toBe(outsideButton);
  });
});
