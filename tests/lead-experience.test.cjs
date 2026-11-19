const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
test('Both enquiry forms retain consent, phone metadata and useful autocomplete',()=>{
 const forms=[...html.matchAll(/<form\b[^>]*data-demo-form[^>]*>([\s\S]*?)<\/form>/g)];assert.equal(forms.length,2);
 for(const [,body]of forms){const phone=body.match(/<input type="tel"[^>]*>/)?.[0]||'';assert.match(phone,/inputmode="tel"/);assert.match(phone,/autocomplete="tel"/);assert.match(phone,/required/);assert.doesNotMatch(phone,/\+7 ___/);assert.match(body,/name="personal-data" required/);assert.match(body,/name="terms" required/);}
});
test('All original enquiry intents remain available and FAQ starts closed',()=>{
 for(const id of ['selection','tour','installment','promotion'])assert.ok(html.includes('value="'+id+'"'),id);
 assert.doesNotMatch(html,/<details\s+open/);assert.equal((html.match(/<details>/g)||[]).length,11);
});
