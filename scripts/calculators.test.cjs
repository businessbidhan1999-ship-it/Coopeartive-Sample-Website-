const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const Module = require('node:module');
const code = ts.transpileModule(fs.readFileSync('src/lib/utils.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const compiled = new Module('calculator-check');
compiled._compile(code, 'calculator-check.cjs');
const { calcEMI, calcFD, formatNPR } = compiled.exports;

test('loan estimate follows a reducing balance and handles zero interest', () => {
  const result = calcEMI(500000, 12, 36);
  assert.ok(Math.abs(result.emi - 16607.1549) < 0.01);
  assert.ok(Math.abs(result.total - result.interest - 500000) < 0.0001);
  assert.equal(calcEMI(12000, 0, 12).emi, 1000);
  assert.equal(calcEMI(12000, 0, 12).interest, 0);
});

test('fixed deposit estimate uses simple interest without invented tax assumptions', () => {
  assert.deepEqual(calcFD(100000, 8, 12), { interest: 8000, maturity: 108000 });
  assert.deepEqual(calcFD(100000, 0, 12), { interest: 0, maturity: 100000 });
});

test('invalid amounts, rates and terms fail explicitly', () => {
  for (const calculate of [calcEMI, calcFD]) {
    assert.throws(() => calculate(10000, 12, 0), RangeError);
    assert.throws(() => calculate(-10000, 12, 12), RangeError);
    assert.throws(() => calculate(10000, -1, 12), RangeError);
    assert.throws(() => calculate(NaN, 12, 12), RangeError);
  }
  assert.equal(formatNPR(1234567), 'NPR 12,34,567');
});
