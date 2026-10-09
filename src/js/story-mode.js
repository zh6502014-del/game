/* Story prototype: narrative data and progression, isolated from duel rules. */
(() => {
'use strict';
const routes = {
 assassin: {name:'凜',job:'刺客',org:'尺烏',theme:'失去命令以後，為誰拔刀？',skill:'潛行',effect:'進度 +2，不增加危險',nodes:[
 ['沒有名字的人','潛入研究室','無名之羽','凜從小在尺烏長大，首腦是唯一會叫她名字的人。第一次正式暗殺的目標，是曜火研究主管赫爾曼。任務說他準備洩露暮鐘技術。','凜沿指定路線進入研究室。赫爾曼沒有呼救，只問：「他們說我偷了什麼？」他又說，暮鐘從未消滅夜域。凜還不知道這句話意味著什麼。'],
 ['右手的印記','沿維修通道撤離','灼痕','赫爾曼拿起尚未完成的實驗銃。子彈擦過凜的右手，撞上金屬設施；爆開的能量沿管線回流，兩人被捲入短暫同步。','赫爾曼承受主要回流，死於反噬。凜只留下片段畫面、一名女研究員與「地下三層」幾個字，沒有得到完整答案。她帶傷從維修通道離開。'],
 ['回不了的家','避開據點伏擊','斷羽','尺烏據點沒有守衛。凜看見熟悉的人與首腦都已死去，清洗者正在翻找檔案。「出外勤的還沒回來。等。」她藏回暗處。','尺烏沒有其他生還者。官方宣布尺烏叛國，通緝告示只寫著「尺烏的人」。凜割去制服標誌；她懷疑有人利用任務清洗組織，卻仍不知道命令的來源。']
 ]},
 swordsman: {name:'朔',job:'劍客',org:'守誓',theme:'誓言與良知之間，守護誰？',skill:'斷後',effect:'危險 -3，進度 +1',nodes:[
 ['鐘樓裡的朋友','安排鐘樓護送','木葉之約','年輕的朔負責保護一名不能自由離開鐘樓的納爾瓦。他帶糖、書與路邊的葉子，還送了一枚親手刻製的木書籤。','納爾瓦把書籤夾進旅行記。「這個地方，你去過嗎？」朔搖頭。「那以後一起去。」這句話誰也沒當成承諾，書籤卻一直被留下。'],
 ['已經撤離的城市','護住抄錄資料','未竟之誓','納爾瓦發現引域座標與舊資料不符。比對封存紀錄後，他發現那些被稱為已撤離的地方，仍有居民；儀式之後，又出現死亡紀錄。','延後儀式的要求被拒絕，守衛反而增加。他尚無死亡形成暮晶的直接證據，卻已確認撤離說法是謊言。納爾瓦決定帶著資料離開，把警告送出去。'],
 ['伊藤的劍','撐到納爾瓦抵達出口','逆命之刃','朔的師父伊藤攔在出口前：「鐘停了，城裡的人怎麼辦？」朔知道那些人也真的會死，但仍站到朋友前面：「那就讓兩邊的人都知道，鐘要敲去哪裡。」','朔不是要打贏伊藤，只須讓納爾瓦走到出口。他肩繩斷裂，手臂受傷，最後借落下的柵門撤離。為免牽連彼此，兩人約定不再直接聯絡。這發生在磷被收養以前。']
 ]},
 tank: {name:'格蘭',job:'坦克',org:'渡垣',theme:'讓身後的人，再多走一步。',skill:'救援盾',effect:'危險 -4，僅能短暫緩衝',nodes:[
 ['提前響起的暮鐘','建立撤離路線','灰地行者','格蘭第一次參加撤離任務，只是渡垣新兵。隊伍預測小城將成為移夜目標，當地政府卻公告無須撤離。居民不肯拋下家業。','暮鐘比推估更早啟動，光先暗了。渡垣放棄集合點，轉向已勘查的高地通道。安全線只是暫時未被波及的接應處，並非永遠安全的結界。'],
 ['折返的路','護送落後的母女','折返者','最後一批人接近接應點時，格蘭看見落在後面的母女。母親抱不動孩子，女孩也已走不穩。他折返，把女孩交給前來接應的隊友。','格蘭推著母親向前，夜域邊緣壓上狹窄通道。母親在最後幾步跌倒；他把救援盾插進地面，啟動盾內的暮晶片。'],
 ['第一面盾','爭取最後的救援時間','初壁','盾只能保住幾秒較穩定的空間。晶片迅速耗損，盾面開始裂開。格蘭順著母親呼喚孩子的聲音喊：「看著她。再一步就好。」','母女活了下來，隊員在盾崩裂前把格蘭拖出通道。他的第一面盾與未趕到的人留在夜域裡。「撤離部分成功」不是安慰；下次他需要更早、更準確的情報。']
 ]},
 gunner: {name:'伊芙・赫森',job:'槍手',org:'曜火',theme:'在真相之前，仍要看見人。',skill:'保險片',effect:'進度 +3、危險 +1',nodes:[
 ['晶體裡的小女孩','比對殘響與舊紀錄','聽見殘響','高純度暮晶傳出：「媽媽，我們到了嗎？」伊芙更換裝置後，聲音仍在同一段錄音出現。她與赫爾曼開始追查礦物來源。','一句話不能確認身分。兩人繼續比對樣本、生活細節與死亡紀錄，逐漸排除環境回音。暮晶可能保存著人；分配礦區的人是否早就知道？'],
 ['寄不出去的研究','帶走地下三層副本','封存之證','伊芙把礦床、死亡人口、夜域停留時間與純度排在同一張表上，發現暮晶的純度與死亡有關。她質疑赫爾曼的研究，兩人大吵一架，赫爾曼要她隔天起不用再來研究室。','翌日，伊芙聽說研究室出事，博士死去時她不在現場。她循博士帶她走過的維修入口，取走副本與部分讀值；異常回流紀錄並不能還原現場。她確認死亡與暮晶的關係，也讀到博士推開她的原因，卻仍不知道導師死亡的完整經過。'],
 ['第一槍','護送資料箱逃離','餘燼','封存人員逐層收走資料。伊芙將備用裝置改成可攜式暮晶銃，限制輸出，加入過載時切斷能量的保險片。它必須預先蓄能，不能持續射擊。','她朝門邊機械鎖開出第一槍，拖著資料箱撤離。身後研究區燃燒，她沒有回頭，無法判定起火原因。瞄準、換位與餘燃控制，是後來每一次逃亡才逐漸學會的。']
 ]}
};
window.NDStoryOrigins=routes;
const KEY='nightfallStoryV1';
const puzzleNodes={tank:{0:'evac'},gunner:{2:'gun'}};
let root,job='assassin',selected=0,mission=null,view='map',notice='',storageOK=true;
let beat=0,endingRead=false;
let progress={};
try { const raw=JSON.parse(localStorage.getItem(KEY)||'{}'); for(const key of Object.keys(routes)) progress[key]=Number.isInteger(raw?.[key])?Math.max(0,Math.min(3,raw[key])):0; }
catch { storageOK=false; }
for(const key of Object.keys(routes)) progress[key]??=0;
function save(){for(const key of Object.keys(routes))window.NDSkins.noteProgress(key,progress[key]);try{localStorage.setItem(KEY,JSON.stringify(progress));}catch{storageOK=false;}}
function button(action,label,disabled=false){return `<button data-action="${action}" ${disabled?'disabled':''}>${label}</button>`;}
function draw(){
 document.body.classList.toggle('story-playing',view==='play');
 if(view==='play'){drawStage();return;}
 const r=routes[job],n=r.nodes[selected],total=Object.values(progress).reduce((a,b)=>a+b,0);
 const collectibleJobs=Object.keys(routes).filter(key=>window.NDStoryArt.skins[key]),owned=collectibleJobs.filter(key=>window.NDSkins.unlocked(key)).length;
 root.innerHTML=`<div class="story-shell"><header class="story-header"><a class="home-return" href="index.html">← 返回首頁</a><a href="Nightfall-Duel-V12.12.39-Test.html">← 決鬥大廳</a><span>NIGHTFALL DUEL / CHRONICLES</span><button data-action="puzzles">拼圖工坊</button><button data-action="gallery">故事圖鑑</button><button data-action="collection">外觀收藏 ${owned} / ${collectibleJobs.length}</button></header>
 <section class="story-intro"><div><p class="story-eyebrow">第一階段 · 起源篇</p><h1>鐘聲以外的名字</h1><p>四段往事，通往同一場尚未揭曉的黑夜。</p></div><div class="story-overall"><strong>${String(total).padStart(2,'0')} <small>/ 12</small></strong><span>已完成故事節點</span></div></section>
 <nav class="story-roles" aria-label="職業故事線">${Object.entries(routes).map(([key,x])=>`<button data-job="${key}" aria-pressed="${job===key}"><img src="assets/icons/${key}.svg" alt=""><span>${x.name}<small>${x.job} · ${x.org}　${progress[key]}/3</small></span></button>`).join('')}</nav>
 ${!storageOK?'<p role="status">瀏覽器無法保存進度，目前僅於本頁保留。</p>':''}
 <p class="story-notice" role="status">${notice}</p>
 ${view==='puzzles'?puzzleWorkshop():view==='gallery'?gallery():view==='collection'?collection():`<div class="story-layout"><aside class="story-portrait"><img src="${window.NDSkins.path(job,window.NDSkins.equipped(job))}" data-fallback="${window.NDSkins.path(job,'base')}" alt="${r.name}目前外觀"><div><span>${r.org} / ${r.job}</span><h2>${r.name}</h2><p>${r.theme}</p><small>${window.NDSkins.equipped(job)==='base'?'原始外觀':'已裝備：'+window.NDStoryArt.skins[job].title}</small></div></aside><section class="story-content"><div class="story-route" aria-label="章節進程">${r.nodes.map((x,i)=>`<button data-node="${i}" ${i>progress[job]?'disabled':''} aria-current="${selected===i?'step':'false'}"><span>${i<progress[job]?'✓':String(i+1).padStart(2,'0')}</span><b>${x[0]}</b><small>${i<progress[job]?'已完成':i===progress[job]?'可挑戰':'尚未解鎖'}</small></button>`).join('')}</div>
 <article class="story-reader"><p class="story-eyebrow">${job==='swordsman'?'磷被收養以前':job==='tank'?'主線前的若干年':'主線近期'} · 節點 ${selected+1}</p><h2>${n[0]}</h2>${nodeArt(false)}<p>${n[3]}</p>
 ${mission?challenge():`<div class="story-objective"><span>節點目標</span><strong>${n[1]}</strong><p>${puzzleNodes[job]?.[selected]?'先完成形狀配對，再進入事件挑戰。':''}在危險達到 6 前，累積 6 點進度。每步即一回合；先處理危險，再判定完成。</p></div>${button('start',selected<progress[job]?'重溫這段往事':'進入故事 →')}`}
 ${selected===2?`<div class="story-reward"><img src="assets/icons/card.svg" alt=""><span>完成解鎖 <b>${r.name}・${window.NDStoryArt.skins[job].title}</b><small>專屬外觀 · 完成後可裝備，不增加能力</small></span></div>`:''}</article></section></div>`}
 <footer class="story-footer"><span>起源篇 · 外觀不影響能力</span><span>${total===12?'四段起源已完成':'完成四條起源線後，銜接共同主線'} · 第二階段「被留下來的人」尚未開放</span></footer></div>`;
}
// Narrative uses the existing text verbatim, grouped into short reading beats.
function beats(text){const units=text.match(/[^。！？]+[。！？]?[」』]?/g)||[text];const pages=[];for(const unit of units){if(pages.length&&pages.at(-1).length+unit.length<85)pages[pages.length-1]+=unit;else pages.push(unit);}return pages;}
function enterNode(){mission=null;beat=0;endingRead=false;notice='';view='play';draw();focusStage();}
function focusStage(){root.querySelector('[data-action="advance"], [data-action="embark"], [data-action="careful"], [data-action="next"]')?.focus({preventScroll:true});}
function stageImage(){
 const before={assassin:['assassin-lab','assassin-lab',null],swordsman:['swordsman-bookmark','swordsman-records','swordsman-records'],tank:['tank-bell','tank-return','tank-return'],gunner:['gunner-echo','gunner-sealed','gunner-basement']};
 const id=mission?.state==='won'?art.nodes[job][selected].at(-1):before[job][selected];
 return art.scenes.find(x=>x.id===id)||{path:window.NDSkins.path(job,'base'),title:routes[job].name};
}
function drawStage(){
 const r=routes[job],n=r.nodes[selected],img=stageImage(),won=mission?.state==='won',reading=!mission||(won&&!endingRead),pages=beats(won?n[4]:n[3]);
 const chapter=job==='swordsman'?'磷被收養以前':job==='tank'?'主線前的若干年':'主線近期';
 let content;
 if(reading){const last=beat>=pages.length-1;content=`<div class="story-dialogue"><div class="story-voice"><span>${won?'後來':'往事'} · ${r.name}</span><small>${beat+1} / ${pages.length}</small></div><p class="story-spoken" role="status">${pages[beat]}</p><div class="story-read-controls">${button('previous','← 上一段',beat===0)}${button(last?(won?'finish-reading':'embark'):'advance',last?(won?'收起這段記憶':puzzleNodes[job]?.[selected]?(job==='tank'?'整理撤離簡圖 →':'查看工作臺 →'):'開始行動 →'):'繼續 →')}</div></div>`;}
 else if(won){content=`<div class="story-outcome story-memory"><p class="story-eyebrow">記憶已收錄</p><h2>${n[0]}</h2><p>${selected===2?'專屬外觀已解鎖，可至收藏選擇裝備。':'這段故事已完成。'}</p>${button('next',selected<2?'走向下一段往事 →':'返回故事地圖')}${selected===2?button('collection','查看外觀收藏'):''}</div>`;}
 else content=challenge();
 root.innerHTML=`<section class="story-stage" aria-label="${r.name}：${n[0]}"><img class="story-stage-image" src="${img.path}" data-fallback="${window.NDSkins.path(job,'base')}" alt="${img.title}"><div class="story-stage-shade"></div><header class="story-stage-header">${button('leave','← 章節地圖')}<div><span>${chapter} / ${String(selected+1).padStart(2,'0')}</span><h1>${n[0]}</h1></div>${button('reading-log','故事紀錄')}</header><div class="story-stage-space" aria-hidden="true"></div><div class="story-stage-bottom">${!storageOK?'<p class="story-save-warning" role="status">目前無法保存進度，僅於本頁保留。</p>':''}<section class="story-stage-panel">${content}</section><p class="story-stage-hint">${mission?.state==='active'?'完成眼前的行動，故事便會繼續。':'點選繼續閱讀 · 可隨時查看已讀紀錄'}</p></div></section>`;
}
function readingLog(){
 const n=routes[job].nodes[selected],before=beats(n[3]),after=beats(n[4]);
 const read=mission?before:before.slice(0,beat+1);if(mission?.state==='won')read.push(...after.slice(0,endingRead?after.length:beat+1));
 const trigger=document.activeElement,d=document.createElement('dialog');d.className='story-log-dialog';d.setAttribute('aria-label','已讀故事紀錄');d.innerHTML=`<h2>已讀故事紀錄</h2>${read.map(t=>`<p>${t}</p>`).join('')}<button>返回故事</button>`;d.querySelector('button').onclick=()=>d.close();d.addEventListener('close',()=>{d.remove();trigger?.focus();},{once:true});document.body.append(d);d.showModal();
}
function leaveStage(){
 if(mission?.state==='active'){
  const d=document.createElement('dialog');d.className='story-log-dialog';d.setAttribute('aria-label','離開未完成節點');d.innerHTML='<h2>暫時離開？</h2><p>這次未完成的行動會重新開始，已解鎖的收藏會保留。</p><button data-stay>繼續遊玩</button><button data-exit>返回地圖</button>';const trigger=document.activeElement;
  d.querySelector('[data-stay]').onclick=()=>d.close();d.querySelector('[data-exit]').onclick=()=>{d.close();mission=null;view='map';draw();};d.addEventListener('close',()=>{d.remove();if(trigger?.isConnected)trigger.focus();},{once:true});document.body.append(d);d.showModal();
 }else{mission=null;view='map';draw();}
}

function puzzleWorkshop(){return `<section class="story-puzzle-list"><div class="story-collection-head"><h2>拼圖工坊</h2>${button('map','返回故事')}</div><p>四個場景共用形狀配對。此處為獨立試玩，不增加故事進度或解鎖 Skin。格蘭第一節點與伊芙第三節點已接入拼圖；共同主線尚未開放。</p><div class="story-puzzle-choices">${Object.entries(window.NDStoryPuzzles.scenes).map(([id,s])=>`<button data-puzzle="${id}">${s.title}<small>${['archive','recorder'].includes(id)?'含後續劇情 · 點擊即查看並試玩':'獨立試玩 · 不保存進度'}</small></button>`).join('')}</div></section>`;}
function beginChallenge(){mission={state:'active',advance:0,danger:0,supply:2,used:false,turn:1,log:'觀察局勢，選擇下一步。'};notice='';draw();focusStage();}
function collection(){
 const cards=Object.entries(routes).filter(([key])=>window.NDStoryArt.skins[key]).map(([key,route])=>{
  const skin=window.NDStoryArt.skins[key],done=window.NDSkins.unlocked(key),equipped=window.NDSkins.equipped(key)===skin.id;
  return `<article class="story-skin ${done?'unlocked':'locked'}" data-skin-id="${skin.id}"><img loading="lazy" src="${skin.path}" data-fallback="${window.NDSkins.path(key,'base')}" alt="${route.name}・${skin.title}"><div><small>${done?'已解鎖':'完成角色起源故事解鎖'}</small><h3>${route.name}・${skin.title}</h3><p>${route.nodes[2][0]}</p><button data-equip="${key}" data-value="${equipped?'base':skin.id}" ${done?'':'disabled'}>${equipped?'還原原始外觀':'裝備 '+skin.title}</button></div></article>`;
 }).join('');
 return `<section class="story-collection"><div class="story-collection-head"><h2>外觀收藏</h2>${button('map','返回故事')}</div><div class="story-cards">${cards}</div></section>`;
}
const art=window.NDStoryArt;
const safeBefore=new Set(['swordsman-bookmark','swordsman-records','tank-bell','tank-return','gunner-echo','gunner-sealed']);
let showSpoilers=false;
function sceneButton(scene){return `<button class="story-scene" data-scene="${scene.id}" aria-label="放大：${scene.title}"><img loading="lazy" src="${scene.path}" alt="${scene.title}"><span>${scene.title} · 點擊放大</span></button>`;}
function nodeArt(after){const ids=art.nodes[job][selected];return ids.filter(id=>after?!safeBefore.has(id):safeBefore.has(id)).map(id=>sceneButton(art.scenes.find(x=>x.id===id))).join('');}
function availableScene(scene){for(const key of Object.keys(art.nodes)){const index=art.nodes[key].findIndex(ids=>ids.includes(scene.id));if(index>=0)return progress[key]>index;}return false;}
function gallery(){const groups=[...new Set(art.scenes.map(x=>x.group))];return `<section class="story-gallery"><div class="story-collection-head"><h2>故事圖鑑 · 29 幅記憶</h2>${button('map','返回故事')}</div><p>已完成節點的情境圖會自動收錄。完整原稿亦包含尚未開放的後續章節。</p><button data-action="spoilers" aria-pressed="${showSpoilers}">${showSpoilers?'隱藏未完成與後續劇情':'顯示完整圖鑑（包含後續劇情）'}</button>${groups.map(group=>{const all=art.scenes.filter(x=>x.group===group),visible=all.filter(x=>showSpoilers||availableScene(x));return `<section><h3>${group}</h3><div class="story-gallery-grid">${visible.map(sceneButton).join('')}</div>${visible.length<all.length?`<p class="story-hidden-count">${all.length-visible.length} 幅尚未開放；完成節點或選擇顯示完整圖鑑。</p>`:''}</section>`;}).join('')}</section>`;}
function openScene(id,trigger){
 const list=view==='gallery'?art.scenes.filter(x=>showSpoilers||availableScene(x)):art.scenes.filter(x=>art.nodes[job][selected].includes(x.id)&&(safeBefore.has(x.id)||mission?.state==='won'));
 let index=list.findIndex(x=>x.id===id);if(index<0)return;
 const dialog=document.createElement('dialog');dialog.className='story-lightbox';dialog.setAttribute('aria-label','故事情境圖');
 dialog.innerHTML='<button class="story-lightbox-close" aria-label="關閉圖片">✕</button><figure><img><figcaption></figcaption></figure><div class="story-lightbox-nav"><button data-direction="-1">上一張</button><span></span><button data-direction="1">下一張</button></div>';
 function update(){const x=list[index];dialog.querySelector('img').src=x.path;dialog.querySelector('img').alt=x.title;dialog.querySelector('figcaption').textContent=x.group+' · '+x.title;dialog.querySelector('.story-lightbox-nav span').textContent=(index+1)+' / '+list.length;dialog.querySelector('[data-direction="-1"]').disabled=index===0;dialog.querySelector('[data-direction="1"]').disabled=index===list.length-1;}
 dialog.querySelector('.story-lightbox-close').onclick=()=>dialog.close();
 dialog.addEventListener('click',e=>{const dir=e.target.closest('[data-direction]');if(dir){index=Math.max(0,Math.min(list.length-1,index+Number(dir.dataset.direction)));update();}else if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close();}});
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();index=Math.max(0,Math.min(list.length-1,index+(e.key==='ArrowRight'?1:-1)));update();}});
 dialog.addEventListener('close',()=>{dialog.remove();if(trigger?.isConnected)trigger.focus();});document.body.append(dialog);update();dialog.showModal();dialog.querySelector('button').focus();
}
function challenge(){
 const m=mission,n=routes[job].nodes[selected];
 if(m.state==='won')return `<div class="story-outcome"><h3>${selected===2?'節點完成 · 專屬外觀已解鎖':'故事節點已完成'}</h3><p>${n[4]}</p>${nodeArt(true)}${button('next',selected<2?'前往下一節點':'返回故事地圖')}${selected===2?button('collection','查看外觀收藏'):''}</div>`;
 if(m.state==='lost')return `<div class="story-outcome"><h3>行動受阻</h3><p>危險已達上限。調整節奏，再嘗試一次；已完成的故事進度會保留。</p>${button('start','重新挑戰')}</div>`;
 return `<section class="story-challenge"><h3>${n[1]} <small>回合 ${m.turn}</small></h3><div class="story-meters"><span>進度 <b>${m.advance} / 6</b><meter min="0" max="6" value="${m.advance}"></meter></span><span>危險 <b>${m.danger} / 6</b><meter min="0" max="6" value="${m.danger}"></meter></span><span>補給 <b>${m.supply} / 2</b></span></div><p role="status">${m.log}</p><div class="story-actions">${button('careful','謹慎推進 · 進度 +1／危險 +1')}${button('rush','快速推進 · 進度 +2／危險 +2')}${button('rest','整理補給 · 危險 -3／補給 -1',m.supply===0)}${button('skill',routes[job].skill+' · '+routes[job].effect+'（限一次）',m.used)}</div><small>切換職業或節點將重新開始未完成挑戰。</small></section>`;
}
function act(action){
 if(action==='leave'){leaveStage();return;}
 if(action==='reading-log'){readingLog();return;}
 if(action==='advance'){beat++;draw();focusStage();return;}
 if(action==='previous'){beat=Math.max(0,beat-1);draw();focusStage();return;}
 if(action==='finish-reading'){endingRead=true;draw();focusStage();return;}
 if(action==='embark'){const puzzle=puzzleNodes[job]?.[selected];if(puzzle)window.NDStoryPuzzles.open(puzzle,{onComplete:beginChallenge});else beginChallenge();return;}

 if(action==='puzzles'){view='puzzles';draw();return;}
 if(action==='gallery'){view='gallery';draw();return;}
 if(action==='spoilers'){showSpoilers=!showSpoilers;draw();return;}
 if(action==='collection'){view='collection';draw();return;}
 if(action==='map'){view='map';draw();return;}
 if(action==='start'){enterNode();return;}
 if(action==='next'){if(selected<2){selected++;enterNode();}else{mission=null;view='map';draw();}return;}
 if(!mission||mission.state!=='active')return;
 const m=mission;
 if(action==='careful'){m.advance++;m.danger++;m.log='你穩定前進一步，也更接近危險。';}
 else if(action==='rush'){m.advance+=2;m.danger+=2;m.log='你搶下時間，但危險正在逼近。';}
 else if(action==='rest'&&m.supply>0){m.supply--;m.danger-=3;m.log='消耗一份補給，重整行動節奏。';}
 else if(action==='skill'&&!m.used){m.used=true;const changes={assassin:[2,0],swordsman:[1,-3],tank:[0,-4],gunner:[3,1]}[job];m.advance+=changes[0];m.danger+=changes[1];m.log=routes[job].skill+'已使用，本次挑戰無法再次使用。';}
 else return;
 m.danger=Math.max(0,m.danger);m.advance=Math.min(6,m.advance);m.turn++;
 if(m.danger>=6)m.state='lost';
 else if(m.advance>=6){m.state='won';beat=0;endingRead=false;progress[job]=Math.max(progress[job],selected+1);save();notice=selected===2?'外觀已解鎖：'+routes[job].name+'・'+window.NDStoryArt.skins[job].title:'章節完成：'+routes[job].nodes[selected][0];}
 draw();
}
window.NDStory={mount(el){if(root)return;root=el;root.addEventListener('error',e=>{const img=e.target;if(img.tagName==='IMG'&&img.dataset.fallback){const fallback=img.dataset.fallback;delete img.dataset.fallback;img.src=fallback;}},true);root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;if(b.dataset.puzzle){window.NDStoryPuzzles.open(b.dataset.puzzle,{practice:true,trigger:b});return;}if(b.dataset.scene){openScene(b.dataset.scene,b);return;}if(b.dataset.equip){const result=window.NDSkins.equip(b.dataset.equip,b.dataset.value);notice=result.ok?(result.persisted?'外觀已保存':'無法保存外觀，目前僅於本頁保留'):'請先完成故事線';draw();return;}if(b.dataset.job&&routes[b.dataset.job]){job=b.dataset.job;selected=Math.min(progress[job],2);mission=null;view='map';notice='';draw();}else if(b.dataset.node!==undefined){const i=Number(b.dataset.node);if(i>=0&&i<3&&i<=progress[job]){selected=i;enterNode();}}else act(b.dataset.action);});draw();}};
})();
