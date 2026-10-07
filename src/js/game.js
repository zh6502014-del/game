"use strict";

// V12.12.27 — Fix Attack Lock lifecycle: current committed attacks are never retroactively blocked by a lock created during resolution.
  // V12.12.24 — Fix Tank Defense per-round state cleanup.
// V12.12.23 — Fix Defense state leakage: -0.25 applies only when the actual Defense card was used this round.
// V12.10.16 baseline preserved; V12.11.0 — Reduction pass.
// V12.12.0 FINAL — V12.11.0 + MISS dodge feedback only.
// V12.12.13 — Impact feedback remains one-shot and uses horizontal left/right motion.
// Do not rely on browser Window named-property behavior for #app.
// V12.12.0 — Add MISS combat feedback only. No gameplay/UI structure changes.
const app=document.getElementById("app");
if(!app) throw new Error("Nightfall Duel: #app root not found");

const JOBS={
  swordsman:{n:"劍客",i:"⚔️",t:"控制・瀕死爆發",d:"HP < 5 時取得一次性的「劍氣出竅」；命中後有機會封鎖對手攻擊。"},
  tank:{n:"坦克",i:"🛡️",t:"防守・反擊",d:"每回合可免費使用一次護盾 +2，且防禦有機會反擊；有盾時反傷機率 30%。"},
  assassin:{n:"刺客",i:"🗡️",t:"偷牌・夜襲",d:"閃擊造成傷害並只偷取對手基礎卡；夜晚可轉化閃躲為夜襲攻擊。"},
  gunner:{n:"槍手",i:"🔫",t:"爆發・遠距",d:"爆擊造成 2 傷害並附加灼傷。"}
};
const AIS={
  conservative:"鐵壁",
  aggressive:"狂戰",
  strategic:"獵手"
};
const BASE=[
  {n:"攻擊",k:"attack",target:"combat",i:"⚔️",s:"造成 1 傷害"},
  {n:"防禦",k:"defense",target:"combat",i:"🛡️",s:"本次受到傷害 -0.25"},
  {n:"閃躲",k:"dodge",target:"combat",i:"👁️",s:"50% 閃躲；刺客可反擊"}
];

let playerJob="swordsman",aiJob="tank",aiType="strategic",S=null,dragIndex=null,pointerDrag=null,dragCardEl=null;
let gameSessionId=0;

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function currentSession(id){return !!S && S.session===id;}
function sessionSleep(ms,id){return new Promise(resolve=>setTimeout(()=>resolve(currentSession(id)),ms));}
let assassinCoinQueue=Promise.resolve();
/* V12.12.17 — Real recorded coin flip: Raventhornn, Freesound #181189, CC0. Embedded locally; no external dependency. */
// V12.12.39 — Contextual music layers + audio settings: character select / battle / result.
const AUDIO_URLS={
  "setupBgm":"https://opengameart.org/sites/default/files/prepare_to_fight.mp3",
  "bgm":"https://lpc.opengameart.org/sites/default/files/Battle.mp3",
  "resultBgm":"https://opengameart.org/sites/default/files/upgrades_menu_asset_pack.ogg",
  "cardPickup":"https://opengameart.org/sites/default/files/cut.wav",
  "cardPlace":"https://opengameart.org/sites/default/files/contact1.wav",
  "cardFlip":"https://opengameart.org/sites/default/files/contact2.wav",
  "cardInvalid":"https://opengameart.org/sites/default/files/gun_reload_lock_or_click_sound.mp3",
  "hit":"https://opengameart.org/sites/default/files/skill_hit.mp3",
  "burn":"https://opengameart.org/sites/default/files/fire_sound_effect.mp3",
  "counter":"https://opengameart.org/sites/default/files/attack_hit.mp3",
  "coinFlip":"assets/coinFlip.wav",
  "victory":"https://opengameart.org/sites/default/files/winfretless.ogg",
  // DUEL-SFX-062 — local, synthesized duel combat cues (scripts/gen_duel_sfx.py). Played from the presentation timeline
  // (combat-fx.js impact/launch, environment.js casts), not from rules code, so each sound lands on its visual.
  ...Object.fromEntries(["swingBlade","swingHeavy","swingShadow","shot","swingSpirit","hitBlade","hitHeavy","hitShadow","hitBullet","hitCrit","hitSpirit",
    "counter","blockShield","ward","evade","burn","shieldUp","castClass","castSpirit","castDomain","domainHeal","nightfall"]
    .map(n=>["duel"+n[0].toUpperCase()+n.slice(1),"assets/audio/duel/"+n+".mp3"]))
  // AUDIO-MIX-061: "shield" and "lock" used to reuse the hit / cardInvalid files and sounded identical to them; they now use their own synthesized cues.
  // "defeat" has no remote file: the downloaded sad-trumpet clip sounded comical, so the synthesized low toll plays instead.
};
const AUDIO_DEFAULTS={setupBgm:.11,bgm:.144,resultBgm:.12,cardPickup:.28,cardPlace:.42,cardFlip:.5,cardInvalid:.38,hit:.55,shield:.5,lock:.45,burn:.48,counter:.58,coinFlip:.624,victory:.864,defeat:.55};
const AUDIO_LABELS={
  setupBgm:["備戰音樂","職業選擇頁"],bgm:["戰鬥音樂","決鬥進行中"],resultBgm:["結算音樂","戰鬥結束"],
  cardPickup:["拿牌","拖曳拿起卡牌"],cardPlace:["放牌","卡牌放入位置"],cardFlip:["翻牌","Reveal／翻面"],cardInvalid:["無效操作","禁止操作提示"],
  hit:["攻擊與命中","揮擊、命中、閃避"],shield:["護盾與防禦","護盾、格擋、領域"],lock:["封鎖與夜襲","攻擊封鎖、入夜"],burn:["灼傷","Burn 效果"],
  counter:["反擊","Tank Counter"],coinFlip:["硬幣","夜襲判定"],victory:["勝利","Victory"],defeat:["失敗","Defeat"]
};
let audioVolumes={};
try{audioVolumes=JSON.parse(localStorage.getItem("nightfallAudioVolumesV1")||"{}")}catch(e){audioVolumes={};}
/* DUEL-SFX-062 — the duel cues follow an existing slider instead of adding 22 new ones. Each file is mastered for a
   level of .8; the group slider scales it by (user value / group default). */
const ND_SFX_GROUP={duelSwingBlade:"hit",duelSwingHeavy:"hit",duelSwingShadow:"hit",duelShot:"hit",duelSwingSpirit:"hit",
  duelHitBlade:"hit",duelHitHeavy:"hit",duelHitShadow:"hit",duelHitBullet:"hit",duelHitCrit:"hit",duelHitSpirit:"hit",duelEvade:"hit",duelCastClass:"hit",duelCastSpirit:"hit",
  duelCounter:"counter",duelBlockShield:"shield",duelWard:"shield",duelShieldUp:"shield",duelCastDomain:"shield",duelDomainHeal:"shield",
  duelBurn:"burn",duelNightfall:"lock"};
function getAudioVolume(k){
  const grp=ND_SFX_GROUP[k];
  if(grp){const gd=AUDIO_DEFAULTS[grp]||.5;return Math.max(0,Math.min(1,.8*getAudioVolume(grp)/gd));}
  const d=AUDIO_DEFAULTS[k]??.55;
  const v=Number(audioVolumes[k]);
  return Number.isFinite(v)?Math.max(0,Math.min(1,v)):d;
}
const AudioBank={};
/* AUDIO-MIX-061 — loudness balance. Measured max momentary loudness (EBU R128) of every local file and every synthesized cue at its
   default level spanned ~40 dB (skill files ~-14, basic hits ~-31, swing ~-43). These trims (dB) pull each cue into a tier:
   big moments ~-16, skill impacts ~-17.5, basic hits ~-20, motion/status ~-23, UI ~-30. They multiply on top of the user's own volume,
   so the sliders keep working.
   2026-10-06 follow-up: the ringing three-note cues (fxResImpact 共振彈/晶錐 impact, fxResTick 共振 tick, victory) sat too far forward; pulled down ~4–5 dB.
   Turn change plays turnStart then energy (+1 暮晶) 80ms apart, often followed by buff/stun cues; boosted, they stacked into a
   "deng-deng-deng" every turn. turnStart and energy are back near their original level (+3 / +2 dB). "file" applies only to the local files that were measured (remote OpenGameArt files are left as they are). */
const ND_MIX={
  file:{fxQuakeImpact:-2.1,fxResImpact:-9,fxShadowBurst:-3.8,fxUnityStrike:-3.8,fxQuakeStomp:-2,fxQuakeCrack:-.8,fxResFire:1.5,fxStun:-5.8,fxResTick:-11,
    abyssRoar:-1.6,fxShadowGather:-2.1,fxUnityGather:-4.9,fxResCharge:-3.9,recorderCut:-8.8,recorderOn:-.9,recorderPlay:-1.4,coinFlip:3.5},
  synth:{fxQuakeImpact:2.8,fxResImpact:.8,fxShadowBurst:10.4,fxUnityStrike:6.6,fxQuakeStomp:7.1,fxQuakeCrack:14.7,fxResFire:9.1,fxStun:9.4,fxResTick:9.8,
    abyssRoar:10.7,fxShadowGather:10.4,fxUnityGather:11.8,fxResCharge:12.8,recorderCut:8,recorderOn:10.8,recorderPlay:12.4,coinFlip:17.3,
    fxBellBlast:-1.3,fxBellCharge:-1,fxBellWave:5.5,fxBellHush:2,transformBurst:4,transformCharge:9.3,explode:5.3,
    hit:11.4,gunshot:8.2,crit:9.2,unitDown:7.5,purge:9,devour:8.5,counter:13.7,shield:11.9,lock:11.9,summon:12,
    swing:18.8,evade:17,grab:13,skillCast:11,buff:12.4,shadow:12.3,burn:21,
    cardPickup:17.8,cardFlip:14.6,cardPlace:6.4,cardInvalid:13.9,turnStart:3,energy:2,victory:0,defeat:4.4}
};
function sfxVolume(k,kind){const t=ND_MIX[kind]?.[k]||0;return getAudioVolume(k)*Math.pow(10,t/20);}
let audioEnabled=true;
let currentMusicMode="setup";
let currentMusicKey=null;
let musicFadeTimer=null;
function initAudio(){
  if(typeof Audio==="undefined")return;
  if(Object.keys(AudioBank).length)return;
  Object.entries(AUDIO_URLS).forEach(([k,url])=>{
    try{
      const a=new Audio();
      a.src=url;
      a.preload="auto";
      a.volume=getAudioVolume(k);
      if(k==="setupBgm"||k==="bgm"||k==="resultBgm")a.loop=true;
      AudioBank[k]=a;
      a.load();
    }catch(e){console.warn("Nightfall Duel audio init failed:",k,e)}
  });
}
function musicKey(mode){
  return mode==="battle"?"bgm":mode==="result"?"resultBgm":"setupBgm";
}
function ensureBattleMusic(){switchMusic("battle",false)}
function ensureSetupMusic(){switchMusic("setup",false)}
function ensureResultMusic(){switchMusic("result",true)}
function toggleAudio(){
  if(Object.keys(AudioBank).length===0)try{initAudio();}catch(e){}
  audioEnabled=!audioEnabled;
  if(!audioEnabled){
    if(musicFadeTimer){clearInterval(musicFadeTimer);musicFadeTimer=null;}
    Object.values(AudioBank).forEach(a=>{try{a.pause();}catch(e){}});
  }else{
    switchMusic(currentMusicMode,false);
  }
  const b=document.querySelector(".audio-toggle");
  if(b)b.textContent=audioEnabled?"🔊":"🔇";
  if(typeof renderGame==="function" && S)renderGame();
  else if(typeof renderSetup==="function")renderSetup();
}

function shuf(a){return [...a].sort(()=>Math.random()-.5)}
function clone(o){return JSON.parse(JSON.stringify(o))}
function cardIcon(c){return c.i||JOBS[c.job]?.i||"🎴"}
function deck(job){
  const d=[...BASE.map(clone),...BASE.map(clone),...BASE.map(clone)];
  if(job==="swordsman")d.push({n:"斬擊",k:"class",job:"swordsman",i:"⚔️",s:"造成 2 傷害；命中後 50% 封鎖攻擊"});
  if(job==="tank")d.push({n:"護盾",k:"class",job:"tank",target:"self",i:"🛡️",s:"免費獲得 2 護盾；仍須出 1 張正常牌"});
  if(job==="assassin")d.push({n:"閃擊",k:"class",job:"assassin",target:"combat",i:"🗡️",s:"造成 1 傷害並嘗試偷取 1 張基礎卡"});
  if(job==="gunner")d.push({n:"爆擊",k:"class",job:"gunner",target:"combat",i:"🔫",s:"造成 2 傷害；命中後附加 0.25 灼傷"});
  return shuf(d);
}
function makePlayer(job){return {
  job,hp:10,maxHp:10,shield:0,hand:[],deck:deck(job),
  night:false,roundDodge:false,spirit:0,spiritGranted:false,
  used:false,usedDefense:false,counterShielded:false,lastDamageTaken:0,
  shieldUsed:false,def:0,burn:0,history:[],
  domainGranted:false,domainActive:false
}}
function draw(p,n=1){
  for(let x=0;x<n;x++){
    if(!p.deck.length)p.deck=deck(p.job);
    p.hand.push(p.deck.pop());
  }
}
function log(t){if(!S)return;
  S.log.unshift(t);
  S.log=S.log.slice(0,80);
  if(!Array.isArray(S.battleLog))S.battleLog=[];
  S.battleLog.push({round:S.round,text:String(t)});
}
// V12.10.9 — Unified combat card classification.
function isAttackCard(p,c){
  if(!c)return false;
  if(typeof c.__attackSnapshot==="boolean")return c.__attackSnapshot;
  if(c.k==="attack")return true;
  if(c.k==="class" && ["swordsman","assassin","gunner"].includes(c.job))return true;
  if(c.k==="spirit" && c.job==="swordsman")return true;
  if(c.k==="dodge" && p?.job==="assassin" && p?.night)return true;
  return false;
}
function isResolvedAttackCard(c){return !!c&&c.__attackSnapshot===true;}
function canTankCounter(tank,attacker,attackerCard,attackerCombatResolved){
  // V12.12.29 — Counter tree: only an actually resolved Attack that dealt
  // positive post-Defense damage can enter the Tank counter branch.
  return tank?.job==="tank" && tank.usedDefense && attackerCombatResolved===true
    && isResolvedAttackCard(attackerCard) && tank.lastDamageTaken>0;
}
function isNonAttackCard(p,c){return !!c && !isAttackCard(p,c);}

