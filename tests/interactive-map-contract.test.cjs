const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
test('All script sources and local page links resolve to actual files',()=>{
 for(const m of html.matchAll(/\b(?:src|href|data-src|poster)="([^"#][^"]*)"/g)){
  const p=m[1].split('?')[0];if(/^(?:https?:|tel:|mailto:|data:)/.test(p))continue;
  assert.ok(fs.existsSync(path.join(root,'dist',p)),p);
 }
});
test('English page and accessible labels have no untranslated Cyrillic',()=>{
 assert.match(html,/<html lang="en">/);
 const markup=html.replace(/<!--[\s\S]*?-->/g,'').replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'');
 assert.doesNotMatch(markup.replace(/<[^>]*>/g,''),/[А-Яа-яЁё]/);
 for(const m of markup.matchAll(/\b(?:alt|title|aria-label|placeholder|data-video-title|data-video-description)="([^"]*)"/g))assert.doesNotMatch(m[1],/[А-Яа-яЁё]/);
});
