/* Shared shape matching: no dependencies, no persistence side effects. */
(() => {
'use strict';
const parts = {"gun": [{"id": "gun-0", "label": "本體", "x": 17.5, "y": 18.5625, "w": 46.625, "h": 55.74728, "crop": [77, 118, 414, 300]}, {"id": "gun-1", "label": "槍管外殼", "x": 58.75, "y": 21.8625, "w": 35.0, "h": 10.5, "crop": [26, 219, 462, 84]}, {"id": "gun-2", "label": "木握柄", "x": 15.25, "y": 41.04375, "w": 18.125, "h": 34.67762, "crop": [53, 56, 351, 407]}, {"id": "gun-3", "label": "菱形暮晶", "x": 36.5, "y": 23.71875, "w": 9.5, "h": 19.75703, "crop": [112, 73, 288, 363], "assembled": {"x": 36.5, "y": 23.71875, "w": 9.5, "h": 19.75703}}], "evac": [{"id": "evac-0", "label": "街口", "path": "assets/story/props/map-art/evac-0.webp", "shape": "M0 0H100V35Q65 25 65 50Q65 75 100 65V100H65Q75 65 50 65Q25 65 35 100H0Z", "x": 15, "y": 16, "w": 35, "h": 35}, {"id": "evac-1", "label": "通道", "path": "assets/story/props/map-art/evac-1.webp", "shape": "M0 0H100V100H65Q75 65 50 65Q25 65 35 100H0V65Q-35 75 -35 50Q-35 25 0 35Z", "x": 50, "y": 16, "w": 35, "h": 35}, {"id": "evac-2", "label": "高地", "path": "assets/story/props/map-art/evac-2.webp", "shape": "M0 0H35Q25 -35 50 -35Q75 -35 65 0H100V35Q65 25 65 50Q65 75 100 65V100H0Z", "x": 15, "y": 51, "w": 35, "h": 35}, {"id": "evac-3", "label": "接應處", "path": "assets/story/props/map-art/evac-3.webp", "shape": "M0 0H35Q25 -35 50 -35Q75 -35 65 0H100V100H0V65Q-35 75 -35 50Q-35 25 0 35Z", "x": 50, "y": 51, "w": 35, "h": 35}], "archive": [{"id": "archive-0", "label": "礦坑口", "path": "assets/story/props/map-art/archive-0.webp", "shape": "M0 0H100V35Q65 25 65 50Q65 75 100 65V100H65Q75 65 50 65Q25 65 35 100H0Z", "x": 15, "y": 16, "w": 35, "h": 35}, {"id": "archive-1", "label": "主坑道", "path": "assets/story/props/map-art/archive-1.webp", "shape": "M0 0H100V100H65Q75 65 50 65Q25 65 35 100H0V65Q-35 75 -35 50Q-35 25 0 35Z", "x": 50, "y": 16, "w": 35, "h": 35}, {"id": "archive-2", "label": "崩塌區", "path": "assets/story/props/map-art/archive-2.webp", "shape": "M0 0H35Q25 -35 50 -35Q75 -35 65 0H100V35Q65 25 65 50Q65 75 100 65V100H0Z", "x": 15, "y": 51, "w": 35, "h": 35}, {"id": "archive-3", "label": "結晶洞室", "path": "assets/story/props/map-art/archive-3.webp", "shape": "M0 0H35Q25 -35 50 -35Q75 -35 65 0H100V100H0V65Q-35 75 -35 50Q-35 25 0 35Z", "x": 50, "y": 51, "w": 35, "h": 35}], "recorder": [{"id": "recorder-0", "label": "供能接頭", "path": "assets/puzzles/recorder/recorder-0.svg", "shape": "M50 5L95 90H5Z", "x": 12, "y": 29, "w": 23, "h": 38}, {"id": "recorder-1", "label": "讀取模組", "path": "assets/puzzles/recorder/recorder-1.svg", "shape": "M10 10H70L90 30V90H10Z", "x": 39, "y": 29, "w": 23, "h": 38}, {"id": "recorder-2", "label": "輸出接頭", "path": "assets/puzzles/recorder/recorder-2.svg", "shape": "M30 5H70V25H95V75H70V95H30V75H5V25H30Z", "x": 66, "y": 29, "w": 23, "h": 38}]};
const scenes = {
 gun:{title:'伊芙 · 組裝暮晶銃',intro:'將四片外觀放入相符的輪廓。',done:'暮晶銃已拼合。伊芙握住博士留給她的武器。',note:''},
 evac:{title:'格蘭 · 撤離簡圖',intro:'出發前整理已勘查的路線。把各區圖塊放回對應輪廓，確認高地接應通道。',done:'備用路線已確認。暮鐘卻比推估更早響起，格蘭跟著隊伍放棄原集合點，轉往高地通道。',note:'簡圖只整理已知路況，不能預知夜域，也不是永久安全的保證。'},
 archive:{title:'迪普霍姆 · 礦坑地圖',intro:'把納爾瓦筆記裡的礦坑地圖圖塊放回對應的輪廓。',done:'地圖拼好了。納爾瓦標出的坑道，一路通往礦坑深處。',note:''},
 recorder:{title:'共同主線 · 修復錄音裝置',intro:'伊芙取出隨身的小型接線配件，將三個接頭放入相同形狀的插槽，修復納爾瓦留下的錄音裝置。',done:'伊芙接妥接頭，錄音裝置的指示燈重新亮起。裝置能播放，但只能播出還留在裡面的那一段。',note:'這裡只修復播放功能，不會確認納爾瓦如今的下落。'}
};
// Presentation-only task context; placement rules and story progress stay unchanged.
const taskContext = {
 gun:{goal:'拼合博士留下的暮晶銃。',ready:'選擇圖塊，放入相符輪廓。',complete:'四片已就位。'},
 evac:{goal:'拼合已勘查的撤離簡圖，確認高地接應通道。',ready:'檢視各區用途，將圖塊放回已知位置。',complete:'撤離簡圖已拼合，確認接應路線後繼續。'},
 archive:{goal:'把四塊地圖放回原位，找出納爾瓦走的坑道。',ready:'先看資料來源，再放回對應輪廓。',complete:'四份資料已歸位，繼續查看比對所得的線索。'},
 recorder:{goal:'錄音裝置的三條線路都斷了。接妥三個配件，讓它能再次播放。',ready:'斷線處還在冒細小的火花。核對每個接頭的用途，依輪廓裝入。',complete:'三條線路都接通了，指示燈亮起，喇叭網格後傳來細微的底噪。確認後繼續聽取錄音。'}
};
const partContext = {
 "gun-0": {"inspect": "深鋼與古銅裝飾的本體。", "done": "本體已就位。"},
 "gun-1": {"inspect": "帶有兩道古銅環的長形外殼。", "done": "槍管外殼已就位。"},
 "gun-2": {"inspect": "帶木紋與刻花的握柄。", "done": "木握柄已就位。"},
 "gun-3": {"inspect": "青綠色的菱形暮晶。", "done": "菱形暮晶已就位。"},
 "evac-0": {
  "inspect": "街口圖塊記錄出發一帶的路口，是辨認撤離路線的起點。",
  "done": "街口位置已標明，還要和通道、接應處一起核對。"
 },
 "evac-1": {
  "inspect": "通道連接原集合點與高地方向；先把已知路段放回簡圖。",
  "done": "通道圖塊已補回，這是隊伍轉往高地時要辨認的路段。"
 },
 "evac-2": {
  "inspect": "高地是備用撤離方向。位置確認不代表沿路永遠安全。",
  "done": "高地位置已標明，留作原集合點失效時的備用方向。"
 },
 "evac-3": {
  "inspect": "接應處是隊伍會合的位置，需要與其他路段一起核對。",
  "done": "接應處已圈出，出發前仍要把整條路線核對完整。"
 },
 "archive-0": {
  "inspect": "礦坑口與軌道旁的礦車場。",
  "done": "入口對上了。"
 },
 "archive-1": {
  "inspect": "主坑道與跨過裂縫的木棧橋。",
  "done": "主坑道對上了。"
 },
 "archive-2": {
  "inspect": "崩塌的坑道與翻倒的礦車。",
  "done": "崩塌區對上了。"
 },
 "archive-3": {
  "inspect": "結晶洞室與中央的豎井，最深處被圈了起來。",
  "done": "最深處的圈記，就是他要去的地方。"
 },
 "recorder-0": {
  "inspect": "供能接頭連接裝置的能源接口；接好一端不代表已可播放。",
  "done": "供能接頭「喀」地卡進插槽，電源線路亮了。還要接好其餘兩處。"
 },
 "recorder-1": {
  "inspect": "讀取模組用來讀取裝置中的既有紀錄，無法恢復遭刪除的內容。",
  "done": "讀取模組扣緊，讀取線路接通。能讀的，只有裝置裡還留著的紀錄。"
 },
 "recorder-2": {
  "inspect": "輸出接頭負責傳出聲音。其他接線都妥當後，才進入聆聽。",
  "done": "輸出接頭接妥，傳出聲音的線路通了。三處都接好才聽得到。"
 }
};
let active=null;
function open(id,{onComplete,completionText,practice=false,trigger=document.activeElement}={}){
 if(active || !scenes[id] || (id==='gun'&&!window.NDStorySearchAssets))return null;
 const isMap=id==='evac'||id==='archive',needsImages=id==='gun'||isMap||id==='recorder';
 const s=scenes[id],items=parts[id].map((p,index)=>id==='gun'?{...p,path:window.NDStorySearchAssets.props[p.id].path}:isMap?{...p,x:15+(index%2)*35,y:15+Math.floor(index/2)*35}:p),placed=new Set();let selected=null,finished=false,consumed=false,drag=null,suppressUntil=0,closed=false,loadToken=0;
 let cancelLoad=()=>{};
 const cropStyle=p=>{const [x,y,w,h]=p.crop||[0,0,512,512];return `--part-left:${-x/w*100}%;--part-top:${-y/h*100}%;--part-width:${512/w*100}%;--part-height:${512/h*100}%;--part-aspect:${w/h}`;};
 function slotMarkup(p){
  const position=`left:${p.x}%;top:${p.y}%;width:${p.w}%;height:${p.h}%`;
  if(id==='gun')return `<div class="puzzle-gun-part" data-part="${p.id}" style="${position};${cropStyle(p)}"><span class="puzzle-slot-art"><img alt="" hidden><img class="puzzle-alpha" alt="" aria-hidden="true" draggable="false"></span><span class="puzzle-outline" aria-hidden="true"><span class="puzzle-outline-box"><img class="puzzle-alpha" alt="" draggable="false"></span></span><button class="puzzle-slot" data-slot="${p.id}" style="--hit-width:${(p.hitW||p.w)/p.w*100}%;--hit-height:${(p.hitH||p.h)/p.h*100}%" aria-label="${p.label}的位置"><span>${p.label}</span></button></div>`;
  if(isMap)return `<div class="puzzle-map-part" data-part="${p.id}" style="${position}"><svg class="puzzle-map-clip" aria-hidden="true"><defs><clipPath id="puzzle-hit-${p.id}" clipPathUnits="objectBoundingBox"><path d="${p.shape}" transform="translate(${38/176} ${38/176}) scale(${1/176})"/></clipPath></defs></svg><button class="puzzle-slot" data-slot="${p.id}" style="clip-path:url(#puzzle-hit-${p.id})" aria-label="${p.label}的位置"><svg viewBox="-38 -38 176 176" aria-hidden="true"><path d="${p.shape}"/></svg><img alt="" hidden><span>${p.label}</span></button></div>`;
  if(id==='recorder')return `<button class="puzzle-slot" data-slot="${p.id}" style="${position}" aria-label="${p.label}的位置"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="socket-${p.id}" x2="0" y2="1"><stop stop-color="#020a09"/><stop offset="1" stop-color="#182a21"/></linearGradient></defs><path class="recorder-socket-depth" d="${p.shape}"/><path class="recorder-socket-well" d="${p.shape}" style="--socket-fill:url(#socket-${p.id})"/><path class="recorder-socket-contacts" d="M42 80v7m8-7v7m8-7v7"/></svg><img alt="" hidden><span>${p.label}</span></button>`;
  return `<button class="puzzle-slot" data-slot="${p.id}" style="${position}" aria-label="${p.label}的位置"><svg viewBox="-38 -38 176 176" aria-hidden="true"><path d="${p.shape}"/></svg><img src="${p.path}" alt="" hidden><span>${p.label}</span></button>`;
 }
 // Gun hit areas are enlarged independently; maps use a 100-unit tile inside 176-unit SVG padding.
 const slotVisual=slot=>id==='gun'||isMap?slot.parentElement:slot;
 const dialog=document.createElement('dialog');dialog.className='puzzle-dialog sq-dialog';dialog.dataset.sq='puzzle';dialog.setAttribute('aria-labelledby','puzzle-title');active=dialog;dialog.dataset.state=needsImages?'loading':'ready';
 if(id==='recorder')dialog.dataset.puzzle='recorder';
 const recorderDecor=id==='recorder'?`<svg class="recorder-circuits" viewBox="0 0 1000 606" preserveAspectRatio="none" aria-hidden="true"><g class="recorder-traces"><path class="rt rt0" d="M235 405v46h270"/><path class="rt rt1" d="M505 405v97H165v-25"/><path class="rt rt2" d="M775 405v68H505v-22"/><path class="rt-flow rt0" d="M235 405v46h270"/><path class="rt-flow rt1" d="M505 405v97H165v-25"/><path class="rt-flow rt2" d="M775 405v68H505v-22"/><path class="rt-conn" d="M165 463v26m10-26v26m10-26v26"/></g><g class="recorder-junctions"><circle cx="235" cy="451" r="5"/><circle cx="505" cy="451" r="5"/><circle cx="775" cy="473" r="5"/></g><g class="recorder-sparks"><circle class="rs rs0" cx="235" cy="408" r="4"/><circle class="rs rs1" cx="505" cy="408" r="4"/><circle class="rs rs2" cx="775" cy="408" r="4"/></g></svg><div class="recorder-eq recorder-eq-a" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="recorder-eq recorder-eq-b" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="recorder-indicators" aria-hidden="true"><i></i><i></i><i></i></div>`:'';
 // The part images carry a faint (alpha 1-10) halo far outside the visible object; the 10x-4 alpha ramp drops it so
 // silhouette and outline follow the real edge and match the assembled picture.
 const gunRingDefs='<svg class=\"puzzle-defs\" width=\"0\" height=\"0\" aria-hidden=\"true\" focusable=\"false\"><filter id=\"puzzle-gun-fill\" color-interpolation-filters=\"sRGB\"><feColorMatrix type=\"matrix\" values=\"0 0 0 0 0.027 0 0 0 0 0.063 0 0 0 0 0.055 0 0 0 10 -4\"/></filter><filter id=\"puzzle-gun-fill-hint\" color-interpolation-filters=\"sRGB\"><feColorMatrix type=\"matrix\" values=\"0 0 0 0 0.416 0 0 0 0 0.439 0 0 0 0 0.255 0 0 0 10 -4\"/></filter><filter id=\"puzzle-gun-ring\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\" color-interpolation-filters=\"sRGB\"><feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 10 -4\" result=\"solid\"/><feMorphology in=\"solid\" operator=\"dilate\" radius=\"1.5\" result=\"grown\"/><feComposite in=\"grown\" in2=\"solid\" operator=\"out\" result=\"edge\"/><feFlood flood-color=\"#839c8e\"/><feComposite in2=\"edge\" operator=\"in\"/></filter><filter id=\"puzzle-gun-ring-hint\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\" color-interpolation-filters=\"sRGB\"><feColorMatrix in=\"SourceAlpha\" type=\"matrix\" values=\"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 10 -4\" result=\"solid\"/><feMorphology in=\"solid\" operator=\"dilate\" radius=\"1.5\" result=\"grown\"/><feComposite in=\"grown\" in2=\"solid\" operator=\"out\" result=\"edge\"/><feFlood flood-color=\"#f0d28c\"/><feComposite in2=\"edge\" operator=\"in\"/></filter></svg>';
 const context=taskContext[id];
 dialog.innerHTML=`<header class="puzzle-head"><div><p class="puzzle-eyebrow sq-eyebrow"><b class="sq-badge">支線</b><span>拼圖 · ${practice?'工坊試玩':'故事互動'}</span></p><h2 id="puzzle-title">${s.title}</h2></div><button data-close aria-label="關閉拼圖">關閉</button></header>
 <p class="puzzle-objective">${context.goal}</p>
 <div class="puzzle-asset-state" ${needsImages?'':'hidden'}><p role="status">${isMap?'正在展開地圖圖塊…':'正在載入組裝零件…'}</p><button data-puzzle-retry hidden>重試載入</button></div>
 <div class="puzzle-workspace"><div class="puzzle-surface"><div class="puzzle-board puzzle-${id}" aria-label="組裝底圖">${id==='gun'?gunRingDefs:''}${recorderDecor}${items.map(slotMarkup).join('')}</div><div class="puzzle-tray" aria-label="待放入圖塊" style="--piece-count:${items.length}">${[...items].reverse().map(p=>`<button class="puzzle-piece" data-piece="${p.id}" aria-pressed="false" ${id==='gun'?`style="${cropStyle(p)}"`: ''}>${id==='gun'?'<span class="puzzle-piece-art">':''}<img ${needsImages?'':`src="${p.path}"`} alt="" draggable="false">${id==='gun'?'</span>':''}<span>${p.label}</span><small class="puzzle-piece-state">待放入</small></button>`).join('')}</div></div>
 <aside class="puzzle-feedback" aria-label="任務進度與目前零件"><div class="puzzle-progress"><span>拼合進度</span><strong data-puzzle-count>0 / ${items.length}</strong><div class="puzzle-progress-marks" aria-hidden="true">${items.map(p=>`<i data-progress-part="${p.id}"></i>`).join('')}</div></div><div class="puzzle-detail"><h3 data-puzzle-detail-title>檢視零件</h3><p data-puzzle-detail>${context.ready}</p></div><p class="puzzle-status" role="status" aria-live="polite">已放入 0 / ${items.length}。請選擇一塊。</p></aside></div>
 <div class="puzzle-finish" hidden><h3>拼合完成</h3><p>${s.done}</p><button data-continue>${practice?'完成試玩':'繼續劇情'}</button></div><footer><div class="puzzle-tools"><button data-reset>重新拼合</button><button data-hint>提示位置</button></div><details class="puzzle-instructions"><summary>操作說明</summary><p>${s.intro}</p><p class="puzzle-help">拖曳圖塊，靠近合適輪廓時鬆手；或先點圖塊再點輪廓。鍵盤可用 Tab 與 Enter，拖曳中按 Escape 放回。不需旋轉、不限時。${practice?'試玩不解鎖章節或外觀。':'未完成離開將重新開始。'}</p><p class="puzzle-note">${s.note}</p></details></footer>`;
 const status=dialog.querySelector('.puzzle-status');
 const detailTitle=dialog.querySelector('[data-puzzle-detail-title]');
 const detailText=dialog.querySelector('[data-puzzle-detail]');
 function showPart(part,completed=false){
  detailTitle.textContent=part.label+(completed?' · 已就位':'');
  detailText.textContent=partContext[part.id]?.[completed?'done':'inspect']||context.ready;
 }
 function paintProgress(){
  dialog.querySelector('[data-puzzle-count]').textContent=`${placed.size} / ${items.length}`;
  for(const part of items){
   const done=placed.has(part.id);
   dialog.querySelector(`[data-progress-part="${part.id}"]`).dataset.filled=String(done);
   dialog.querySelector(`[data-piece="${part.id}"] .puzzle-piece-state`).textContent=done?'已就位':'待放入';
  }
 }
 if(completionText)dialog.querySelector('.puzzle-finish p').textContent=completionText;
 const ready=()=>!closed&&dialog.open&&dialog.dataset.state==='ready';
 function paintAssembly(assembled){
  if(id!=='gun')return;
  dialog.querySelector('.puzzle-board').dataset.assembled=String(assembled);
  for(const part of items){
   if(!part.assembled)continue;
   const pose=assembled?part.assembled:part,visual=dialog.querySelector(`[data-part="${part.id}"]`);
   for(const [property,key] of [['left','x'],['top','y'],['width','w'],['height','h']])visual.style[property]=pose[key]+'%';
  }
 }
 function loadImages(){
  cancelLoad();const token=++loadToken,cleanups=new Set();
  dialog.dataset.state='loading';
  const notice=dialog.querySelector('.puzzle-asset-state');notice.hidden=false;notice.querySelector('p').textContent=isMap?'正在展開地圖圖塊…':'正在載入組裝零件…';notice.querySelector('button').hidden=true;
  dialog.querySelectorAll('[data-piece],[data-slot],[data-reset]').forEach(el=>{el.disabled=true;});
  cancelLoad=()=>{for(const cancel of [...cleanups])cancel();cleanups.clear();};
  const decode=part=>new Promise((resolve,reject)=>{
   const image=new Image();let settled=false;
   const finish=(error,cancelled=false)=>{
    if(settled)return;settled=true;clearTimeout(timer);image.onload=image.onerror=null;cleanups.delete(cancel);
    if(error||cancelled)image.removeAttribute('src');
    if(error)reject(error);else resolve();
   };
   const cancel=()=>finish(null,true);cleanups.add(cancel);
   const timer=setTimeout(()=>finish(new Error('Image loading timed out')),15000);
   image.onload=()=>{if(!image.naturalWidth){finish(new Error('Empty image'));return;}if(typeof image.decode==='function')image.decode().then(()=>finish(),error=>finish(error));else finish();};
   image.onerror=()=>finish(new Error('Image failed to load'));image.src=part.path;
  });
  Promise.all(items.map(decode)).then(()=>{
   if(closed||!dialog.open||token!==loadToken)return;
   for(const part of items){
    const slot=dialog.querySelector(`[data-slot="${part.id}"]`),piece=dialog.querySelector(`[data-piece="${part.id}"]`);
    if(id==='gun')slotVisual(slot).querySelectorAll('.puzzle-alpha').forEach(alpha=>{alpha.style.setProperty('--piece-image',`url("${part.path}")`);alpha.src=part.path;});
    slotVisual(slot).querySelector('img').src=piece.querySelector('img').src=part.path;
   }
   dialog.dataset.state='ready';notice.hidden=true;
   dialog.querySelectorAll('[data-piece],[data-slot],[data-reset]').forEach(el=>{el.disabled=false;});
   status.textContent=`已放入 0 / ${items.length}。請選擇一塊。`;
   if(dialog.contains(document.activeElement))dialog.querySelector('[data-piece]').focus({preventScroll:true});
  }).catch(()=>{
   if(closed||!dialog.open||token!==loadToken)return;
   cancelLoad();dialog.dataset.state='error';notice.querySelector('p').textContent=isMap?'地圖圖片未能載入，請重試後再開始拼合。':'零件圖片未能載入，請重試後再開始拼合。';notice.querySelector('button').hidden=false;status.textContent='所有圖片與輪廓載入完成後，才能進行拼合。';
  });
 }
 function select(pid){if(!ready()||placed.has(pid)||finished)return;clearPreview();clearHint();selected=pid;showPart(items.find(p=>p.id===pid));dialog.querySelectorAll('[data-piece]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.piece===pid)));status.textContent=`已選擇「${items.find(p=>p.id===pid).label}」，請放入對應輪廓。`;}
 function place(pid,sid){
  if(!ready()||finished||!pid||placed.has(pid)||!items.some(p=>p.id===pid))return;
  if(pid!==sid){status.textContent='形狀不相符，圖塊回到原位。可以再試一次。';return;}
  clearPreview();clearHint();placed.add(pid);selected=null;paintProgress();showPart(items.find(p=>p.id===pid),true);
  const slot=dialog.querySelector(`[data-slot="${pid}"]`),piece=dialog.querySelector(`[data-piece="${pid}"]`);
  slot.classList.add('filled');if(id==='gun')slotVisual(slot).classList.add('filled');slotVisual(slot).querySelector('img').hidden=false;slot.disabled=true;piece.disabled=true;piece.setAttribute('aria-pressed','false');
  if(id==='recorder'&&typeof playSfx==='function')try{playSfx('lock')}catch(e){}status.textContent=`已放入 ${placed.size} / ${items.length}。${partContext[pid]?.done||items.find(p=>p.id===pid).label+'已就位。'}`;
  if(placed.size===items.length){finished=true;if(id==='recorder'&&typeof playSfx==='function')try{playSfx('recorderOn')}catch(e){}detailTitle.textContent='已完成拼合';detailText.textContent=context.complete;paintAssembly(true);dialog.querySelector('.puzzle-finish').hidden=false;dialog.querySelector('[data-continue]').focus();}
  else dialog.querySelector('[data-piece]:not(:disabled)').focus({preventScroll:true});
 }
 function clearPreview(){dialog.querySelectorAll('.is-near').forEach(el=>el.classList.remove('is-near'));}
 function clearHint(){dialog.querySelectorAll('.is-hinted').forEach(el=>el.classList.remove('is-hinted'));}
 function showHint(){
  if(!selected){status.textContent='先選擇一件圖塊，再按提示位置。';return;}
  clearHint();const slot=dialog.querySelector(`[data-slot="${selected}"]`);slotVisual(slot).classList.add('is-hinted');slot.classList.add('is-hinted');
  status.textContent=`「${items.find(p=>p.id===selected).label}」的輪廓已標示；提示不會替你放入。`;
 }
 function cleanupDrag(){
  clearPreview();if(!drag)return;
  const current=drag;drag=null;current.ghost?.remove();current.source.classList.remove('is-lifted');dialog.classList.remove('is-dragging');
  if(current.source.hasPointerCapture?.(current.pointer))current.source.releasePointerCapture(current.pointer);
 }
 function returnDrag(message){cleanupDrag();suppressUntil=Date.now()+350;status.textContent=message;}
 // The ghost uses the slot's visual dimensions, independent of its 44px hit target.
 function liftPiece(current){
  const part=items.find(p=>p.id===current.id),slot=dialog.querySelector(`[data-slot="${current.id}"]`);
  const target=slotVisual(slot).getBoundingClientRect(),art=current.source.querySelector('.puzzle-piece-art')||current.source.querySelector('img');
  let source=art.getBoundingClientRect();
  if(isMap){
   const edge=Math.min(source.width,source.height),size=edge*100/176;
   const left=source.left+(source.width-edge)/2+edge*38/176,top=source.top+(source.height-edge)/2+edge*38/176;
   source={left,top,width:size,height:size,right:left+size,bottom:top+size};
  }
  const inside=current.x>=source.left&&current.x<=source.right&&current.y>=source.top&&current.y<=source.bottom;
  current.anchorX=target.width*(inside?(current.x-source.left)/source.width:.5);current.anchorY=target.height*(inside?(current.y-source.top)/source.height:.5);
  const ghost=document.createElement('div');ghost.className='puzzle-drag-ghost'+(id==='gun'?' puzzle-cropped-ghost':isMap?' puzzle-map-ghost':'');ghost.setAttribute('aria-hidden','true');
  ghost.style.width=target.width+'px';ghost.style.height=target.height+'px';if(id==='gun')ghost.style.cssText+=';'+cropStyle(part);
  const image=current.source.querySelector('img').cloneNode();image.alt='';ghost.append(image);dialog.append(ghost);current.ghost=ghost;
  current.source.classList.add('is-lifted');dialog.classList.add('is-dragging');
 }
 function nearSlot(current,x,y){
  const slot=dialog.querySelector(`[data-slot="${current.id}"]`);if(slot.disabled)return null;
  const rect=slot.getBoundingClientRect(),board=dialog.querySelector('.puzzle-board').getBoundingClientRect();
  // A small physical tolerance assists fingers without revealing distant matches.
  const tolerance=Math.min(24,Math.max(12,board.width*.025));
  if(isMap){
   const tile=slotVisual(slot).getBoundingClientRect(),shape=slot.querySelector('svg path');
   const contains=(px,py)=>shape.isPointInFill(new DOMPoint((px-tile.left)/tile.width*100,(py-tile.top)/tile.height*100));
   if(contains(x,y))return slot;
   // A neighbouring tab owns its own hit region; never snap through that neighbour.
   const hit=document.elementFromPoint(x,y)?.closest('[data-slot]');
   if(hit&&hit!==slot&&dialog.contains(hit))return null;
   for(let i=0;i<8;i++){const angle=i*Math.PI/4;if(contains(x+Math.cos(angle)*tolerance,y+Math.sin(angle)*tolerance))return slot;}
   return null;
  }
  const dx=Math.max(rect.left-x,0,x-rect.right),dy=Math.max(rect.top-y,0,y-rect.bottom);
  return Math.hypot(dx,dy)<=tolerance?slot:null;
 }
 function moveDrag(e){
  drag.ghost.style.left=(e.clientX-drag.anchorX)+'px';drag.ghost.style.top=(e.clientY-drag.anchorY)+'px';
  const candidate=nearSlot(drag,e.clientX,e.clientY);clearPreview();drag.candidate=candidate;
  if(candidate){slotVisual(candidate).classList.add('is-near');candidate.classList.add('is-near');}
  drag.ghost.classList.toggle('is-aligned',!!candidate);
 }
 dialog.addEventListener('click',e=>{
  if(closed)return;const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.hasAttribute('data-close')){dialog.close();return;}
  if(b.hasAttribute('data-puzzle-retry')){if(dialog.dataset.state==='error')loadImages();return;}
  if(!ready())return;
  if(b.hasAttribute('data-reset')){
   cleanupDrag();clearHint();placed.clear();selected=null;finished=false;paintAssembly(false);paintProgress();detailTitle.textContent='檢視零件';detailText.textContent=context.ready;
   dialog.querySelectorAll('[data-piece],[data-slot]').forEach(el=>{el.disabled=false;el.classList.remove('filled');if(el.dataset.piece)el.setAttribute('aria-pressed','false');else{slotVisual(el).querySelector('img').hidden=true;if(id==='gun')slotVisual(el).classList.remove('filled');}});
   dialog.querySelector('.puzzle-finish').hidden=true;status.textContent=`已放入 0 / ${items.length}。請選擇一塊。`;dialog.querySelector('[data-piece]').focus({preventScroll:true});return;
  }
  if(b.hasAttribute('data-continue')&&finished&&!consumed){consumed=true;dialog.close('complete');return;}
  if(drag||Date.now()<suppressUntil)return;
  if(b.dataset.piece)select(b.dataset.piece);
  else if(b.dataset.slot){if(selected)place(selected,b.dataset.slot);else status.textContent=id==='recorder'?'請先從零件區選擇配件，再選擇對應輪廓。':'請先選擇下方圖塊，再選擇對應輪廓。';}
  else if(b.hasAttribute('data-hint'))showHint();
 });
 dialog.addEventListener('pointerdown',e=>{
  if(drag){if(e.pointerId!==drag.pointer)e.preventDefault();return;}
  const b=e.target.closest('[data-piece]');if(!ready()||!b||b.disabled||e.button!==0||e.isPrimary===false)return;
  drag={id:b.dataset.piece,x:e.clientX,y:e.clientY,pointer:e.pointerId,source:b,moved:false};b.setPointerCapture(e.pointerId);
 });
 dialog.addEventListener('pointermove',e=>{
  if(!ready()){cleanupDrag();return;}if(!drag||drag.pointer!==e.pointerId)return;
  if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7){drag.moved=true;select(drag.id);liftPiece(drag);}
  if(drag.moved){e.preventDefault();moveDrag(e);}
 });
 dialog.addEventListener('pointerup',e=>{
  if(!ready()){cleanupDrag();return;}if(!drag||drag.pointer!==e.pointerId)return;
  const current=drag;
  if(current.moved){
   const candidate=nearSlot(current,e.clientX,e.clientY),target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-slot]');
   cleanupDrag();suppressUntil=Date.now()+350;
   if(candidate)place(current.id,candidate.dataset.slot);
   else if(target&&dialog.contains(target))place(current.id,target.dataset.slot);
   else status.textContent='已放回圖塊區，請放入對應輪廓。';
  }else cleanupDrag();
 });
 dialog.addEventListener('pointercancel',e=>{if(drag?.pointer===e.pointerId)returnDrag('操作已取消，圖塊已放回。');});
 dialog.addEventListener('lostpointercapture',e=>{if(drag?.pointer===e.pointerId)returnDrag('操作已取消，圖塊已放回。');});
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape'&&drag){e.preventDefault();returnDrag('拖曳已取消，圖塊已放回。');}});
 dialog.addEventListener('close',()=>{closed=true;loadToken++;cancelLoad();cleanupDrag();dialog.remove();if(active===dialog)active=null;if(trigger?.isConnected)trigger.focus();if(consumed&&!practice)onComplete?.();},{once:true});
 document.body.append(dialog);dialog.showModal();if(needsImages)loadImages();else dialog.querySelector('[data-piece]').focus();
 return dialog;
}
window.NDStoryPuzzles={open,scenes:Object.fromEntries(Object.entries(scenes).map(([id,s])=>[id,{title:s.title}]))};
})();