function canPlay(p,c){
  if(isAttackCard(p,c) && p.attackLocked)return false;
  if((c.k==="class"||c.k==="spirit")&&c.job!==p.job)return false;
  if(c.k==="domain"){
    return p.job==="tank" && p.hp<3 && p.shield===0 && !p.domainActive;
  }
  if(c.k==="class"&&c.job==="tank"&&p.shieldUsed)return false;
  return true;
}
function ensurePlayable(p){
  if(!p.hand.length)draw(p,1);
  if(!p.hand.some(c=>canPlay(p,c)))draw(p,1);
}
function recordCombatEvent(target,event){
  if(!S||!target||!S.roundEvents)return;
  const side=target===S.p?"player":target===S.a?"ai":null;
  if(!side)return;
  S.roundEvents[side].push({...event});
}
function damageDirect(target,n,reason){
  // Normal damage path: Shield absorbs incoming damage before HP.
  // Domain Conversion is handled only in damage(..., isAttack=true),
  // so burn/counter/non-attack effects never consume Domain.
  const requested=+(Math.max(0,n)).toFixed(2);
  let left=requested, absorbed=Math.min(Math.max(0,target.shield),left);
  target.shield=+(target.shield-absorbed).toFixed(2);left=+(left-absorbed).toFixed(2);
  if(left>0){
    target.hp=Math.max(0,+(target.hp-left).toFixed(2));
  }
  const hpLoss=+(-left).toFixed(2);
  const shieldLoss=+(-absorbed).toFixed(2);
  const effectiveDamage=+(absorbed+left).toFixed(2);
  recordCombatEvent(target,{type:"damage",reason,amount:effectiveDamage,hp:hpLoss,shield:shieldLoss});
  return {hp:hpLoss,shield:shieldLoss,reason,amount:effectiveDamage};
}
function damage(attacker,target,n,reason,isAttack=false){
  if(target.roundDodge){
    target.lastDamageTaken=0;
    recordCombatEvent(target,{type:"miss",reason,amount:0,hp:0,shield:0});
    log(reason+"：被閃躲");
    return {dodged:true,hp:0,shield:0,amount:0};
  }
  // Defense reduction is applied before any Domain Conversion.
  // Domain converts the final attack value (after Defense), while still bypassing Shield.
  const defenseReduction=target.usedDefense ? Math.max(0,target.def||0) : 0;
  const reduced=Math.max(0,+(n-defenseReduction).toFixed(2));
  if(isAttack && target.domainActive){
    const incoming=reduced;
    const healed=+Math.min(Math.max(0,target.maxHp||10)-target.hp,incoming).toFixed(2);
    target.hp=+(target.hp+healed).toFixed(2);
    target.lastDamageTaken=0;
    target.domainActive=false;
    recordCombatEvent(target,{type:"domain",reason:"🌌 領域展開",amount:incoming,hp:healed,shield:0});
    log(`🌌 領域展開：防禦後將 ${incoming} 點攻擊轉換為 HP +${healed}`);
    return {dodged:false,hp:healed,shield:0,domainConverted:true,amount:incoming};
  }
  if(reduced<=0){
    target.lastDamageTaken=0;
    log(reason+"：被防禦完全抵銷");
    return {dodged:false,hp:0,shield:0,amount:0};
  }
  const r=Object.assign({dodged:false},damageDirect(target,reduced,reason));
  // Counter damage is based on actual incoming damage after Defense reduction,
  // including damage absorbed by Shield—not only HP lost.
  target.lastDamageTaken=+r.amount.toFixed(2);
  return r;
}
function endCheck(){
  if(S.storyBattle?.mode==='surviveBoth50'){
    if(S.p.hp<=0||S.a.hp<=0){S.end=true;S.w='ai';log('護送失敗：任一方倒下均不符合牽制目標。');return true;}
    if(S.round>=50){S.end=true;S.w='draw';log('50 回合雙方存活：牽制完成，平手通關。');return true;}
    return false;
  }
  if(S.p.hp<=0||S.a.hp<=0){
    S.end=true;S.w=S.p.hp<=0&&S.a.hp<=0?"draw":S.p.hp<=0?"ai":"player";
    if(S.w==="player")playSfx("victory");
    else if(S.w==="ai")playSfx("defeat");
    else playSfx("cardFlip");
    try{ensureResultMusic();}catch(e){}
    log(S.w==="draw"?"雙方同歸於盡！":S.w==="player"?"🏆 你獲勝！":"💀 AI 獲勝！");
    return true;
  }
  if(S.round>=50){
    S.end=true;S.w=S.p.hp===S.a.hp?"draw":S.p.hp>S.a.hp?"player":"ai";
    log("⏱️ 第50回合：以實際 HP 判定。");
    return true;
  }
  return false;
}
function playableIndexes(p){return p.hand.map((c,i)=>canPlay(p,c)?i:-1).filter(i=>i>=0)}

function scoreCard(p,o,c){
  const hp=p.hp, oh=o.hp, shield=p.shield;
  let score=Math.random()*0.35;
  if(c.k==="attack")score+=1.2;
  if(c.k==="defense")score+=p.hp<5?2.2:0.7;
  if(c.k==="dodge")score+=o.history.at(-1)==="attack"?2:0.9;
  if(c.k==="class"&&c.job==="swordsman")score+=o.hp<=4?2.5:1.6;
  if(c.k==="class"&&c.job==="tank")score+=shield<2?2.5:0.2;
  if(c.k==="class"&&c.job==="assassin")score+=o.hand.length>2?2.2:1.3;
  if(c.k==="class"&&c.job==="gunner")score+=o.hp<=4?2.8:1.8;
  if(aiType==="conservative"){
    if(c.k==="defense")score+=2;if(c.k==="dodge")score+=1.2;if(hp<5)score+=1.5;
    if(c.k==="class"&&c.job==="tank")score+=1.8;
  }
  if(aiType==="aggressive"){
    if(["attack","class"].includes(c.k))score+=1.5;
    if(c.k==="class"&&c.job==="gunner")score+=2;
    if(o.hp<=4)score+=2;
  }
  if(aiType==="strategic"){
    if(o.history.at(-1)==="attack"&&c.k==="dodge")score+=2;
    if(o.hp<5&&["attack","class"].includes(c.k))score+=1.5;
    if(p.hp<4&&c.k==="defense")score+=1.7;
  }
  return score;
}
function aiPick(){
  const ids=playableIndexes(S.a);
  if(!ids.length)return -1;
  ids.sort((x,y)=>scoreCard(S.a,S.p,S.a.hand[y])-scoreCard(S.a,S.p,S.a.hand[x]));
  return ids[0];
}

function cardTypeName(c){
  if(c.k==="class")return "職業卡";
  if(c.k==="spirit"||c.k==="domain")return "特殊卡";
  return "基礎卡";
}
function summary(c){return c.s||""}

function renderSetup(){
  window.NDEnvironment?.leave();
  ensureAudioButton();
  try{initAudio();ensureSetupMusic();}catch(e){}
  const entries=Object.entries(JOBS);
  const playerIndex=Math.max(0,entries.findIndex(([k])=>k===playerJob));
  const aiIndex=Math.max(0,entries.findIndex(([k])=>k===aiJob));
  const jobDetails={
    swordsman:{pills:["⚔️ 2 傷害","🚫 50% 封鎖","✨ HP < 5"],short:"控制節奏，低血量時取得一次性爆發。"},
    tank:{pills:["🛡️ +2 護盾","↩️ 防禦反擊","🌌 HP < 3"],short:"用護盾拖住節奏，再抓反擊窗口。"},
    assassin:{pills:["🗡️ 1 傷害","🎴 偷基礎卡","🌙 夜襲"],short:"靠偷牌與夜襲製造對手預期之外的回合。"},
    gunner:{pills:["🔫 2 傷害","🔥 +0.25 灼傷","🎯 爆發"],short:"穩定打出高傷害，命中後留下灼傷壓力。"}
  };
  const role=jobDetails[playerJob]||jobDetails.swordsman;
  const renderCarousel=(side,selectedIndex,selectedJob)=>entries.map(([k,j],idx)=>`
    <button class="carousel-card ${selectedJob===k?"selected":""}" data-side="${side}" data-job="${k}" onclick="selectSetupJob('${side}','${k}',${idx})" aria-label="${side==='player'?'選擇':'查看'}${j.n}">
      <div class="carousel-icon">${j.i}</div>
      <div class="carousel-name">${j.n}</div>
      <div class="carousel-tag">${j.t}</div>
      <div class="carousel-hint">${selectedJob===k?'已選定':'選擇英雄'}</div>
    </button>`).join("");
  const dots=(selectedIndex)=>entries.map((_,i)=>`<i class="carousel-dot ${i===selectedIndex?'active':''}"></i>`).join("");
  app.innerHTML=`
  <div class="panel setup-wrap">
    <div class="setup-top">
      <div>
        <div class="setup-kicker">NIGHTFALL DUEL</div>
        <div class="setup-title">夜幕決鬥</div>
        <div class="setup-sub">選擇你的命運，踏入最後的戰場。</div>
      </div>
    </div>

    <div class="setup-stage">
      <section class="duel-side player">
        <div class="side-inner">
          <div class="side-head"><div class="side-label">你的英雄</div><div class="side-choice">${JOBS[playerJob].n}</div></div>
          <div class="carousel" id="playerCarousel">
            <div class="carousel-track">${renderCarousel('player',playerIndex,playerJob)}</div>
            <div class="carousel-nav">
              <button class="carousel-arrow" onclick="moveSetupCarousel('player',-1)" aria-label="上一個職業">‹</button>
              <div class="carousel-dots">${dots(playerIndex)}</div>
              <button class="carousel-arrow" onclick="moveSetupCarousel('player',1)" aria-label="下一個職業">›</button>
            </div>
          </div>
          <details class="choice-detail">
            <summary>查看 ${JOBS[playerJob].n} 的玩法</summary>
            <div class="detail-body">
              <div class="detail-pills">${role.pills.map(x=>`<span class="detail-pill">${x}</span>`).join("")}</div>
              ${role.short}
            </div>
          </details>
        </div>
      </section>

      <div class="vs-column"><div class="vs-badge">VS</div></div>

      <section class="duel-side enemy">
        <div class="side-inner">
          <div class="side-head"><div class="side-label">對陣英雄</div><div class="side-choice">${JOBS[aiJob].n}</div></div>
          <div class="carousel" id="aiCarousel">
            <div class="carousel-track">${renderCarousel('ai',aiIndex,aiJob)}</div>
            <div class="carousel-nav">
              <button class="carousel-arrow" onclick="moveSetupCarousel('ai',-1)" aria-label="上一個職業">‹</button>
              <div class="carousel-dots">${dots(aiIndex)}</div>
              <button class="carousel-arrow" onclick="moveSetupCarousel('ai',1)" aria-label="下一個職業">›</button>
            </div>
          </div>
          <details class="choice-detail">
            <summary>查看 ${JOBS[aiJob].n} 的玩法</summary>
            <div class="detail-body">${JOBS[aiJob].d}</div>
          </details>
        </div>
      </section>
    </div>

    <div class="setup-divider"></div>
    <div class="side-head"><div class="side-label">對手戰術</div><div class="side-choice">${AIS[aiType]}</div></div>
    <div class="ai-mind">${Object.entries(AIS).map(([k,n])=>`
      <button class="ai-choice ${aiType===k?'selected':''}" onclick="aiType='${k}';renderSetup()">
        <div class="ai-name">${n}</div>
        <div class="ai-desc">${k==='conservative'?'重視防禦與資源。':k==='aggressive'?'偏好傷害與收尾。':'依血量、上一回合與局勢調整。'}</div>
      </button>`).join("")}</div>
    <div class="ai-more">四位英雄・三種戰術・一場決鬥</div>

    <div class="setup-footer">
      <button class="start" onclick="startGame()">進入決鬥　➜</button>
      <a class="home-return" href="index.html">← 返回首頁</a>
      <a class="story-entry" href="Nightfall-Duel-Story.html">故事模式 · 追尋鐘聲背後的名字 →</a>
      ${window.NDSkins.controls(playerJob)}
      <button class="audio-settings-btn" onclick="showAudioSettings()">🔊 音效設定</button>
      <button class="rules-btn" onclick="showRules()">📖 遊戲規則與判定矩陣</button>
    </div>
  </div>`;
  requestAnimationFrame(()=>{
    centerSetupCarousel('player',playerIndex);
    centerSetupCarousel('ai',aiIndex);
  });
}

function setupTrack(side){return document.querySelector(`#${side==='player'?'playerCarousel':'aiCarousel'} .carousel-track`);}
function setupCards(side){return [...document.querySelectorAll(`#${side==='player'?'playerCarousel':'aiCarousel'} .carousel-card`)];}
function centerSetupCarousel(side,index,behavior='auto'){
  const track=setupTrack(side), card=setupCards(side)[index];
  if(!track||!card)return;
  const cardRect=card.getBoundingClientRect(), trackRect=track.getBoundingClientRect();
  const left=track.scrollLeft+cardRect.left-trackRect.left-(track.clientWidth-cardRect.width)/2;
  track.scrollTo({left:Math.max(0,left),behavior});
}
function selectSetupJob(side,job,index){
  if(side==='player')playerJob=job; else aiJob=job;
  renderSetup();
}
function moveSetupCarousel(side,delta){
  const cards=setupCards(side), currentJob=side==='player'?playerJob:aiJob;
  let idx=cards.findIndex(c=>c.dataset.job===currentJob);
  if(idx<0)idx=0;
  idx=(idx+delta+cards.length)%cards.length;
  const job=cards[idx]?.dataset.job;
  if(side==='player')playerJob=job; else aiJob=job;
  renderSetup();
}

function fighter(p,side){
  const resultSide=side==="enemy"?"ai":"player";
  const fx=S?.lastResult?.[resultSide];
  const hasCombatImpact=!!fx&&Array.isArray(fx.events)&&fx.events.some(ev=>ev.type==="miss"||ev.type==="damage"&&((Number(ev.hp||0)<0)||(Number(ev.shield||0)<0)));
  const shouldHit=!!fx&&S.phase==="result"&&fx.__hitPlayed!==true&&hasCombatImpact;
  if(shouldHit)fx.__hitPlayed=true;
  const job=JOBS[p.job];
  const hpPct=Math.max(0,p.hp/p.maxHp*100);
  const shieldPct=Math.max(0,p.shield/6*100);
  return `<div class="panel fighter ${side} ${shouldHit?"combat-hit":""}">
    <div class="fighter-head">
      <div class="fighter-id">
        <span class="fighter-avatar">${job.i}</span>
        <div class="fighter-copy">
          <div class="fighter-title-row">
            <div class="fighter-name">${side==="player"?"你":"AI"}・${job.n}</div>
            <div class="status-strip" aria-label="角色狀態">
              ${p.shield>0?`<span class="status buff-status">🛡️ 護盾</span>`:""}
              ${p.attackLocked?'<span class="status debuff-status lock-status">🚫 封鎖</span>':""}
              ${p.burn>0?`<span class="status burn-status">🔥 ${p.burn}</span>`:""}
              ${p.job==="assassin"&&p.night?'<span class="status special-status night-status is-night">🌙 夜襲</span>':""}
              ${p.spirit?`<span class="status special-status spirit-status">✨ 劍氣</span>`:""}
              ${p.domainActive?`<span class="status domain-status">🌌 領域</span>`:""}
            </div>
          </div>
          <div class="fighter-role">${side==="enemy"?AIS[aiType]:"你的戰士"}</div>
        </div>
      </div>
      <div class="fighter-hand">🃏 ${p.hand.length}</div>
    </div>
    <div class="combat-bars">
      <div class="stat-line hp-line">
        <span>HP</span><strong>${p.hp} / ${p.maxHp}</strong>
        <div class="mini-bar"><div class="hpfill" style="width:${hpPct}%"></div></div>
      </div>
      <div class="stat-line shield-line">
        <span>SHIELD</span><strong>${p.shield} / 6</strong>
        <div class="shield-steps" aria-label="Shield ${p.shield} of 6">
          ${Array.from({length:6},(_,i)=>`<i class="${i<p.shield?"filled":""}"></i>`).join("")}
        </div>
      </div>
    </div>
    ${fx?`<div class="combat-fx">${(fx.events?.length?fx.events:[]).map(ev=>{
      if(ev.type==="miss")return `<div class="float miss">MISS</div>`;
      if(ev.type==="domain")return ev.hp?`<div class="float pos">+${ev.hp}<small>HP</small></div>`:"";
      const parts=[];
      if(ev.hp)parts.push(`<div class="float ${ev.hp<0?"neg":"pos"}">${ev.hp>0?"+":""}${ev.hp}<small>HP</small></div>`);
      if(ev.shield)parts.push(`<div class="float ${ev.shield<0?"neg":"pos"}">${ev.shield>0?"+":""}${ev.shield}<small>🛡</small></div>`);
      return parts.join("");
    }).join("") || `${fx.miss?`<div class="float miss">MISS</div>`:""}`}</div>`:""}
  </div>`;
}

