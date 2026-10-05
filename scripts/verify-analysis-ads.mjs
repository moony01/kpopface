import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const app = await readFile('static/js/app.js', 'utf8');
const frames = [];
const timers = [];
const requests = [];
let failNextRequest = false;

function element(slot, width = 320) {
  const attributes = { 'data-ad-slot': slot, 'data-ad-placement': slot };
  return {
    dataset: {}, style: {}, children: [], width,
    getAttribute(name) { return attributes[name]; },
    setAttribute(name, value) { attributes[name] = value; },
    getBoundingClientRect() { return { width: this.parentNode?.width ?? this.width }; },
    querySelector() { return this.children.find(child => child.className === 'adsbygoogle') || null; },
    appendChild(child) { child.parentNode = this; this.children.push(child); }
  };
}

const context = vm.createContext({
  document: { querySelector: () => null, createElement: () => element() },
  window: {
    location: { hostname: 'example.com', origin: 'https://example.com' },
    setTimeout: callback => timers.push(callback),
    adsbygoogle: { push() {
      if (failNextRequest) {
        failNextRequest = false;
        throw new Error('No slot size for availableWidth=0');
      }
      requests.push({});
    } }
  },
  requestAnimationFrame: callback => frames.push(callback),
  console
});
vm.runInContext(app.slice(0, app.indexOf('// T1.13:')), context);

function render() {
  while (frames.length) frames.shift()();
}

const loading = element('7822847481', 0);
const result = element('3138863990');
context.initializeAnalysisResultAd(loading);
render();
assert.equal(requests.length, 0, 'A zero-width ad must not be requested');
assert.equal(result.children.length, 0, 'The hidden result must have no ad element yet');
assert.equal(timers.length, 1, 'Zero width must schedule a retry');
loading.width = 320;
timers.shift()();
render();
assert.equal(requests.length, 1, 'The loading ad must initialize once width is available');
const loadingAd = loading.children[0];
assert.equal(loadingAd.getAttribute('data-ad-slot'), '7822847481');

failNextRequest = true;
context.initializeAnalysisResultAd(result);
render();
assert.equal(requests.length, 1, 'A failed AdSense push must not count as initialized');
assert.notEqual(result.children[0].dataset.adsenseInitialized, 'true');
timers.shift()();
render();
assert.equal(requests.length, 2, 'A slot-size error must recover on retry');
const resultAd = result.children[0];
assert.equal(resultAd.getAttribute('data-ad-slot'), '3138863990');
assert.notEqual(loadingAd, resultAd, 'Loading and result must own distinct ad nodes');

context.initializeAnalysisResultAd(loading);
context.initializeAnalysisResultAd(result);
render();
assert.equal(requests.length, 2, 'Repeated uploads must not refresh initialized ads');
assert.equal(loading.children.length, 1);
assert.equal(result.children.length, 1);
assert.equal(loadingAd.parentNode, loading, 'The loading ad must remain at its original position');
assert.equal(resultAd.parentNode, result, 'The result ad must remain at its original position');

for (const language of ['', 'en', 'ja', 'zh', 'de', 'es', 'fr', 'id', 'nl', 'pl', 'pt', 'ru', 'tr', 'uk', 'vi']) {
  const path = language ? `${language}/index.html` : 'index.html';
  const html = await readFile(path, 'utf8');
  assert.equal(html.split('include analysis-result-ad.html placement="loading"').length - 1, 1, `${path}: loading ad must appear once`);
  const tipMarkup = html.slice(html.indexOf('<div class="tip-box">'), html.indexOf('include analysis-result-ad.html placement="loading"'));
  assert.equal((tipMarkup.match(/<div\b/g) || []).length, (tipMarkup.match(/<\/div>/g) || []).length, `${path}: close the tip box before the loading ad`);
  assert.equal(html.split('include kpopface-report-cta.html').length - 1, 1, `${path}: shared result section must appear once`);
  assert.equal(html.includes('include analysis-result-ad.html placement="result"'), false, `${path}: no duplicate result ad outside the shared section`);
}

const resultSection = await readFile('_includes/kpopface-report-cta.html', 'utf8');
const resultAdInclude = 'include analysis-result-ad.html placement="result"';
assert.equal(resultSection.split(resultAdInclude).length - 1, 1);
assert.ok(resultSection.indexOf(resultAdInclude) < resultSection.indexOf('class="agency-ranking result-agency-ranking"'), 'Result ad must be above agency match rates');
assert.match(resultSection, /id="detail-cta-wrap"[^>]*hidden/, 'The undeployed report CTA must stay hidden');
assert.match(resultSection, /id="detail-analysis-btn"[^>]*disabled/, 'The undeployed report button must stay disabled');

for (const layout of ['default', 'page-split', 'privacy']) {
  const html = await readFile(`_layouts/${layout}.html`, 'utf8');
  const assets = [...html.matchAll(/(?:src|href)="([^"]*static\/(?:js|css)\/[^"?]+\.(?:js|css))([^\"]*)"/g)];
  assert.ok(assets.length > 0);
  for (const [, asset, query] of assets) {
    assert.equal(query, "?v={{ site.time | date: '%Y%m%d%H%M%S' }}", `${layout}: ${asset} must use the shared build version`);
  }
}
console.log('Ad/version regression checks passed: width retry, AdSense error recovery, stable separate slots, no refresh, loading below tips, result above ranking, hidden report CTA, 15 languages, versioned assets.');
