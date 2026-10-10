/* Presentation adapter. No card legality, random draws, AI, or resolution logic. */
(() => {
  'use strict';
  const defs=window.ND_ICON_DEFS;
  const jobs=['swordsman','tank','assassin','gunner'];
  const glyphs={ '⚔':'attack','🛡':'shield','👁':'dodge','🗡':'flash','🔫':'critical','✨':'spirit','🌌':'domain','🌙':'night','☀':'sun','🚫':'lock','🔥':'burn','↩':'counter','🥷':'counter','🎯':'critical','🎴':'card','🃏':'card','🏆':'victory','💀':'defeat','⚖':'draw','📖':'rules','🔊':'audio','🔇':'mute','♫':'audio','♪':'audio','☷':'journal','◇':'rules','◆':'selected','✕':'close','×':'close','✅':'selected','✓':'selected','⚠':'warning','⏱':'round','⏭':'right','↻':'retry','↺':'retry','➜':'play','‹':'left','›':'right','＋':'expand','－':'collapse','→':'right','←':'left','↓':'expand','↑':'collapse'};
  const glyphRE=new RegExp('('+Object.keys(glyphs).join('|')+')[\\uFE0E\\uFE0F]?','gu');
  function semantic(glyph,tail=''){
    // Match the adjacent label only; another character later in a log is not this icon's identity.
    const label=tail.trimStart().replace(/^AI\s+/,'');
    if(glyph==='←'&&/^(返回|首頁|決鬥大廳|章節地圖)/.test(label))return 'back';
    if((glyph==='🎴'||glyph==='🃏')&&label.startsWith('偷'))return 'steal';
    if(glyph==='⚔')return label.startsWith('劍客')?'swordsman':label.startsWith('斬擊')?'slash':'attack';
    if(glyph==='🛡')return label.startsWith('坦克')?'tank':label.startsWith('防禦')?'defense':'shield';
    if(glyph==='🗡'&&label.startsWith('刺客'))return 'assassin';
    if(glyph==='🔫'&&label.startsWith('槍手'))return 'gunner';
    return glyphs[glyph];
  }
  function icon(name,size=24){
    if(!defs[name])throw new Error('Unknown Nightfall icon: '+name);
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('width',size);svg.setAttribute('height',size);
    svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
    svg.setAttribute('class','nd-icon');svg.dataset.icon=name;
    // SVG geometry is static, local, authored data; never interpolate log text here.
    svg.innerHTML=defs[name].body;
    return svg;
  }
  function plainText(value){
    return String(value).replace(glyphRE,(full,g,offset,all)=>'【'+defs[semantic(g,all.slice(offset+full.length))].label+'】').replace(/[\uFE0E\uFE0F]/g,'');
  }
  function fragment(value){
    const text=String(value),out=document.createDocumentFragment();let at=0;
    for(const match of text.matchAll(glyphRE)){
      out.append(document.createTextNode(text.slice(at,match.index)));
      out.append(icon(semantic(match[1],text.slice(match.index+match[0].length)),20));
      at=match.index+match[0].length;
    }
    out.append(document.createTextNode(text.slice(at)));return out;
  }
  function fillIcon(el,name){
    if(el.dataset.ndIcon===name&&el.querySelector('svg'))return;
    el.dataset.ndIcon=name;el.replaceChildren(icon(name));
  }
  function skinFor(el,job){
    const host=el.closest('[data-skin],[data-owner],.carousel-card');
    let skin=host?.dataset.skin||'base';
    if(host?.classList.contains('carousel-card'))skin=host.dataset.side==='player'?(window.NDSkins?.equipped(job)||'base'):'base';
    else if(host?.dataset.owner==='player'&&!host.dataset.skin)skin=typeof S!=='undefined'&&S?S.p.skin:'base';
    return skin;
  }
  // HUD crops are measured per painting; full/card artwork keeps its existing framing.
  const faceCrops={
    swordsman:{base:[230,-45,0],origin:[235,-56,-12]},
    tank:{base:[235,-48,0],origin:[255,-82,-28]},
    assassin:{base:[230,-57,0],origin:[225,-54,-3]},
    gunner:{base:[235,-53,0],origin:[230,-68,-8]}
  };
  function applyFaceCrop(el,job,skin){
    const [width,left,top]=faceCrops[job][skin==='base'?'base':'origin'];
    el.style.setProperty('--portrait-width',width+'%');
    el.style.setProperty('--portrait-left',left+'%');
    el.style.setProperty('--portrait-top',top+'%');
  }
  function portrait(el,job,mode){
    const skin=skinFor(el,job);
    const baseSrc=job==='gunner'?'assets/story/actors/gun-unify/gunner.webp':`assets/characters/${job}.webp`;
    const src=window.NDSkins?.path(job,skin)||baseSrc;
    if(el.dataset.portrait===job&&el.dataset.source===src&&el.querySelector('img'))return;
    el.dataset.source=src;delete el.dataset.cardIllustration;el.classList.remove('portrait-failed');
    el.dataset.portrait=job;el.dataset.crop=mode;
    if(mode==='face')applyFaceCrop(el,job,skin);
    const fallback=icon(job);fallback.classList.add('portrait-fallback');
    const img=document.createElement('img');img.className='character-image';img.alt='';img.draggable=false;
    img.decoding='async';img.src=src;
    img.addEventListener('error',()=>{if(img.dataset.fallback!=='yes'&&src!==baseSrc){img.dataset.fallback='yes';if(mode==='face')applyFaceCrop(el,job,'base');img.src=baseSrc;return;}el.classList.add('portrait-failed');img.hidden=true;});
    const badge=document.createElement('span');badge.className='class-crest';badge.append(icon(mode==='card'?(window.ND_CARD_ART?.[job]?.icon||job):job,16));
    if(mode==='face'){
      const windowEl=document.createElement('span');windowEl.className='portrait-window';windowEl.append(img);
      el.replaceChildren(fallback,windowEl,badge);
    }else el.replaceChildren(fallback,img,badge);
  }
  function cardArt(host,kind,card){
    const art=window.ND_CARD_ART?.[kind];if(!art)return false;
    card.dataset.category=art.category;
    if(host.dataset.cardIllustration===kind&&host.querySelector('img'))return true;
    host.dataset.cardIllustration=kind;host.dataset.portrait=kind;
    const fallback=icon(art.icon);fallback.classList.add('portrait-fallback');
    const img=document.createElement('img');img.className='character-image card-illustration';img.alt='';img.draggable=false;img.decoding='async';img.src=art.src;img.style.objectPosition=art.position;
    if(art.fit)img.style.objectFit=art.fit;
    img.addEventListener('error',()=>{host.classList.add('portrait-failed');img.hidden=true});
    const badge=document.createElement('span');badge.className='class-crest';badge.append(icon(art.icon,16));
    host.replaceChildren(fallback,img,badge);return true;
  }
  // Every unrevealed card shares one neutral back, independent of card/job/skin.
  function backArt(host){
    // HOT-MODE-090: 熱血風格用火焰卡背；故事戰鬥與一般風格仍用金色卡背。
    const hot=typeof heatActive==='function'&&heatActive(),variant=hot?'flame-v1':'gold-v2';
    if(host.dataset.backArt===variant)return;
    host.dataset.backArt=variant;
    host.querySelectorAll('.back-art-image').forEach(n=>n.remove());host.classList.remove('has-back-art','back-art-failed');
    const img=document.createElement('img');img.className='back-art-image';
    img.alt='';img.draggable=false;img.decoding='async';
    img.addEventListener('load',()=>host.classList.add('has-back-art'));
    img.addEventListener('error',()=>{img.hidden=true;host.classList.remove('has-back-art');host.classList.add('back-art-failed')});
    img.src=hot?'assets/cards/back-flame-v1.webp':'assets/cards/back-gold-v2.webp';host.append(img);
  }
  function coinArt(host,face){
    if(host.dataset.coinArt===face)return;host.dataset.coinArt=face;
    const fallback=icon(face==='sun'?'sun':'night',40);
    const img=document.createElement('img');img.src=`assets/coins/${face}.webp`;img.alt='';img.className='coin-art';img.draggable=false;
    img.addEventListener('error',()=>{img.remove();host.classList.add('coin-art-failed')});host.replaceChildren(fallback,img);
  }
  function refresh(root=document.body){
    if(!root)return;
    root.querySelectorAll('.carousel-card[data-job]').forEach(card=>portrait(card.querySelector('.carousel-icon'),card.dataset.job,'full'));
    root.querySelectorAll('.duel-avatar[data-art]').forEach(el=>{if(jobs.includes(el.dataset.art))portrait(el,el.dataset.art,'face')});
    root.querySelectorAll('.card[data-art],.card3d[data-art],.detail-card[data-art]').forEach(card=>{
      const kind=card.dataset.art,host=card.querySelector('.icon,.detail-icon');if(!host)return;
      if(jobs.includes(kind)&&skinFor(card,kind)!=='base'){card.dataset.category='class';portrait(host,kind,'card');}
      else if(!cardArt(host,kind,card)){if(jobs.includes(kind))portrait(host,kind,'card');else fillIcon(host,defs[kind]?kind:'card');}
    });
    root.querySelectorAll('.enemy-card-back,.face.back').forEach(el=>{
      if(!el.querySelector('.back-seal')){const seal=icon('seal',64);seal.classList.add('back-seal');el.append(seal);}
      backArt(el);
    });
    root.querySelectorAll('.result-icon').forEach(el=>fillIcon(el,({player:'victory',ai:'defeat',draw:'draw'})[el.closest('[data-outcome]')?.dataset.outcome]||'draw'));
    root.querySelectorAll('.coin-face.sun .coin-symbol').forEach(el=>coinArt(el,'sun'));
    root.querySelectorAll('.coin-face.moon .coin-symbol').forEach(el=>coinArt(el,'moon'));
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      if(!node.parentElement||node.parentElement.closest('svg,script,style,textarea,option,[data-nd-plain]'))return NodeFilter.FILTER_REJECT;
      glyphRE.lastIndex=0;return glyphRE.test(node.data)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const button=node.parentElement.closest('button');
      if(button&&!button.getAttribute('aria-label')&&!node.data.replace(glyphRE,'').trim())button.setAttribute('aria-label',plainText(node.data).replace(/[【】]/g,''));
      node.replaceWith(fragment(node.data));
    });
    root.querySelectorAll('button[aria-label]').forEach(el=>{
      const label=el.getAttribute('aria-label');glyphRE.lastIndex=0;
      if(glyphRE.test(label))el.setAttribute('aria-label',plainText(label).replace(/[【】]/g,''));
    });
    root.querySelectorAll('summary').forEach(el=>{
      if(!el.querySelector('.summary-icon')){const chevron=icon('expand',16);chevron.classList.add('summary-icon');el.append(chevron);}
    });
    root.querySelectorAll('.copy-log-btn,.result-screen>.secondary').forEach(el=>{if(!el.querySelector('svg'))el.prepend(icon(el.classList.contains('copy-log-btn')?'copy':'back',20));});
    root.querySelectorAll('.float.miss').forEach(el=>{if(!el.querySelector('svg'))el.prepend(icon('miss',20));});
    root.querySelectorAll('.duel-hp>span,.duel-shield-row>span').forEach(el=>{if(!el.querySelector('svg'))el.prepend(icon(el.textContent==='HP'?'hp':'shield',16));});
    const mute=document.getElementById('audioToggle');
    if(mute){const name=mute.querySelector('svg')?.dataset.icon;mute.setAttribute('aria-label',name==='mute'?'開啟音效':'全部靜音');mute.setAttribute('aria-pressed',String(name==='mute'));}
    // Opt-in controls: card hit targets, story choices and puzzle geometry retain their layouts.
    root.querySelectorAll('.rules-close,.audio-close,.audio-toggle,.carousel-arrow,.story-lightbox-close').forEach(el=>el.classList.add('nd-control','nd-icon-button'));
    root.querySelectorAll('.setup-footer>button,.audio-actions>button,.copy-log-btn,.detail-actions>button,.result-screen>button,.story-battle-banner>button,.story-log-dialog>button,.story-header>a').forEach(el=>el.classList.add('nd-control'));
    for(const [selector,name] of [
      ['.detail-actions>.close,.story-battle-banner>button,.result-screen[data-outcome^="story-"]>button:not(.start),.story-log-dialog>[data-exit]','back'],
      ['.result-screen[data-outcome="story-failure"]>.start','retry'],
      ['.result-screen[data-outcome="story-success"]>.start','right']
    ])root.querySelectorAll(selector).forEach(el=>{if(!el.querySelector('svg'))el.prepend(icon(name,20))});
    root.querySelectorAll('.nd-control').forEach(el=>{
      for(const node of el.childNodes)if(node.nodeType===Node.TEXT_NODE){
        const trimmed=node.data.trim();if(trimmed!==node.data)node.data=trimmed;
      }
    });
  }
  window.NDVisuals=Object.freeze({icon,plainText,fragment,refresh,labels:Object.freeze(Object.fromEntries(Object.entries(defs).map(([k,v])=>[k,v.label])))});
  let pending=false;
  const observer=new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;observer.disconnect();try{refresh()}finally{observer.observe(document.body,{childList:true,subtree:true,characterData:true})}})});
  function start(){refresh();observer.observe(document.body,{childList:true,subtree:true,characterData:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
