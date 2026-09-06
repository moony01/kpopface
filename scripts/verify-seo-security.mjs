import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(path, 'utf8');
const required = async (path, patterns) => {
  const source = await read(path);
  for (const pattern of patterns) {
    assert.match(source, pattern, `${path} is missing ${pattern}`);
  }
  return source;
};

const defaultLayout = await required('_layouts/default.html', [
  /name="description"/,
  /name="robots"/,
  /site\.baseurl/,
  /@tensorflow\/tfjs@4\.22\.0/,
  /@teachablemachine\/image@0\.8\.5/,
  /id=\{\{ site\.google_analytics \}\}/
]);
assert.doesNotMatch(defaultLayout, /@(?:tensorflow\/tfjs|teachablemachine\/image)@latest/);
assert.doesNotMatch(defaultLayout, /property="image"/);
assert.doesNotMatch(defaultLayout, /googletagmanager\.com\/gtag\/js\?id='{/);

await required('_includes/seo-head.html', [
  /rel="canonical"/,
  /property="og:image"/,
  /hreflang="x-default"/,
  /page\.robots contains 'noindex'/
]);
await required('_layouts/page-split.html', [/{% include seo-head\.html %}/, /result-security\.js/]);
await required('_layouts/privacy.html', [/{% include seo-head\.html %}/]);
await required('detail.html', [/robots: "noindex, nofollow"/]);
await required('404.html', [/robots: noindex/]);

const resultSecurity = await required('static/js/result-security.js', [
  /normalizePredictions/,
  /normalizePercent/,
  /MAX_IMAGE_LENGTH/,
  /parseStoredResult/
]);
assert.match(resultSecurity, /\['sm', 'jyp', 'yg'\]|AGENCY_NAMES/);

const comment = await required('static/js/comment.js', [
  /replyIndicator\.replaceChildren/,
  /replace\(\/\[&<>"'\]\//,
  /Number\.isSafeInteger\(commentId\)/
]);
assert.doesNotMatch(comment, /replyIndicator\.innerHTML\s*=\s*`/);

await required('static/js/page-router.js', [/parseStoredResult/, /allowedPages/]);
await required('static/js/analyzing.js', [/PageRouter\.requireResult\(\)/, /PageRouter\.navigateTo\('result'\)/]);
assert.doesNotMatch(await read('_includes/site-logo.html'), /href="\/kpopface\//);
await required('static/js/app.js', [/typeof Kakao !== 'undefined'/, /invalidImage/]);
await required('_headers', [/X-Content-Type-Options: nosniff/, /Content-Security-Policy-Report-Only/]);
await required('netlify.toml', [/\[\[headers\]\]/, /X-Content-Type-Options = "nosniff"/, /Content-Security-Policy-Report-Only/]);

const vercel = JSON.parse(await read('vercel.json'));
assert.ok(Array.isArray(vercel.headers) && vercel.headers.length > 0, 'Vercel headers are missing');
assert.ok(vercel.headers[0].headers.some((header) => header.key === 'X-Content-Type-Options'));

console.log('SEO/security static checks passed');
