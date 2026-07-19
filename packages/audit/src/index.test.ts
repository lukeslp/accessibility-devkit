import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { runAudit } from './index';

function setMarkup(markup: string): void {
  document.documentElement.lang = 'en';
  document.head.innerHTML = '<title>Audit fixture</title>';
  document.body.innerHTML = markup;
}

function violationIds(result: Awaited<ReturnType<typeof runAudit>>): string[] {
  return result.violations.map((violation) => violation.id);
}

afterEach(() => {
  document.body.innerHTML = '';
});

beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterAll(() => {
  vi.restoreAllMocks();
});

describe('runAudit', () => {
  it('reports no WCAG A or AA violations for valid markup', async () => {
    setMarkup(`
      <main id="fixture">
        <h1>Account settings</h1>
        <label for="email">Email address</label>
        <input id="email" type="email" />
        <button type="button">Save changes</button>
      </main>
    `);

    const result = await runAudit('#fixture');

    expect(result.summary.total).toBe(0);
  });

  it('reports invalid markup with an accessibility violation', async () => {
    setMarkup('<main id="fixture"><h1>Profile</h1><img src="profile.png" /></main>');

    const result = await runAudit('#fixture');

    expect(violationIds(result)).toContain('image-alt');
    expect(result.summary.total).toBeGreaterThan(0);
  });

  it('limits an audit to included selectors', async () => {
    setMarkup(`
      <main id="audited"><h1>Included content</h1><img src="good.png" alt="A mountain" /></main>
      <aside id="outside"><img src="missing-alt.png" /></aside>
    `);

    const result = await runAudit(document, { include: ['#audited'] });

    expect(violationIds(result)).not.toContain('image-alt');
  });

  it('removes excluded selectors from an audit', async () => {
    setMarkup(`
      <main id="fixture">
        <h1>Scoped content</h1>
        <img src="good.png" alt="A mountain" />
        <div id="legacy-widget"><img src="missing-alt.png" /></div>
      </main>
    `);

    const result = await runAudit('#fixture', { exclude: ['#legacy-widget'] });

    expect(violationIds(result)).not.toContain('image-alt');
  });
});
