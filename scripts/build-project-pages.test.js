'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { renderProjectPage, SPEC } = require('./build-project-pages');

const sample = {
  slug: 'demo-project',
  eyebrow: 'Product',
  title: 'Demo Project',
  lede: 'A one-line summary of the demo.',
  pills: ['React', 'Supabase'],
  problem: 'The problem being solved.',
  built: 'What was built to solve it.',
  outcome: 'The measurable outcome.',
};

test('renderProjectPage: complete self-contained HTML document', () => {
  const html = renderProjectPage(sample);
  assert.match(html, /<!DOCTYPE html>/i);
  assert.match(html, /<\/html>/i);
  assert.match(html, /Deep Ocean Tech/); // shared design system comment
});

test('renderProjectPage: renders title, lede, eyebrow, and all three narrative sections', () => {
  const html = renderProjectPage(sample);
  assert.match(html, /Demo Project/);
  assert.match(html, /one-line summary of the demo/);
  assert.match(html, /Product/);
  assert.match(html, /The problem being solved/);
  assert.match(html, /What was built to solve it/);
  assert.match(html, /The measurable outcome/);
});

test('renderProjectPage: renders each tech pill', () => {
  const html = renderProjectPage(sample);
  assert.match(html, /React/);
  assert.match(html, /Supabase/);
});

test('renderProjectPage: links back to the projects index and notes private source', () => {
  const html = renderProjectPage(sample);
  assert.match(html, /href="index\.html"/); // back link within projects/
  assert.match(html, /private/);
});

test('renderProjectPage: escapes HTML special characters in content', () => {
  const html = renderProjectPage({ ...sample, title: 'A & B <x>' });
  assert.doesNotMatch(html, /<x>/);
  assert.match(html, /A &amp; B/);
});

test('SPEC: covers the 11 planned projects with required fields', () => {
  assert.equal(SPEC.length, 11);
  for (const p of SPEC) {
    for (const k of ['slug', 'eyebrow', 'title', 'lede', 'pills', 'problem', 'built', 'outcome']) {
      assert.ok(p[k], `${p.slug} missing ${k}`);
    }
    assert.ok(Array.isArray(p.pills) && p.pills.length > 0, `${p.slug} needs pills`);
  }
});
