const {chromium}=require('/Users/songer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..');
const out=path.resolve(__dirname,'../evidence');fs.mkdirSync(out,{recursive:true});
const evidence={task:'ART-ARCHIVE-MATERIALS-055',scope:'Isolated material preview; current public reader controls, fixture text, no campaign or real saves.',cases:[],errors:[],sources:{}};
const styles=JSON.parse(fs.readFileSync(path.join(__dirname,'source-styles.json')));
const tracked=['story-search.js','story-search-assets.js',...styles,'source-art/ART-ARCHIVE-MATERIALS-055/demo/materials.css','source-art/ART-ARCHIVE-MATERIALS-055/demo/index.html'];
for(const p of tracked)evidence.sources[p]=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1');
 const target=path.resolve(root,'.'+decodeURIComponent(url.pathname));
 if(!target.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.md':'text/plain; charset=utf-8'})[path.extname(target)]||'application/octet-stream');res.end(fs.readFileSync(target));}catch{res.writeHead(404).end();}
});
const ready=p=>p.locator('dialog[data-state=ready]').waitFor();
const clickFolder=(p,tag,width)=>p.locator(`${width<=1000?'.search-archive-index':'.search-props'} [data-search-reveal="folio-${tag}"]`).click();
async function validatePage(p,width){
 const v=await p.evaluate(()=>{
  const d=document.querySelector('dialog'),s=d.querySelector('.search-archive-sheet');
  const r=d.getBoundingClientRect();return{overflow:document.documentElement.scrollWidth>innerWidth||d.scrollWidth>d.clientWidth+1,inside:r.left>=-1&&r.right<=innerWidth+1&&r.top>=-1&&r.bottom<=innerHeight+1,sheetBackground:s&&getComputedStyle(s).backgroundImage,bodyFont:s&&getComputedStyle(s.querySelector('.search-doc-part p')).fontSize};
 });
 assert.equal(v.overflow,false);assert.equal(v.inside,true);if(v.sheetBackground){assert.match(v.sheetBackground,/archive-paper-ivory/);assert.ok(parseFloat(v.bodyFont)>=17);}
 if(width>1000){
  const labels=await p.locator('.search-cover-tag').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{tag:e.textContent,hit:hit?.closest('[data-search-reveal]')?.dataset.searchReveal};}));
  for(const label of labels)assert.equal(label.hit,'folio-'+label.tag);
 }
 return v;
}
(async()=>{
 let browser;
 try{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  browser=await chromium.launch({channel:'chrome',headless:true});
  evidence.browser=browser.version();
  const base=`http://127.0.0.1:${server.address().port}/source-art/ART-ARCHIVE-MATERIALS-055/demo/index.html`;
  for(const [width,height] of [[1440,900],[390,844]]){
   const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce',hasTouch:width<1000});
   const p=await context.newPage();p.on('pageerror',e=>evidence.errors.push(e.message));
   await p.goto(base+'?auto');await ready(p);
   await p.screenshot({path:path.join(out,`new-${width}-initial.png`)});
   await validatePage(p,width);
   for(const tag of ['0423','0424','0425','0426','0427','0428','0429']){
    await clickFolder(p,tag,width);
    await p.locator('.search-record-number').filter({hasText:tag}).waitFor();
    const state=await validatePage(p,width);
    if(tag==='0426'||tag==='0428')await p.screenshot({path:path.join(out,`new-${width}-${tag}.png`)});
    if(tag==='0428')assert.match(await p.locator('[data-kind=note]').evaluate(e=>getComputedStyle(e).backgroundImage),/archive-paper-note/);
    if(tag!=='0426')assert.equal(await p.locator('[data-search-collect]').count(),0);
    evidence.cases.push({width,height,tag,pass:true,...state});
    if(width<=760)await p.locator('.search-reader-back-top').click();
   }
   await clickFolder(p,'0426',width);
   await p.locator('[data-search-collect]').click();
   assert.deepEqual(await p.evaluate(()=>previewEvents.collected),['sealed-order']);
   assert.equal(await p.evaluate(()=>previewEvents.completed),0);
   await p.locator('[data-search-continue]:visible').first().click();
   assert.equal(await p.evaluate(()=>previewEvents.completed),1);
   assert.equal(await p.evaluate(()=>localStorage.length),0);
   await context.close();
  }
  const old=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});await old.goto(base+'?auto&material=old');await ready(old);await clickFolder(old,'0426',1440);await old.screenshot({path:path.join(out,'old-1440-0426.png')});await old.close();
  const fallback=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await fallback.route('**/archive-paper-*.webp',r=>r.abort());await fallback.goto(base+'?auto');await ready(fallback);await clickFolder(fallback,'0428',390);assert.equal(await fallback.locator('.search-archive-sheet').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(233, 223, 198)');assert.ok(await fallback.locator('.search-reader-back-top').isVisible());await fallback.screenshot({path:path.join(out,'fallback-390-0428.png')});await fallback.close();
  evidence.texture_failure_fallback='opaque CSS paper colors preserve readable text; back control works';
  assert.deepEqual(evidence.errors,[]);
  for(const [p,hash] of Object.entries(evidence.sources))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex'),hash,'Source changed during verification: '+p);
  evidence.status='PASS';
 }catch(error){evidence.status='FAIL';evidence.failure=error.stack;process.exitCode=1;}finally{if(browser)await browser.close();server.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify({status:evidence.status,cases:evidence.cases.length,failure:evidence.failure,output:out},null,2));}
})();