function revealCard(c,side,stage){
  if(!c)return "";
  const cl=(stage||"");
  /* Battle-table cards intentionally mirror hand cards: same visual hierarchy
     (icon + name only). Full rules/details stay in the detail layer. */
  return `<div class="card3d ${cl}" data-art="${c.k==='class'?c.job:c.k}" data-owner="player" data-skin="${c.k==='class'?(side==='enemy'?'base':S.p.skin):'base'}">
    <div class="face back"><span></span></div>
    <div class="face front">
      <span class="icon">${cardIcon(c)}</span>
      <b>${c.n}</b>
    </div>
  </div>`;
}

// Display formatting only: combat state retains its original numeric precision.
function hudNumber(value){return Number(value.toFixed(2)).toString();}

/* DUEL-STAGE: card-battle mode shows the story-mode standing art for each job.
   The player's figure doubles as the drop zone for self-target cards. */
const ND_DUEL_HERO={swordsman:{src:"assets/story/actors/shuo.webp",face:"right"},tank:{src:"assets/story/actors/gran.webp",face:"left"},assassin:{src:"assets/story/actors/rin.webp",face:"right"},gunner:{src:"assets/story/actors/eve.webp",face:"right"}};
/* HERO-DROP-FX: a successful self-target drop releases one gold shockwave from the figure's chest (presentation only). */
function ndHeroBurst(hero){
  if(!hero||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const r=hero.getBoundingClientRect(),size=Math.max(160,r.width*1.05);
  const el=document.createElement("div");el.className="duel-hero-burst";el.setAttribute("aria-hidden","true");
  Object.assign(el.style,{left:(r.left+r.width/2-size/2)+"px",top:(r.top+r.height*.38-size/2)+"px",width:size+"px",height:size+"px"});
  document.body.appendChild(el);
  const a=el.animate([{opacity:0,transform:"scale(.35)"},{opacity:1,transform:"scale(.75)",offset:.18},{opacity:0,transform:"scale(1.5)"}],{duration:620,easing:"cubic-bezier(.2,.7,.3,1)"});
  a.onfinish=a.oncancel=()=>el.remove();setTimeout(()=>el.remove(),900);
}
function ndDuelHero(p,which){
  const art=ND_DUEL_HERO[p.job];
  if(!art)return "";
  const flip=art.face!==(which==="player"?"right":"left");
  const fx=which==="player"?`<span class="duel-hero-backlight"></span><span class="duel-hero-sigil"></span><span class="duel-hero-motes"><i></i><i></i><i></i><i></i><i></i></span>`:"";
  return `<div class="duel-hero ${which}" data-job="${p.job}" aria-hidden="true">${fx}<img src="${art.src}" alt="" draggable="false" class="${flip?"is-flipped":""}"><span class="duel-hero-drop"></span></div>`;
}
function arena(){
  const p=S.p;
  const stage=S.revealStage;
  const statusTags=(p)=>[
    p.attackLocked?ndStatusTag("lock","🚫 封鎖"):"",
    p.burn>0?ndStatusTag("burn",`🔥 ${p.burn}`):"",
    p.job==="assassin"&&p.night?ndStatusTag("night","🌙 夜襲"):"",
    p.spirit?ndStatusTag("spirit","✨ 劍氣"):"",
    p.domainActive?ndStatusTag("domain","🌌 領域"):""
  ].filter(Boolean).join("");
  const side=(p,which)=>{
    const pct=Math.max(0,Math.min(100,p.hp/p.maxHp*100));
    return `<section class="duel-side battle-hud ${which===`enemy`?`enemy`:`player`} ${p.hp<3?"low-hp":""}" data-job="${p.job}" aria-label="${which===`enemy`?`對手資訊`:`你的資訊`}">
      <div class="duel-side-inner">
        ${which==='enemy'&&S.storyBattle?`<div class="duel-avatar"><img class="story-npc-emblem" src="assets/icons/${p.job}.svg" alt="${S.storyBattle.name}徽記"></div>`:`<div class="duel-avatar" data-art="${p.job}" data-skin="${p.skin||'base'}">${JOBS[p.job]?.i||"🎴"}</div>`}
        <div class="duel-identity"><span class="duel-owner">${which===`enemy`?`對手`:`玩家`}</span><div class="duel-name">${which==='enemy'&&S.storyBattle?S.storyBattle.name:JOBS[p.job]?.n||p.job}</div></div>
        <div class="duel-copy">
          <div class="duel-hp"><span>HP</span><strong>${hudNumber(p.hp)}</strong></div>
          <div class="duel-hpbar"><div class="duel-hpfill" style="width:${pct}%"></div></div>
          <div class="duel-shield-row"><span>SHIELD</span><strong>${hudNumber(p.shield)} <small>/ 6</small></strong></div>
          <div class="duel-shield" aria-label="Shield ${p.shield} of 6">${Array.from({length:6},(_,i)=>`<i class="${i<p.shield?"filled":""}"></i>`).join("")}</div>
        </div>
          <div class="duel-status-row">${p.shield>0?ndStatusTag("shield","🛡️ 護盾","buff-status"):""}${statusTags(p)}</div>
      </div>
    </section>`;
  };
  const stageMode=!S.storyBattle;
  return `<div class="duel-screen${stageMode?" nd-stage":""}">
    ${stageMode?ndDuelHero(S.p,"player")+ndDuelHero(S.a,"enemy"):""}
    ${side(S.a,"enemy")}
    <section class="duel-hand-panel enemy" aria-label="對手手牌區">
      <div class="duel-hand ai-hand">${Array.from({length:Math.min(S.a.hand.length,7)},(_,i)=>`<div class="enemy-card-back" style="--r:${(i-3)*1.7}deg" aria-hidden="true"></div>`).join("")}</div>
    </section>
    <section class="retro-arena phase-${S.phase||"idle"} reveal-${stage||"none"}" aria-label="決鬥牌區">
      <div class="retro-field-mark"></div>
      <div class="retro-field-line"></div>
      <div class="retro-board">
        <div class="retro-card-slot slot enemy ${S.pending?.ai?"has-card":"empty"}" aria-label="對手出牌區"><span class="slot-label" aria-hidden="true">OPPONENT CARD</span>${revealCard(S.pending?.ai,"enemy",stage)}</div>
        <div class="retro-center" aria-label="回合與 VS"><span class="round-mini"><span class="round-caption">ROUND</span><span class="round-count">${Math.min(S.round,50)}<span class="round-limit"> / 50</span></span></span><span class="vsx">VS</span>${ndRoundSummary()}</div>
        <div class="retro-card-slot slot you ${S.pending?.player?"has-card":"empty"}" aria-label="你的出牌區"><span class="slot-label" aria-hidden="true">你的出牌區</span>${revealCard(S.pending?.player,"you",stage)}</div>
      </div>
    </section>
    <section class="duel-hand-panel player" aria-label="你的手牌區">
      <div class="duel-hand player-hand">${S.p.hand.map((c,i)=>{
        const phaseBlocked=S.phase!=="player";
        const attackBlocked=S.phase==="player"&&isAttackCard(p,c)&&p.attackLocked;
        const classBlocked=c.k==="class"&&c.job!==p.job;
        const tankShieldUsed=c.k==="class"&&c.job==="tank"&&p.shieldUsed;
        const domainBlocked=c.k==="domain"&&!canPlay(p,c);
        const dis=phaseBlocked||attackBlocked||classBlocked||tankShieldUsed||domainBlocked;
        const stateClass=attackBlocked?"hand-blocked":(dis?"hand-disabled":"");
        const blockReason=dis?ndBlockReason(p,c):"";
        return `<button class="card ${stateClass} ${c.k==="class"?`class-${c.job}`:""} ${c.k==="spirit"?"special":""}" data-art="${c.k==='class'?c.job:c.k}" data-owner="player" ${dis?`disabled data-block-reason="${blockReason}" title="${blockReason}"`:""} draggable="false" ondragstart="return false" ondragend="return false" onclick="if(!this.dataset.dragged)showCard(${i})"><span class="icon">${cardIcon(c)}</span><b>${c.n}</b>${attackBlocked?'<span class="card-state-badge">🚫</span>':""}</button>`;
      }).join("")}</div>
    </section>
    ${side(S.p,"player")}
  </div>`;
}
function renderGame(){
  if(S.end){renderResult();return}
  const p=S.p;
  app.innerHTML=`${S.storyBattle?`<div class="story-battle-banner"><button onclick="leaveStoryBattle()">返回場景</button><strong>${S.storyBattle.name}</strong> · ${S.storyBattle.description}</div>`:''}<div class="topbar"><div><div class="kicker">NIGHTFALL DUEL</div><div class="round">ROUND ${Math.min(S.round,50)} / 50</div></div><div class="phase"><span class="phase-dot"></span>${S.phase==="player"?"YOUR MOVE":S.phase==="reveal"?"SHOWDOWN":"OPPONENT"}</div></div>${arena()}<nav class="battle-dock" aria-label="遊戲選單"><button onclick="showBattleJournal()">☷ <span>戰況</span></button><span class="battle-state">${S.phase==="player"?"點牌查看並出牌，或拖至你的放置區":S.phase==="reveal"?"揭曉命運":S.phase==="result"?"戰鬥結算":"對手行動中"}</span><button onclick="showRules()">◇ <span>規則</span></button><button onclick="showAudioSettings()">♫ <span>音效</span></button></nav>`;
  window.NDEnvironment?.sync(S);
}
function getBattleLogText(){
  const rows=Array.isArray(S?.battleLog)?S.battleLog:[];
  const playerJobName=JOBS[S?.p?.job]?.n||S?.p?.job||"-";
  const aiJobName=JOBS[S?.a?.job]?.n||S?.a?.job||"-";
  const aiName=AIS[aiType]||aiType||"-";
  const result=S?.w==="player"?"你獲勝":S?.w==="ai"?"AI 獲勝":"平手";
  const header=[
    "NIGHTFALL DUEL · 完整對戰紀錄",
    `玩家職業：${playerJobName}`,
    `AI職業：${aiJobName}（${aiName}）`,
    `結果：${result}`,
    `回合：${Math.min(S?.round||0,50)}`,
    `最終 HP：你 ${Math.max(0,S?.p?.hp||0)} / AI ${Math.max(0,S?.a?.hp||0)}`,
    "",
    "===== 戰鬥 LOG ====="
  ];
  const body=rows.map((entry,i)=>`[${String(entry.round).padStart(2,"0")}] ${String(entry.text)}`);
  return NDVisuals.plainText([...header,...body].join("\n"));
}
async function copyBattleLog(){
  const text=getBattleLogText();
  try{
    if(navigator.clipboard?.writeText){
      await navigator.clipboard.writeText(text);
    }else{
      const ta=document.createElement("textarea");
      ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();
    }
    const btn=document.getElementById("copyBattleLogBtn");
    if(btn){const old=btn.textContent;btn.textContent="✅ 已複製完整對戰紀錄";setTimeout(()=>{if(document.body.contains(btn))btn.textContent=old},1400);}
  }catch(e){
    const ta=document.createElement("textarea");
    ta.value=text;document.body.appendChild(ta);ta.select();
    try{document.execCommand("copy")}catch(_){}
    ta.remove();
  }
}
function renderResult(){
  if(S.storyBattle){renderStoryResult();return;}
  const title=S.w==="player"?"VICTORY":S.w==="ai"?"DEFEAT":"DRAW";
  const icon=S.w==="player"?"🏆":S.w==="ai"?"💀":"⚖️";
  app.innerHTML=`<div class="panel result-screen" data-outcome="${S.w}">
    <div class="kicker">NIGHTFALL DUEL · ${S.round} ROUNDS</div>
    <div class="result-icon">${icon}</div>
    <div class="result-title">${title}</div>
    <div class="result-sub">${S.w==="player"?"The night belongs to you.":S.w==="ai"?"The night wins.":"Neither fighter falls."}</div>
    <div class="result-stats">
      <div class="stat">你 HP ${Math.max(0,S.p.hp)}</div><div class="stat">AI HP ${Math.max(0,S.a.hp)}</div>
      <div class="stat">回合 ${Math.min(S.round,50)}</div>
    </div>
    <details class="battle-log-export"><summary>對戰紀錄</summary>
      <div class="hand-head"><b>完整對戰紀錄</b><span class="muted">本場戰況</span></div>
      <textarea class="battle-log-text" readonly onclick="this.select()">${getBattleLogText().replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}</textarea>
      <button id="copyBattleLogBtn" class="copy-log-btn" onclick="copyBattleLog()">複製戰績</button>
    </details>
    <button class="start" onclick="startGame()">↻ 再戰一次</button>
    <button class="secondary" onclick="S=null;try{ensureSetupMusic();}catch(e){};renderSetup()">返回備戰大廳</button>
    <button class="audio-settings-btn" onclick="showAudioSettings()">🔊 音效設定</button>
  </div>`;
}

function showRules(){
  const el=document.createElement("div");
  el.className="rules-overlay";
  el.innerHTML=`
    <div class="rules-modal" role="dialog" aria-modal="true" aria-label="遊戲規則">
      <div class="rules-head">
        <div><div class="kicker">NIGHTFALL DUEL · V12.12.34</div><div class="rules-title">📖 完整遊戲規則</div></div>
        <button class="rules-close" aria-label="關閉">✕</button>
      </div>

      <div class="rules-section">
        <h3>1｜基本流程</h3>
        <p>雙方初始 HP 10，每回合正常出牌最多 1 張。雙方蓋牌後同時揭曉並結算；最多進行 50 回合。</p>
        <p>第 50 回合結束後，以雙方實際 HP 判定勝負；HP 同為 0 或第 50 回合 HP 相同則平手。</p>
        <p class="rule-note">「正常出牌」與「免費效果」分開計算。坦克護盾與領域展開屬於免費效果，不消耗本回合正常出牌次數。</p>
      </div>

      <div class="rules-section">
        <h3>2｜卡牌分類：只有 9 種牌</h3>
        <div class="rules-scroll"><table class="rules-table">
          <thead><tr><th>卡牌</th><th>所屬</th><th>出牌區域</th><th>Attack</th><th>正常出牌？</th></tr></thead>
          <tbody>
            <tr><td>⚔️ 攻擊</td><td>基礎卡</td><td>決鬥區</td><td>是</td><td>是</td></tr>
            <tr><td>🛡️ 防禦</td><td>基礎卡</td><td>決鬥區</td><td>否</td><td>是</td></tr>
            <tr><td>👁️ 閃躲</td><td>基礎卡</td><td>決鬥區</td><td>白天否／夜襲是</td><td>是</td></tr>
            <tr><td>⚔️ 斬擊</td><td>劍客</td><td>決鬥區</td><td>是</td><td>是</td></tr>
            <tr><td>✨ 劍氣出竅</td><td>劍客特殊卡</td><td>決鬥區</td><td>是</td><td>是</td></tr>
            <tr><td>🛡️ 護盾</td><td>坦克</td><td>自己的角色區</td><td>否</td><td>否，免費</td></tr>
            <tr><td>🌌 領域展開</td><td>坦克特殊卡</td><td>自己的角色區</td><td>否</td><td>否，免費</td></tr>
            <tr><td>🗡️ 閃擊</td><td>刺客</td><td>決鬥區</td><td>是</td><td>是</td></tr>
            <tr><td>🔫 爆擊</td><td>槍手</td><td>決鬥區</td><td>是</td><td>是</td></tr>
          </tbody>
        </table></div>
        <p class="rule-note">「職業卡」不是「可以丟到角色區」的意思。只有明確標記為「自己的角色區」的護盾與領域展開，才可以拖到自己的角色資訊卡。</p>
      </div>

      <div class="rules-section">
        <h3>3｜完整戰鬥判定矩陣</h3>
        <div class="rules-scroll"><table class="rules-table">
          <thead><tr><th>卡牌</th><th>傷害</th><th>可被閃躲</th><th>刺客閃躲成功可反擊？</th><th>可觸發領域展開？</th></tr></thead>
          <tbody>
            <tr><td>⚔️ 攻擊</td><td>1</td><td>是</td><td>是，0.5</td><td>是</td></tr>
            <tr><td>🛡️ 防禦</td><td>0</td><td>否</td><td>否</td><td>否</td></tr>
            <tr><td>👁️ 閃躲（白天）</td><td>0</td><td>—</td><td>否</td><td>否</td></tr>
            <tr><td>👁️ 閃躲（夜襲）</td><td>1</td><td>是</td><td>是，0.5</td><td>是</td></tr>
            <tr><td>⚔️ 斬擊</td><td>2</td><td>是</td><td>是，0.5</td><td>是</td></tr>
            <tr><td>✨ 劍氣出竅</td><td>2</td><td>是</td><td>是，0.5</td><td>是</td></tr>
            <tr><td>🗡️ 閃擊</td><td>1</td><td>是</td><td>是，0.5</td><td>是</td></tr>
            <tr><td>🔫 爆擊</td><td>2</td><td>是</td><td>是，0.5</td><td>是</td></tr>
            <tr><td>🛡️ 護盾</td><td>0</td><td>否</td><td>否</td><td>否</td></tr>
            <tr><td>🌌 領域展開</td><td>0</td><td>否</td><td>否</td><td>—</td></tr>
          </tbody>
        </table></div>
      </div>

      <div class="rules-section">
        <h3>4｜基礎卡規則</h3>
        <p><b>⚔️ 攻擊：</b>造成 1 傷害。</p>
        <p><b>🛡️ 防禦：</b>本回合受到的傷害降低 0.25。若使用防禦當下有護盾，坦克反擊機率為 30%；沒有護盾則為 20%。反擊傷害為本次實際受到傷害的 50%。</p>
        <p><b>👁️ 閃躲：</b>一般狀態有 50% 機率閃躲成功；成功會取消本回合對自己的攻擊。刺客成功閃躲攻擊時，另外造成 0.5 反擊傷害。</p>
      </div>

      <div class="rules-section">
        <h3>5｜四個職業的特殊規則</h3>
        <p><b>⚔️ 劍客・斬擊：</b>2 傷害；命中後 50% 機率封鎖對手下一回合的攻擊。</p>
        <p><b>✨ 劍客・劍氣出竅：</b>當 HP < 5 時，每場戰鬥僅取得一次。2 傷害；命中後 50% 機率封鎖對手下一回合的攻擊。</p>
        <p><b>🛡️ 坦克・護盾：</b>每回合最多使用一次；免費獲得 2 護盾，不消耗本回合正常出牌次數。使用後仍可再出 1 張正常戰鬥牌。</p>
        <p><b>🛡️ 坦克・防禦反擊：</b>只有「坦克自己打出防禦」時才有反擊判定；護盾本身不會反擊。</p>
        <p><b>🗡️ 刺客・閃擊：</b>1 傷害；從對手手牌隨機嘗試偷 1 張<b>基礎卡</b>。基礎卡只有「攻擊、防禦、閃躲」。如果抽到的是職業卡或特殊卡，該卡直接丟棄，不進入刺客手牌。</p>
        <p><b>🌙 刺客・夜襲：</b>閃擊有 50% 機率讓刺客進入夜襲；夜襲期間，刺客的「閃躲」轉為造成 1 傷害的攻擊牌，並使對手下一回合不能使用攻擊。</p>
        <p><b>🔫 槍手・爆擊：</b>2 傷害；命中後附加 0.25 灼傷，灼傷於回合結束處理。</p>
        <p><b>🌌 坦克・領域展開：</b>坦克 HP 低於 3 時，每場戰鬥可取得一次；護盾為 0 時才能使用。啟動後，下一次未被閃躲的攻擊會先扣除防禦減傷，再將剩餘傷害轉為 HP 回復，不超過 HP 上限。領域只生效一次。</p>
      </div>

      <div class="rules-section">
        <h3>6｜三個最容易搞混的判定</h3>
        <p><b>① 職業卡 ≠ 角色區卡。</b>劍客的斬擊、刺客的閃擊、槍手的爆擊都是職業卡，但全部丟到「決鬥區」。只有坦克護盾、領域展開丟到「自己的角色區」。</p>
        <p><b>② 閃躲通常不是攻擊。</b>只有刺客處於夜襲狀態時，「閃躲」才轉為攻擊。</p>
        <p><b>③ 領域只看攻擊型傷害。</b>防禦牌不會觸發領域；灼傷與坦克反擊等非攻擊型傷害也不會觸發。</p>
      </div>

      <div class="rules-section">
        <h3>7｜卡牌放置位置</h3>
        <p><b>戰鬥牌：</b>攻擊、防禦、閃躲及攻擊型職業牌，請拖到自己的決鬥卡槽。</p>
        <p><b>護盾與領域展開：</b>請拖到自己的角色資訊卡。</p>
        <p>放到敵方角色、敵方卡槽或不適用的區域時，卡牌不會打出。</p>
      </div>

      <div class="rules-section">
        <h3>8｜無牌可出的處理</h3>
        <p>如果一方沒有任何合法的正常戰鬥牌，系統會自動結束該回合，不會讓戰鬥卡死。坦克若仍有合法免費效果，系統會先保留操作機會，讓玩家決定是否使用；AI 也會依相同規則處理免費效果。</p>
      </div>
    </div>`;
  const close=()=>el.remove();
  el.querySelector(".rules-close").onclick=close;
  el.onclick=e=>{if(e.target===el)close()};
  document.body.appendChild(el);
}

function showCard(i){
  if(!S||S.phase!=="player"||!S.p.hand[i])return;
  const c=S.p.hand[i], session=S, previousFocus=document.activeElement;
  const el=document.createElement("div");el.className="detail";
  el.innerHTML=`<div class="detail-card" role="dialog" aria-modal="true" aria-label="${c.n}詳情" data-art="${c.k==='class'?c.job:c.k}" data-owner="player">
    <div class="detail-icon">${cardIcon(c)}</div><div class="detail-name">${c.n}</div>
    <div class="detail-type">${cardTypeName(c)}</div>
    <div class="detail-text">${summary(c)}${c.job?`<br><br>職業：${JOBS[c.job].n}`:""}</div>
    <div class="detail-actions"><button class="close">返回手牌</button><button class="play-card start" ${canPlay(S.p,c)?"":"disabled"}>${c.k==="domain"?"展開領域":c.target==="self"?"施放護盾":"打出此牌"}</button></div>
  </div>`;
  const close=()=>{el.remove();if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true})};
  el.querySelector(".close").onclick=close;
  el.querySelector(".play-card").onclick=()=>{
    if(S!==session||S.p.hand[i]!==c||!canPlay(S.p,c)){close();return}
    close();playCard(i);
  };
  el.onclick=e=>{if(e.target===el)close()};
  el.addEventListener("keydown",e=>{
    if(e.key==="Escape"){e.preventDefault();close()}
    if(e.key==="Tab"){
      const buttons=[...el.querySelectorAll('button:not(:disabled)')];
      const next=(buttons.indexOf(document.activeElement)+(e.shiftKey?-1:1)+buttons.length)%buttons.length;
      e.preventDefault();buttons[next].focus();
    }
  });
  document.body.appendChild(el);
  el.querySelector(".close").focus({preventScroll:true});
}

