/**
 * @module @accessibility-devkit/components
 * Accessible UI primitives: focus traps, roving tabindex, live-region
 * announcements, skip links, dialogs, and menus.
 */

import { createFocusTrap, type FocusTrap as FocusTrapInstance } from 'focus-trap';

// ============================================================
// Focus Trap
// ============================================================

export interface FocusTrapOptions {
  /** Element or selector to receive focus when the trap activates. */
  initialFocus?: HTMLElement | string | false;
  /** Whether clicking outside the trap is allowed (default: false). */
  allowOutsideClick?: boolean;
}

/**
 * Manages focus containment within a DOM element.
 * Essential for modals, dialogs, and off-canvas panels.
 *
 * @example
 * ```ts
 * const trap = new FocusTrap(document.getElementById('modal')!);
 * trap.activate();
 * // later:
 * trap.deactivate();
 * ```
 */
export class FocusTrap {
  private trap: FocusTrapInstance;

  constructor(element: HTMLElement | string, options: FocusTrapOptions = {}) {
    this.trap = createFocusTrap(element, {
      initialFocus: options.initialFocus as HTMLElement | string | undefined,
      returnFocusOnDeactivate: true,
      allowOutsideClick: options.allowOutsideClick ?? false,
    });
  }

  /** Activate the trap — focus moves inside and stays there. */
  activate(): void {
    this.trap.activate();
  }

  /** Deactivate the trap — focus returns to the trigger element. */
  deactivate(): void {
    this.trap.deactivate();
  }

  /** Pause the trap without deactivating (e.g. while a nested modal opens). */
  pause(): void {
    this.trap.pause();
  }

  /** Resume a paused trap. */
  unpause(): void {
    this.trap.unpause();
  }
}

// ============================================================
// Roving Tabindex
// ============================================================

/**
 * Creates a roving tabindex pattern for a group of related controls
 * (radio groups, toolbars, menu items, tab lists).
 *
 * Arrow keys move focus within the group; Tab leaves the group entirely.
 *
 * @param container - Parent element containing the managed items
 * @param selector - CSS selector for the focusable items inside the container
 * @returns Object with a `destroy()` method to remove event listeners
 *
 * @example
 * ```ts
 * const { destroy } = createRovingTabindex(toolbar, '[role="button"]');
 * // cleanup:
 * destroy();
 * ```
 */
export function createRovingTabindex(
  container: HTMLElement,
  selector: string
): { destroy: () => void } {
  function getItems(): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(selector));
  }

  function focusItem(item: HTMLElement): void {
    getItems().forEach((el) => el.setAttribute('tabindex', '-1'));
    item.setAttribute('tabindex', '0');
    item.focus();
  }

  function onKeyDown(e: KeyboardEvent): void {
    const items = getItems();
    const current = document.activeElement as HTMLElement;
    const index = items.indexOf(current);
    if (index === -1) return;

    const key = e.key;
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      e.preventDefault();
      focusItem(items[(index + 1) % items.length]);
    } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
      e.preventDefault();
      focusItem(items[(index - 1 + items.length) % items.length]);
    } else if (key === 'Home') {
      e.preventDefault();
      focusItem(items[0]);
    } else if (key === 'End') {
      e.preventDefault();
      focusItem(items[items.length - 1]);
    }
  }

  // Init: first item is tabbable, rest are not
  const initial = getItems();
  initial.forEach((el, i) => el.setAttribute('tabindex', i === 0 ? '0' : '-1'));
  container.addEventListener('keydown', onKeyDown);

  return {
    destroy() {
      container.removeEventListener('keydown', onKeyDown);
      getItems().forEach((el) => el.removeAttribute('tabindex'));
    },
  };
}

// ============================================================
// Screen Reader Announcements
// ============================================================

let _liveRegion: HTMLElement | null = null;

function ensureLiveRegion(): HTMLElement {
  if (!_liveRegion) {
    _liveRegion = document.createElement('div');
    _liveRegion.setAttribute('aria-live', 'polite');
    _liveRegion.setAttribute('aria-atomic', 'true');
    Object.assign(_liveRegion.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      margin: '-1px',
      padding: '0',
      overflow: 'hidden',
      clip: 'rect(0,0,0,0)',
      whiteSpace: 'nowrap',
      border: '0',
    });
    document.body.appendChild(_liveRegion);
  }
  return _liveRegion;
}

/**
 * Sends a message to screen readers via an ARIA live region.
 *
 * @param message - Text to announce
 * @param politeness - 'polite' waits for idle; 'assertive' interrupts immediately
 *
 * @example
 * ```ts
 * announceToScreenReader('Item saved successfully');
 * announceToScreenReader('Error: form submission failed', 'assertive');
 * ```
 */
export function announceToScreenReader(
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
): void {
  const region = ensureLiveRegion();
  region.setAttribute('aria-live', politeness);
  region.textContent = '';
  // Force a DOM mutation so the screen reader registers the change
  requestAnimationFrame(() => {
    region.textContent = message;
  });
}

// ============================================================
// Skip Link
// ============================================================

