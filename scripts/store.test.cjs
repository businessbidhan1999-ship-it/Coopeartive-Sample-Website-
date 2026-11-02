const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const ts = require('typescript');
const Module = require('node:module');

test('file store boots without runtime data, serializes updates and recovers after failure', async () => {
  const code = ts.transpileModule(fs.readFileSync('src/lib/server/store.ts', 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  const original = process.cwd();
  const temporary = await fsp.mkdtemp(path.join(os.tmpdir(), 'mero-store-'));
  const compiled = new Module(path.join(original, 'store-check.cjs'));
  const originalRequire = compiled.require.bind(compiled);
  compiled.require = (name) => (name === 'server-only' ? {} : originalRequire(name));
  try {
    process.chdir(temporary);
    await fsp.mkdir('src/content', { recursive: true });
    await fsp.writeFile('src/content/settings.json', '{"name":"Sample"}');
    compiled._compile(code, 'store-check.cjs');
    const { readJSON, writeJSON, updateJSON } = compiled.exports;
    assert.deepEqual(await readJSON('settings'), { name: 'Sample' });
    assert.deepEqual(await readJSON('submissions/contacts'), []);
    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        updateJSON('submissions/contacts', (rows) => [...rows, i]),
      ),
    );
    assert.equal((await readJSON('submissions/contacts')).length, 10);
    await assert.rejects(() =>
      updateJSON('settings', () => {
        throw Error('Expected failure');
      }),
    );
    await writeJSON('settings', { name: 'Updated' });
    assert.deepEqual(await readJSON('settings'), { name: 'Updated' });
    await assert.rejects(() => readJSON('../private'));
    assert.deepEqual(
      (await fsp.readdir('data')).filter((file) => file.endsWith('.tmp')),
      [],
    );
  } finally {
    process.chdir(original);
    await fsp.rm(temporary, { recursive: true, force: true });
  }
});
