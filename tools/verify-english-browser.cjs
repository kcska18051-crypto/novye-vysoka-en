const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const url=process.env.CHECK_URL||'http://127.0.0.1:4181/';
const out=path.resolve(__dirname,'../tmp/english-browser-qa');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch();const results=[];
 try{for(const width of (process.env.CHECK_WIDTHS||'320,390,768,1440').split(',').map(Number)){
  const context=await browser.newContext({viewport:{width,height:width>1000?1000:900},locale:'ru-RU',reducedMotion:'reduce'});
  const p=await context.newPage(),errors=[],bad=[],posts=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().startsWith(url)&&r.status()>=400)bad.push(r.status()+' '+r.url())});
  p.on('request',r=>{if(r.url().startsWith(url)&&!['GET','HEAD'].includes(r.method()))posts.push(r.url())});
  const response=await p.goto(url,{waitUntil:'networkidle'});assert.equal(response.status(),200);console.log('Loaded '+width);
  const scan=async label=>{
   const data=await p.evaluate(()=>({lang:document.documentElement.lang,w:innerWidth,s:document.documentElement.scrollWidth,text:document.body.innerText,attrs:[...document.querySelectorAll('[alt],[aria-label],[placeholder],[title]')].flatMap(e=>['alt','aria-label','placeholder','title'].map(k=>e.getAttribute(k)).filter(Boolean))}));
   assert.equal(data.lang,'en',label);assert.ok(data.s<=data.w+1,label+' overflow '+JSON.stringify({w:data.w,s:data.s}));
   assert.doesNotMatch(data.text,/[А-Яа-яЁё\u3400-\u9fff]/,label);for(const a of data.attrs)assert.doesNotMatch(a,/[А-Яа-яЁё\u3400-\u9fff]/,label);
  };
  await scan('initial');await p.screenshot({path:path.join(out,width+'-hero.png')});
  if(width<=768){await p.locator('.menu-button').click();await scan('menu');await p.locator('.menu-button').click();}
  await p.locator('.hero-actions [aria-controls="situation-plan-dialog"]').click();await p.locator('#situation-plan-dialog img').evaluate(i=>i.decode());await scan('situation');await p.keyboard.press('Escape');
  for(const tab of await p.locator('.journey-tab').all()){await tab.click();await scan('lifestyle');}
  for(const city of ['moscow','yaroslavl','rybinsk','uglich']){
   await p.locator(`[data-route-options="city"] [data-value="${city}"]`).click();
   for(const mode of ['car','bus','train']){await p.locator(`[data-route-options="mode"] [data-value="${mode}"]`).click();await scan('route '+city+mode);assert.match(await p.locator('[data-route-link]').getAttribute('href'),/rtext=/);}
  }
  for(const id of ['degtyaritsy','nikolo','vysoka','chernaya']){
   const region=p.locator(`[data-map-quarter="${id}"]`);await region.focus();await region.press('Enter');await p.locator('#qe-open-selected').click();
   await p.locator('#qe-plan').evaluate(i=>i.decode());await p.locator('#qe-plus').click();assert.equal(await p.locator('#qe-reset').innerText(),'150%');await scan('plan '+id);
   if(width===390&&id==='degtyaritsy')await p.screenshot({path:path.join(out,width+'-plan.png')});await p.locator('#qe-back').click();
  }
  for(const tab of await p.locator('[data-around-category]').all()){await tab.click();await scan('surroundings');}
  await p.locator('.faq-list summary').first().click();await scan('FAQ');
  await p.locator('.hero-actions [data-lead-intent="selection"]').click();
  for(const selector of ['#lead-dialog form','#tour form']){
   const form=p.locator(selector),phone=form.locator('input[type="tel"]');
   await form.locator('button[type="submit"]').click();assert.match(await phone.evaluate(e=>e.validationMessage),/Please complete/);
   await form.locator('[name="personal-data"]').check();await form.locator('[name="terms"]').check();
   for(const value of ['+44 7700 900123','+86 138 0013 8000','+7 (999) 123-45-67','+1 202 555 0123']){
    await phone.fill(value);assert.equal(await phone.inputValue(),value);await form.locator('button[type="submit"]').click();
    await p.waitForFunction(s=>document.querySelector(s+' .form-status').textContent.includes('Submission will be enabled'),selector);
    assert.equal(await form.locator('.form-success').isVisible(),false);
   }
   await phone.fill('7700900123');await form.locator('button[type="submit"]').click();assert.match(await phone.evaluate(e=>e.validationMessage),/country code/);
   await phone.fill('+44 7700 900123');assert.equal(await phone.evaluate(e=>e.validationMessage),'');await scan('form');
   if(selector.startsWith('#lead')){await p.screenshot({path:path.join(out,width+'-form.png')});await p.locator('.lead-dialog-close').click();}
  }
  const video=p.locator('.cinema-card[data-video-id="assets/video/swing-volga-client.mp4"]');await video.click();assert.equal(await p.locator('#video-dialog').evaluate(d=>d.open),true);assert.equal(await p.locator('#video-dialog video').evaluate(v=>v.muted),true);await scan('video');await p.locator('.video-dialog-close').click();
  await p.locator('.sound-control').click();await p.waitForFunction(()=>document.querySelector('.sound-control').getAttribute('aria-pressed')==='true');await p.locator('.sound-control').click();
  for(let y=0;y<await p.evaluate(()=>document.body.scrollHeight);y+=700){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(10);}
  await p.evaluate(()=>scrollTo(0,0));await scan('full page');await p.screenshot({path:path.join(out,width+'-full.png'),fullPage:true});
  assert.deepEqual(errors,[],'JavaScript errors');assert.deepEqual(bad,[],'HTTP errors');assert.deepEqual(posts,[],'unexpected submissions');
  results.push({width,routes:12,plans:4,scenes:9,internationalForms:2,passed:true});console.log('PASS '+width);await context.close();
 }}finally{await browser.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({url,results},null,2));}
})().catch(e=>{console.error(e);process.exitCode=1});