/**
 * Creates a visually-hidden skip-to-main-content link for keyboard users.
 * The link becomes visible on focus.
 *
 * @param targetId - The `id` of the element to skip to
 * @param text - Link text (default: 'Skip to main content')
 * @returns The anchor element — insert it as the first child of `<body>`
 *
 * @example
 * ```ts
 * document.body.insertBefore(createSkipLink('main-content'), document.body.firstChild);
 * ```
 */
export function createSkipLink(
  targetId: string,
  text = 'Skip to main content'
): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = `#${targetId}`;
  link.textContent = text;
  Object.assign(link.style, {
    position: 'absolute',
    top: '-40px',
    left: '0',
    background: '#000000',
    color: '#ffffff',
    padding: '8px 16px',
    zIndex: '9999',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'top 0.15s',
  });
  link.addEventListener('focus', () => {
    link.style.top = '0';
  });
  link.addEventListener('blur', () => {
    link.style.top = '-40px';
  });
  return link;
}

// ============================================================
// Accessible Dialog
// ============================================================

export interface DialogOptions {
  /** CSS selector for the close button inside the dialog element. */
  closeSelector?: string;
  /** Whether pressing Escape closes the dialog (default: true). */
  closeOnEscape?: boolean;
  /** Callback fired when the dialog opens. */
  onOpen?: () => void;
  /** Callback fired when the dialog closes. */
  onClose?: () => void;
}

/**
 * Wraps a `<dialog>` or `role="dialog"` element with focus management,
 * ARIA attributes, and keyboard handling.
 *
 * @example
 * ```ts
 * const dialog = new AccessibleDialog(document.getElementById('my-dialog')!);
 * document.getElementById('open-btn')!.addEventListener('click', () => dialog.open());
 * ```
 */
export class AccessibleDialog {
  private element: HTMLElement;
  private trap: FocusTrap;
  private opts: Required<DialogOptions>;

  constructor(element: HTMLElement, options: DialogOptions = {}) {
    this.element = element;
    this.opts = {
      closeSelector: options.closeSelector ?? '[data-dialog-close]',
      closeOnEscape: options.closeOnEscape ?? true,
      onOpen: options.onOpen ?? (() => undefined),
      onClose: options.onClose ?? (() => undefined),
    };
    this.trap = new FocusTrap(element);
    this.element.setAttribute('aria-modal', 'true');
    if (!this.element.getAttribute('role')) {
      this.element.setAttribute('role', 'dialog');
    }
    if (!this.element.hidden) {
      this.element.hidden = true;
    }
    this.bindEvents();
  }

  private bindEvents(): void {
    if (this.opts.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) this.close();
      });
    }
    const closeBtn = this.element.querySelector(this.opts.closeSelector);
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
  }

  /** Returns true if the dialog is currently visible. */
  isOpen(): boolean {
    return !this.element.hidden && this.element.getAttribute('aria-hidden') !== 'true';
  }

  /** Open the dialog and trap focus inside it. */
  open(): void {
    this.element.hidden = false;
    this.element.removeAttribute('aria-hidden');
    this.trap.activate();
    this.opts.onOpen();
  }

  /** Close the dialog and return focus to the trigger. */
  close(): void {
    this.element.hidden = true;
    this.element.setAttribute('aria-hidden', 'true');
    this.trap.deactivate();
    this.opts.onClose();
  }
}

// ============================================================
// Accessible Menu
// ============================================================

/**
 * Manages keyboard navigation and ARIA state for a disclosure-style menu.
 *
 * - Click trigger → toggles menu open/closed
 * - Escape → closes menu, returns focus to trigger
 * - Arrow keys within open menu → roving tabindex navigation
 * - Click outside → closes menu
 *
 * @example
 * ```ts
 * const menu = new AccessibleMenu(
 *   document.getElementById('menu-trigger')!,
 *   document.getElementById('menu-list')!
 * );
 * ```
 */
export class AccessibleMenu {
  private trigger: HTMLElement;
  private menu: HTMLElement;
  private roving: { destroy: () => void } | null = null;

  constructor(
    trigger: HTMLElement,
    menu: HTMLElement,
    itemSelector = '[role="menuitem"]'
  ) {
    this.trigger = trigger;
    this.menu = menu;

    this.trigger.setAttribute('aria-haspopup', 'true');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('role', 'menu');
    this.menu.hidden = true;

    this.roving = createRovingTabindex(menu, itemSelector);

    this.trigger.addEventListener('click', () => this.toggle());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) this.close();
    });

    document.addEventListener('click', (e) => {
      const target = e.target as Node;
      if (!this.trigger.contains(target) && !this.menu.contains(target)) {
        this.close();
      }
    });
  }

  /** Returns true if the menu is currently visible. */
  isOpen(): boolean {
    return !this.menu.hidden;
  }

  /** Toggle open/closed. */
  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  /** Open the menu and focus the first item. */
  open(): void {
    this.menu.hidden = false;
    this.trigger.setAttribute('aria-expanded', 'true');
    const firstItem = this.menu.querySelector<HTMLElement>('[role="menuitem"]');
    firstItem?.focus();
  }

  /** Close the menu and return focus to the trigger. */
  close(): void {
    this.menu.hidden = true;
    this.trigger.setAttribute('aria-expanded', 'false');
    this.trigger.focus();
  }

  /** Remove all event listeners added by this instance. */
  destroy(): void {
    this.roving?.destroy();
  }
}
