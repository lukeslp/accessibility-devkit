import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

test('gives Codex desktop users a five-minute plugin quick start', async () => {
  const readme = await read('README.md');

  assert.match(readme, /## Five-minute quick start/i);
  assert.match(readme, /Codex desktop app/i);
  assert.match(readme, /Plugins Directory/i);
  assert.match(readme, /marketplace.*import|import.*marketplace/i);
  assert.match(readme, /\.claude-plugin\/marketplace\.json/);
  assert.match(
    readme,
    /\[OpenAI Plugins documentation\]\(https:\/\/learn\.chatgpt\.com\/docs\/plugins\)/,
  );
  assert.match(readme, /Review this interface for accessibility barriers/i);
  assert.match(readme, /Expected (result|output)/i);
  assert.match(readme, /Verif(y|ication)/i);
  assert.doesNotMatch(readme, /(?:^|\n)\s*codex plugin\b/im);
});

test('offers a repository-backed direct skill fallback and separate Claude commands', async () => {
  const readme = await read('README.md');

  assert.match(readme, /git clone https:\/\/github\.com\/lukeslp\/accessibility-devkit\.git/i);
  assert.match(readme, /\.agents\/skills\/accessibility/);
  assert.match(readme, /target="\$HOME\/\.agents\/skills\/accessibility"/);
  assert.match(readme, /\[ -e "\$target" \] \|\| \[ -L "\$target" \]/);
  assert.match(readme, /ls -ld "\$target"/);
  assert.match(readme, /remove only that entry with: rm/i);
  assert.match(readme, /different.*destination/i);
  assert.match(readme, /never overwrite.*nest/i);
  assert.match(readme, /\/plugin marketplace add lukeslp\/accessibility-devkit/);
  assert.match(readme, /\/plugin install accessibility@accessibility-devkit/);
});

test('the component review demonstrates every requested remediation without an overlay', async () => {
  const examplePath = path.join(root, 'examples/accessible-component-review.md');
  await access(examplePath);
  const example = await read('examples/accessible-component-review.md');

  assert.match(example, /## Before/i);
  assert.match(example, /## After/i);
  assert.match(example, /semantic/i);
  assert.match(example, /keyboard/i);
  assert.match(example, /focus/i);
  assert.match(example, /error recovery/i);
  assert.match(example, /target size/i);
  assert.match(example, /<button[^>]*type="submit"/i);
  assert.match(example, /\.focus\(\)/);
  assert.match(example, /aria-describedby/i);
  assert.match(example, /aria-live="polite"/i);
  assert.match(example, /min-(?:inline-)?size:\s*44px/i);
  assert.match(example, /min-(?:block-)?size:\s*44px/i);
  assert.doesNotMatch(example, /accessibility overlay/i);
});

test('keeps plugin, skill, and package identifiers valid for the quick start', async () => {
  const codex = JSON.parse(await read('.codex-plugin/plugin.json'));
  const claude = JSON.parse(await read('.claude-plugin/plugin.json'));
  const marketplace = JSON.parse(await read('.claude-plugin/marketplace.json'));
  const skill = await read('skills/accessibility/SKILL.md');
  const workspace = JSON.parse(await read('package.json'));
  const packages = await Promise.all(
    ['audit', 'components', 'accommodations'].map(async (name) =>
      JSON.parse(await read(`packages/${name}/package.json`)),
    ),
  );

  assert.equal(codex.name, 'accessibility');
  assert.equal(codex.skills, './skills/');
  assert.equal(claude.name, 'accessibility');
  assert.equal(marketplace.plugins[0].name, 'accessibility');
  assert.match(skill, /^---\nname: accessibility\ndescription: /);
  assert.deepEqual(
    packages.map(({ name }) => name),
    [
      '@accessibility-devkit/audit',
      '@accessibility-devkit/components',
      '@accessibility-devkit/accommodations',
    ],
  );
  assert.match(workspace.scripts.test, /tests\/docs\/adoption-quick-start\.test\.mjs/);
});

test('keeps canonical repository metadata accurate', async () => {
  const canonical = 'https://github.com/lukeslp/accessibility-devkit';
  const codex = JSON.parse(await read('.codex-plugin/plugin.json'));
  const claude = JSON.parse(await read('.claude-plugin/plugin.json'));
  const workspace = JSON.parse(await read('package.json'));
  const packages = await Promise.all(
    ['audit', 'components', 'accommodations'].map(async (name) =>
      JSON.parse(await read(`packages/${name}/package.json`)),
    ),
  );

  assert.equal(codex.repository, canonical);
  assert.equal(claude.repository, canonical);
  assert.equal(workspace.repository.url, `git+${canonical}.git`);
  assert.equal(codex.interface.privacyPolicyURL, undefined);
  assert.equal(codex.interface.termsOfServiceURL, undefined);
  for (const packageManifest of packages) {
    assert.equal(packageManifest.repository.url, `git+${canonical}.git`);
    assert.match(packageManifest.homepage, /\/tree\/master\/packages\//);
  }
});

test('runs a reproducible spelling check for the adoption documentation', async () => {
  const workspace = JSON.parse(await read('package.json'));
  const cspell = JSON.parse(await read('cspell.json'));

  assert.match(
    workspace.scripts.spelling,
    /^cspell --config cspell\.json README\.md examples\/accessible-component-review\.md$/,
  );
  assert.match(workspace.scripts.test, /pnpm spelling &&/);
  assert.ok(cspell.words.includes('Codex'));
  assert.ok(cspell.words.includes('WCAG'));
});