function showAudioSettings(){
  try{initAudio();}catch(e){}
  const old=document.getElementById("audioSettingsOverlay");
  if(old)old.remove();
  const makeRows=(keys)=>keys.map(k=>{
    const [name,desc]=AUDIO_LABELS[k]||[k,""];
    const pct=Math.round(getAudioVolume(k)*100);
    return `<div class="audio-row"><div class="audio-label">${name}<small>${desc}</small></div><input class="audio-range" data-audio-key="${k}" type="range" min="0" max="1" step="0.01" value="${getAudioVolume(k)}" aria-label="${name}音量"><div class="audio-value" data-audio-value="${k}">${pct}%</div></div>`;
  }).join("");
  const el=document.createElement("div");
  el.id="audioSettingsOverlay";el.className="audio-overlay";
  el.innerHTML=`<div class="audio-modal" role="dialog" aria-modal="true" aria-label="音效設定">
    <div class="audio-head"><div><div class="audio-title">🔊 音效設定</div><div class="audio-sub">分開調整每一層音樂與戰鬥音效。調整會立即生效並自動保存。</div></div><button class="audio-close" type="button">✕</button></div>
    <div class="audio-group"><div class="audio-group-title">MUSIC</div>${makeRows(["setupBgm","bgm","resultBgm"])}</div>
    <div class="audio-group"><div class="audio-group-title">SOUND EFFECTS</div>${makeRows(["cardPickup","cardPlace","cardFlip","cardInvalid","hit","shield","lock","burn","counter","coinFlip","victory","defeat"])}</div>
    <div class="audio-actions"><button class="audio-reset" type="button">↺ 恢復預設音量</button><button class="audio-mute" type="button">${audioEnabled?"🔇 全部靜音":"🔊 開啟全部音效"}</button></div>
  </div>`;
  const close=()=>el.remove();
  el.querySelector(".audio-close").onclick=close;
  el.addEventListener("click",e=>{if(e.target===el)close()});
  el.querySelectorAll("[data-audio-key]").forEach(input=>input.addEventListener("input",e=>{
    const k=e.currentTarget.dataset.audioKey;setAudioVolume(k,e.currentTarget.value);
    const out=el.querySelector(`[data-audio-value="${k}"]`);if(out)out.textContent=Math.round(getAudioVolume(k)*100)+"%";
    if(k==="setupBgm"||k==="bgm"||k==="resultBgm"){const a=AudioBank[k];if(a&&currentMusicKey===k)try{a.volume=getAudioVolume(k)}catch(err){}}
  }));
  el.querySelector(".audio-reset").onclick=()=>{resetAudioVolumes();renderAudioSettingsInPlace(el)};
  el.querySelector(".audio-mute").onclick=()=>{toggleAudio();renderAudioSettingsInPlace(el)};
  document.body.appendChild(el);
}
function renderAudioSettingsInPlace(el){
  const modal=el?.querySelector(".audio-modal");if(!modal)return;
  const active=document.activeElement;
  el.querySelectorAll("[data-audio-key]").forEach(input=>{const k=input.dataset.audioKey;input.value=getAudioVolume(k);const out=el.querySelector(`[data-audio-value="${k}"]`);if(out)out.textContent=Math.round(getAudioVolume(k)*100)+"%"});
  const mute=el.querySelector(".audio-mute");if(mute)mute.textContent=audioEnabled?"🔇 全部靜音":"🔊 開啟全部音效";
  if(active&&active.classList.contains("audio-range"))active.focus();
}

function ensureAudioButton(){
  let b=document.getElementById("audioToggle");
  if(!b){
    b=document.createElement("button");
    b.id="audioToggle";
    b.className="audio-toggle";
    b.type="button";
    b.textContent="🔊";
    b.addEventListener("click",toggleAudio);
    document.body.appendChild(b);
  }
  b.textContent=audioEnabled?"🔊":"🔇";
}
let storyBattleContext=null;
window.startNDStoryBattle=function(config,onReturn){
 storyBattleContext={config:{...config},onReturn};playerJob=config.player;aiJob=config.enemy;aiType=config.mode==='surviveBoth50'?'conservative':'strategic';document.body.classList.remove('story-playing');startGame();
};
function returnFromStoryBattle(success){
 if(!storyBattleContext)return;
 const callback=storyBattleContext.onReturn;storyBattleContext=null;gameSessionId++;NDCombatFX.cancel();S=null;
 document.querySelectorAll('.coin-flip-overlay,.card-detail-overlay').forEach(e=>e.remove());
 try{ensureSetupMusic();}catch(e){}callback(success);
}
function leaveStoryBattle(){
 const d=document.createElement('dialog');d.className='story-log-dialog';d.innerHTML='<h2>離開這場對戰？</h2><p>對戰進度不保存，返回後可以重試，不會失去已完成章節。</p><button data-stay>繼續對戰</button><button data-exit>返回場景</button>';d.querySelector('[data-stay]').onclick=()=>d.close();d.querySelector('[data-exit]').onclick=()=>{d.close();returnFromStoryBattle(false);};d.addEventListener('close',()=>d.remove(),{once:true});document.body.append(d);d.showModal();
}
function renderStoryResult(){
 const ok=S.storyBattle.mode==='surviveBoth50'?S.w==='draw'&&S.round>=50&&S.p.hp>0&&S.a.hp>0:S.w==='player';
 app.innerHTML=`<section class="panel result-screen" data-outcome="${ok?'story-success':'story-failure'}"><div class="kicker">故事決鬥 · ${S.storyBattle.name}</div><h1>${ok?(S.storyBattle.mode==='surviveBoth50'?'平手 · 牽制完成':'戰勝對手'):'未達成關卡條件'}</h1><p>${ok?'接續故事，查看這場對戰的後果。':'任務目標：'+S.storyBattle.description}</p><p>回合 ${S.round} · 你 HP ${Math.max(0,S.p.hp)} / 對手 HP ${Math.max(0,S.a.hp)}</p>${ok?'<button class="start" onclick="returnFromStoryBattle(true)">繼續故事</button>':'<button class="start" onclick="startGame()">重新對戰</button><button onclick="returnFromStoryBattle(false)">返回場景</button>'}</section>`;
}
function startGame(){
  NDCombatFX.cancel();
  try{initAudio();switchMusic("battle",true);}catch(e){}
  document.querySelectorAll(".coin-flip-overlay").forEach(el=>el.remove());
  assassinCoinQueue=Promise.resolve();
S={session:++gameSessionId,round:1,p:makePlayer(playerJob),a:makePlayer(aiJob),phase:"player",pending:null,reveal:false,revealFlipped:false,revealShowFront:false,revealStage:null,end:false,w:null,log:[],battleLog:[],lastResult:null,roundEvents:{player:[],ai:[]},assassinCoinResults:null};
  if(storyBattleContext){S.storyBattle={...storyBattleContext.config};if(S.storyBattle.mode==='surviveBoth50'){S.p.hp=S.p.maxHp=70;S.a.hp=S.a.maxHp=70;}}
  S.p.skin=window.NDSkins.equipped(playerJob);S.a.skin="base";
  draw(S.p,3);draw(S.a,3);
  log("⚔️ 第1回合開始：雙方抽3張牌。");
  log(`你：${JOBS[playerJob].n}；AI：${JOBS[aiJob].n}（${AIS[aiType]}）`);
  renderGame();
}

