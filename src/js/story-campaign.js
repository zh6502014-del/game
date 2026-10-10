/* Complete manuscript campaign. Node-local actions are transactional; only completed nodes persist. */
(()=>{'use strict';
const origins=window.NDStoryOrigins,art=window.NDStoryArt,prefix={assassin:'A',swordsman:'S',tank:'T',gunner:'E'},jobs=Object.keys(prefix),nodes=[];
for(const job of jobs)origins[job].nodes.forEach((a,i)=>nodes.push({id:prefix[job]+(i+1),job,title:a[0],intro:a[3],after:a[4],reward:a[2],image:art.nodes[job][i].at(-1),actions:NDCampaignSpecs[prefix[job]+(i+1)],requires:i?[prefix[job]+i]:[]}));
NDCampaignShared.forEach((a,i)=>nodes.push({id:a[0],job:a[0].startsWith('P')?'phosphor':'party',title:a[1],image:a[2],intro:a[3],after:a[4],actions:a[5],requires:i?[NDCampaignShared[i-1][0]]:jobs.map(j=>prefix[j]+'3')}));
const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
byId.A2.intro='赫爾曼退向實驗台，仍在尋找退路。凜封住了唯一的出口。';
byId.A2.after='赫爾曼拿起未完成的實驗銃開槍。子彈擦過凜的右手，能量反衝回槍身，赫爾曼死於反噬。凜帶傷從維修通道離開。';
// A1 and A2 are one chapter: the confrontation, the fight and the accident are told in A1.
// The A3 node keeps its id (it still awards the skin) and now follows A1 directly.
{const first=byId.A1,second=byId.A2;first.intro=first.intro+' 研究室裡，凜封住了唯一的出口。';first.after=second.after;first.image=second.image;first.actions=[...first.actions,...second.actions];byId.A3.requires=['A1'];nodes.splice(nodes.indexOf(second),1);delete byId.A2;}
// Shared-line chapters told as one: the second node folds into the first (its steps follow in story-chapters.js).
const MERGED_INTO={};
// STORY-CONDENSE-026 adds B1+B2, B3(+C1)+C2, D3+D4 and D5+D6 (same order as story-chapters.js).
for(const [a,b] of [['P1','P2'],['P3','P4'],['B1','B2'],['C8','C9']]){const first=byId[a],second=byId[b];first.intro=first.intro+' '+second.intro;first.after=second.after;first.actions=[...first.actions,...second.actions];nodes.forEach(n=>{n.requires=n.requires.map(r=>r===b?a:r);});nodes.splice(nodes.indexOf(second),1);delete byId[b];MERGED_INTO[b]=a;}
byId.E3.intro='博士死了。伊芙潛回被翻過的研究室，打開只有她知道的保險箱。';
byId.E3.after='伊芙讀完博士的信，組好他留下的槍，擊退士兵逃出研究所。屋頂上，凜看著她離開。';
const puzzles={E3:'gun',C8:'archive',C9:'recorder'},routes={T1:'evac-tiles'};
const encounters={"B1-wolves": {"player": "swordsman", "enemy": "swordsman", "heroName": "朔", "heroPortrait": "assets/skins/swordsman-origin.webp", "name": "晶狼", "mode": "win", "allies": [], "enemies": [{"id": "wolf-1", "job": "swordsman", "name": "晶狼", "hp": 3, "attack": 1, "portrait": "assets/characters/enemies/crystal-wolf.webp"}, {"id": "wolf-2", "job": "swordsman", "name": "晶狼", "hp": 3, "attack": 1, "portrait": "assets/characters/enemies/crystal-wolf.webp"}], "objective": {"type": "defeat"}, "description": "兩頭被暮晶侵蝕的晶狼撲向磷。路過的劍客朔拔刀擋在她身前。"}, "A2": {"player": "assassin", "enemy": "gunner", "heroName": "凜", "heroPortrait": "assets/characters/assassin.webp", "name": "赫爾曼博士", "mode": "win", "allies": [], "enemies": [{"id": "herman", "job": "gunner", "name": "赫爾曼博士", "hp": 10, "attack": 1, "portrait": "assets/story/actors/gun-unify/herman.webp"}], "objective": {"type": "defeat"}, "description": "研究台後，赫爾曼舉起了實驗銃。"}, "S3": {"player": "swordsman", "enemy": "swordsman", "heroName": "朔", "heroPortrait": "assets/skins/swordsman-origin.webp", "name": "伊藤 · 朔的師父", "mode": "survive", "allies": [], "enemies": [{"id": "master", "job": "swordsman", "name": "伊藤 · 朔的師父", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/ito.webp"}], "objective": {"type": "survive", "rounds": 6, "requireBothAlive": true}, "enemyPolicy": "restrained", "description": "牽制 6 個完整回合，雙方都必須存活。不要擊倒師父；朋友離開後便可撤退。"}, "E3": {"player": "gunner", "enemy": "swordsman", "heroName": "伊芙", "heroPortrait": "assets/story/actors/gun-unify/gunner-origin.webp", "name": "研究區追兵", "mode": "win", "allies": [], "enemies": [{"id": "pursuer", "job": "swordsman", "name": "研究區追兵", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/enemy-blade.webp"}], "objective": {"type": "defeat"}, "description": "第一槍已破開門鎖。擊退阻路追兵，帶著研究資料離開。"}, "C3": {"player": "assassin", "enemy": "swordsman", "heroName": "凜", "heroPortrait": "assets/skins/assassin-origin.webp", "name": "後門追兵", "mode": "win", "allies": [{"id": "eve", "job": "gunner", "name": "伊芙", "portrait": "assets/story/actors/gun-unify/gunner-origin.webp"}], "enemies": [{"id": "pursuer-blade", "job": "swordsman", "name": "阻路追兵", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/enemy-blade.webp"}, {"id": "pursuer-shadow", "job": "assassin", "name": "截路追兵", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/enemy-shadow.webp"}], "objective": {"type": "defeat"}, "description": "凜打開後門退路，伊芙護著資料協助壓制追兵。朔守入口，格蘭護送磷撤離，兩人不參加這場後門戰鬥。"}, "C4-outer": {"player": "gunner", "enemy": "swordsman", "heroName": "伊芙", "heroPortrait": "assets/story/actors/gun-unify/gunner-origin.webp", "name": "外廊封鎖", "mode": "win", "allies": [{"id": "shuo", "job": "swordsman", "name": "朔", "portrait": "assets/skins/swordsman-origin.webp"}], "enemies": [{"id": "outer-guard", "job": "swordsman", "name": "外廊看守", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/enemy-blade.webp"}, {"id": "outer-gunner", "job": "gunner", "name": "警戒槍手", "hp": 10, "attack": 1, "portrait": "assets/story/actors/gun-unify/enemy-gunner.webp"}], "objective": {"type": "defeat"}, "description": "士兵封住檔案櫃區的出口。伊芙與朔擋下第一批士兵，朔護著磷。"}, "C4-inner": {"player": "assassin", "enemy": "tank", "heroName": "凜", "heroPortrait": "assets/skins/assassin-origin.webp", "name": "內庫取件", "mode": "win", "allies": [{"id": "shuo", "job": "swordsman", "name": "朔", "portrait": "assets/skins/swordsman-origin.webp"}, {"id": "eve", "job": "gunner", "name": "伊芙", "portrait": "assets/story/actors/gun-unify/gunner-origin.webp"}], "enemies": [{"id": "inner-shield", "job": "tank", "name": "內庫盾衛", "hp": 10, "attack": 1, "shield": 2, "portrait": "assets/characters/enemies/enemy-shield.webp"}, {"id": "inner-gunner", "job": "gunner", "name": "內庫槍手", "hp": 10, "attack": 1, "portrait": "assets/story/actors/gun-unify/enemy-gunner.webp"}], "objective": {"type": "defeat"}, "description": "更多士兵圍上來，凜從上層落下。凜、伊芙與朔一起擊退士兵。"}, "C9-abyss": {"player": "assassin", "enemy": "assassin", "heroName": "凜", "heroPortrait": "assets/skins/assassin-origin.webp", "name": "冥淵", "mode": "win", "allies": [{"id": "shuo", "job": "swordsman", "name": "朔", "portrait": "assets/skins/swordsman-origin.webp"}, {"id": "eve", "job": "gunner", "name": "伊芙", "portrait": "assets/story/actors/gun-unify/gunner-origin.webp"}], "enemies": [{"id": "abyss-claw-1", "job": "assassin", "name": "冥淵 · 晶爪", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/enemy-abyss-claw.webp"}, {"id": "abyss-body-1", "job": "tank", "name": "冥淵 · 晶軀", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/enemy-abyss-body.webp"}, {"id": "abyss-body-2", "job": "tank", "name": "冥淵 · 晶軀", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/enemy-abyss-body.webp"}], "objective": {"type": "defeat"}, "description": "冥淵從坑道深處衝出。凜、朔與伊芙聯手擊退它們；磷退在後面，不參加戰鬥。"}, "H1-king": {"player": "assassin", "enemy": "swordsman", "heroName": "凜", "heroPortrait": "assets/skins/assassin-origin.webp", "name": "路易斯 · 移夜之主", "mode": "win", "allies": [{"id": "shuo", "job": "swordsman", "name": "朔", "portrait": "assets/skins/swordsman-origin.webp"}, {"id": "eve", "job": "gunner", "name": "伊芙", "portrait": "assets/story/actors/gun-unify/gunner-origin.webp"}, {"id": "gran", "job": "tank", "name": "格蘭", "portrait": "assets/skins/tank-origin.webp"}], "enemies": [{"id": "guard-blade", "job": "swordsman", "name": "王室衛兵 · 劍", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/enemy-blade.webp"}, {"id": "guard-gunner", "job": "gunner", "name": "王室衛兵 · 槍", "hp": 10, "attack": 1, "portrait": "assets/story/actors/gun-unify/enemy-gunner.webp"}, {"id": "louis-armored", "job": "swordsman", "name": "路易斯", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/king-armored.webp", "transform": {"summonAround": true, "hp": 12, "attack": 2, "job": "assassin", "name": "路易斯（水晶異變）", "portrait": "assets/characters/enemies/king-crystal.webp", "purgeIds": ["guard-blade", "guard-gunner", "guard-shield"], "rescue": {"text": "伊藤帶著一名士兵趕到，加入戰局！", "units": [{"id": "itou", "job": "swordsman", "name": "伊藤", "hp": 10, "attack": 2, "portrait": "assets/characters/enemies/ito.webp"}, {"id": "itou-soldier", "job": "tank", "name": "士兵", "hp": 8, "attack": 1, "shield": 1, "portrait": "assets/characters/enemies/enemy-shield.webp"}]}, "ratRules": {"devourBelow": 5, "heal": 2, "respawnEvery": 2, "respawnCount": 2}, "summon": [{"id": "crystal-rat-1", "job": "assassin", "name": "水晶鼠", "hp": 1, "attack": 0, "shield": 0, "trap": true, "portrait": "assets/characters/enemies/crystal-rat.webp"}, {"id": "crystal-rat-2", "job": "assassin", "name": "水晶鼠", "hp": 1, "attack": 0, "shield": 0, "trap": true, "portrait": "assets/characters/enemies/crystal-rat.webp"}, {"id": "crystal-rat-3", "job": "assassin", "name": "水晶鼠", "hp": 1, "attack": 0, "shield": 0, "trap": true, "portrait": "assets/characters/enemies/crystal-rat.webp"}, {"id": "crystal-rat-4", "job": "assassin", "name": "水晶鼠", "hp": 1, "attack": 0, "shield": 0, "trap": true, "portrait": "assets/characters/enemies/crystal-rat.webp"}]}}, {"id": "guard-shield", "job": "tank", "name": "王室衛兵 · 盾", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/enemy-shield.webp"}], "objective": {"type": "defeat"}, "description": "戴著頭戴裝置的路易斯與王室士兵圍住操控室。"}, "C9-griffin": {"player": "tank", "enemy": "tank", "heroName": "格蘭", "heroPortrait": "assets/skins/tank-origin.webp", "name": "晶化獅鷲", "mode": "win", "allies": [{"id": "shuo", "job": "swordsman", "name": "朔", "portrait": "assets/skins/swordsman-origin.webp"}, {"id": "eve", "job": "gunner", "name": "伊芙", "portrait": "assets/story/actors/gun-unify/gunner-origin.webp"}, {"id": "rin", "job": "assassin", "name": "凜", "portrait": "assets/skins/assassin-origin.webp"}], "enemies": [{"id": "griffin", "job": "tank", "name": "晶化獅鷲", "hp": 14, "attack": 2, "portrait": "assets/story/actors/extra/enemy-griffin.webp"}, {"id": "abyss-claw-1", "job": "assassin", "name": "冥淵 · 晶爪", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/enemy-abyss-claw.webp"}, {"id": "abyss-body-1", "job": "tank", "name": "冥淵 · 晶軀", "hp": 10, "attack": 1, "portrait": "assets/characters/enemies/enemy-abyss-body.webp"}], "objective": {"type": "defeat"}, "description": "礦坑深處的實驗產物，身邊還跟著兩隻冥淵。格蘭的士兵團全倒了，他和趕來的眾人一起迎戰。"}};
// H2「硬幣」夜襲線: 凜 alone. Five soldiers at a time, refilled after every enemy turn until 15 have fallen.
// Her first fall awakens her (晶化右手): HP 13, shield 2, attack 2, 殘影 always counters, plus 晶錐 (1 to every enemy + 震盪).
{const soldier=(job,n)=>({job,name:job==='gunner'?'士兵 · 槍':'士兵 · 劍',hp:2,attack:1,plain:true,portrait:job==='gunner'?'assets/story/actors/gun-unify/enemy-gunner.webp':'assets/characters/enemies/enemy-blade.webp',...(n?{id:'soldier-'+n}:{})});
encounters['H2-night']={player:'assassin',enemy:'swordsman',heroName:'凜',heroPortrait:'assets/skins/assassin-origin.webp',name:'暮鐘操控室 · 士兵團',mode:'win',allies:[],
 enemies:[soldier('swordsman',1),soldier('gunner',2),soldier('swordsman',3),soldier('gunner',4),soldier('swordsman',5)],
 reinforce:{goal:15,requireAwakened:true,pool:[soldier('swordsman'),soldier('gunner')]},
 heroTransform:{hp:13,shield:2,attack:2,name:'凜（覺醒）',portrait:'assets/characters/rin-awakened.webp',counterChance:1,cone:{cost:1,damage:1,ticks:2},awakenText:'右手的晶體裂開了。',afterText:'晶體爬上她的肩膀。凜又站了起來。'},
 objective:{type:'defeat'},description:'士兵從每一扇門湧進來。場上一次五名，倒下就有人補上。擊倒 15 名士兵。'};}
const KEY='nightfallStoryV2';let store={version:2,completedNodes:[],choices:{},evidence:{}},storageOK=true,root,route='assassin',view='map',current=null,phase='intro',page=0,seen=new Set(),message='',puzzleDone=false,choice=null,spoilers=false;
function rebuildEvidence(){store.evidence={};for(const id of store.completedNodes){const n=byId[id];n.actions.forEach((a,i)=>store.evidence[id+'-'+i]={sourceNode:id,owner:n.job,label:a[0],description:a[1],shared:['C','D','F','G'].includes(id[0])});}}
try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw?.version===2&&Array.isArray(raw.completedNodes)){store.completedNodes=nodes.filter(n=>raw.completedNodes.includes(n.id)).map(n=>n.id);
// Saves from before the A1+A2 merge: A1 alone was only half of today's A1.
if(!raw.completedNodes.includes('A2'))store.completedNodes=store.completedNodes.filter(id=>id!=='A1');
// Same for the shared-line merges: finishing only the first half does not finish the merged chapter.
for(const [b,a] of Object.entries(MERGED_INTO))if(!raw.completedNodes.includes(b))store.completedNodes=store.completedNodes.filter(id=>id!==a);if(['help','direct'].includes(raw.choices?.C7))store.choices.C7=raw.choices.C7;if(['sun','night'].includes(raw.choices?.H2))store.choices.H2=raw.choices.H2;if(Array.isArray(raw.choices?.H2faces))store.choices.H2faces=['sun','night'].filter(f=>raw.choices.H2faces.includes(f));}}catch{storageOK=false;}
try{const old=JSON.parse(localStorage.getItem('nightfallStoryV1')||'{}');for(const j of jobs){const count=Number.isInteger(old?.[j])?Math.max(0,Math.min(3,old[j])):0;for(let i=1;i<=count;i++){const id=prefix[j]+i;if(id==='A2'||(id==='A1'&&count<2))continue;if(!store.completedNodes.includes(id))store.completedNodes.push(id);}}}catch{storageOK=false;}
store.completedNodes=nodes.reduce((ids,n)=>{if(store.completedNodes.includes(n.id)&&n.requires.every(id=>ids.includes(id)))ids.push(n.id);return ids;},[]);
rebuildEvidence();
function complete(id){return store.completedNodes.includes(id==='A2'?'A1':(MERGED_INTO[id]||id));}
function unlocked(n){return complete(n.id)||n.requires.every(complete);}
function lockHint(n){const miss=n.requires.filter(id=>!complete(id)).map(id=>{const m=nodes.find(x=>x.id===id);return m?`${id}「${m.title}」`:id});return miss.length?`<em class="campaign-lock-reason">需先完成 ${esc(miss.join('、'))}</em>`:'';}
// Follow a direct continuation first; an unfinished origin leads to the next available line.
function nextNode(){return nodes.find(n=>n.requires.includes(current.id)&&unlocked(n))||nodes.find(n=>!complete(n.id)&&unlocked(n));}
route=(nodes.find(n=>!complete(n.id)&&unlocked(n))||nodes.at(-1)).job;
function syncSkins(){for(const j of jobs){let count=0;while(count<3&&complete(prefix[j]+(count+1)))count++;window.NDSkins.noteProgress(j,count);}}
syncSkins();
// A merged chapter is saved with its folded halves too; the load-time merge check needs them to keep it complete after reload.
function persisted(){const folded=[...(complete('A1')?['A2']:[]),...Object.keys(MERGED_INTO).filter(b=>store.completedNodes.includes(MERGED_INTO[b]))];return {...store,completedNodes:[...store.completedNodes,...folded.filter(id=>!store.completedNodes.includes(id))]};}
function save(){rebuildEvidence();syncSkins();try{localStorage.setItem(KEY,JSON.stringify(persisted()));const old={};for(const j of jobs){let count=0;while(count<3&&complete(prefix[j]+(count+1)))count++;old[j]=count;}localStorage.setItem('nightfallStoryV1',JSON.stringify(old));storageOK=true;}catch{storageOK=false;}}
// STORY-HOTKEY: each control advertises its keyboard shortcut (hidden on touch-only devices).
const STORY_KEYS={flip:'Enter',advance:'Space',previous:'Left',log:'L',leave:'Esc',proceed:'Enter','perform-action':'Enter',fight:'Enter',search:'Enter',commit:'Enter',next:'Enter'};
function b(action,text,disabled=false){const key=STORY_KEYS[action];return `<button data-action="${action}" ${disabled?'disabled':''}${key?` aria-keyshortcuts="${key==='Left'?'ArrowLeft':key}"`:''}>${text}${key?`<kbd class="story-key" aria-hidden="true">${key}</kbd>`:''}</button>`;}
function name(j){return origins[j]?.name||(j==='phosphor'?'磷與養父':'共同主線');}
function pages(text){return text.match(/.{1,76}(?:[。！？」]|$)/g)||[text];}
// Split without dropping text at punctuation or long unpunctuated boundaries.
function lines(text){const parts=text.match(/[^。！？]+[。！？]?[」』]?/g)||[text],out=[];for(const p of parts){if(out.length&&out.at(-1).length+p.length<85)out[out.length-1]+=p;else out.push(p);}return out;}
function warning(){return storageOK?'':'<p class="story-save-warning" role="status">無法保存進度，目前僅於本頁保留。可稍後按「重試保存」。</p>'+b('save','重試保存');}
let searchFound=new Set();let wallState=null;
// H2: the coin rolled in this play-through ('sun' | 'night'); null until the coin step.
let coin=null;
const COIN_TEXT={sun:'太陽朝上。',night:'夜襲朝上。'};
let cursor=0,frontier=0,stepSeen=new Map(),transcript=[],busy=false,session=0,imageToken=0,safeImage=null,imageHost=null,wantedImage='',imageError=false,nextCached='',readingUnits=[];
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function performance(){return window.NDStoryPerformances?.[current.id];}
function step(){return performance().steps[cursor];}
// Groups are only authored, contiguous source IDs. Unknown/test IDs stay single.
// Single-button gates (action) and click-to-reveal inspections are told as reading lines: one click moves on.
const READING_TYPES=['narration','dialogue','action','inspect'];
let wiping=false,lastPress={key:'',at:0};
function compileReadingUnits(nodeId,steps){
 const singleton=()=>steps.map((t,index)=>({start:index,end:index,kind:READING_TYPES.includes(t.type)?'reading':'interaction',stepIds:[t.id]}));
 const splitDialogue=!window.NDStoryStaging?.groupDialogue;// tests may opt back into whole-exchange groups
 const metadata=window.NDStoryReadingGroups,groups=metadata?.groups?.[nodeId]||[],observations=new Set(metadata?.narrativeActionIds||[]),indices=new Map(steps.map((t,index)=>[t.id,index])),starts=new Map(),used=new Set();
 try{
  for(const ids of groups){
   if(!Array.isArray(ids)||!ids.length)throw Error('empty reading group');
   const positions=ids.map(id=>indices.get(id));
   if(positions.every(index=>index===undefined))continue;
   const start=positions[0];
   if(positions.some((index,k)=>index===undefined||index!==start+k||used.has(index)))throw Error('non-contiguous or duplicate reading IDs');
   if(positions.some(index=>!['narration','dialogue'].includes(steps[index].type)&&!(steps[index].type==='action'&&observations.has(steps[index].id))))throw Error('reading group crosses an interaction');
   positions.forEach(index=>used.add(index));
   // Dialogue is staged one voice at a time; only consecutive non-dialogue prose stays together.
   let runStart=0;
   for(let k=0;k<=positions.length;k++){
    const spoken=splitDialogue&&k<positions.length&&steps[positions[k]].type==='dialogue';
    if(k===positions.length||spoken){
     if(k>runStart)starts.set(positions[runStart],{start:positions[runStart],end:positions[k-1],kind:'reading',stepIds:ids.slice(runStart,k)});
     if(spoken){starts.set(positions[k],{start:positions[k],end:positions[k],kind:'reading',stepIds:[ids[k]]});runStart=k+1;}
    }
   }
  }
  const units=[];
  for(let index=0;index<steps.length;){const unit=starts.get(index)||{start:index,end:index,kind:READING_TYPES.includes(steps[index].type)?'reading':'interaction',stepIds:[steps[index].id]};units.push(unit);index=unit.end+1;}
  // A3 ends on Rin choosing to find the red-haired woman; keep the authored
  // completion step for data compatibility, but collect from that final scene.
  const last=units.at(-1),ending=units.at(-2);
  if(nodeId==='A3'&&last?.start===last?.end&&steps[last.start]?.type==='complete'&&ending?.kind==='reading'&&steps[ending.end]?.id==='A3-step-07-b'){
   ending.collectsMemory=true;units.pop();
  }
  return units;
 }catch(error){console.warn('Reading groups rejected for '+nodeId+': '+error.message);return singleton();}
}
function a3Ending(){return current?.id==='A3'&&readingUnit()?.collectsMemory===true;}
function readingUnit(){return readingUnits.find(unit=>unit.start===cursor);}
function begin(id){const n=byId[id];if(!n||!unlocked(n)||!window.NDStoryPerformances?.[id])return;{const perf=window.NDStoryPerformances[id];if(perf.allSteps)perf.steps=perf.allSteps.slice();}coin=null;mapReveal=null;current=n;route=n.job;phase='performance';cursor=frontier=0;readingUnits=compileReadingUnits(id,performance().steps);stepSeen=new Map();searchFound=new Set();wallState=null;recorderCued=new Set();transcript=[];busy=false;wiping=false;session++;imageToken++;safeImage=null;imageHost=null;wantedImage='';imageError=false;nextCached='';message='';choice=null;view='play';draw();window.scrollTo({top:0,left:0,behavior:'instant'});}
function choiceText(){return choice==='help'?'眾人分配有限補給，完成短程接應後回到路線。':'眾人把求援位置交給接應隊，確認沒有尾隨後繼續追查。';}
// DIALOGUE-UNIFY-030: every voiced line (spoken, off-screen, recording, echo) wears 「」; narration and prompts stay bare.
const VOICED_KINDS=['dialogue','offscreen','echo','recording'];
// STORY-RECORDER: recorded voices play through the repaired recorder; the cue fires once per line, never in review.
// STORY-ROAR: a sound that belongs to one specific line. C9-step-13 is the creature's roar from the tunnel mouth.
// AUDIO-MIX-061: H2-r71 no longer repeats the charge that H2-r69 (aiming) already played; the trigger line fires at once.
const STEP_CUES={'C9-r01':'abyssRoar','H2-r20':['fxResFire',['fxResImpact',280]],'H2-r48':'fxResFire','H2-r49':'fxQuakeCrack','H2-r50':'fxUnityStrike','H2-r51':'fxResCharge','H2-r69':'fxResCharge','H2-r71':[['fxResFire',0],['fxResImpact',280]],'H2-r72':'fxResCharge','H2-r75':'fxBellCharge','H2-r76':'fxBellBlast','H2-r77':'fxBellWave','H2-r78':'fxBellHush'};
// H2-WHITEOUT: screen effects tied to one line, like STEP_CUES. whiteout = white light swallows the room then draws back in; surge = a faint warm pulse.
const STEP_FX={'H2-r50':'whiteout','H2-r51':'surge','H2-r72':'surge','H2-r76':'jolt','H2-r77':'quake'};
function stepFx(name){
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 const ticket=session;
// H2 bell shock: the picture itself trembles (decaying jitter) and thin pale rings spread out from the bell tower, timed to the three pulses of fxBellWave (0 / .95 / 1.95s).
 if(name==='jolt'||name==='quake'){
  const pulses=name==='quake'?[[0,1],[950,.75],[1950,.5]]:[[0,1]],total=name==='quake'?4200:1100;
  setTimeout(()=>{
   if(ticket!==session)return;
   const host=root.querySelector('.performance-image-host');
   const shake=(amp,dur)=>{if(!host?.animate)return;const n=Math.round(dur/45),frames=[];for(let i=0;i<=n;i++){const k=Math.pow(1-i/n,1.6)*amp,a=i*2.399;frames.push({translate:(Math.sin(a*3.1)*k).toFixed(1)+'px '+(Math.cos(a*2.3)*k*.7).toFixed(1)+'px',scale:String(1+amp*.0016)});}frames.push({translate:'0 0',scale:'1'});host.animate(frames,{duration:dur,easing:'linear'});};
   const layer=document.createElement('div');layer.className='story-fx story-fx-shock';layer.setAttribute('aria-hidden','true');document.body.append(layer);
   for(const [delay,power] of pulses)setTimeout(()=>{
    if(ticket!==session||!layer.isConnected)return;
    shake(14*power,name==='quake'?1300:700);
    const ring=document.createElement('i');ring.className='story-shock-ring';layer.append(ring);
    ring.animate([{transform:'translate(-50%,-50%) scale(.08)',opacity:.9},{transform:'translate(-50%,-50%) scale(3.4)',opacity:0}],{duration:2300,easing:'cubic-bezier(.2,.6,.3,1)',fill:'forwards'});
   },delay);
   setTimeout(()=>layer.remove(),total+2400);
  },60);
  return;
 }
 setTimeout(()=>{if(ticket!==session)return;const el=document.createElement('div');el.className='story-fx story-fx-'+name;el.setAttribute('aria-hidden','true');el.innerHTML='<i class="story-fx-wash"></i><i class="story-fx-core"></i>';document.body.append(el);setTimeout(()=>el.remove(),name==='whiteout'?3900:1600);},60);
}
// LAB-SHOCK-070: merged A1 retains this source ID; sound and picture share one cue.
let labShock=null;
function cancelLabShock(){
 if(!labShock)return;
 clearTimeout(labShock.timer);labShock.animation?.cancel();labShock=null;
 // playSfx has no per-cue stop handle; an already-started 0.72s impact finishes naturally.
}
function labShockCue(t,review){
 const unit=readingUnit(),steps=performance().steps,id='A2-step-05',key='lab:'+id;
 if(review||document.hidden||!unit||!steps.slice(unit.start,unit.end+1).some(m=>m.id===id)||recorderCued.has(key))return;
 recorderCued.add(key);cancelLabShock();
 const cue={ticket:session,position:cursor,timer:null,animation:null};labShock=cue;
 cue.timer=setTimeout(()=>{
  if(labShock!==cue||cue.ticket!==session||cue.position!==cursor||view!=='play'||phase!=='performance'||document.hidden)return;
  try{if(typeof playSfx==='function')playSfx('fxResImpact');}catch(e){}
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
  const host=root.querySelector('.performance-image-host');
  if(!host?.animate)return;
  const frames=[];
  for(let i=0;i<=18;i++){
   const decay=Math.pow(1-i/18,1.8),a=i*2.399;
   frames.push({translate:`${(Math.sin(a*3.1)*12*decay).toFixed(1)}px ${(Math.cos(a*2.3)*8*decay).toFixed(1)}px`,scale:String(1+.025*decay)});
  }
  frames.push({translate:'0 0',scale:'1'});
  cue.animation=host.animate(frames,{duration:810,easing:'linear'});
 },t.id===id?0:700);
}
let recorderCued=new Set();
function recorderCue(voice,t,review){
 labShockCue(t,review);
 if(review||typeof playSfx!=='function')return;
 const steps=performance().steps,play=(n,delay)=>{try{if(delay)setTimeout(()=>{try{playSfx(n)}catch(e){}},delay);else playSfx(n)}catch(e){}};
 if(!recorderCued.has(t.id)){
  const prev=steps[steps.findIndex(x=>x.id===t.id)-1],prevVoice=prev?voiceForStep(prev):null;
  const name=voice.kind==='recording'?'recorderPlay':(prevVoice?.kind==='recording'&&voice.kind==='narration'?'recorderCut':null);
  if(name){recorderCued.add(t.id);play(name);}
 }
 // Line-specific cues also fire when the line is one member of a grouped reading panel; they follow the group's first sound by a beat.
 const unit=readingUnit();
 for(const m of steps.slice(unit.start,unit.end+1)){const fx=STEP_FX[m.id];if(fx&&!recorderCued.has('fx:'+m.id)){recorderCued.add('fx:'+m.id);stepFx(fx);}}
 for(const m of steps.slice(unit.start,unit.end+1)){const cue=STEP_CUES[m.id];if(cue&&!recorderCued.has('cue:'+m.id)){recorderCued.add('cue:'+m.id);const lead=m.id===t.id?0:700;for(const c of [].concat(cue))Array.isArray(c)?play(c[0],lead+c[1]):play(c,lead);}}
}
function quoteIfSpoken(voice,text){return VOICED_KINDS.includes(voice.kind)&&text?`「${text}」`:text;}
function stepText(t=step()){if(t.type==='inspect'&&t.items?.length)return t.items.length===1?t.items[0].text:t.items.map(i=>'【'+i.label+'】'+i.text).join(' ');return (t.text||'');}
function remember(t){if(!transcript.some(x=>x.id===t.id))transcript.push({id:t.id,speaker:t.speaker||'旁白',text:quoteIfSpoken(voiceForStep(t),stepText(t))||t.label||''});}
function drawReadingUnit(){draw();window.scrollTo({top:0,left:0,behavior:'instant'});}
// Same picture on both sides of a frame change: no black wipe, the text just carries on.
function sameBackground(a,b){try{const pa=composition(a).background?.path,pb=composition(b).background?.path;return !!pa&&pa===pb;}catch{return false;}}
function forward(){
 if(busy||wiping)return;
 cancelLabShock(); if(a3Ending())return;
 const steps=performance().steps,next=readingUnit().end+1;if(next>=steps.length)return;
 const move=()=>{if(cursor<frontier){cursor=next;}else{cursor=next;frontier=cursor;message='';}drawReadingUnit();};
 const from=steps[cursor],to=steps[next],stage=root.querySelector('.story-performance');
 // A new location is one fade through black, not an extra button press.
 if(from&&to&&from.frame!==to.frame&&!sameBackground(from,to)&&stage&&!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
  wiping=true;const ticket=session,prevTitle=performance().frames[from.frame]?.title||'',rawTitle=performance().frames[to.frame]?.title||'',title=rawTitle===prevTitle?'':rawTitle;
  const veil=phase=>{const v=document.createElement('div');v.className='story-scene-veil';v.dataset.phase=phase;v.setAttribute('aria-hidden','true');v.innerHTML=title?`<span>${esc(title)}</span>`:'';return v;};
  stage.append(veil('out'));
  setTimeout(()=>{wiping=false;if(ticket!==session)return;move();const now=root.querySelector('.story-performance');if(now){const v=veil('in');now.append(v);setTimeout(()=>v.remove(),800);}},340);
 }else move();
}
function commit(){if(busy||cursor!==frontier||(step().type!=='complete'&&!a3Ending())||(current?.id==='A3'&&(view!=='play'||phase!=='performance')))return;const lockedBefore=nodes.filter(n=>!unlocked(n)).map(n=>n.id),facesBefore=[...(store.choices.H2faces||[])];if(!complete(current.id))store.completedNodes.push(current.id);if(current.id==='C7'&&choice)store.choices.C7=choice;if(current.id==='H2'&&coin){store.choices.H2=coin;store.choices.H2faces=['sun','night'].filter(f=>f===coin||(store.choices.H2faces||[]).includes(f));}save();mapReveal={id:current.id,opened:lockedBefore.filter(id=>unlocked(byId[id])),face:current.id==='H2'&&coin&&!facesBefore.includes(coin)?coin:null,at:0};phase='reward';draw();}
// Keep only a small decoded working set. The browser may reuse its HTTP cache after eviction.
const decodedAssets=new Map();
function decodeAsset(path){
 if(decodedAssets.has(path))return decodedAssets.get(path);
 const image=new Image();image.src=path;
 const pending=image.decode().then(()=>image).catch(error=>{if(decodedAssets.get(path)===pending)decodedAssets.delete(path);throw error;});
 decodedAssets.set(path,pending);
 while(decodedAssets.size>12)decodedAssets.delete(decodedAssets.keys().next().value);
 return pending;
}
function composition(t=step()){
 const resolved=window.NDStageAssets?.resolve(current.id,t);
 if(resolved?.background?.path)return resolved.kind==='search'?{...resolved,props:resolved.props.filter(p=>p.decorative||p.retained||!searchFound.has(p.id))}:resolved;
 const frame=performance().frames[t.frame];
 return {id:frame.id,kind:'illustration',background:frame,actors:[],title:frame.title};
}
function assetPaths(scene){return [...new Set([scene.background.path,...(scene.actors||[]).map(actor=>actor.path),...(scene.props||[]).map(prop=>prop.path)])];}
function assetKey(scene){return assetPaths(scene).join('|');}
function requestImage(retry=false){
 const scene=composition(),key=JSON.stringify(scene);
 if(wantedImage===key&&!retry)return;
 wantedImage=key;imageError=false;const token=++imageToken;
 paintImage();
 Promise.all(assetPaths(scene).map(decodeAsset)).then(()=>{
  if(token!==imageToken||view!=='play')return;
  safeImage=scene;paintImage(true);preloadReachable();
 }).catch(()=>{if(token!==imageToken)return;imageError=true;paintImage(false);});
}
function preloadReachable(){
 if(readingUnit().kind!=='reading')return;
 const currentAssets=assetKey(composition());
 for(const unit of readingUnits.filter(unit=>unit.start>cursor)){
  if(unit.kind!=='reading')return;
  const t=performance().steps[unit.start];
  const next=composition(t),key=assetKey(next);
  if(key!==currentAssets){if(key!==nextCached){nextCached=key;Promise.all(assetPaths(next).map(decodeAsset)).catch(()=>{});}return;}
 }
}
function voiceForStep(t=step(),scene=composition(t)){
 if(window.NDStageAssets?.speakerPresentation)return window.NDStageAssets.speakerPresentation(t,scene);
 const actor=t.type==='dialogue'?(scene.actors||[]).find(person=>person.name===t.speaker):null;
 return {name:t.speaker||(t.type==='narration'?'旁白':'當前任務'),kind:t.type==='dialogue'?'dialogue':t.type==='narration'?'narration':'task',label:t.type==='dialogue'?'對話':t.type==='narration'?'敘述':'提示',actorId:actor?.id||null};
}
function paintImage(animate=false){
 const host=imageHost;if(!host)return;
 // A reattached host has no computed style yet; flush it so focus changes animate.
 if(host.isConnected)void host.offsetWidth;
 // Reattaching the preserved host for new text must not replay its previous entrance.
 if(!animate)for(const image of host.querySelectorAll('.performance-fade'))image.classList.remove('performance-fade');
 if(safeImage){
  const scene=safeImage,background=scene.background;
  let canvas=host.querySelector('.performance-prop-canvas');
  if(scene.kind==='search'&&!canvas){canvas=document.createElement('div');canvas.className='performance-prop-canvas';const previous=host.querySelector('.story-stage-image');if(previous)canvas.append(previous);host.append(canvas);}
  if(scene.kind!=='search'&&canvas){const previous=canvas.querySelector('.story-stage-image');if(previous)host.prepend(previous);canvas.remove();canvas=null;}
  const imageParent=canvas||host;
  let backgroundImage=host.querySelector('.story-stage-image:not(.performance-leaving)');
  if(!backgroundImage||backgroundImage.getAttribute('src')!==background.path){
   const next=document.createElement('img');next.className='story-stage-image'+(animate?(backgroundImage?' performance-crossfade':' performance-fade'):'');next.src=background.path;next.dataset.t0=String(Date.now());next.alt=background.title||scene.title||'';
   if(backgroundImage&&animate){
    // Crossfade: keep the old image underneath while the new one fades in on top, then drop it.
    backgroundImage.classList.add('performance-leaving');backgroundImage.after(next);
    const old=backgroundImage;setTimeout(()=>old.remove(),1000);
   }else if(backgroundImage)backgroundImage.replaceWith(next);else imageParent.prepend(next);
  }
  if(canvas){
   for(const old of canvas.querySelectorAll('.performance-prop'))old.remove();
   for(const prop of scene.props||[]){
    const object=document.createElement('div');object.className='performance-prop'+(prop.lit?' is-lit':'');object.dataset.prop=prop.id;
    if(prop.mark)object.dataset.mark=prop.mark;if(prop.stack)object.dataset.stack=String(prop.stack);
    Object.assign(object.style,{left:prop.x+'%',top:prop.y+'%',width:prop.w+'%',height:prop.h+'%'});object.style.setProperty('--prop-rotate',(prop.rotate||0)+'deg');
    const image=document.createElement('img');image.src=prop.path;image.alt=prop.name||'';object.append(image);canvas.append(object);
   }
  }
  const actors=scene.actors||[],keep=new Set(),currentScene=composition(),voice=voiceForStep(step(),currentScene);
  // A retained safe frame must not attribute new dialogue to an old scene.
  const speakingId=scene.id===currentScene.id&&readingUnit().start===readingUnit().end?voice.actorId:null;
  for(const actor of actors){
   const key=actor.id+'|'+actor.path;keep.add(key);
   let portrait=[...host.querySelectorAll('.performance-actor')].find(image=>image.dataset.key===key);
   if(!portrait){portrait=document.createElement('img');portrait.className='performance-actor'+(animate?' performance-fade':'');portrait.dataset.key=key;portrait.src=actor.path;portrait.alt=actor.name||'';host.append(portrait);}
   portrait.dataset.actor=actor.id;portrait.dataset.position=['left','right','center'].includes(actor.position)?actor.position:'center';portrait.dataset.active=String(actor.id===speakingId);
  }
  for(const portrait of host.querySelectorAll('.performance-actor'))if(!keep.has(portrait.dataset.key))portrait.remove();
  host.dataset.speaking=String(Boolean(speakingId));
  host.querySelector('.performance-speaker-marker')?.remove();
  const speakingActor=actors.find(actor=>actor.id===speakingId);
  if(speakingActor){
   const marker=document.createElement('span');marker.className='performance-speaker-marker';marker.dataset.position=['left','right','center'].includes(speakingActor.position)?speakingActor.position:'center';marker.setAttribute('aria-hidden','true');
   const name=document.createElement('strong'),label=document.createElement('span');name.textContent=voice.name;label.textContent='正在發言';marker.append(name,label);host.append(marker);
  }
  host.dataset.path=background.path;host.style.setProperty('--stage-art','url("'+new URL(background.path,document.baseURI).href+'")');host.dataset.scene=scene.id;host.dataset.kind=scene.kind;host.setAttribute('aria-label',scene.title||background.title||'故事場景');
  root.querySelector('.story-performance')?.setAttribute('data-scene-kind',scene.kind);
 }
 const status=root.querySelector('.performance-image-status');
 if(status)status.innerHTML=imageError?'場景素材未能載入，保留目前畫面。 '+b('retry-image','重試圖片'):!safeImage?'正在載入場景…':'';
}
function readingVoice(t){if(t.type==='inspect')return {name:t.items?.length===1?t.items[0].label:'查看',kind:'narration',label:'線索',actorId:null};return t.type==='action'&&readingUnit().kind==='reading'?{name:'旁白',kind:'narration',label:'觀察',actorId:null}:voiceForStep(t);}
// A voice with no body on stage (off-screen, recording, echo) hangs its plate in the middle so it never points at a bystander.
function speakerSide(voice){const a=(composition().actors||[]).find(x=>x.id===voice.actorId);if(a&&['left','right','center'].includes(a.position))return a.position;return VOICED_KINDS.includes(voice.kind)?'center':'left';}
// Typewriter: full text stays in the DOM (hidden tail) so layout never jumps and text is always readable by tools.
let typer=null;
function stopTyping(finish){
 if(!typer)return false;
 const t=typer;typer=null;clearTimeout(t.timer);
 if(t.el.isConnected){if(finish){t.shown.textContent=t.full;t.rest.textContent='';}t.el.removeAttribute('data-typing');t.el.setAttribute('aria-live','polite');}
 return true;
}
function typewrite(){
 stopTyping(false);
 const el=root?.querySelector('.story-dialogue-panel[data-presentation=subtitle][data-review=false] .story-spoken');
 if(!el||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 const full=el.textContent,chars=[...full];if(chars.length<2)return;
 const shown=document.createElement('span'),rest=document.createElement('span');shown.className='tw-shown';rest.className='tw-rest';rest.textContent=full;el.textContent='';el.append(shown,rest);
 el.dataset.typing='true';el.setAttribute('aria-live','off');
 const state=typer={el,shown,rest,full,timer:0};let i=0;
 const tick=()=>{
  if(typer!==state)return;
  if(!el.isConnected){typer=null;return;}
  i++;shown.textContent=chars.slice(0,i).join('');rest.textContent=chars.slice(i).join('');
  if(i>=chars.length){stopTyping(true);return;}
  state.timer=setTimeout(tick,/[。！？…]/.test(chars[i-1])?170:/[，、；：]/.test(chars[i-1])?90:30);
 };
 state.timer=setTimeout(tick,120);
}
function readingLine(t){const voice=readingVoice(t),isNarrator=voice.kind==='narration'&&voice.name==='旁白';return `<div class="story-reading-line" data-reading-step-id="${esc(t.id)}" data-voice-kind="${esc(voice.kind)}"${isNarrator?' data-narrator="true"':''}>${isNarrator?'':`<span class="story-line-speaker"><strong>${esc(voice.name)}</strong><span class="story-voice-kind">${esc(voice.label)}</span></span>`}<span class="story-line-text">${esc(quoteIfSpoken(voice,stepText(t)))}</span></div>`;}
function stage(){const focusedAction=root.contains(document.activeElement)?document.activeElement.dataset?.action:null;const t=step(),unit=readingUnit(),review=cursor<frontier,voice=readingVoice(t),reading=unit.kind==='reading',grouped=unit.end>unit.start,members=performance().steps.slice(unit.start,unit.end+1),progress=`${review?'已讀回看 · ':''}${readingUnits.indexOf(unit)+1} / ${readingUnits.length}`;members.forEach(remember);let content='';const navigation=`<div class="story-read-controls">${b('previous','← 上一段',cursor===0)}${review?b('advance',unit.end+1===frontier?'返回目前進度 →':'下一段 →'):a3Ending()?b('commit','收錄這段記憶 →'):reading?b('advance','繼續 →'):''}</div>`;
if(phase==='reward'){const next=nextNode(),skin=collectibleSkin(current);content=`<div class="story-outcome"><p class="story-eyebrow">${current.id==='H2'?(storageOK?'終章 · 記憶已收錄':'終章 · 待保存'):'記憶已收錄'}</p><h2>${esc(current.title)}</h2><p>${skin?`${name(current.job)}・${esc(skin.title)} 外觀已解鎖，可至收藏裝備。`:(storageOK?'已保存本章進度與取得的線索。':'本章已完成，進度與線索目前僅保留於本頁。')}</p>${b('next',next?`下一段 · ${next.id} ${esc(next.title)} →`:'返回章節總覽')}${skin?b('collection','查看外觀收藏'):''}</div>`;}
else{const isNarrator=voice.kind==='narration'&&voice.name==='旁白',spokenText=quoteIfSpoken(voice,stepText(t));content=grouped?`<div class="story-voice"><span class="story-reading-heading">交談與敘述 <span>${members.length} 則</span></span><small>${progress}</small></div><div class="story-spoken story-reading-text" tabindex="-1" aria-label="完整交談">${members.map(readingLine).join('')}</div>`:`<div class="story-voice">${isNarrator?'':`<div class="story-speaker"><strong>${esc(voice.name)}</strong><span class="story-voice-kind">${esc(voice.label)}</span></div>`}<small>${progress}</small></div><p class="story-spoken"${isNarrator?' data-narrator="true"':''} role="status" data-reading-step-id="${esc(t.id)}" aria-label="${esc(voice.name+'，'+voice.label)}">${esc(spokenText)}</p>`;
if(review){if(['search'].includes(t.type))content+=`<div class="performance-review">${(t.items||[]).map(i=>`<p><strong>${esc(i.label)}</strong> ${esc(i.text)}</p>`).join('')}</div>`;if(t.type==='choice')content+=`<p class="performance-review">${esc(choiceText())}</p>`;if(t.type==='coin'&&coin)content+=`<p class="performance-review">${esc(COIN_TEXT[coin])}</p>`;content+='<p class="performance-review-note">回看不重複執行互動或領取獎勵。</p>';}
else if(t.type==='inspect'&&!reading){const selected=stepSeen.get(t.id)||new Set();content+=`<div class="story-actions">${t.items.map((i,k)=>`<button data-inspect="${k}">${selected.has(i.id)?'✓ ':''}${esc(i.label)}</button>`).join('')}</div><p class="performance-inspect-response" role="status">${esc(message)}</p>${b('proceed',t.label||'完成查證，繼續 →',selected.size<t.items.length)}`;}
else if(t.type==='search')content+=`<p class="performance-search-progress">${t.sceneId==='archive-wall'?'一個一個抽屜地找 · 每打開 6 個抽屜，查勤的士兵就會巡到這裡':t.items.filter(i=>searchFound.has(i.id)).length+' / '+t.items.length+' 件已收取 · 不限時，可提示所在區域'}</p><p role="status">${esc(message)}</p>${b('search','進入場景尋找 →',busy)}`;
else if(t.type==='action'&&!reading)content+=b('perform-action',esc(t.label||'繼續行動 →'));
else if(t.type==='rhythm')content+=`<p role="status">${esc(message)}</p>`+b('proceed',esc(t.label||'開始撐盾'),busy);
else if(['puzzle','route'].includes(t.type))content+=`<p role="status">${esc(message)}</p>`+b('proceed',esc(t.label||(t.type==='route'?'規劃撤離路線 →':'開始拼合 →')),busy);
else if(t.type==='battle'){const e=encounters[t.ref||current.id];content+=`<h2>${esc(e.name)}</h2><p>${esc(e.description)}</p><p role="status">${esc(message)}</p>${b('fight','開始卡牌對戰',busy)}`;}
else if(t.type==='choice')content+=`<div class="story-actions"><button data-choice="help" aria-pressed="${choice==='help'}">短程協助撤離</button><button data-choice="direct" aria-pressed="${choice==='direct'}">直接追查，通知接應隊</button></div><p role="status">${esc(message)}</p>${b('proceed','依此路線前進 →',!choice)}`;
else if(t.type==='coin')content+=b('flip',esc(t.label||'擲出硬幣'),busy);
else if(t.type==='complete')content+=b('commit',t.label||'收錄這段記憶 →');
content+=navigation;}
if(!imageHost){imageHost=document.createElement('div');imageHost.className='performance-image-host';}else imageHost.remove();
root.innerHTML=`<section class="story-stage story-performance" data-reading-mode="${grouped?'group':'single'}" aria-label="${esc(current.title)}"><div class="performance-image-host"></div><div class="story-stage-shade"></div><header class="story-stage-header">${b('leave','← 章節地圖')}<div><span>${current.id}</span><h1>${esc(current.title)}</h1></div>${b('log','故事紀錄')}</header><div class="story-stage-space"></div><div class="story-stage-bottom"><p class="performance-image-status" role="status"></p>${warning()}<section class="story-stage-panel story-dialogue-panel" data-presentation="${phase==='reward'?'reward':grouped?'reading-group':reading?'subtitle':'interaction'}" data-reading-start="${unit.start}" data-reading-end="${unit.end}" data-voice-kind="${grouped?'group':esc(voice.kind)}" data-speaker-side="${grouped?'none':speakerSide(voice)}" data-step-id="${esc(t.id)}" data-step-type="${esc(t.type)}" data-review="${review}">${content}</section></div></section>`;root.querySelector('.performance-image-host').replaceWith(imageHost);for(const el of imageHost.querySelectorAll('.story-stage-image:not(.performance-leaving)')){const age=Date.now()-(+el.dataset.t0||0);if(age>=9000)el.classList.add('is-settled');else el.style.animationDelay='-'+age+'ms';}paintImage();requestImage();preloadReachable();const focusTarget=(grouped&&root.querySelector('.story-reading-text'))||(focusedAction&&root.querySelector(`[data-action="${focusedAction}"]:not(:disabled)`))||root.querySelector('.story-stage-panel button:not(:disabled)');focusTarget?.focus({preventScroll:true});recorderCue(voice,t,review);typewrite();}
// STORY-BRANCH-MAP-089: every chapter on one branch map. Four origin lanes converge on 磷與養父, then the shared line
// snakes down the page and splits into H2's two coin endings. Connectors are drawn from the laid-out nodes (drawBranchLinks).
// STORY-BRANCH-MAP-089 stage 3: a map node opens a chapter card (scene art, premise, contents) before the chapter starts.
function chapterArt(n){return art.scenes.find(x=>x.id===n.image)?.path||window.NDStoryPerformances?.[n.id]?.frames?.[0]?.path||'';}
function openChapter(id){const n=byId[id];if(!n||!unlocked(n))return;const done=complete(n.id),src=chapterArt(n),lane=jobs.includes(n.job)?name(n.job):name(n.job);
 const d=modal(`<article class="bmap-detail">${src?`<figure class="bmap-detail-art"><img src="${esc(src)}" alt="${esc(n.title)} 情境圖" decoding="async"></figure>`:''}<p class="bmap-detail-meta">${esc(lane)} · ${n.id} · ${done?'已完成':'可進入'}</p><h2>${esc(n.title)}</h2><p class="bmap-detail-intro">${esc(n.intro||'')}</p><div class="bmap-detail-actions"><button data-chapter-enter>${done?'回顧本章':'進入本章'}</button></div></article>`,`${n.id} ${n.title}`);
 d.classList.add('bmap-detail-dialog');const go=d.querySelector('[data-chapter-enter]');go.onclick=()=>{d.close();begin(n.id);};go.focus();}
// STORY-BRANCH-MAP-089 stage 5: what a chapter holds, read from its steps, shown as an icon row.
function branchNode(n,place=''){const done=complete(n.id),open=unlocked(n),state=done?'done':open?'open':'locked',miss=n.requires.filter(id=>!complete(id));
 return `<button class="bmap-node" data-node-id="${n.id}" data-state="${state}" ${open?'':'disabled'} ${place}${open?'':` title="需先完成 ${esc(miss.join('、'))}"`}><i class="bmap-seal" aria-hidden="true">${n.id}</i><span class="bmap-copy"><span class="bmap-meta">${done?'✓ 已完成':open?'可進入':'未開放'}</span><strong>${esc(n.title)}</strong>${open?'':lockNeed(n,miss)}</span></button>`;}
// STORY-BRANCH-MAP-089 stage 4: each origin lane opens with its hero, in the look the player has equipped.
// Face crops match game-art.js (HUD portraits): [width%, left%, top%] for base and origin art.
const LANE_FACE={swordsman:{base:[230,-45,0],origin:[235,-56,-12]},tank:{base:[235,-48,0],origin:[255,-82,-28]},assassin:{base:[230,-57,0],origin:[225,-54,-3]},gunner:{base:[235,-53,0],origin:[230,-68,-8]}};
// 磷與養父 lane: avatar of her adoptive father, the priest 納爾瓦 (user: no 磷 avatar); [src, width%, left%, top%] face crop.
const PARTY_FACES={phosphor:['assets/story/actors/phosphor.webp',230,-65,-5]};
const PHOSPHOR_FACES=[['assets/story/actors/narva/father.webp',357,-143,-13]];
function laneAvatar(j,finished){const S=window.NDSkins;if(!S)return '';const skin=S.equipped(j),src=S.path(j,skin),base=S.path(j,'base'),[w,l,t]=LANE_FACE[j][skin==='base'?'base':'origin'];return `<span class="bmap-avatar" data-job="${j}" data-finished="${finished}"><img src="${src}" data-fallback="${base}" alt="" decoding="async" style="width:${w}%;left:${l}%;top:${t}%"></span>`;}
// STORY-BRANCH-MAP-089 stage 2: say exactly what a locked node waits for. P1 waits on four origin lines → four seals.
function lockNeed(n,miss){if(n.requires.length>1&&n.requires.every(id=>jobs.includes(byId[id]?.job))){return `<span class="bmap-need bmap-keys" aria-label="需完成四條起源線：已完成 ${n.requires.length-miss.length} / ${n.requires.length}">${n.requires.map(id=>{const j=byId[id].job;return `<i data-lit="${complete(id)}" title="${esc(name(j))}${complete(id)?'（已完成）':'（未完成）'}">${esc(name(j)[0])}</i>`;}).join('')}</span>`;}
 return `<span class="bmap-need">需先完成 ${miss.map(id=>`${id}「${esc(byId[id]?.title||'')}」`).join('、')}</span>`;}
function map(){const seen=store.choices.H2faces||[],shared=nodes.filter(n=>n.job==='party'),pre=nodes.filter(n=>n.job==='phosphor');
 // Left → right flowchart on one grid (scrolls sideways): lane heads | origin chapters (3 cols) | 磷與養父 head | P1 P3 | shared line | endings.
 // Rows 1–4 are the four origin lanes; everything after the convergence sits on the middle two rows.
 const at=(r,c)=>`style="grid-row:${r};grid-column:${c}"`,mid='2 / span 2',P0=6,S0=P0+pre.length+1,E=S0+shared.length;
 const head=(lane,r,c,avatar,label)=>{return `<div class="bmap-lane-head" data-lane="${lane}" data-active="${route===lane}" ${at(r,c)}>${avatar}<b>${label}</b></div>`;};
 const origin=jobs.map((j,ri)=>{const own=nodes.filter(n=>n.job===j),cols=own.length===2?[2,4]:[2,3,4];return head(j,ri+1,1,laneAvatar(j,own.every(n=>complete(n.id))),name(j),own)+own.map((n,k)=>branchNode(n,at(ri+1,cols[k]))).join('');}).join('');
 const preHTML=head('phosphor',mid,P0-1,PHOSPHOR_FACES.map(([src,w,l,t])=>`<span class="bmap-avatar" data-finished="${pre.every(n=>complete(n.id))}"><img src="${src}" alt="" decoding="async" style="width:${w}%;left:${l}%;top:${t}%"></span>`).join(''),'納爾瓦',pre)+pre.map((n,k)=>branchNode(n,at(mid,P0+k))).join('');
 const partyFaces=`<span class="bmap-avatars">${laneAvatar('swordsman',true)}<span class="bmap-avatar" data-mate="phosphor" data-finished="true"><img src="${PARTY_FACES.phosphor[0]}" alt="" decoding="async" style="width:${PARTY_FACES.phosphor[1]}%;left:${PARTY_FACES.phosphor[2]}%;top:${PARTY_FACES.phosphor[3]}%"></span>${laneAvatar('tank',true)}</span>`,
 sharedHTML=head('party',mid,S0-1,partyFaces,'相遇',shared)+shared.map((n,k)=>branchNode(n,at(mid,S0+k))).join('');
 const endings=[['sun','☀','太陽','1 / span 2'],['night','☾','夜襲','3 / span 2']].map(([f,g,l,r])=>`<span class="bmap-ending" data-face="${f}" data-seen="${seen.includes(f)}" data-from="H2" ${at(r,E)}><i class="bmap-seal" aria-hidden="true">${seen.includes(f)?g:'?'}</i><span class="bmap-copy"><span class="bmap-meta">${seen.includes(f)?'✓ 已看過':'尚未揭曉'}</span><strong>${seen.includes(f)?'結局 · '+l:'結局 · ？？？'}</strong></span></span>`).join('');
 return `<div class="bmap-scroll" tabindex="0" aria-label="章節支線圖（可左右捲動）"><section class="campaign-map bmap" style="grid-template-columns:var(--bmap-head) repeat(${E-1},var(--bmap-col))"><svg class="bmap-links" aria-hidden="true"></svg>${origin}${preHTML}${sharedHTML}${endings}</section></div>`;}
// Connectors follow `requires`; the H2 endings hang off H2. Redrawn whenever the map's size changes.
let branchObserver=null,mapReveal=null;
// STORY-BRANCH-MAP-089 stage 1: after a chapter is recorded, the map focuses that node and lights what it opened (once).
const REVEAL_MS=3200;function revealLive(){return mapReveal&&mapReveal.at&&Date.now()-mapReveal.at<REVEAL_MS;}
function drawBranchLinks(){const mapEl=root.querySelector('.bmap'),svg=mapEl?.querySelector('.bmap-links');if(!svg)return;const box=mapEl.getBoundingClientRect(),pos=el=>{const r=(el.classList.contains('bmap-lane-head')&&el.querySelector('.bmap-avatars,.bmap-avatar')||el).getBoundingClientRect();return {l:r.left-box.left,r:r.right-box.left,t:r.top-box.top,b:r.bottom-box.top,cx:(r.left+r.right)/2-box.left,cy:(r.top+r.bottom)/2-box.top};};
 const path=(a,b)=>{if(b.l>=a.r-4){const x1=a.r,x2=b.l,m=(x1+x2)/2;return `M${x1},${a.cy} C${m},${a.cy} ${m},${b.cy} ${x2},${b.cy}`;}if(b.t>=a.b-4){const y1=a.b,y2=b.t,m=(y1+y2)/2;return `M${a.cx},${y1} C${a.cx},${m} ${b.cx},${m} ${b.cx},${y2}`;}const ltr=b.cx>a.cx,x1=ltr?a.r:a.l,x2=ltr?b.l:b.r,m=(x1+x2)/2;return `M${x1},${a.cy} C${m},${a.cy} ${m},${b.cy} ${x2},${b.cy}`;};
 const edges=[];nodes.forEach(n=>{const node=mapEl.querySelector(`[data-node-id="${n.id}"]`);n.requires.forEach(id=>{const from=mapEl.querySelector(`[data-node-id="${id}"]`),entry=n.job!==byId[id]?.job&&mapEl.querySelector(`.bmap-lane-head[data-lane="${n.job}"]`),to=entry||node;if(from&&to)edges.push([from,to,complete(n.id)?'done':complete(id)?'open':'locked',n.id]);});});
 mapEl.querySelectorAll('.bmap-lane-head').forEach(h=>{const first=nodes.find(n=>n.job===h.dataset.lane),node=first&&mapEl.querySelector(`[data-node-id="${first.id}"]`);if(node)edges.push([h,node,complete(first.id)?'done':unlocked(first)?'open':'locked',null]);});
 mapEl.querySelectorAll('.bmap-ending').forEach(e=>{const from=mapEl.querySelector('[data-node-id="H2"]');if(from)edges.push([from,e,e.dataset.seen==='true'?'done':complete('H1')?'open':'locked']);});
 svg.setAttribute('width',box.width);svg.setAttribute('height',box.height);svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
 const live=revealLive(),late=live?Math.round(Date.now()-mapReveal.at):0,isReveal=(a,b,id)=>live&&a.dataset.nodeId===mapReveal.id&&((id&&mapReveal.opened.includes(id))||(b.dataset.face&&b.dataset.face===mapReveal.face));
 svg.innerHTML=edges.map(([a,b,s,id])=>{const d=path(pos(a),pos(b));return isReveal(a,b,id)?`<path data-state="${s}" data-reveal="base" style="animation-delay:${-late}ms" d="${d}"/><path data-reveal="glow" pathLength="1" style="animation-delay:${-late}ms" d="${d}"/>`:`<path data-state="${s}" d="${d}"/>`;}).join('');}
function mountBranchMap(focus){const mapEl=root.querySelector('.bmap');branchObserver?.disconnect();if(!mapEl)return;if(mapReveal&&!mapReveal.at){mapReveal.at=Date.now();}if(revealLive()){const late=Math.round(Date.now()-mapReveal.at),mark=(el,cls)=>{if(!el)return;el.classList.add(cls);el.style.setProperty('--reveal-late',-late+'ms');};mark(mapEl.querySelector(`[data-node-id="${mapReveal.id}"]`),'bmap-just-done');mapReveal.opened.forEach(id=>mark(mapEl.querySelector(`[data-node-id="${id}"]`),'bmap-just-opened'));if(mapReveal.face)mark(mapEl.querySelector(`.bmap-ending[data-face="${mapReveal.face}"]`),'bmap-just-opened');if(late<300)requestAnimationFrame(()=>centerOn([...mapEl.querySelectorAll('.bmap-just-done,.bmap-just-opened')],true));}else{const cur=nodes.find(n=>!complete(n.id)&&unlocked(n))||nodes.at(-1);centerOn([mapEl.querySelector(`[data-node-id="${cur.id}"]`)],false);}bindMapDrag(mapEl.parentElement);drawBranchLinks();branchObserver=new ResizeObserver(()=>drawBranchLinks());branchObserver.observe(mapEl);document.fonts?.ready?.then(()=>drawBranchLinks());
 if(focus){const lane=mapEl.querySelector(`[data-lane="${route}"]`);lane?.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}}
// Centre the sideways map on a set of elements (horizontal scroll inside the map; vertical on the page).
function centerOn(els,smooth){els=els.filter(Boolean);const scroller=root.querySelector('.bmap-scroll');if(!els.length||!scroller)return;const rs=els.map(e=>e.getBoundingClientRect()),sr=scroller.getBoundingClientRect(),left=Math.min(...rs.map(r=>r.left)),right=Math.max(...rs.map(r=>r.right)),behavior=smooth&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'auto';
 scroller.scrollTo({left:Math.max(0,scroller.scrollLeft+(left+right)/2-sr.left-sr.width/2),behavior});if(smooth){const top=Math.min(...rs.map(r=>r.top)),bottom=Math.max(...rs.map(r=>r.bottom));if(top<0||bottom>innerHeight)window.scrollTo({top:Math.max(0,scrollY+(top+bottom)/2-innerHeight/2),behavior});}}
// Drag to pan with a mouse; touch and trackpads scroll natively. A drag never turns into a node click.
function bindMapDrag(scroller){if(!scroller||scroller.dataset.drag)return;scroller.dataset.drag='1';let start=null,moved=false;
 scroller.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;start={x:e.clientX,left:scroller.scrollLeft};moved=false;});
 scroller.addEventListener('pointermove',e=>{if(!start)return;const dx=e.clientX-start.x;if(!moved&&Math.abs(dx)>5){moved=true;scroller.classList.add('is-dragging');scroller.setPointerCapture(e.pointerId);}if(moved)scroller.scrollLeft=start.left-dx;});
 const end=()=>{start=null;scroller.classList.remove('is-dragging');};scroller.addEventListener('pointerup',end);scroller.addEventListener('pointercancel',end);
 scroller.addEventListener('click',e=>{if(moved){e.stopPropagation();e.preventDefault();moved=false;}},true);}
