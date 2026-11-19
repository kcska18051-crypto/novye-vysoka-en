const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
const original=require('./fixtures/russian-source-contract.json');
test('English copy preserves the five-neighbourhood scope and four named map regions',()=>{
 assert.match(html,/5 neighbourhoods|five neighbourhoods/i);
 assert.deepEqual([...html.matchAll(/data-map-quarter="([^"]+)"/g)].map(m=>m[1]),['degtyaritsy','chernaya','vysoka','nikolo']);
});
test('RUB pricing, deposit, repayment count and promotion dates retain source facts',()=>{
 assert.match(html,/45[ ,\u00a0]?000/);assert.match(html,/100\s*(?:m²|square metres)/);
 assert.match(html,/<dt>Initial payment<\/dt><dd>30<span>%<\/span><\/dd>/);
 assert.match(html,/<dt>Equal monthly payments<\/dt><dd>12<\/dd>/);
 assert.match(html,/30 October 2025/);assert.match(html,/31 December 2027/);
 assert.match(html,/one (?:plot|purchased plot)[\s\S]{0,60}one (?:entry|ticket)|each plot[\s\S]{0,60}(?:entry|ticket)/i);
});
test('Every translated route preserves its source numbers and external source URLs',()=>{
 const box={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'dist/transport-approved-data.js'),'utf8'),box);const data=box.window.TRIP_PLANNER_DATA;
 assert.deepEqual(Object.keys(data.routes),Object.keys(original.routes));
 assert.equal(data.destination.address,original.destination.address);
 for(const [id,r] of Object.entries(data.routes)){
  const expected=original.routes[id];assert.equal(r.totalMinutes,expected.totalMinutes,id);assert.equal(r.alternative??null,expected.alternative,id);
  assert.equal(r.steps.length,expected.steps.length,id);
  r.steps.forEach((s,i)=>{assert.deepEqual((s.title+' '+s.text+' '+(s.time||'')).match(/\d+/g)||[],expected.steps[i].numbers,id+' step '+i);assert.equal(s.source??null,expected.steps[i].source,id);});
 }
});
test('Translation preserves all map item IDs, geometry, categories and media choices',()=>{
 const data=require('../dist/map-data.js');const actual=[...data.quarters,...data.objects].map(i=>({id:i.id,x:i.x,y:i.y,category:i.category,image:i.image??null,imageFallback:i.imageFallback??null}));
 assert.deepEqual(actual,original.items);
});