function hasPlayableCombatCard(p){
  return Array.isArray(p?.hand) && p.hand.some(c =>
    c && c.target!=="self" && canPlay(p,c)
  );
}
function hasAvailableFreeEffect(p){
  return Array.isArray(p?.hand) && p.hand.some(c =>
    c && c.target==="self" && canPlay(p,c)
  );
}
function maybeGrantTankDomain(p){
  if(!p || p.job!=="tank" || p.domainGranted || p.hp>=3)return false;
  p.domainGranted=true;
  p.hand.push({
    n:"領域展開",k:"domain",job:"tank",target:"self",i:"🌌",
    s:"下一次未被閃躲的攻擊，將防禦減傷後的傷害轉為 HP 回復；不超過 HP 上限，只生效一次"
  });
  log("🌌 坦克 HP 低於 3，獲得一次「領域展開」。");
  return true;
}
function passCard(side){
  return {n:side==="player"?"結束回合":"AI 結束回合",k:"pass",target:"combat",i:"⏭️",s:"本回合不出戰鬥牌",special:true};
}
async function endPlayerTurn(){
  if(!S||S.end||S.phase!=="player")return;
  const canEnd = S.p.shieldUsed || !hasPlayableCombatCard(S.p);
  if(!canEnd)return;

  S.p.used=true;
  S.pending={player:passCard("player")};
  S.phase="ai";
  log("⏭️ 你結束本回合，等待對手。");
  renderGame();

  try{
    await aiTurn();
  }catch(err){
    console.error("AI turn error after player pass",err);
    if(S&&!S.end&&S.phase==="ai"&&!S.pending?.ai){
      log("⚠️ AI 出牌異常，已自動跳過本回合。");
      S.pending.ai=passCard("ai");
      beginReveal();
    }
  }
}

async function playCard(i){
  if(!S||S.end||S.phase!=="player")return;
  const c=S.p.hand[i];
  if(!c||!canPlay(S.p,c))return;

  // Self-target/free effects (e.g. Tank Shield) attach to the player's HUD.
  // They do NOT consume the normal combat action.
  if(c.target==="self"){
    S.p.hand.splice(i,1);
    const shieldBefore=S.p.shield;
    const applied=await applyCard(S.p,S.a,c);
    if(!applied)return;
    log(`🛡️ ${c.n} 已附加至你的角色`);
    renderGame();
    window.NDEnvironment?.cast(c,"player");
    if(S.p.shield>shieldBefore)NDCombatFX.freeShield(+(S.p.shield-shieldBefore).toFixed(2));

    // Free effects do not consume the normal combat action.
    // If no legal normal combat card remains, the system can safely
    // determine that this side has no further move and auto-pass.
    if(!hasPlayableCombatCard(S.p)){
      await endPlayerTurn();
    }
    return;
  }

  // Normal combat card: commit it to the combat slot and consume the action.
  S.p.hand.splice(i,1);
  c.__attackSnapshot=isAttackCard(S.p,c);
  c.__attackAllowedSnapshot=!S.p.attackLocked;
  S.p.used=true;
  S.pending={player:c};
  S.phase="placing";
  playSfx("cardPlace"); log(`🃏 你蓋牌：「${c.n}」`);
  renderGame();
  await sleep(520);
  if(!S||S.end||S.phase!=="placing")return;
  S.phase="ai";
  renderGame();
  // V12.10.1 — fail-safe AI transition. Audio/network failures must never
  // leave the duel parked in the AI phase without a pending card.
  try{
    await aiTurn();
  }catch(err){
    console.error("AI turn error",err);
    if(S&&!S.end&&S.phase==="ai"&&!S.pending?.ai){
      log("⚠️ AI 出牌異常，已自動重新進入本回合。");
      return nextRound();
    }
  }
  if(S&&!S.end&&S.phase==="ai"&&S.pending?.player&&!S.pending?.ai){
    const sid=S.session;
    setTimeout(()=>{
      if(!currentSession(sid))return;
      if(!S.end&&S.phase==="ai"&&S.pending?.player&&!S.pending?.ai){
        log("⚠️ AI 出牌逾時，重新開始本回合。");
        nextRound(sid);
      }
    },1800);
  }
}
async function aiTurn(){
  if(!S||S.end||S.phase!=="ai")return;

  // V12.12.8 — Preserve the existing free-effect parity with the player.
  // Tank Shield and Domain Expansion are self-targeted free effects:
  // they never consume the normal combat action. Domain is considered
  // first when legal because Shield must be 0 for Domain to activate.
  let freeUsed=false;
  let domainIndex=S.a.hand.findIndex(c=>c?.k==="domain"&&canPlay(S.a,c));
  if(domainIndex>=0){
    const c=S.a.hand.splice(domainIndex,1)[0];
    await applyCard(S.a,S.p,c);
    freeUsed=true;
    log("🌌 AI 使用免費「領域展開」。");
    renderGame();window.NDEnvironment?.cast(c,"ai");
    await sleep(260);
  }else{
    const shieldIndex=S.a.hand.findIndex(c=>c?.k==="class"&&c.job==="tank"&&canPlay(S.a,c));
    if(shieldIndex>=0){
      const c=S.a.hand.splice(shieldIndex,1)[0];
      await applyCard(S.a,S.p,c);
      freeUsed=true;
      log("🛡️ AI 先使用免費護盾。");
      renderGame();window.NDEnvironment?.cast(c,"ai");
      await sleep(260);
    }
  }

  // After any free effect, AI still gets one normal combat action.
  const i=aiPick();
  if(i<0){
    S.a.used=true;
    S.pending.ai=passCard("ai");
    log(freeUsed
      ? "⏭️ AI 使用免費效果後沒有可用正常牌，AI 結束本回合。"
      : (S.a.attackLocked?"🚫 AI 被攻擊封鎖且沒有其他可用牌，AI 結束本回合。":"⏭️ AI 沒有可用牌，AI 結束本回合。"));
    renderGame();
    await sleep(260);
    beginReveal();
    return;
  }

  const c=S.a.hand.splice(i,1)[0];
  c.__attackSnapshot=isAttackCard(S.a,c);
  c.__attackAllowedSnapshot=!S.a.attackLocked;
  S.a.used=true;
  S.pending.ai=c;
  playSfx("cardPlace");
  log(`🃏 AI 蓋牌：「${c.n}」`);
  renderGame();
  await sleep(420);
  beginReveal();
}
async function applyCard(p,o,c,opponentCard=null){
  if(!c)return false;
  p.history.push(c.k);
  if(p.history.length>8)p.history.shift();
  if(c.k==="pass"){
    return true;
  }
  if(c.k==="domain"){
    p.domainActive=true;
    return true;
  }
  // V12.12.27 — Attack Lock is a next-round effect. A committed Attack card
  // uses its round-start permission snapshot, so a Lock created during this
  // resolution can never retroactively cancel the current committed attack.
  if(isAttackCard(p,c) && c.__attackAllowedSnapshot===false){
    log("🚫 攻擊被封鎖");
    return false;
  }
  if(c.k==="attack"){
    if(p.attackLocked){log("🚫 攻擊被封鎖");return false}
    const r=damage(p,o,1,"⚔️ 普通攻擊",true);
    if(r.domainConverted)log("🌌 領域展開：攻擊轉為 HP");
    else if(r.hp||r.shield)log("⚔️ 普通攻擊造成 1 傷害");
  }
  else if(c.k==="defense"){
    // V12.12.30: Defense is snapshotted at round start. Do not reset
    // lastDamageTaken here because the opponent's attack may already have
    // resolved against the snapshot.
    p.def=.25;p.usedDefense=true;p.counterShielded=p.shield>0;
    log("🛡️ 防禦：本次受到傷害 -0.25");
  }
  else if(c.k==="dodge"){
    if(p.job==="assassin" && p.night){
      const r=damage(p,o,1,"🌙 夜襲",true);
      log(r.domainConverted?"🌌 領域展開：夜襲轉為 HP":"🌙 夜襲：閃躲牌轉為 1 傷害");
    }else if(p.roundDodge){
      log("👁️ 閃躲成功");
      if(p.job==="assassin" && isAttackCard(o,opponentCard)){
        damageDirect(o,.5,"🥷 刺客閃躲反擊");
        log("🥷 刺客反擊：0.5");
      }
    }else {
      log("👁️ 閃躲失敗");
    }
  }
  else if(c.k==="spirit"&&c.job==="swordsman"){
    const r=damage(p,o,2,"✨ 劍氣出竅",true);log(r.domainConverted?"🌌 領域展開：劍氣出竅轉為 HP +2":"✨ 劍氣出竅造成 2 傷害");
    if(!r.dodged&&!r.domainConverted&&r.amount>0&&Math.random()<.5){o.attackLocked=true;log("✨ 劍氣出竅：封鎖對手下一回合攻擊")}
    p.spirit=0;
  }
  else if(c.k==="class"&&c.job==="swordsman"){
    const r=damage(p,o,2,"⚔️ 斬擊",true);log(r.domainConverted?"🌌 領域展開：斬擊轉為 HP +2":"⚔️ 斬擊造成 2 傷害");
    if(!r.dodged&&!r.domainConverted&&r.amount>0&&Math.random()<.5){o.attackLocked=true;log("⚔️ 斬擊封鎖對手下一回合攻擊")}
  }
  else if(c.k==="class"&&c.job==="assassin"){
    const r=damage(p,o,1,"🗡️ 閃擊",true);log(r.domainConverted?"🌌 領域展開：閃擊轉為 HP +1":"🗡️ 閃擊造成 1 傷害");
    if(o.hand.length){
      const x=o.hand.splice(Math.floor(Math.random()*o.hand.length),1)[0];
      if(["attack","defense","dodge"].includes(x.k)){p.hand.push(x);log(`🗡️ 閃擊偷走「${x.n}」，加入你的手牌`)}
      else log(`🗡️ 閃擊偷到「${x.n}」；職業／特殊卡直接丟棄`);
    }
    const side=p===S.p?"player":"ai";
    const night=typeof S.assassinCoinResults?.[side]==="boolean"
      ? S.assassinCoinResults[side] : Math.random()<.5;
    if(night){p.night=true;o.attackLocked=true; log("🌙 進入夜襲；對手下一回合不能攻擊")}
    else if(p.night){p.night=false;log("☀️ 白天：解除夜襲")}
  }
  else if(c.k==="class"&&c.job==="tank"){
    /* FREE_EFFECT: shield attaches to self HUD; no normal action consumed. */
    const beforeShield=p.shield;
    p.shield=Math.min(6,+(p.shield+2).toFixed(2)); ndDuelSfx("shieldUp");
    p.shieldUsed=true;
    const gained=+(p.shield-beforeShield).toFixed(2);
    if(gained>0){
      recordCombatEvent(p,{type:"shield",reason:"🛡️ 護盾",amount:gained,hp:0,shield:gained});
    }
    log(p===S.p?`🛡️ 你護盾 +${gained}`:`🛡️ AI 護盾 +${gained}`);
  }
  else if(c.k==="class"&&c.job==="gunner"){
     const r=damage(p,o,2,"🔫 爆擊",true);
     log("🔫 爆擊造成 2 傷害");
     // Burn is a hit rider: a Dodge or Domain Conversion does not apply it.
     if(!r.dodged&&!r.domainConverted&&r.amount>0){
       o.burn=+(o.burn||0)+.25;
       log(`🔥 ${o===S.p?"你":"AI"} 獲得灼傷：下回合受到 0.25 傷害`);
     }
   }
  return true;
}
async function resolveRound(sessionId=S?.session){
  if(!currentSession(sessionId)||S.end)return;
  const playerLockedByAI=!!S.p.attackLocked;
  const aiLockedByPlayer=!!S.a.attackLocked;
  const before={p:{hp:S.p.hp,shield:S.p.shield},a:{hp:S.a.hp,shield:S.a.shield}};
  S.roundEvents={player:[],ai:[]};

  // One coin flip per round. If an Assassin card is present, the result is
  // determined here for gameplay, but the coin animation is intentionally
  // shown only after the entire round has been resolved.
  const hasAssassinCard = ["player","ai"].some(side=>{
    const c=S.pending?.[side];
    return c?.k==="class"&&c.job==="assassin";
  });
  if(hasAssassinCard){
    const night=Math.random()<.5;
    S.assassinCoinResults={player:night,ai:night};
  }else{
    S.assassinCoinResults=null;
  }

  // V12.12.26 — Combat Resolution Snapshot
  // Establish every round-level defensive state BEFORE any attack resolves.
  // This makes simultaneous Defense vs Attack order-independent and preserves
  // the Shield snapshot used by Tank counter-attack odds.
  const pDefenseSnapshot=S.pending.player?.k==="defense";
  const aDefenseSnapshot=S.pending.ai?.k==="defense";
  S.p.usedDefense=pDefenseSnapshot;
  S.a.usedDefense=aDefenseSnapshot;
  S.p.def=pDefenseSnapshot?.25:0;
  S.a.def=aDefenseSnapshot?.25:0;
  S.p.counterShielded=pDefenseSnapshot ? S.p.shield>0 : false;
  S.a.counterShielded=aDefenseSnapshot ? S.a.shield>0 : false;
  S.p.lastDamageTaken=0;
  S.a.lastDamageTaken=0;

  // V12.9.7 — Pre-resolve normal Dodge so simultaneous attacks can be
  // cancelled regardless of which side's card is applied first.
  S.p.roundDodge = S.pending.player?.k==="dodge" && !S.p.night && Math.random()<.5;
  S.a.roundDodge = S.pending.ai?.k==="dodge" && !S.a.night && Math.random()<.5;

  // V12.10.12 — Resolve self-attached free effects first.
  // This removes side-order dependence: if either Tank uses Shield or Domain
  // Expansion this round, that state is active before either attack resolves.
  // Shield therefore absorbs incoming damage first (unless Domain is active),
  // and Domain always routes subsequent damage directly to HP.
  const pFree = S.pending.player?.k==="domain" || (S.pending.player?.k==="class" && S.pending.player?.job==="tank");
  const aFree = S.pending.ai?.k==="domain" || (S.pending.ai?.k==="class" && S.pending.ai?.job==="tank");
  if(pFree) await applyCard(S.p,S.a,S.pending.player,S.pending.ai);
  if(aFree) await applyCard(S.a,S.p,S.pending.ai,S.pending.player);

  // Resolve remaining committed combat cards after free effects are active.
  // Defense was already snapshotted above, so it is a state declaration only;
  // executing it again here must not clear incoming-damage accounting.
  let playerCombatResolved=true;
  let aiCombatResolved=true;
  if(!pFree){ playerCombatResolved=await applyCard(S.p,S.a,S.pending.player,S.pending.ai); }
  if(!aFree){ aiCombatResolved=await applyCard(S.a,S.p,S.pending.ai,S.pending.player); }

  // Tank counter: base 20%; if the tank had Shield when Defense was used, 30%.
  // The shield snapshot is taken at Defense-card use time, not after damage resolves.
  const tankCounters=[];
  const playerCounterChance=S.p.counterShielded?.3:.2;
  const aiCounterChance=S.a.counterShielded?.3:.2;

  // V12.12.29 — Tank Counter Resolution Tree:
  // Attack card -> actually resolved -> post-Defense damage > 0 ->
  // 20%/30% check -> counter = actual post-Defense incoming damage × 50%.
  // The counter remains in the post-combat phase so the two primary cards stay simultaneous.
  if(canTankCounter(S.p,S.a,S.pending.ai,aiCombatResolved)){
    log(`🛡️ 坦克防禦反傷機率：${S.p.counterShielded?30:20}%`);
    if(Math.random()<playerCounterChance){
      const n=+(S.p.lastDamageTaken*.5).toFixed(2);
      if(n>0)tankCounters.push([S.p,S.a,n]);
    }
  }

  if(canTankCounter(S.a,S.p,S.pending.player,playerCombatResolved)){
    log(`🛡️ AI 坦克防禦反傷機率：${S.a.counterShielded?30:20}%`);
    if(Math.random()<aiCounterChance){
      const n=+(S.a.lastDamageTaken*.5).toFixed(2);
      if(n>0)tankCounters.push([S.a,S.p,n]);
    }
  }
  for(const [tank,target,n] of tankCounters){
    damageDirect(target,n,"🛡️ 坦克防禦反擊");
    log(`🛡️ 坦克防禦反擊：${n}`);
  }
  // Sword spirit: HP < 5 grants ONE "劍氣出竅" per fighter per battle.
  if(S.p.job==="swordsman"&&S.p.hp<5&&!S.p.spiritGranted){
    S.p.spirit=1;S.p.spiritGranted=true;
    S.p.hand.push({n:"劍氣出竅",k:"spirit",job:"swordsman",target:"combat",i:"✨",s:"造成 2 傷害；命中後 50% 封鎖攻擊",special:true});
    log("⚔️ 劍客覺醒：獲得一次性「劍氣出竅」");
  }
  if(S.a.job==="swordsman"&&S.a.hp<5&&!S.a.spiritGranted){
    S.a.spirit=1;S.a.spiritGranted=true;
    S.a.hand.push({n:"劍氣出竅",k:"spirit",job:"swordsman",target:"combat",i:"✨",s:"造成 2 傷害；命中後 50% 封鎖攻擊",special:true});
    log("⚔️ AI 劍客覺醒：獲得一次性「劍氣出竅」");
  }
  // Spirit card is resolved like a normal committed card when chosen next turn.
  // Burn at end of round comes only from Gunner Critical.
  // Assassin Night Raid does NOT cause burn damage.
  const gunBurnP=+(S.p.burn||0).toFixed(2);
  const gunBurnA=+(S.a.burn||0).toFixed(2);
  const burnP=gunBurnP;
  const burnA=gunBurnA;
  if(burnP>0){damageDirect(S.p,burnP,"🔥 灼傷");log(`🔥 你受到灼傷 ${burnP}`);}
  if(burnA>0){damageDirect(S.a,burnA,"🔥 灼傷");log(`🔥 AI 受到灼傷 ${burnA}`);}
  S.p.burn=0;S.a.burn=0;
  // Existing attack locks last for the blocked turn only. A lock created
  // during this resolution persists into the next round.
  S.p.attackLocked=!!(S.p.attackLocked&&!playerLockedByAI);
  S.a.attackLocked=!!(S.a.attackLocked&&!aiLockedByPlayer);
  // V12.12.0 — UI-only feedback: show MISS when a normal Dodge successfully evades an incoming attack.
  const missPlayer = !!(S.p.roundDodge && aiCombatResolved && isResolvedAttackCard(S.pending.ai));
  const missAI = !!(S.a.roundDodge && playerCombatResolved && isResolvedAttackCard(S.pending.player));
  S.p.roundDodge=false;
  S.a.roundDodge=false;
  S.p.def=0; S.a.def=0;

  // V12.10.7 — Tank Domain Expansion appears once when HP drops below 3.
  maybeGrantTankDomain(S.p);
  maybeGrantTankDomain(S.a);

  // V12.9.6 — restore floating combat feedback from the actual round delta.
  // This captures HP and Shield changes caused by attacks, defense,
  // counters, burn, and other resolved effects.
  S.lastResult={
    player:{miss:missPlayer,events:[...S.roundEvents.player]},
    ai:{miss:missAI,events:[...S.roundEvents.ai]}
  };

  // Resolve the round first. Only after all state changes are complete do we
  // enter the feedback phase. This guarantees one deterministic timeline:
  // normal: FLIP > RESOLVE > SHAKE/FADE > NEXT ROUND
  // assassin: FLIP > RESOLVE > COIN > SHAKE/FADE > NEXT ROUND
  const roundEnded = S.p.hp<=0 || S.a.hp<=0 || S.round>=50;
  // Basic cards have no profession; give presentation a read-only actor snapshot.
  const combatants={player:{job:S.p.job},ai:{job:S.a.job}};

  // IMPORTANT: do not render here. The face-up cards must remain on screen
  // while post-resolution presentation is prepared. Rendering here would
  // start the floating combat text before the assassin coin.

  // Assassin coin is purely a post-resolution presentation step.
  if(S.assassinCoinResults && (S.pending?.player?.k==="class"&&S.pending.player.job==="assassin" || S.pending?.ai?.k==="class"&&S.pending.ai.job==="assassin")){
    const coinNight = S.pending?.player?.k==="class"&&S.pending.player.job==="assassin"
      ? S.assassinCoinResults.player
      : S.assassinCoinResults.ai;
    await showAssassinCoin(!!coinNight,sessionId);
    if(!currentSession(sessionId))return;
  }

  if(roundEnded){
    // Keep the final combat feedback visible before switching to the result UI.
    S.phase="result";renderGame();
    await NDCombatFX.play({session:sessionId,round:S.round,result:S.lastResult,pending:S.pending,combatants});
    if(!currentSession(sessionId))return;
    endCheck();
    if(S.end)renderGame();
    return;
  }

  // Single feedback window: arena shake + floating combat text share the same
  // start point and duration, then the round advances exactly once.
  S.phase="result";
  renderGame();
  await NDCombatFX.play({session:sessionId,round:S.round,result:S.lastResult,pending:S.pending,combatants});
  if(!currentSession(sessionId)||S.end)return;
  await nextRound(sessionId);
}