// H2: one coin icon per face; the faces this save has seen are lit.
function coinFaces(){const seen=store.choices.H2faces||[];return `<span class="campaign-coin-faces" aria-label="硬幣：已看過 ${seen.length} / 2 面">${[['sun','☀','太陽'],['night','☾','夜襲']].map(([f,g,l])=>`<span class="campaign-coin" data-face="${f}" data-seen="${seen.includes(f)}" title="${l}${seen.includes(f)?'（已看過）':'（未看過）'}" aria-hidden="true">${g}</span>`).join('')}</span>`;}
function collectibleSkin(node){
 return node&&node.id===prefix[node.job]+'3'?art.skins[node.job]:null;
}
function collection(){
 const cards=nodes.filter(collectibleSkin).map(node=>{
  const skin=collectibleSkin(node),done=NDSkins.unlocked(node.job),equipped=NDSkins.equipped(node.job)===skin.id;
  return `<article class="story-skin ${done?'unlocked':'locked'}" data-skin-id="${esc(skin.id)}"><img src="${skin.path}" data-fallback="${window.NDSkins.path(node.job,'base')}" alt="${esc(name(node.job)+'・'+skin.title)}"><div><h3>${esc(name(node.job)+'・'+skin.title)}</h3><p>${done?'已解鎖':'完成「'+esc(node.title)+'」解鎖'}</p>${equipped?`<button data-equip="${node.job}">還原原始外觀</button>`:''}</div></article>`;
 }).join('');
 return `<section class="story-collection"><h2>外觀收藏</h2><p>完成各角色的起源故事，解鎖專屬外觀。</p><div class="story-cards">${cards}</div></section>`;
}
function sceneUnlocked(scene){return nodes.some(n=>complete(n.id)&&((window.NDStoryPerformances?.[n.id]?.frames||[]).some(f=>f.id===scene.id)||n.image===scene.id||(jobs.includes(n.job)&&art.nodes[n.job][Number(n.id[1])-1].includes(scene.id))));}
function gallery(){return `<section class="story-gallery"><h2>故事圖鑑 · ${art.scenes.length} 幅</h2>${b('spoilers',spoilers?'隱藏未完成劇情':'顯示完整圖鑑（含後續劇情）')}<div class="story-gallery-grid">${art.scenes.filter(s=>spoilers||sceneUnlocked(s)).map(s=>`<button class="story-scene" data-scene="${s.id}"><img src="${s.path}" alt="${s.title}" loading="lazy"><span>${s.group} · ${s.title}</span></button>`).join('')}</div></section>`;}
function evidenceHTML(){return `<h2>線索紀錄</h2><p>回憶由各角色持有；只有共同主線的查證才形成全隊已知資訊。</p>${Object.entries(store.evidence).map(([id,e])=>`<details><summary>${e.label} · ${e.sourceNode} / ${name(e.owner)}</summary><p>${e.description}</p></details>`).join('')||'<p>尚未完成故事節點。</p>'}`;}
function draw(){cancelLabShock();document.body.classList.toggle('story-playing',view==='play');if(view==='play'){stage();return;}root.innerHTML=`<div class="story-shell"><header class="story-header"><a href="index.html">← 首頁</a><a href="Nightfall-Duel-V12.12.39-Test.html">自由決鬥</a>${b('collection','外觀收藏')}${b('gallery','故事圖鑑')}</header><section class="story-intro"><div><p class="story-eyebrow">故事主線 · 起源與被留下來的人</p><h1>鐘聲以外的名字</h1><p>四段往事交會於暮城。循著博士留下的線索，追查暮晶與鐘聲背後的真相。</p><p class="story-progress"><span>已完成故事節點</span><strong>${store.completedNodes.length}<small> / ${nodes.length}</small></strong></p></div></section>${warning()}<p role="status">${message}</p>${view==='collection'?collection():view==='gallery'?gallery():view==='workshop'?`<section class="story-puzzle-list sq-list" data-sq="list"><header class="sq-list-head"><p class="sq-eyebrow"><b class="sq-badge">支線</b><span>小遊戲 · 獨立試玩</span></p><h2>拼圖工坊</h2></header><p>獨立試玩含後續劇情，不解鎖章節或外觀。</p><div class="story-puzzle-choices">${Object.entries(NDStoryPuzzles.scenes).map(([id,s])=>`<button class="sq-card" data-puzzle="${id}"><span class="sq-card-type"><b class="sq-badge">支線</b>拼圖</span><strong>${s.title}</strong><small>${['archive','recorder'].includes(id)?'含後續劇情 · 點擊即查看並試玩':'獨立試玩 · 不保存進度'}</small></button>`).join('')}</div></section>`:map()}</div>`;if(!['collection','gallery','workshop'].includes(view))mountBranchMap(false);else branchObserver?.disconnect();}
function modal(html,label){const trigger=document.activeElement,d=document.createElement('dialog');d.className='story-log-dialog';d.setAttribute('aria-label',label);d.innerHTML='<button data-close>關閉</button>'+html;d.querySelector('[data-close]').onclick=()=>d.close();d.addEventListener('close',()=>{d.remove();if(trigger?.isConnected)trigger.focus();},{once:true});document.body.append(d);d.showModal();return d;}
function openScene(id){const list=art.scenes.filter(s=>spoilers||sceneUnlocked(s));let at=list.findIndex(s=>s.id===id);if(at<0)return;const d=modal('<figure><img style="width:100%"><figcaption></figcaption></figure><button data-prev>上一張</button><button data-next>下一張</button>','故事情境圖');function paint(){d.querySelector('img').src=list[at].path;d.querySelector('img').alt=list[at].title;d.querySelector('figcaption').textContent=list[at].title;d.querySelector('[data-prev]').disabled=at===0;d.querySelector('[data-next]').disabled=at===list.length-1;}function step(x){at=Math.max(0,Math.min(list.length-1,at+x));paint();}d.querySelector('[data-prev]').onclick=()=>step(-1);d.querySelector('[data-next]').onclick=()=>step(1);d.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();step(e.key==='ArrowLeft'?-1:1);}});paint();d.querySelector('[data-close]').focus();}
function patrolEncounter(){
 const base=JSON.parse(JSON.stringify(encounters['C4-outer'])),pool=[{id:'patrol-blade',job:'swordsman',name:'查勤劍衛',hp:10,attack:1,portrait:'assets/characters/enemies/enemy-blade.webp'},{id:'patrol-gunner',job:'gunner',name:'查勤槍手',hp:10,attack:1,portrait:'assets/story/actors/gun-unify/enemy-gunner.webp'}];
 const pick=(i,k)=>{const e={...pool[k]};e.id+='-'+i;return e;};
 // Random, but never two gunners: a gunner first forces a swordsman second.
 const firstKind=Math.random()<.5?0:1,secondKind=firstKind===1?0:(Math.random()<.5?0:1);
 const enemies=[pick(1,firstKind),pick(2,secondKind)];
 return {...base,name:'查勤的士兵',enemy:enemies[0].job,enemies,description:'查勤的士兵巡到檔案櫃前。伊芙與朔擋下他們，朔護著磷。'};
}
function openArchiveWall(t){
 if(busy||cursor!==frontier)return;
 const ticket=session,position=cursor,trigger=document.activeElement;busy=true;let returned=false;
 const valid=()=>!returned&&ticket===session&&position===cursor&&view==='play';
 wallState=wallState||window.NDArchiveWall.newState();
 const finish=success=>{if(!valid())return;returned=true;busy=false;if(success&&wallState.found)forward();else draw();};
 const launch=()=>{
  if(!valid())return;
  try{
   const dialog=window.NDArchiveWall.open({state:wallState,trigger,
    onFound(){if(!valid()||searchFound.has('sealed-order'))return;searchFound.add('sealed-order');const item=t.items[0];transcript.push({id:t.id+'-sealed-order',speaker:item.label,text:item.text});requestImage();},
    onHint(text){if(valid())transcript.push({id:t.id+'-hint',speaker:'伊芙',text});},
    onPatrol(n,done){
     if(!valid())return;
     if(!window.NDStoryEnergyBattle?.start){done(false);return;}
     try{window.NDStoryEnergyBattle.start(patrolEncounter(n),ok=>{if(!valid())return;document.body.classList.add('story-playing');done(!!ok);});}catch{done(false);}
    },
    onResume(){launch();},
    onComplete(){finish(true);},onCancel(){finish(false);}});
   if(!dialog){busy=false;message='尋物介面暫時無法開啟，請重試。';draw();}
  }catch{busy=false;message='尋物介面暫時無法開啟，請重試。';draw();}
 };
 launch();
}
function openSearch(){
 if(busy||cursor!==frontier||step().type!=='search')return;
 if(step().sceneId==='archive-wall'&&window.NDArchiveWall){openArchiveWall(step());return;}
 if(!window.NDStorySearch?.open){message='尋物介面尚未載入，請稍後重試。';draw();return;}
 const t=step(),ticket=session,position=cursor,trigger=document.activeElement;busy=true;let returned=false;
 const valid=()=>!returned&&ticket===session&&position===cursor&&view==='play';
 const items=performance().steps.filter(s=>s.type==='search'&&s.sceneId===t.sceneId).flatMap(s=>s.items);
 const finish=success=>{if(!valid())return;returned=true;busy=false;if(success&&t.items.every(i=>searchFound.has(i.id)))forward();else draw();};
 try{
  const dialog=NDStorySearch.open(t.sceneId,{targetIds:t.items.map(i=>i.id),foundIds:[...searchFound],items,trigger,
   onCollect(id){if(!valid()||!t.items.some(i=>i.id===id)||searchFound.has(id))return;searchFound.add(id);const item=t.items.find(i=>i.id===id);transcript.push({id:t.id+'-'+id,speaker:item.label,text:item.text});requestImage();},
   onComplete(){finish(true);},onCancel(){finish(false);}});
  if(!dialog){busy=false;message='尋物介面暫時無法開啟，請重試。';draw();}
 }catch{busy=false;message='尋物介面暫時無法開啟，請重試。';draw();}
}
function openShieldRhythm(){
 if(busy||view!=='play'||phase!=='performance'||cursor!==frontier||step().type!=='rhythm')return;
 const api=window.NDShieldRhythm;
 if(!api?.open){message='撐盾挑戰尚未載入，請稍後重試。';draw();return;}
 busy=true;const ticket=session,position=cursor;let settled=false,dialog=null;
 const active=()=>ticket===session&&position===cursor&&view==='play'&&phase==='performance';
 try{dialog=api.open({practice:false,trigger:document.activeElement,onComplete(){
  if(settled||!active())return;
  settled=true;busy=false;forward();
 }});}catch(error){console.error('shield rhythm failed to open',error);}
 if(dialog)dialog.addEventListener('close',()=>{
  if(settled)return;settled=true;
  if(active()){busy=false;message='尚未完成撐盾，可重新挑戰。';draw();}
 },{once:true});
 else if(!settled){settled=true;if(active()){busy=false;message='撐盾挑戰暫時無法開啟，請重試。';draw();}}
}
function proceed(){if(busy||cursor!==frontier)return;const t=step();if(t.type==='rhythm'){openShieldRhythm();return;}if(t.type==='inspect'&&(stepSeen.get(t.id)?.size||0)<t.items.length)return;if(t.type==='choice'){if(!choice)return;if(!transcript.some(x=>x.id===t.id+'-choice'))transcript.push({id:t.id+'-choice',speaker:'路線選擇',text:choiceText()});}if(['puzzle','route'].includes(t.type)){busy=true;const ticket=session,position=cursor,api=t.type==='route'?(window.NDStoryMaze?.scenes?.[t.ref]?window.NDStoryMaze:window.NDStoryRoute):window.NDStoryPuzzles;if(!api?.open){busy=false;message=t.type==='route'?'撤離路線任務尚未載入，請稍後重試。':'拼圖介面尚未載入，請稍後重試。';draw();return;}let dialog=null;try{dialog=api.open(t.ref,{completionText:t.ref==='recorder'?'接線完成。桌燈已點亮，磷準備播放納爾瓦留下的紀錄。':undefined,onComplete(){if(ticket!==session||position!==cursor)return;busy=false;forward();}});}catch(error){console.error('story mini-game failed to open',t.ref,error);}if(dialog)dialog.addEventListener('close',()=>{if(ticket===session&&position===cursor){busy=false;draw();}},{once:true});else{busy=false;message=t.type==='route'?'撤離路線任務暫時無法開啟，請重試。':'拼圖介面暫時無法開啟，請重試。';draw();}return;}if(['inspect','choice'].includes(t.type))forward();}
// H2: toss the coin. Presentation randomness only (never the battle RNG); the other branch's steps are dropped for this play-through.
function flip(){
 if(busy||cursor!==frontier||step().type!=='coin')return;
 const t=step(),perf=performance();coin=Math.random()<.5?'sun':'night';
 perf.steps=perf.steps.filter(item=>!item.branch||item.branch===coin);
 readingUnits=compileReadingUnits(current.id,perf.steps);
 remember(t);if(!transcript.some(x=>x.id===t.id+'-coin'))transcript.push({id:t.id+'-coin',speaker:'硬幣',text:COIN_TEXT[coin]});
 coinToss(coin,forward);
}
// H2-COIN-FX: the coin flies up spinning, turns over and over, and stops at the top with the rolled face toward the player.
// Purely visual (the face is already decided); skipped with reduced motion. Input is held until it lands.
const COIN_ART={sun:'assets/story/props/chapter-props/h2-coin-sun.webp',night:'assets/story/props/chapter-props/h2-coin-night.webp'};
function coinToss(face,done){
 const stage=root.querySelector('.story-performance');
 if(!stage||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||!document.body.animate){done();return;}
 const cue=n=>{try{if(typeof playSfx==='function')playSfx(n);}catch(e){}};
 busy=true;const ticket=session;
 const box=document.createElement('div');box.className='story-coin-toss';box.setAttribute('aria-hidden','true');
 box.innerHTML=`<div class="story-coin-lift"><div class="story-coin"><img class="story-coin-face" src="${COIN_ART.sun}" alt=""><img class="story-coin-face story-coin-back" src="${COIN_ART.night}" alt=""></div></div><div class="story-coin-glint"></div>`;
 stage.append(box);
 const spin=box.querySelector('.story-coin'),lift=box.querySelector('.story-coin-lift'),T=1700;
 cue('coinFlip');
 spin.animate([{transform:'rotateX(0deg)'},{transform:'rotateX('+(7*360+(face==='night'?180:0))+'deg)'}],{duration:T,easing:'cubic-bezier(.12,.62,.28,1)',fill:'forwards'});
 lift.animate([{transform:'translateY(46vh) scale(.5)'},{transform:'translateY(-7vh) scale(1)',offset:.72},{transform:'translateY(0) scale(1.05)'}],{duration:T,easing:'cubic-bezier(.22,.8,.3,1)',fill:'forwards'});
 const end=()=>{box.remove();if(ticket!==session)return;busy=false;done();};
 setTimeout(()=>{if(ticket!==session){box.remove();return;}box.classList.add('is-landed');},T);
 setTimeout(()=>box.classList.add('is-out'),T+750);
 setTimeout(end,T+1100);
}
function act(a){if(a==='retry-image'){requestImage(true);return;}if(a==='flip'){flip();return;}if(a==='advance'){if(cursor<frontier||readingUnit().kind==='reading')forward();}else if(a==='previous'){if(!busy){cursor=readingUnits[Math.max(0,readingUnits.findIndex(unit=>unit.start===cursor)-1)].start;message='';drawReadingUnit();}}else if(a==='perform-action'){if(!busy&&cursor===frontier&&step().type==='action'&&readingUnit().kind==='interaction')forward();}else if(a==='search')openSearch();else if(a==='proceed')proceed();else if(a==='commit')commit();else if(a==='next'){const next=nextNode();if(next)begin(next.id);else{view='map';draw();}}else if(a==='fight'){if(busy||cursor!==frontier||step().type!=='battle')return;if(!window.NDStoryEnergyBattle?.start){message='戰鬥模組尚未載入，請稍後重試。';draw();return;}busy=true;const ticket=session,position=cursor;let returned=false;const onReturn=success=>{if(returned||ticket!==session||position!==cursor)return;returned=true;busy=false;document.body.classList.add('story-playing');if(success)forward();else{message='未達成關卡條件。可以重新對戰，已完成的場景互動會保留。';draw();}};try{window.NDStoryEnergyBattle.start(encounters[step().ref||current.id],onReturn);}catch(error){busy=false;message='戰鬥暫時無法啟動，請重試。';draw();}}else if(a==='log'){modal('<h2>已讀故事紀錄</h2>'+transcript.filter(t=>t.text).map(t=>`<p data-story-record-id="${esc(t.id)}"><strong>${esc(t.speaker)}</strong>：${esc(t.text)}</p>`).join(''),'已讀故事紀錄');}else if(a==='evidence')modal(evidenceHTML(),'線索紀錄');else if(a==='leave'){if(phase==='reward'){view='map';draw();return;}const d=modal('<h2>暫時離開？</h2><p>本章未完成的互動與對戰會重新開始，已收錄的記憶與解鎖的外觀會保留。</p><button data-exit>離開節點</button>','離開節點');d.querySelector('[data-exit]').onclick=()=>{session++;imageToken++;busy=false;d.close();view='map';draw();};}else if(a==='save'){save();draw();}else if(a==='spoilers'){spoilers=!spoilers;draw();}else if(['map','collection','gallery','workshop'].includes(a)){view=a;message='';draw();}}
// STORY-HOTKEY: keyboard control for dialogue / reading mode. Never fires while a dialog, minigame or battle owns the keyboard.
// STORY-NO-ARROWS: dialogue/story buttons carry plain labels (the → / ← glyphs are stripped after every render).
function stripButtonArrows(){
 if(!root)return;
 for(const button of root.querySelectorAll('button')){
  const walker=document.createTreeWalker(button,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode())){
   if(node.parentElement&&node.parentElement.closest('.story-key'))continue;
   const text=node.nodeValue;if(/[→←]/.test(text)){const next=text.replace(/\s*[→←]\s*/g,' ').trim();if(next!==text)node.nodeValue=next;}
  }
 }
}
function storyKey(e){
 if(!root||!root.isConnected||view!=='play'||!current||busy||e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||e.repeat)return;
 if(document.querySelector('dialog[open],.story-energy-overlay'))return;
 const t=e.target,inField=t&&t.closest&&t.closest('input,textarea,select,[contenteditable="true"]');if(inField)return;
 const onButton=Boolean(t&&t.closest&&t.closest('button,a')),k=e.key;
 const btn=sel=>{const el=root.querySelector(sel);return el&&!el.disabled?el:null};
 let el=null;
 if(k===' '||k==='Enter'||k==='ArrowRight'){
  if(onButton&&k!=='ArrowRight')return;
  if(stopTyping(true)){e.preventDefault();return;}
  el=btn('[data-action="advance"]')||btn('[data-action="perform-action"]')||btn('[data-action="proceed"]')||btn('[data-action="fight"]')||btn('[data-action="search"]')||btn('[data-action="commit"]')||btn('[data-action="flip"]')||btn('[data-action="next"]');
 }else if(k==='ArrowLeft')el=btn('[data-action="previous"]');
 else if(k==='l'||k==='L')el=btn('[data-action="log"]');
 else if(k==='Escape')el=btn('[data-action="leave"]');
 else if(/^[1-9]$/.test(k))el=[...root.querySelectorAll('[data-inspect],[data-choice]')].filter(x=>!x.disabled)[Number(k)-1]||null;
 if(!el)return;
 e.preventDefault();el.click();
}
let storyKeyBound=false;
window.NDStory={mount(el){if(root)return;root=el;window.addEventListener('blur',cancelLabShock);window.addEventListener('pagehide',cancelLabShock);window.addEventListener('orientationchange',cancelLabShock);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelLabShock();});if(!storyKeyBound){storyKeyBound=true;document.addEventListener('keydown',storyKey);}new MutationObserver(stripButtonArrows).observe(root,{childList:true,subtree:true});root.addEventListener('error',e=>{const img=e.target;if(img.dataset?.fallback){const src=img.dataset.fallback;delete img.dataset.fallback;img.src=src;}},true);root.addEventListener('click',e=>{
 // Visual-novel convention: tapping the scene or dialogue box finishes the line, then advances.
 if(phase==='performance'&&current&&!e.target.closest('button,a,dialog,input,select,textarea')&&e.target.closest('.story-stage-space,.story-dialogue-panel[data-presentation=subtitle],.story-performance')&&!e.target.closest('.story-stage-header,.story-read-controls,.story-actions')){
  if(stopTyping(true))return;
  if(cursor<frontier||readingUnit()?.kind==='reading'){forward();return;}
  // Route/puzzle steps still open through the same tap-anywhere gesture as the rest of the VN flow,
  // not just their small button, so a tap that lands near-but-not-on it is never a silent no-op.
  if(!busy&&cursor===frontier&&['route','puzzle'].includes(step().type)){proceed();return;}
 }
},true);
root.addEventListener('click',e=>{const el=e.target.closest('button');if(!el||el.disabled||!root.contains(el))return;const d=el.dataset;
 // Fast taps at one spot (click-to-advance, then the next button) arrive with detail>1; only a repeat of the same control is a double press.
 const pressKey=(d.action||d.nodeId||d.inspect||d.choice||el.className)+'',pressAt=Date.now();if(e.detail>1&&pressKey===lastPress.key&&pressAt-lastPress.at<300)return;lastPress={key:pressKey,at:pressAt};if(d.nodeId)openChapter(d.nodeId);else if(d.route){route=d.route;view='map';message='';draw();mountBranchMap(true);}else if(d.inspect!==undefined){if(busy||cursor!==frontier||step().type!=='inspect')return;const t=step(),i=t.items[Number(d.inspect)];if(!i)return;const selected=stepSeen.get(t.id)||new Set();selected.add(i.id);stepSeen.set(t.id,selected);message=i.text;if(!transcript.some(x=>x.id===t.id+'-'+i.id))transcript.push({id:t.id+'-'+i.id,speaker:i.label,text:i.text});draw();}else if(d.choice){if(cursor!==frontier||step().type!=='choice'||!['help','direct'].includes(d.choice))return;choice=d.choice;message=choiceText();draw();}else if(d.equip){const j=d.equip,r=NDSkins.equip(j,NDSkins.equipped(j)==='base'?art.skins[j].id:'base');message=r.persisted?'外觀已保存':'無法保存外觀，目前僅於本頁保留';draw();}else if(d.scene)openScene(d.scene);else if(d.puzzle)NDStoryPuzzles.open(d.puzzle,{practice:true,trigger:el});else act(d.action);});draw();stripButtonArrows();},resume(){draw();stripButtonArrows();}};
window.NDCampaign={nodes,encounters,unlocked:id=>unlocked(byId[id]),snapshot:()=>JSON.parse(JSON.stringify(store)),performanceState:()=>({node:current?.id,cursor,frontier,busy,phase,foundIds:[...searchFound],wall:wallState?{opened:wallState.opened.length,fights:wallState.fights,sinceFight:wallState.sinceFight,found:wallState.found,hint:wallState.hintShown}:null,step:current?JSON.parse(JSON.stringify(step())):null,reading:current?{...readingUnit(),stepIds:[...readingUnit().stepIds],index:readingUnits.indexOf(readingUnit()),total:readingUnits.length}:null})};
})();
