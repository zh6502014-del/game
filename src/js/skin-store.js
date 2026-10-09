/* Cosmetic persistence is independent of battle rules and story save format. */
(() => {
'use strict';
const skins=window.NDStoryArt.skins, KEY='nightfallSkinsV1', prefix={assassin:'A',swordsman:'S',tank:'T',gunner:'E'};
let choices={}, sessionProgress={};
try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');if(raw&&typeof raw==='object'&&!Array.isArray(raw))choices=raw;}catch{}
function progress(job){
 if(!Object.hasOwn(prefix,job))return 0;
 let count=sessionProgress[job]||0;
 // Read each generation independently: a corrupt or unavailable key must not hide the other.
 try{const old=JSON.parse(localStorage.getItem('nightfallStoryV1')||'{}');if(Number.isInteger(old?.[job]))count=Math.max(count,Math.max(0,Math.min(3,old[job])));}catch{}
 try{const current=JSON.parse(localStorage.getItem('nightfallStoryV2')||'null');if(current?.version===2&&Array.isArray(current.completedNodes)){while(count<3&&current.completedNodes.includes(prefix[job]+(count+1)))count++;}}catch{}
 return count;
}
function unlocked(job){return !!skins[job]&&progress(job)>=3;}
function equipped(job){return unlocked(job)&&choices[job]===skins[job].id?choices[job]:'base';}
function path(job,id='base'){return skins[job]&&id===skins[job].id?skins[job].path:(job==='gunner'?'assets/story/actors/gun-unify/gunner.webp':`assets/characters/${job}.webp`);}
function equip(job,id){if(!skins[job]||(id!=='base'&&(id!==skins[job].id||!unlocked(job))))return {ok:false,persisted:false};choices[job]=id;let persisted=true;try{localStorage.setItem(KEY,JSON.stringify(choices));}catch{persisted=false;}window.dispatchEvent(new Event('nd-skin-change'));return {ok:true,persisted};}
function controls(job){const s=skins[job],current=equipped(job);return `<div class="skin-controls" aria-label="玩家外觀"><span>角色外觀</span><button type="button" aria-pressed="${current==='base'}" onclick="equipSetupSkin('${job}','base')">原始外觀</button><button type="button" aria-pressed="${current===s.id}" ${unlocked(job)?'':'disabled'} onclick="equipSetupSkin('${job}','${s.id}')">${s.title}${unlocked(job)?'':' · 完成故事線解鎖'}</button><small id="skin-save-status" role="status"></small></div>`;}
window.NDSkins=Object.freeze({unlocked,equipped,equip,path,controls,noteProgress(job,value){sessionProgress[job]=Math.max(sessionProgress[job]||0,value);}});
})();