async function nextRound(sessionId=S?.session){
  if(!currentSession(sessionId)||S.end)return;
  S.lastResult=null;S.pending=null;S.reveal=false;S.revealFlipped=false;S.revealShowFront=false;S.revealStage=null;S.assassinCoinResults=null;
  S.round++;

  // Reset all per-round Tank/Defense state. Shield itself persists across rounds.
  S.p.shieldUsed=false;
  S.a.shieldUsed=false;
  S.p.usedDefense=false; S.a.usedDefense=false;
  S.p.counterShielded=false; S.a.counterShielded=false;
  S.p.lastDamageTaken=0; S.a.lastDamageTaken=0;
  S.p.def=0; S.a.def=0;

  draw(S.p,1);draw(S.a,1);
  ensurePlayable(S.p);ensurePlayable(S.a);
  S.phase="player";
  renderGame();

  // Rule-driven safety: if the player has no legal normal combat card,
  // do not wait for a click forever. Auto-submit a pass for this side.
  // A still-available Tank Shield is a legal free action, so leave the
  // player in YOUR MOVE and let them use it first.
  if(!hasPlayableCombatCard(S.p) && !hasAvailableFreeEffect(S.p)){
    await sleep(180);
    if(!S||S.end||S.phase!=="player")return;
    log(S.p.attackLocked
      ?"🚫 你沒有可用的正常牌，系統自動結束本回合。"
      :"⏭️ 你沒有可用的正常牌，系統自動結束本回合。");
    S.p.used=true;
    S.pending={player:passCard("player")};
    S.phase="ai";
    renderGame();
    try{
      await aiTurn();
    }catch(err){
      console.error("AI turn error after auto-pass",err);
      if(S&&!S.end&&S.phase==="ai"&&!S.pending?.ai){
        S.pending.ai=passCard("ai");
        beginReveal();
      }
    }
  }
}
// All entry pages share this renderer, audio settings and local artwork.
function renderHome(){
  window.NDEnvironment?.leave();
  app.innerHTML=`<main class="home-shell" aria-labelledby="home-title">
    <header class="home-top"><span>NIGHTFALL DUEL</span><button class="home-audio" onclick="showAudioSettings()">🔊 音效設定</button></header>
    <section class="home-intro"><p class="home-eyebrow">暮色降臨 · 由你啟程</p><h1 id="home-title">黑夜之中，<br>選擇你的道路。</h1><p>走進四位英雄的往事，或以手中卡牌迎接一場決鬥。</p></section>
    <nav class="home-modes" aria-label="選擇遊戲玩法">
      <a class="home-mode home-story" href="Nightfall-Duel-Story.html" aria-labelledby="home-story-title">
        <img class="home-mode-art" src="assets/characters/assassin.webp" alt="">
        <div class="home-mode-copy"><p class="home-eyebrow">01 / CHRONICLES</p><h2 id="home-story-title">故事玩法</h2><p>追尋鐘聲背後的名字。探索四條起源故事線，完成節點挑戰，解鎖記憶卡面。</p><div class="home-tags"><span>四位英雄</span><span>章節挑戰</span><span>卡面收藏</span></div><span class="home-enter">進入故事 <span aria-hidden="true">→</span></span></div>
      </a>
      <a class="home-mode home-duel" href="Nightfall-Duel-V12.12.39-Test.html" aria-labelledby="home-duel-title">
        <img class="home-mode-art" src="assets/characters/swordsman.webp" alt="">
        <div class="home-mode-copy"><p class="home-eyebrow">02 / CARD BATTLE</p><h2 id="home-duel-title">卡牌對戰玩法</h2><p>選擇職業與對手戰術。掌握攻擊、防禦與閃躲的時機，在回合交鋒中取得勝利。</p><div class="home-tags"><span>四種職業</span><span>策略出牌</span><span>AI 對戰</span></div><span class="home-enter">進入決鬥 <span aria-hidden="true">→</span></span></div>
      </a>
    </nav>
    <footer class="home-footer"><span>同一片黑夜，兩種冒險。</span><span>故事進度會保存在目前的瀏覽器。</span></footer>
  </main>`;
}

function render(){if(document.body.dataset.mode==="home"){renderHome();return;}if(document.body.dataset.mode==="story"){if(S?.storyBattle){if(S.end)renderResult();else renderGame();}else window.NDStory.mount(app);return;}if(!S)renderSetup();else if(S.end)renderResult();else renderGame()}

/* V12.10.11 — drag lifecycle fail-safe */


/* ============================================================
   V8.9 — CLEAN POINTER DRAG CONTROLLER
   One controller owns the gesture. No per-card pointer handlers.
   Diagnostic HUD is intentionally tiny and can be removed after
   verification.
   ============================================================ */

/* ============================================================
   V9.2 — DRAG LAYER FIX
   V12.10.11 — DRAG LIFECYCLE FAIL-SAFE
   Root cause: .hand is overflow-x:auto. A transformed child cannot
   paint outside that scroll container. High z-index cannot escape
   overflow clipping.

   Solution:
   - Original card stays in the hand as a placeholder.
   - Once movement exceeds the threshold, create ONE drag ghost
     directly under <body>.
   - The ghost is position:fixed and therefore escapes .hand clipping.
   - Pointer Capture remains on the original card.
   ============================================================ */
let dragState=null;
let dragClickSuppressedUntil=0;

function getDragCard(target){
  // V12.12.39-Test: the reference-table layout uses .duel-hand instead of the legacy .hand wrapper.
  return target?.closest?.(".duel-hand.player-hand .card");
}

function pointerDown(e){
  // One gesture owns the ghost and pointer capture until it is cleaned up.
  if(dragState)return;
  const card=getDragCard(e.target);
  if(!card || card.disabled || !S || S.phase!=="player")return;

  const cards=[...document.querySelectorAll(".duel-hand.player-hand .card")];
  const index=cards.indexOf(card);
  if(index<0 || !canPlay(S.p,S.p.hand[index]))return;

  const r=card.getBoundingClientRect();
  // A rotated/hovered card's bounding box is not its physical card size.
  const width=card.offsetWidth,height=card.offsetHeight;
  playSfx("cardPickup");

  dragState={
    card,index,pointerId:e.pointerId,
    startX:e.clientX,startY:e.clientY,
    offsetX:(e.clientX-r.left)/r.width*width,
    offsetY:(e.clientY-r.top)/r.height*height,
    width,height,
    moved:false,target:false,
    ghost:null
  };

  e.preventDefault();
  e.stopPropagation();

  try{card.setPointerCapture(e.pointerId)}catch(_){}
}

function createDragGhost(d){
  const ghost=d.card.cloneNode(true);

  ghost.removeAttribute("id");
  ghost.removeAttribute("disabled");
  ghost.removeAttribute("onclick");
  ghost.setAttribute("aria-hidden","true");
  ghost.tabIndex=-1;
  ghost.classList.remove("disabled");
  ghost.classList.add("nd-drag-ghost");

  ghost.style.width=d.width+"px";
  ghost.style.height=d.height+"px";
  ghost.style.left=(d.startX-d.offsetX)+"px";
  ghost.style.top=(d.startY-d.offsetY)+"px";

  document.body.appendChild(ghost);
  d.ghost=ghost;

  d.card.classList.add("nd-drag-placeholder","nd-drag-source");
  document.body.classList.add("nd-dragging-mode");

  if(navigator.vibrate)navigator.vibrate(8);
}

function pointerMove(e){
  const d=dragState;
  if(!d || e.pointerId!==d.pointerId)return;

  e.preventDefault();
  e.stopPropagation();

  const dx=e.clientX-d.startX;
  const dy=e.clientY-d.startY;

  if(!d.moved){
    if(Math.hypot(dx,dy)<6)return;

    d.moved=true;
    createDragGhost(d);
    /* Never allow a ghost to survive an abnormal mobile gesture. */
    d.failSafeTimer=setTimeout(()=>{
      if(dragState===d)cleanupDrag(d);
    },15000);
  }

  if(!d.ghost)return;

  updateDragTarget(d,e);
}

function hasCardDropOverlap(cardRect,areaRect){
  if(!areaRect || cardRect.width<=0 || cardRect.height<=0)return false;
  const width=Math.max(0,Math.min(cardRect.right,areaRect.right)-Math.max(cardRect.left,areaRect.left));
  const height=Math.max(0,Math.min(cardRect.bottom,areaRect.bottom)-Math.max(cardRect.top,areaRect.top));
  return width*height>=cardRect.width*cardRect.height*0.4;
}

function updateDragTarget(d,e){
  // Measure the visible, elevated card after moving it, excluding its shadow.
  // Move and release share this geometry; pointer position alone is not a hit.
  d.ghost.style.left=(e.clientX-d.offsetX)+"px";
  d.ghost.style.top=(e.clientY-d.offsetY)+"px";
  const cardRect=d.ghost.getBoundingClientRect();
  const combatSlot=document.querySelector(".slot.you");
  const selfHud=document.querySelector(".duel-side.player");
  const selfHero=document.querySelector(".duel-hero.player");
  const enemyHud=document.querySelector(".duel-side.enemy");
  const enemySlot=document.querySelector(".slot.enemy");
  const hit=el=>hasCardDropOverlap(cardRect,el?.getBoundingClientRect());
  const card=S.p.hand[d.index];
  const zone=card?.target==="self"?"self":"combat";
  d.target = zone==="self" ? (hit(selfHud)||hit(selfHero)) : hit(combatSlot);
  const invalid=zone==="combat" ? hit(enemySlot) : hit(enemyHud);

  combatSlot?.classList.toggle("nd-drop-target",zone==="combat"&&d.target);
  selfHud?.classList.toggle("nd-drop-target",zone==="self"&&d.target);
  if(selfHero){
    selfHero.classList.toggle("nd-drop-ready",zone==="self");
    selfHero.classList.toggle("nd-drop-target",zone==="self"&&d.target);
    if(zone==="self")selfHero.querySelector(".duel-hero-drop").textContent=d.target?`放開使用「${card.n}」`:`拖到角色身上使用「${card.n}」`;
  }
  enemySlot?.classList.toggle("nd-drop-invalid",zone==="combat"&&invalid);
  enemyHud?.classList.toggle("nd-drop-invalid",zone==="self"&&invalid);

  d.ghost.classList.toggle("nd-drag-valid",d.target);
  d.ghost.classList.toggle("nd-drag-invalid",invalid);
}

function pointerUp(e){
  const d=dragState;
  if(!d || e.pointerId!==d.pointerId)return;

  e.preventDefault();
  e.stopPropagation();

  if(d.moved&&d.ghost)updateDragTarget(d,e);
  const shouldPlay=d.moved&&d.target;
  const index=d.index;
  if(shouldPlay&&S?.p?.hand?.[index]?.target==="self")ndHeroBurst(document.querySelector(".duel-hero.player.nd-drop-target"));

  try{d.card.releasePointerCapture(e.pointerId)}catch(_){}
  cleanupDrag(d);

  if(shouldPlay)playCard(index);
  else if(d.moved){playSfx("cardInvalid");const c=S?.p?.hand?.[index];ndShowHint(document.querySelector(c?.target==="self"?".duel-screen>.duel-side.player":".slot.you"),c?.target==="self"?"這張牌要拖到你自己的角色身上或角色面板":"拖到你的出牌區（重疊 40% 以上）即可出牌");}
}

function pointerCancel(e){
  if(!dragState)return;
  if(e?.pointerId!=null&&e.pointerId!==dragState.pointerId)return;
  cleanupDrag(dragState);
}

/* V12.10.11 — Android/Chrome fail-safe.
   A drag must never leave a body-level ghost behind when the browser
   loses pointer capture, the tab loses focus, or touchend/touchcancel
   is delivered without the expected pointerup sequence. */
function pointerLostCapture(e){
  if(!dragState)return;
  if(e?.pointerId!=null&&e.pointerId!==dragState.pointerId)return;
  cleanupDrag(dragState);
}
function dragWindowBlur(){
  if(dragState)cleanupDrag(dragState);
}
function dragVisibilityChange(){
  if(document.hidden && dragState)cleanupDrag(dragState);
}

function cleanupDrag(d){
  if(!d)return;

  if(d.failSafeTimer)clearTimeout(d.failSafeTimer);
  d.ghost?.remove();

  d.card.classList.remove("nd-drag-placeholder","nd-drag-source");
  if(d.moved){
    // Mobile browsers may synthesize a click after pointerup.
    // Suppress that synthetic click so a drag never opens the card detail modal.
    dragClickSuppressedUntil=Date.now()+500;
    d.card.dataset.dragged="1";
    setTimeout(()=>delete d.card.dataset.dragged,350);
  }

  document.body.classList.remove("nd-dragging-mode");
  document.querySelector(".slot.you")?.classList.remove("ready","nd-drop-target");
  document.querySelector(".duel-side.player")?.classList.remove("nd-drop-target");
  document.querySelector(".duel-hero.player")?.classList.remove("nd-drop-ready","nd-drop-target");
  document.querySelector(".slot.enemy")?.classList.remove("nd-drop-invalid");
  document.querySelector(".duel-side.enemy")?.classList.remove("nd-drop-invalid");

  dragState=null;
}

/* One delegated event system; survives every renderGame(). */
// V12.10.10 — prevent the browser's synthetic click after a drag.
// Without this guard, a mobile drag can also fire the card's onclick,
// opening a fixed detail overlay and making the card appear "stuck".
document.addEventListener("click",e=>{
  if(Date.now()<dragClickSuppressedUntil){
    const card=e.target?.closest?.(".duel-hand.player-hand .card");
    if(card){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
},{capture:true});
document.addEventListener("pointerdown",pointerDown,{capture:true,passive:false});
document.addEventListener("pointermove",pointerMove,{capture:true,passive:false});
document.addEventListener("pointerup",pointerUp,{capture:true,passive:false});
document.addEventListener("pointercancel",pointerCancel,{capture:true,passive:false});
document.addEventListener("lostpointercapture",pointerLostCapture,{capture:true,passive:false});
document.addEventListener("touchend",()=>{if(!window.PointerEvent && dragState)cleanupDrag(dragState)},{capture:true,passive:false});
document.addEventListener("touchcancel",()=>{if(!window.PointerEvent && dragState)cleanupDrag(dragState)},{capture:true,passive:false});
window.addEventListener("blur",dragWindowBlur,{capture:true});
document.addEventListener("visibilitychange",dragVisibilityChange,{capture:true});

/* Legacy names kept harmless for compatibility. */
function dragStart(e,i){pointerDown(e)}
function dragMove(e){pointerMove(e)}
function dragFinish(e){pointerUp(e)}
function dragEnd(){pointerCancel()}


/* V12.12.39-Test UI Repair 12 — motion/audio polish.
   Presentation-only: preserve gameplay resolution and existing hit areas. */
const ND_SFX_POOLS=Object.create(null);
let ndMusicFadeFrame=0;

function setAudioVolume(k,v){
  const val=Math.max(0,Math.min(1,Number(v)||0));
  audioVolumes[k]=val;
  try{localStorage.setItem("nightfallAudioVolumesV1",JSON.stringify(audioVolumes))}catch(e){}
  if(AudioBank[k]){try{AudioBank[k].volume=val}catch(e){}}
  if(ND_SFX_POOLS[k])ND_SFX_POOLS[k].forEach(a=>{try{a.volume=Math.min(1,sfxVolume(k,"file"))}catch(e){}});
}
function resetAudioVolumes(){
  audioVolumes={};
  try{localStorage.removeItem("nightfallAudioVolumesV1")}catch(e){}
  Object.keys(AUDIO_DEFAULTS).forEach(k=>setAudioVolume(k,AUDIO_DEFAULTS[k]));
}
function ensureSfxPool(name){
  if(ND_SFX_POOLS[name]?.length)return ND_SFX_POOLS[name];
  const base=AudioBank[name];
  if(!base)return [];
  const pool=[base];
  for(let i=1;i<3;i++){
    try{
      const clone=base.cloneNode(true);
      clone.preload="auto";
      clone.volume=Math.min(1,sfxVolume(name,"file"));
      clone.load();
      pool.push(clone);
    }catch(e){}
  }
  ND_SFX_POOLS[name]=pool;
  return pool;
}
function playSfx(name){
  if(!audioEnabled)return;
  if(Object.keys(AudioBank).length===0)try{initAudio()}catch(e){}
  const pool=ensureSfxPool(name);
  if(!pool.length)return;
  const a=pool.find(x=>x.paused||x.ended)||pool[0];
  try{
    a.pause();
    a.currentTime=0;
    a.volume=getAudioVolume(name);
    const pr=a.play();
    if(pr&&typeof pr.catch==="function")pr.catch(()=>{});
  }catch(e){}
}
function switchMusic(mode,fade=true){
  currentMusicMode=mode;
  if(Object.keys(AudioBank).length===0)try{initAudio()}catch(e){}
  if(!audioEnabled)return;
  const nextKey=musicKey(mode);
  const next=AudioBank[nextKey];
  if(!next)return;
  const prev=currentMusicKey&&AudioBank[currentMusicKey];
  if(ndMusicFadeFrame){cancelAnimationFrame(ndMusicFadeFrame);ndMusicFadeFrame=0;}
  const target=getAudioVolume(nextKey);
  if(prev===next){
    try{next.volume=target; if(next.paused){const pr=next.play();if(pr?.catch)pr.catch(()=>{});}}catch(e){}
    return;
  }

  const finish=()=>{
    if(prev&&prev!==next)try{prev.pause();prev.currentTime=0;prev.volume=getAudioVolume(currentMusicKey||nextKey)}catch(e){}
    currentMusicKey=nextKey;
    try{next.currentTime=0;next.volume=target;if(!next.paused){next.pause();next.currentTime=0;}}
    catch(e){}
    if(!fade){
      try{next.volume=target;const pr=next.play();if(pr?.catch)pr.catch(()=>{});}catch(e){}
      return;
    }
    try{next.volume=0;const pr=next.play();if(pr?.catch)pr.catch(()=>{});}catch(e){}
    const startPrev=prev?Math.max(0,Number(prev.volume)||0):0;
    const start=performance.now();
    const duration=320;
    const tick=(now)=>{
      const t=Math.min(1,(now-start)/duration);
      const eased=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
      try{next.volume=target*eased}catch(e){}
      if(prev&&prev!==next)try{prev.volume=startPrev*(1-eased)}catch(e){}
      if(t<1){ndMusicFadeFrame=requestAnimationFrame(tick);}
      else{
        ndMusicFadeFrame=0;
        if(prev&&prev!==next)try{prev.pause();prev.currentTime=0;prev.volume=getAudioVolume(currentMusicKey||nextKey)}catch(e){}
        try{next.volume=target}catch(e){}
      }
    };
    ndMusicFadeFrame=requestAnimationFrame(tick);
  };

  // Cross-fade both layers at the same time so there is no dead-air gap.
  if(!fade){finish();return;}
  try{next.pause();next.currentTime=0;next.volume=0;}catch(e){}
  currentMusicKey=nextKey;
  const pr=next.play();if(pr?.catch)pr.catch(()=>{});
  const startPrev=prev?Math.max(0,Number(prev.volume)||0):0;
  const start=performance.now();
  const duration=320;
  const tick=(now)=>{
    const t=Math.min(1,(now-start)/duration);
    const eased=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    try{next.volume=target*eased}catch(e){}
    if(prev&&prev!==next)try{prev.volume=startPrev*(1-eased)}catch(e){}
    if(t<1){ndMusicFadeFrame=requestAnimationFrame(tick);}
    else{
      ndMusicFadeFrame=0;
      if(prev&&prev!==next)try{prev.pause();prev.currentTime=0;prev.volume=getAudioVolume(currentMusicKey)}catch(e){}
      try{next.volume=target}catch(e){}
    }
  };
  ndMusicFadeFrame=requestAnimationFrame(tick);
}

function showAssassinCoin(night,sessionId){
  assassinCoinQueue=assassinCoinQueue.then(()=>new Promise(resolve=>{
    if(!currentSession(sessionId)){resolve();return;}
    const face=night?"moon":"sun";
    const label=night?"🌙 夜襲":"☀️ 白天";
    const startRotation=night?0:180;
    const finalRotation=night?540:360;
    const overlay=document.createElement("div");
    overlay.className="coin-flip-overlay";
    overlay.innerHTML=`<div class="coin-flip-scene" aria-hidden="true">
      <div class="coin-flip-coin ${face}" style="--coin-start-rotation:${startRotation}deg;--coin-final-rotation:${finalRotation}deg">
        <div class="coin-face sun"><span class="coin-symbol">☀️</span></div>
        <div class="coin-face moon"><span class="coin-symbol">🌙</span></div>
      </div>
      <div class="coin-result ${face}">${label}</div>
    </div>`;
    const host=document.querySelector(".retro-arena")||document.querySelector(".arena")||document.body;
    host.appendChild(overlay);
    playSfx("coinFlip");
    const done=()=>{clearTimeout(timer);if(currentSession(sessionId))window.NDEnvironment?.sync(S);overlay.classList.add("is-done");setTimeout(()=>overlay.remove(),120);resolve();};
    const timer=setTimeout(done,1280);
    if(!currentSession(sessionId))done();
  }));
  return assassinCoinQueue;
}

async function beginReveal(){
  if(!S||S.end)return;
  const sid=S.session;
  S.phase="reveal";
  S.revealStage="lift";S.reveal=true;S.revealFlipped=false;S.revealShowFront=false;
  S.assassinCoinResults=null;
  renderGame();

  // 1) Lift: give the cards a quiet spatial cue before the flip sound.
  if(!(await sessionSleep(280,sid)))return;
  if(!currentSession(sid)||S.end)return;

  // 2) Flip: sound begins with the visible edge turn, not before it.
  playSfx("cardFlip");
  S.revealStage="flip";S.revealFlipped=true;S.revealShowFront=false;renderGame();
  if(!(await sessionSleep(680,sid)))return;
  if(!currentSession(sid)||S.end)return;

  // 3) Settle: short, soft landing so the face-up cards feel physical.
  S.revealStage="settle";renderGame();
  if(!(await sessionSleep(340,sid)))return;
  if(!currentSession(sid)||S.end)return;

  // 4) Only now resolve combat. Existing rules stay untouched.
  await resolveRound(sid);
}


/* V12.12.39 — BGM reliability fallback
   Remote OpenGameArt BGM can be blocked/unavailable on mobile or local content:// pages.
   Keep the original music when it plays; otherwise fall back to a lightweight Web Audio loop
   after the user's first gesture. This does not replace the existing SFX system. */
const ND_BGM_FALLBACK={
  ctx:null,master:null,mode:null,started:false,step:0,timer:null,
  patterns:{
    setup:[
      [261.63,329.63,392.00],[293.66,369.99,440.00],[246.94,311.13,369.99],[220.00,293.66,349.23]
    ],
    battle:[
      [130.81,164.81,196.00],[146.83,174.61,220.00],[123.47,155.56,185.00],[110.00,146.83,174.61]
    ],
    result:[
      [261.63,329.63,392.00],[293.66,369.99,440.00],[329.63,392.00,493.88],[392.00,493.88,587.33]
    ]
  },
  ensure(){
    if(this.ctx)return this.ctx;
    try{
      this.ctx=new (window.AudioContext||window.webkitAudioContext)();
      this.master=this.ctx.createGain();
      this.master.gain.value=0.055;
      this.master.connect(this.ctx.destination);
      return this.ctx;
    }catch(e){this.ctx=null;this.master=null;return null;}
  },
  tone(freq,when,dur,type='triangle',amp=.18){
    const ctx=this.ctx;if(!ctx||!this.master)return;
    const o=ctx.createOscillator();
    const g=ctx.createGain();
    const f=ctx.createBiquadFilter();
    f.type='lowpass';f.frequency.value=type==='sine'?1500:1100;f.Q.value=.35;
    o.type=type;o.frequency.setValueAtTime(freq,when);
    g.gain.setValueAtTime(.0001,when);
    g.gain.exponentialRampToValueAtTime(amp,when+.035);
    g.gain.exponentialRampToValueAtTime(.0001,when+dur);
    o.connect(f);f.connect(g);g.connect(this.master);
    o.start(when);o.stop(when+dur+.03);
  },
  tick(){
    if(!this.started||!this.ctx||!this.master)return;
    const now=this.ctx.currentTime+.02;
    const pattern=this.patterns[this.mode]||this.patterns.battle;
    const chord=pattern[this.step%pattern.length];
    const stepDur=this.mode==='result'?0.62:this.mode==='setup'?0.72:0.56;
    chord.forEach((n,i)=>this.tone(n,now+i*.018,stepDur*.92,i===0?'sine':'triangle',i===0?.16:.09));
    const root=chord[0]/2;
    this.tone(root,now,stepDur*.78,'sine',.11);
    this.step=(this.step+1)%pattern.length;
  },
  start(mode){
    if(!audioEnabled)return;
    const ctx=this.ensure();
    if(!ctx)return;
    // 2026-09-28: every tap re-requests music; do not restart an already running loop (caused stutter).
    if(this.started&&this.timer&&this.mode===mode&&ctx.state==='running')return;
    this.mode=mode;
    const resume=()=>{
      if(ctx.state==='suspended')ctx.resume().catch(()=>{});
      this.started=true;
      if(this.timer)clearInterval(this.timer);
      this.step=0;
      this.tick();
      const ms=mode==='result'?620:mode==='setup'?720:560;
      this.timer=setInterval(()=>this.tick(),ms);
    };
    if(ctx.state==='running')resume(); else ctx.resume().then(resume).catch(()=>{});
  },
  stop(){
    this.started=false;
    if(this.timer){clearInterval(this.timer);this.timer=null;}
  }
};

// Wrap the final switchMusic definition with a reliability guard.
// The original remote BGM remains the first choice; synth starts only when the remote layer
// is missing, blocked, or still paused after the user gesture.
const ND_originalSwitchMusic=switchMusic;
switchMusic=function(mode,fade=true){
  ND_originalSwitchMusic(mode,fade);
  if(!audioEnabled)return;
  const key=musicKey(mode);
  setTimeout(()=>{
    if(!audioEnabled||currentMusicMode!==mode)return;
    const a=AudioBank[key];
    if(a && !a.paused && !a.ended){ND_BGM_FALLBACK.stop();return;}
    ND_BGM_FALLBACK.start(mode);
  },700);
};

// One gesture is enough to unlock both remote media and the Web Audio fallback.
document.addEventListener('pointerdown',()=>{
  if(!audioEnabled)return;
  try{
    const mode=currentMusicMode||'setup';
    switchMusic(mode,false);
    if(ND_BGM_FALLBACK.ctx?.state==='suspended')ND_BGM_FALLBACK.ctx.resume().catch(()=>{});
  }catch(e){}
},{passive:true});


/* 2026-09-28 — Audio reliability pass.
   1) Muting now also silences the Web Audio BGM fallback (it used to keep ticking after mute).
   2) Remote OpenGameArt SFX are often blocked (offline, proxy, hotlink rules). When an SFX file
      fails to load, a short synthesized cue plays instead so every action still has feedback.
   Presentation only: no rules, RNG, AI or timing of battle resolution are touched. */
const ND_SFX_FALLBACK={
  ctx:null,out:null,noiseBuf:null,
  ensure(){
    if(this.ctx)return this.ctx;
    const shared=ND_BGM_FALLBACK.ensure();
    if(!shared)return null;
    this.ctx=shared;
    this.out=shared.createGain();this.out.gain.value=1;
    // AUDIO-MIX-061: soft clipper so loud or overlapping cues (bell blast, sharp hit transients) round off instead of clipping.
    // Linear (bit-transparent) below -2.5 dBFS; above that it bends smoothly toward 1.0. Covers input up to +6 dBFS.
    try{const pre=shared.createGain(),sh=shared.createWaveShaper(),post=shared.createGain(),N=4097,curve=new Float32Array(N);
      for(let i=0;i<N;i++){const x=(i/(N-1)*2-1)*2,a=Math.abs(x);curve[i]=Math.sign(x)*(a<.75?a:.75+.25*Math.tanh((a-.75)/.25));}
      pre.gain.value=.5;sh.curve=curve;post.gain.value=1;this.out.connect(pre);pre.connect(sh);sh.connect(post);post.connect(shared.destination);}
    catch(e){this.out.connect(shared.destination);}
    const len=Math.floor(shared.sampleRate*.5);this.noiseBuf=shared.createBuffer(1,len,shared.sampleRate);
    const d=this.noiseBuf.getChannelData(0);let seed=1;for(let i=0;i<len;i++){seed=(seed*16807)%2147483647;d[i]=seed/1073741823.5-1;}
    return shared;
  },
  tone(t,freq,dur,{type='sine',gain=.3,to=null}={}){
    const c=this.ctx,o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(this.bus);o.start(t);o.stop(t+dur+.02);
  },
  noise(t,dur,{gain=.3,type='bandpass',freq=2000,q=.8,to=null}={}){
    const c=this.ctx,src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
    src.buffer=this.noiseBuf;f.type=type;f.frequency.setValueAtTime(freq,t);if(to)f.frequency.exponentialRampToValueAtTime(to,t+dur);f.Q.value=q;
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    src.connect(f);f.connect(g);g.connect(this.bus);src.start(t);src.stop(t+dur+.02);
  },
  recipes:{
    cardPickup(t){this.noise(t,.09,{freq:3200,to:5200,gain:.25});},
    cardPlace(t){this.tone(t,150,.14,{to:70,gain:.45});this.noise(t,.05,{freq:1800,gain:.2});},
    cardFlip(t){this.noise(t,.05,{freq:2600,gain:.25});this.noise(t+.07,.05,{freq:2000,gain:.2});},
    cardInvalid(t){this.tone(t,220,.08,{type:'square',gain:.12});this.tone(t+.1,185,.1,{type:'square',gain:.12});},
    hit(t){this.tone(t,110,.2,{to:55,gain:.5});this.noise(t,.12,{type:'lowpass',freq:1600,gain:.35});},
    coinFlip(t){for(let i=0;i<5;i++)this.tone(t+i*.06,2400-i*120,.05,{type:'triangle',gain:.12});}
  },
  play(name){
    const recipe=this.recipes[name];
    if(!recipe){if(ND_SFX_GROUP[name])this.play(ND_SFX_GROUP[name]);return;}
    const c=this.ensure();if(!c)return;
    const run=()=>{
      const t=c.currentTime+.01;
      this.bus=c.createGain();this.bus.gain.value=Math.max(0,Math.min(8,sfxVolume(name,"synth")));this.bus.connect(this.out);
      try{recipe.call(this,t);}catch(e){}
    };
    if(c.state==='running')run();else c.resume().then(run).catch(()=>{});
  }
};
/* DUEL-SFX-062 — play a duel cue by short name. Identical cues requested within 70 ms (both sides hit at once) are
   spaced out instead of stacking into one louder, phasey sound. */
const ND_DUEL_SFX_LAST=Object.create(null);
function ndDuelSfx(short){
  const key="duel"+short[0].toUpperCase()+short.slice(1);
  if(!AUDIO_URLS[key])return;
  const now=performance.now(),wait=Math.max(0,(ND_DUEL_SFX_LAST[key]||0)+70-now);
  ND_DUEL_SFX_LAST[key]=now+wait;
  if(wait)setTimeout(()=>playSfx(key),wait);else playSfx(key);
}
window.ndDuelSfx=ndDuelSfx;
function ndAudioFailed(a){return !!a&&(!!a.error||a.networkState===3);}
const ND_originalPlaySfx=playSfx;
playSfx=function(name){
  if(!audioEnabled)return;
  if(Object.keys(AudioBank).length===0)try{initAudio()}catch(e){}
  const base=AudioBank[name];
  if(ndAudioFailed(base)){ND_SFX_FALLBACK.play(name);return;}
  // 2026-10-01 — A remote file that is still loading (or stalled/blocked) neither errors nor plays, which made
  // effect sounds silently disappear. Until it has data, play the synthesized cue and nudge the load once.
  if(base&&base.readyState<2){
    if(!base.__ndKick){base.__ndKick=1;try{base.load()}catch(e){}}
    ND_SFX_FALLBACK.play(name);return;
  }
  const pool=ensureSfxPool(name);
  if(!pool.length){ND_SFX_FALLBACK.play(name);return;}
  const a=pool.find(x=>x.paused||x.ended)||pool[0];
  try{
    a.pause();a.currentTime=0;a.volume=Math.min(1,sfxVolume(name,"file"));
    const pr=a.play();
    // play() can reject (decode error, blocked autoplay); fall back to the synthesized cue instead of staying silent.
    if(pr&&typeof pr.catch==="function")pr.catch(()=>{ND_SFX_FALLBACK.play(name);});
  }catch(e){ND_SFX_FALLBACK.play(name);}
};
const ND_originalTick=ND_BGM_FALLBACK.tick;
ND_BGM_FALLBACK.tick=function(){if(!audioEnabled){this.stop();return;}return ND_originalTick.call(this);};
const ND_originalToggleAudio=toggleAudio;
toggleAudio=function(){
  ND_originalToggleAudio();
  if(!audioEnabled){
    ND_BGM_FALLBACK.stop();
    Object.values(ND_SFX_POOLS).forEach(pool=>pool.forEach(a=>{try{a.pause();}catch(e){}}));
  }
};


/* 2026-09-28 — Readability pass (presentation only; no rules, RNG or AI changes).
   1) Disabled hand cards explain why they cannot be played; invalid drops say where to drop.
   2) Status badges are tappable and explain themselves in place.
   3) The center shows this round's HP result for both sides while feedback plays. */
const ND_STATUS_TIPS={
  shield:"護盾：先吸收傷害，護盾扣完才會扣 HP。上限 6。",
  lock:"封鎖：下一回合不能打出攻擊類卡牌（攻擊、斬擊、閃擊、爆擊等）。",
  burn:"灼傷：回合結束時受到此數值的傷害，不算攻擊型傷害。",
  night:"夜襲：刺客的「閃躲」轉為造成 1 傷害的攻擊，並讓對手下一回合不能攻擊。",
  spirit:"劍氣出竅：HP < 5 時取得一次。2 傷害，命中後 50% 封鎖對手下一回合攻擊。",
  domain:"領域：下一次未被閃躲的攻擊，將防禦減傷後的傷害轉為 HP 回復；不超過 HP 上限，只生效一次。"
};
function ndStatusTag(key,label,extra=""){
  const tip=ND_STATUS_TIPS[key]||"";
  return `<button type="button" class="duel-status ${extra} nd-status-tip" data-tip="${tip}" aria-label="${label.replace(/^\S+\s/,"")}：${tip}">${label}</button>`;
}
function ndBlockReason(p,c){
  if(!S||S.phase!=="player")return "等待本回合結算中";
  if(isAttackCard(p,c)&&p.attackLocked)return "你被封鎖：這回合不能出攻擊類卡牌";
  if((c.k==="class"||c.k==="spirit")&&c.job!==p.job)return `只有${JOBS[c.job]?.n||"對應職業"}能使用這張牌`;
  if(c.k==="class"&&c.job==="tank"&&p.shieldUsed)return "護盾每回合只能使用一次";
  if(c.k==="domain")return "領域：需坦克 HP < 3、護盾為 0，且尚未展開";
  return "目前無法使用這張牌";
}
function ndRoundSummary(){
  if(!S||S.phase!=="result"||!S.lastResult)return "";
  const sum=side=>{const ev=S.lastResult[side]?.events||[];const hp=ev.reduce((a,e)=>a+(e.hp||0),0);const sh=ev.reduce((a,e)=>a+(e.shield||0),0);
    if(!ev.length)return S.lastResult[side]?.miss?"閃避":"無傷";
    const parts=[];if(hp)parts.push(`${hp>0?"+":""}${hudNumber(hp)} HP`);if(sh)parts.push(`${sh>0?"+":""}${hudNumber(sh)} 護盾`);return parts.join(" ")||"格擋";};
  return `<span class="nd-round-summary" role="status"><span><small>你</small>${sum("player")}</span><span><small>對手</small>${sum("ai")}</span></span>`;
}
function ndShowHint(anchor,text){
  document.querySelector(".nd-hint-toast")?.remove();
  if(!anchor||!text)return;
  const r=anchor.getBoundingClientRect();
  const el=document.createElement("div");el.className="nd-hint-toast";el.setAttribute("role","status");el.textContent=text;
  document.body.appendChild(el);
  const w=el.offsetWidth,h=el.offsetHeight;
  el.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+"px";
  el.style.top=Math.max(8,r.top-h-10)+"px";
  clearTimeout(ndShowHint.t);ndShowHint.t=setTimeout(()=>el.remove(),2400);
}
document.addEventListener("pointerup",e=>{
  const blocked=e.target.closest?.(".duel-hand .card[disabled]");
  if(blocked){ndShowHint(blocked,blocked.dataset.blockReason);return;}
  const tag=e.target.closest?.(".nd-status-tip");
  if(tag){ndShowHint(tag,tag.dataset.tip);}
},true);
document.addEventListener("keydown",e=>{
  if(e.key!=="Enter"&&e.key!==" ")return;
  const tag=e.target.closest?.(".nd-status-tip");if(tag){e.preventDefault();ndShowHint(tag,tag.dataset.tip);}
});

render();

// Game-shell journal: presentation only; opening it never advances a turn.
function showBattleJournal(){
  if(!S)return;
  document.querySelector('.journal-overlay')?.remove();
  const overlay=document.createElement('div');overlay.className='rules-overlay journal-overlay';
  const modal=document.createElement('section');modal.className='rules-modal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-label','戰況紀錄');
  modal.innerHTML='<div class="rules-head"><div class="rules-title">戰況紀錄</div><button class="rules-close" aria-label="關閉戰況">✕</button></div><div class="journal-entries"></div>';
  const entries=modal.querySelector('.journal-entries');
  for(const line of S.log){const row=document.createElement('p');row.textContent=line;entries.appendChild(row);}
  overlay.appendChild(modal);document.body.appendChild(overlay);
  const close=()=>overlay.remove();modal.querySelector('button').onclick=close;overlay.onclick=e=>{if(e.target===overlay)close();};modal.querySelector('button').focus();
}

// Cosmetic choice only. Active matches keep their captured skin.
function equipSetupSkin(job,id){const result=window.NDSkins.equip(job,id);renderSetup();const status=document.getElementById("skin-save-status");if(status)status.textContent=result.ok?(result.persisted?"外觀已保存":"無法保存外觀，目前僅於本頁保留") : "請先完成對應故事線";}
