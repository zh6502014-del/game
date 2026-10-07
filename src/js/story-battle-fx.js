/* Story battle effects module (STORY-BATTLE-FX).
 *
 * Everything that gives the rat-king fight its spectacle lives here, apart from the battle UI's layout and input code:
 *
 *   boss(...)         purge -> transform (the awakening scene) -> summon staging
 *   devour(...)       the king reels in a rat card with a green tether, chews it down and heals
 *   throwCard(...)    the king grabs a rat card, winds up and hurls it into the player's rows
 *   trap(...)         the self-detonation blast
 *   lethal / defeat   shatter-and-fade death, and keeping a transforming boss on the board for its awakening
 *   burnFlames/mirror flame tongues that travel with a burning piece
 *   cardClasses / rosterVisible   per-card state classes and the roster filter
 *
 * Timings and counts live in TUNE below, colours and sizes in story-battle-fx.css, sound recipes in story-battle-sfx.js.
 * The module never touches combat results: it only plays what the engine's frames already say happened.
 * story-energy-ui.js hands over the helpers it needs through NDStoryBattleFx.bind(host), once, before any battle.
 */
(() => {
  'use strict';
  // Milliseconds and counts for every staged effect. Change a number here to retime or thin out an effect.
  const TUNE = {
    awaken: {charge: 1150, burst: 230, emerge: 1100, spikes: 10, motes: 22, shards: 20},
    purge: 520,
    summon: 620,
    devour: {pull: 1000, after: 640},
    throw: {flight: 1500},
    death: {fade: 1150, shards: 12},
    // STORY-SKILL-FX: per-skill cast staging. The cast plays on the skill event; the hit and status events that follow use skillImpact/skillStatus.
    skill: {shadow: 640, unity: 680, quake: 560, resonance: 540, impact: 300, status: 380}
  };
  const T = TUNE;
  let node, effect, centre, unitElement, animate, wait, sound, render, updateDisplay, copy, num, isCurrent;
  function bind(host) {
    ({node, effect, centre, unitElement, animate, wait, sound, render, updateDisplay, copy, num, isCurrent} = host);
  }

  // ---- shatter, fade, vanish ---------------------------------------------------------------------------------------
  // STORY-DEATH: a fallen unit shatters (flash + shards) and then fades out to a faint ghost. `s.dying` remembers when each
  // unit started dying so a re-render mid-animation resumes the fade instead of restarting it.
  function markDying(s,id) {
    s.dying=s.dying||new Map();if(s.dying.has(id))return;
    s.dying.set(id,performance.now());
    // After the shatter-and-fade the unit leaves the roster for good and the rows re-flow.
    setTimeout(()=>{if(s.dying)s.dying.delete(id);if(isCurrent(s)&&s.shell&&s.shell.isConnected)render(s);},T.death.fade);
  }
  function deathFx(s,id) {
    const el=unitElement(s,id);if(!el)return;const p=centre(el);
    effect(s,'seb-death-flash',p);effect(s,'seb-death-crack',p);
    for(let i=0;i<T.death.shards;i++){
      const shard=effect(s,'seb-death-shard',{x:p.x+((i*23)%40)-20,y:p.y+((i*31)%56)-28});
      shard.style.setProperty('--a',(i*30+(i%2?11:0))+'deg');shard.style.setProperty('--d',(46+(i*29)%58)+'px');shard.style.setProperty('--s',String(.7+(i%4)*.22));
    }
  }
  function defeat(s, event) {
    const was=s.view.units.find(u=>u.id===event.targetId);const fresh=was&&was.hp>0;updateDisplay(s,event);markDying(s,event.targetId);if(fresh)render(s);deathFx(s,event.targetId);sound('unitDown');
  }
  // A unit whose hp reached 0 in a damage event: it shatters away, unless this same frame rebuilds it (a boss transform),
  // in which case it stays on the board, downed, until the awakening scene rebuilds it.
  function lethal(s, id, frame) {
    const rises=frame&&frame.after&&frame.after.units.find(x=>x.id===id)?.hp>0;
    if(rises){s.awakening=s.awakening||new Set();s.awakening.add(id);}else markDying(s,id);
    render(s);
  }
  function rosterVisible(s, u) {
    return u.hp>0||Boolean(s.dying&&s.dying.has(u.id))||Boolean(s.awakening&&s.awakening.has(u.id));
  }
  // Classes a unit card carries for dying (resumes the fade after a re-render) and for the lasting awakened glow.
  function cardClasses(s, u, card, wrap) {
    card.classList.toggle('seb-awakened',u.hp>0&&Boolean(s.awakened&&s.awakened.has(u.id)));
    if(u.hp<=0&&s.dying&&s.dying.has(u.id)){const elapsed='-'+Math.round(performance.now()-s.dying.get(u.id))+'ms';card.classList.add('seb-dying');card.style.animationDelay=elapsed;wrap.classList.add('seb-wrap-dying');wrap.style.animationDelay=elapsed;}
  }

  // ---- burning: flames beside the clipped unit button, mirrored onto every motion the unit makes -------------------
  function burnFlames(u) {
    if(!(u.hp>0&&u.statuses.resonance))return null;
    const flames=node('span','seb-burn-flames');flames.setAttribute('aria-hidden','true');
    // [x%, y%, tilt deg, scale] around the arch: top arc, both sides, bottom edge.
    const spots=[[50,0,0,1.3],[34,1,-10,1.1],[66,1,10,1.1],[20,7,-22,1.1],[80,7,22,1.1],[9,18,-30,1.1],[91,18,30,1.1],[2,32,-30,1.15],[98,32,30,1.15],[0,47,-26,1.05],[100,47,26,1.05],[0,62,-24,1.1],[100,62,24,1.1],[0,77,-22,1],[100,77,22,1],[2,91,-20,.95],[98,91,20,.95],[18,100,-160,.55],[38,100,-170,.5],[62,100,170,.5],[82,100,160,.55]];
    spots.forEach(([x,y,r,k],i)=>{if(i>0&&Math.floor((i+1)/2)%2)return;const f=node('i','seb-flame');f.style.cssText='--x:'+x+'%;--y:'+y+'%;--r:'+r+'deg;--k:'+k+';--d:'+(((i*37)%11)/10*.9).toFixed(2)+'s;--t:'+(.62+((i*13)%7)*.05).toFixed(2)+'s';flames.append(f);});
    return flames;
  }
  // STORY-BURN-FOLLOW: the flame layer sits beside the clipped unit button, so every motion played on a
  // unit is mirrored onto its flames (filters dropped) and the fire travels with the piece.
  function mirror(el,frames,opts) {
    const flames=el&&el.parentElement&&el.parentElement.querySelector(':scope > .seb-burn-flames');
    if(!flames||!flames.animate)return null;
    return flames.animate(frames.map(f=>{const r={...f};delete r.filter;return r;}),opts);
  }

  // ---- trap blast (rat self-detonation; a thrown rat blasts at the player's roster) ---------------------------------
  function trap(s, event, source, point) {
    const roster=event.thrown?s.shell.querySelector('.seb-roster-player'):null;const burst=roster?centre(roster):source?centre(source):point;if(burst){effect(s,'seb-blast',burst);effect(s,'seb-blast seb-blast-2',burst);}sound('explode');
  }

  // ---- the king eats a rat ------------------------------------------------------------------------------------------
  async function devour(s, event, token) {
    let duration=0;
      // STORY-RAT-DEVOUR: the king reels a rat card in with a green tether, chews it down, then heals.
      const king=unitElement(s,event.actorId),preyEl=unitElement(s,event.targetId),preyWrap=preyEl&&preyEl.closest('.seb-unit-wrap');
      const kingPoint=king?centre(king):null,prey=preyEl?centre(preyEl):kingPoint;
      if(!kingPoint||!prey){updateDisplay(s,event);markDying(s,event.targetId);render(s);sound('devour');duration=300;}
      else{
        const ghost=preyWrap?preyWrap.cloneNode(true):null;
        if(ghost){
          ghost.classList.remove('seb-wrap-dying');ghost.removeAttribute('style');
          ghost.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
          ghost.querySelectorAll('[data-seb-unit],[data-seb-action],[data-seb-focus]').forEach(n=>{n.removeAttribute('data-seb-unit');n.removeAttribute('data-seb-action');n.removeAttribute('data-seb-focus');n.tabIndex=-1;});
          ghost.classList.add('seb-fx','seb-thrown-card','seb-devoured-card');
          const box=preyWrap.getBoundingClientRect();ghost.style.width=box.width+'px';ghost.style.height=box.height+'px';
          ghost.style.left=prey.x+'px';ghost.style.top=prey.y+'px';
          s.fx.append(ghost);preyEl.style.visibility='hidden';
        }
        const tether=effect(s,'seb-tether seb-tether-green',kingPoint);
        const tx=prey.x-kingPoint.x,ty=prey.y-kingPoint.y;
        tether.style.width=Math.hypot(tx,ty)+'px';tether.style.transform='rotate('+Math.atan2(ty,tx)+'rad)';
        effect(s,'seb-float seb-float-devour',{x:prey.x,y:prey.y-44},'鎖定！');
        effect(s,'seb-grab-ring seb-grab-ring-green',prey);
        sound('grab');
        const to={x:kingPoint.x-prey.x,y:kingPoint.y-prey.y},D=T.devour.pull;
        if(ghost&&ghost.animate){
          const f=(x,y,sc,rot,op,off,ease)=>({transform:'translate(calc(-50% + '+x+'px),calc(-50% + '+y+'px)) scale('+sc+') rotate('+rot+'deg)',opacity:op,offset:off,easing:ease||'ease-in-out'});
          s.animations.add(ghost.animate([
            f(0,0,1,0,1,0),
            f(0,-12,1.1,-4,1,.2),
            f(to.x*.7,to.y*.7-6,.9,-10,1,.55),
            f(to.x,to.y+4,.55,-24,1,.82,'ease-in'),
            f(to.x,to.y+6,.12,-40,0,1)
          ],{duration:D,fill:'forwards'}));
        }
        if(king.animate)animate(s,king,[
          {transform:'scale(1)',filter:'brightness(1)',offset:0},
          {transform:'scale(1.06)',filter:'brightness(1.05)',offset:.45},
          {transform:'scale(1.14,.9)',filter:'brightness(1.25) saturate(1.2)',offset:.6},
          {transform:'scale(.96,1.08)',filter:'brightness(1.1)',offset:.7},
          {transform:'scale(1.12,.92)',filter:'brightness(1.3) saturate(1.3)',offset:.8},
          {transform:'scale(.98,1.04)',offset:.9},
          {transform:'scale(1)',filter:'brightness(1)',offset:1}
        ],D);
        const bits=setInterval(()=>{if(!ghost||!ghost.isConnected)return;const r=ghost.getBoundingClientRect();if(r.width)effect(s,'seb-trail seb-trail-green',{x:r.left+r.width/2,y:r.top+r.height/2});},50);
        s.waiters.set(setTimeout(()=>{effect(s,'seb-float seb-float-devour',{x:kingPoint.x,y:kingPoint.y-60},'吞噬！');},D*.6),()=>{});
        const ok=await wait(s,D,token);clearInterval(bits);if(!ok)return false;
        // swallowed: the rat slot leaves for good, the king's life and bar update, and a green pulse confirms the heal
        updateDisplay(s,event);markDying(s,event.targetId);render(s);
        const gone=unitElement(s,event.targetId);if(gone){const w=gone.closest('.seb-unit-wrap');if(w)w.style.visibility='hidden';}
        const k2=unitElement(s,event.actorId)||king,kp=k2?centre(k2):kingPoint;
        effect(s,'seb-heal-ring',kp);effect(s,'seb-heal-ring seb-heal-ring-2',kp);
        if(event.amount>0)effect(s,'seb-float seb-float-heal',{x:kp.x,y:kp.y-30},'生命 +'+num(event.amount));
        if(k2&&k2.animate)animate(s,k2,[{filter:'brightness(1) drop-shadow(0 0 0 #5fdc8a)'},{filter:'brightness(1.5) drop-shadow(0 0 18px #5fdc8a)',offset:.3},{filter:'brightness(1) drop-shadow(0 0 0 #5fdc8a)'}],520);
        sound('devour');duration=T.devour.after;
      }
    return duration;
  }

  // ---- the king grabs a rat card and throws it ----------------------------------------------------------------------
  function throwCard(s, event, source) {
    let duration=0;
      // STORY-RAT-THROW: the king visibly grabs the rat CARD (tether + lift), winds up, and hurls it into the player's rows.
      const preyEl=unitElement(s,event.targetId),preyWrap=preyEl&&preyEl.closest('.seb-unit-wrap'),roster=s.shell.querySelector('.seb-roster-player');
      const kingPoint=centre(source),prey=preyEl?centre(preyEl):kingPoint,dest=roster?centre(roster):kingPoint;
      const ghost=preyWrap?preyWrap.cloneNode(true):null;
      if(ghost){
        ghost.classList.remove('seb-wrap-dying');ghost.removeAttribute('style');
        ghost.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
        ghost.querySelectorAll('[data-seb-unit],[data-seb-action],[data-seb-focus]').forEach(n=>{n.removeAttribute('data-seb-unit');n.removeAttribute('data-seb-action');n.removeAttribute('data-seb-focus');n.tabIndex=-1;});
        ghost.classList.add('seb-fx','seb-thrown-card');
        const box=preyWrap.getBoundingClientRect();ghost.style.width=box.width+'px';ghost.style.height=box.height+'px';
        ghost.style.left=prey.x+'px';ghost.style.top=prey.y+'px';
        s.fx.append(ghost);
        if(preyEl)preyEl.style.visibility='hidden';
      }
      // 1) grab: a tether snaps from the king to the rat card and the card lifts
      const tether=effect(s,'seb-tether',kingPoint);
      const tx=prey.x-kingPoint.x,ty=prey.y-kingPoint.y;
      tether.style.width=Math.hypot(tx,ty)+'px';tether.style.transform='rotate('+Math.atan2(ty,tx)+'rad)';
      effect(s,'seb-float seb-float-grab',{x:prey.x,y:prey.y-44},'抓住！');
      effect(s,'seb-grab-ring',prey);
      sound('grab');
      const handY=kingPoint.y+Math.min(70,Math.abs(dest.y-kingPoint.y)*.18);
      const dx=dest.x-prey.x,dy=dest.y-prey.y;
      const toKing={x:kingPoint.x-prey.x,y:handY-prey.y};
      const wind={x:toKing.x,y:toKing.y-52};
      const D=T.throw.flight;
      if(ghost&&ghost.animate){
        const f=(x,y,sc,rot,op,off,ease)=>({transform:'translate(calc(-50% + '+x+'px),calc(-50% + '+y+'px)) scale('+sc+') rotate('+rot+'deg)',opacity:op,offset:off,easing:ease||'ease-in-out'});
        s.animations.add(ghost.animate([
          f(0,0,1,0,1,0),
          f(0,-14,1.12,-3,1,.16),                    // lift off the row
          f(toKing.x,toKing.y,.96,-8,1,.38),         // dragged into the king's grip
          f(wind.x,wind.y,.98,-20,1,.52,'ease-out'), // wind-up behind the king
          f(dx*.55+toKing.x*.45,(dy+toKing.y)*.5-110,.9,260,1,.76,'ease-in'),
          f(dx,dy,.7,540,1,1)                        // lands in the player's rows
        ],{duration:D,fill:'forwards'}));
      }
      if(source.animate)animate(s,source,[{transform:'translate(0,0)'},{transform:'translate(0,-6px) scale(1.03)',offset:.38},{transform:'translate(0,-10px)',offset:.52},{transform:'translate(0,14px) scale(1.05)',offset:.66},{transform:'translate(0,0)'}],900);
      const trail=setInterval(()=>{if(!ghost||!ghost.isConnected)return;const r=ghost.getBoundingClientRect();if(r.width)effect(s,'seb-trail',{x:r.left+r.width/2,y:r.top+r.height/2});},55);
      s.waiters.set(setTimeout(()=>{effect(s,'seb-float seb-float-grab',{x:kingPoint.x,y:kingPoint.y-60},'擲出！');sound('swing');},D*.56),()=>{});
      s.waiters.set(setTimeout(()=>clearInterval(trail),D),()=>{});
      duration=D+40;
    return duration;
  }

  // ---- boss phase staging (purge guards -> awakening -> summon) ----------------------------------------------------
  // STORY-TRANSFORM: a boss's second phase (engine events purge -> transform -> summon) is staged instead of popping in.
  async function boss(s,event,token,frame) {
    const afterUnit=frame.after.units.find(x=>x.id===event.targetId);
    const viewUnit=()=>s.view.units.find(x=>x.id===event.targetId);
    let el=unitElement(s,event.targetId);
    if(event.type==='purge'){
      const vu=viewUnit(),p=el?centre(el):null;
      if(p){effect(s,'seb-slash',p);effect(s,'seb-float seb-float-critical',p,'被擊殺');}
      sound('purge');if(vu)vu.hp=0;markDying(s,event.targetId);deathFx(s,event.targetId);render(s);return wait(s,T.purge,token);
    }
    if(event.type==='summon'){
      if(afterUnit){const known=viewUnit();if(known){Object.assign(known,copy(afterUnit));if(s.dying)s.dying.delete(event.targetId);}else s.view.units.push(copy(afterUnit));}
      render(s);const fresh=unitElement(s,event.targetId);
      if(fresh){fresh.classList.add('seb-summon-in');effect(s,'seb-status-ring',centre(fresh));}
      sound('summon');return wait(s,T.summon,token);
    }
    // transform
    const vu=viewUnit();
    if(!afterUnit||!vu||!el){if(s.awakening)s.awakening.delete(event.targetId);return wait(s,160,token);}
    // let the purged guards finish leaving so the row has re-flowed and the effects are centred on the king's final position
    for(let i=0;i<24&&s.dying&&s.dying.size;i++){if(!await wait(s,60,token))return false;}
    el=unitElement(s,event.targetId);if(!el){if(s.awakening)s.awakening.delete(event.targetId);return wait(s,160,token);}
    const p=centre(el);el.classList.remove('seb-down');
    // 1) gather: the board darkens, crystal spikes grow around the unit, motes are sucked into it, the shell shakes
    sound('transformCharge');el.classList.add('seb-transform-charge');s.shell.classList.add('seb-quake');
    const veil=effect(s,'seb-awaken-veil',{x:0,y:0});veil.style.setProperty('--cx',p.x+'px');veil.style.setProperty('--cy',p.y+'px');
    // STORY-AWAKEN-ART: hand-painted sprites (story-skill-fx.js awakenCharge/awakenBurst) replace the CSS aura/spikes/motes/flash/rings/shards when ready.
    try{document.fonts&&document.fonts.load('900 40px "ND Awaken Serif"','異變覺醒');}catch(_){}
    const art=Boolean(window.NDSkillFX&&window.NDSkillFX.ready&&s.fxCanvas&&!s.reduced.matches);
    const artCtx={canvas:s.fxCanvas,host:null,source:{el},target:{el},cancelled:()=>!isCurrent(s)||token!==s.playToken};
    let artA=null,artB=null;
    if(art)artA=window.NDSkillFX.play('awakenCharge',artCtx);
    if(!art){effect(s,'seb-transform-aura',p);effect(s,'seb-transform-aura seb-transform-aura-2',p);effect(s,'seb-awaken-pulse',p);effect(s,'seb-awaken-pulse seb-awaken-pulse-2',p);}
    const spikes=[];
    for(let i=0;!art&&i<T.awaken.spikes;i++){const sp=effect(s,'seb-awaken-spike',p);sp.style.setProperty('--a',(i*36+(i%2?8:0))+'deg');sp.style.setProperty('--h',(54+(i%3)*18)+'px');sp.style.animationDelay=(i*55)+'ms';spikes.push(sp);}
    for(let i=0;!art&&i<T.awaken.motes;i++){
      const ang=(i*47)%360*Math.PI/180,rad=170+(i*53)%130,mote=effect(s,'seb-awaken-mote',p);
      mote.style.setProperty('--x',Math.round(Math.cos(ang)*rad)+'px');mote.style.setProperty('--y',Math.round(Math.sin(ang)*rad)+'px');
      mote.style.animationDelay=((i*41)%620)+'ms';
    }
    if(!await wait(s,T.awaken.charge,token))return false;
    if(artA)await artA;
    // 2) burst: white flash, shockwaves, outward shards, a big banner, a harder shake; the unit is rebuilt at the flash's peak
    sound('transformBurst');
    spikes.forEach(sp=>sp.remove());s.fx.querySelectorAll('.seb-awaken-mote,.seb-awaken-pulse').forEach(n=>n.remove());
    s.shell.classList.remove('seb-quake');s.shell.classList.add('seb-quake-hard');
    effect(s,'seb-awaken-whiteout',{x:0,y:0});
    if(art){const ke=unitElement(s,event.targetId);if(ke)artCtx.target.el=ke;artB=window.NDSkillFX.play('awakenBurst',artCtx);}
    else effect(s,'seb-transform-flash',p);if(!art){effect(s,'seb-transform-ring',p);effect(s,'seb-transform-ring seb-transform-ring-2',p);effect(s,'seb-transform-ring seb-transform-ring-3',p);}
    for(let i=0;!art&&i<T.awaken.shards;i++){const shard=effect(s,'seb-transform-shard',p);shard.style.setProperty('--a',(i*18+(i%2?7:0))+'deg');shard.style.setProperty('--d',(130+(i*37)%150)+'px');}
    if(art){ // the sprite canvas sits above the effect layer, so the banner gets its own layer above the canvas
      const top=node('div','seb-fx-layer seb-fx-layer-top');top.setAttribute('aria-hidden','true');
      const bn=node('span','seb-fx seb-awaken-banner','異變覺醒');bn.style.left=innerWidth/2+'px';bn.style.top=Math.max(90,p.y-10)+'px';top.append(bn);s.root.append(top);setTimeout(()=>top.remove(),1700);
    }else effect(s,'seb-awaken-banner',{x:innerWidth/2,y:Math.max(90,p.y-10)},'異變覺醒');
    if(!await wait(s,T.awaken.burst,token))return false;
    Object.assign(vu,{name:afterUnit.name,portrait:afterUnit.portrait,job:afterUnit.job,hp:afterUnit.hp,maxHp:afterUnit.maxHp,attack:afterUnit.attack,shield:afterUnit.shield,statuses:copy(afterUnit.statuses),attacked:afterUnit.attacked,skillUsed:afterUnit.skillUsed});
    s.awakened=s.awakened||new Set();s.awakened.add(event.targetId);
    if(s.awakening)s.awakening.delete(event.targetId);
    render(s);const born=unitElement(s,event.targetId);
    if(born){born.classList.add('seb-transform-emerge');}
    veil.classList.add('seb-awaken-veil-out');
    if(!await wait(s,T.awaken.emerge,token))return false;
    if(artB)await artB;
    s.shell.classList.remove('seb-quake-hard');return true;
  }

  // ---- skill casts (STORY-SKILL-FX) ---------------------------------------------------------------------------------
  // Each of the four skills has its own cast. Purely visual: it plays what the skill event already says happened.
  function ground(el){const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height*.82,w:r.width,h:r.height};}
  function ghostOf(s,source){
    const wrap=source.closest('.seb-unit-wrap')||source;const g=wrap.cloneNode(true);
    g.classList.remove('seb-wrap-dying');g.removeAttribute('style');
    g.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
    g.querySelectorAll('[data-seb-unit],[data-seb-action],[data-seb-focus]').forEach(n=>{n.removeAttribute('data-seb-unit');n.removeAttribute('data-seb-action');n.removeAttribute('data-seb-focus');n.tabIndex=-1;});
    g.setAttribute('aria-hidden','true');g.classList.add('seb-fx','seb-sk-ghost');
    const box=wrap.getBoundingClientRect();g.style.width=box.width+'px';g.style.height=box.height+'px';
    g.style.left=(box.left+box.width/2)+'px';g.style.top=(box.top+box.height/2)+'px';s.fx.append(g);return g;
  }
  function sparks(s,cls,p,count,spread,rise){
    for(let i=0;i<count;i++){const k=effect(s,cls,{x:p.x+((i*37)%spread)-spread/2,y:p.y+((i*23)%24)-12});
      k.style.setProperty('--dx',(((i*53)%40)-20)+'px');k.style.setProperty('--dy',(-rise-((i*29)%40))+'px');k.style.animationDelay=((i*47)%260)+'ms';}
  }
  function skillCast(s,job,source,target){
    const p=centre(source),box=source.getBoundingClientRect();
    if(job==='assassin'){
      // 殘影: violet smoke, two afterimages slip out to either side, the card flickers.
      effect(s,'seb-sk-smoke',p);effect(s,'seb-sk-smoke seb-sk-smoke-2',p);
      for(const [dx,delay] of [[-1,0],[1,70]]){const g=ghostOf(s,source);g.style.setProperty('--dx',(dx*Math.max(34,box.width*.32))+'px');g.style.animationDelay=delay+'ms';}
      sparks(s,'seb-sk-mote seb-sk-mote-violet',{x:p.x,y:p.y+box.height*.2},10,box.width*.8,40);
      animate(s,source,[{opacity:1,transform:'translateX(0)'},{opacity:.35,transform:'translateX(-3px)',offset:.25},{opacity:.85,transform:'translateX(3px)',offset:.45},{opacity:.4,transform:'translateX(0)',offset:.65},{opacity:1,transform:'translateX(0)'}],T.skill.shadow);
      return T.skill.shadow;
    }
    if(job==='swordsman'){
      // 人劍合一: a golden pillar lands on the swordsman, a blade glint sweeps the card, a glyph circle opens underfoot.
      const g=ground(source);
      const pillar=effect(s,'seb-sk-pillar',{x:p.x,y:box.top+box.height});pillar.style.height=(box.height*1.5)+'px';pillar.style.width=Math.max(46,box.width*.5)+'px';
      const glyph=effect(s,'seb-sk-glyph',g);glyph.style.width=(box.width*1.25)+'px';glyph.style.height=(box.width*.42)+'px';
      const glint=effect(s,'seb-sk-glint',p);glint.style.width=(box.width*1.3)+'px';
      sparks(s,'seb-sk-mote seb-sk-mote-gold',{x:p.x,y:box.top+box.height*.8},9,box.width*.7,70);
      animate(s,source,[{transform:'translateY(0)',filter:'brightness(1)'},{transform:'translateY(-8px)',filter:'brightness(1.35) saturate(1.15)',offset:.4},{transform:'translateY(-4px)',filter:'brightness(1.15)',offset:.7},{transform:'translateY(0)',filter:'brightness(1)'}],T.skill.unity);
      return T.skill.unity;
    }
    if(job==='tank'&&target){
      // 地遁: the tank slams the ground, a glowing fissure runs to the target; crystal spikes erupt on the hit (skillImpact).
      const a=ground(source),b=ground(target),dx=b.x-a.x,dy=b.y-a.y;
      animate(s,source,[{transform:'translateY(0) scale(1)'},{transform:'translateY(-14px) scale(1.02)',offset:.3},{transform:'translateY(3px) scale(1.04,.95)',offset:.45},{transform:'translateY(0) scale(1)'}],320);
      const dust=effect(s,'seb-sk-dust',a);dust.style.width=(a.w*1.3)+'px';dust.style.animationDelay='130ms';
      const crack=effect(s,'seb-sk-fissure',a);crack.style.width=Math.hypot(dx,dy)+'px';crack.style.transform='rotate('+Math.atan2(dy,dx)+'rad)';
      s.shell.classList.add('seb-quake');setTimeout(()=>s.shell&&s.shell.classList.remove('seb-quake'),360);
      return T.skill.quake;
    }
    if(job==='gunner'&&target){
      // 共振彈: rings gather into the muzzle, then a resonance round flies on a drawn sine wave.
      const to=centre(target),dx=to.x-p.x,dy=to.y-p.y,len=Math.hypot(dx,dy)||1,ang=Math.atan2(dy,dx);
      effect(s,'seb-sk-gather',p);effect(s,'seb-sk-gather seb-sk-gather-2',p);
      const wave=effect(s,'seb-sk-wave',p);wave.style.width=len+'px';wave.style.transform='rotate('+ang+'rad)';
      const cycles=Math.max(2,Math.round(len/70)),pts=[];for(let i=0;i<=48;i++){const x=i/48*len,y=12+Math.sin(i/48*cycles*Math.PI*2)*9;pts.push((i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1));}
      wave.innerHTML='<svg width="'+len+'" height="24" viewBox="0 0 '+len+' 24" aria-hidden="true"><path pathLength="1" class="seb-sk-wave-glow" d="'+pts.join(' ')+'"/><path pathLength="1" class="seb-sk-wave-core" d="'+pts.join(' ')+'"/></svg>';
      wave.style.setProperty('--len',len+'px');
      const orb=effect(s,'seb-sk-orb',p);orb.style.setProperty('--tx',dx+'px');orb.style.setProperty('--ty',dy+'px');
      return T.skill.resonance;
    }
    return 240;
  }
  function skillImpact(s,job,p,targetEl){
    const box=targetEl?targetEl.getBoundingClientRect():{width:90,height:120,top:p.y-60};
    if(job==='tank'){
      const base={x:p.x,y:box.top+box.height*.86};
      const dust=effect(s,'seb-sk-dust',base);dust.style.width=(box.width*1.2)+'px';
      for(let i=0;i<5;i++){const sp=effect(s,'seb-sk-spike',{x:base.x+(i-2)*box.width*.17,y:base.y});
        sp.style.setProperty('--a',((i-2)*13)+'deg');sp.style.setProperty('--h',(box.height*(.38+((i*7)%3)*.12))+'px');sp.style.animationDelay=(Math.abs(i-2)*35)+'ms';}
      return T.skill.impact;
    }
    if(job==='gunner'){
      effect(s,'seb-sk-hit',p);
      for(let i=0;i<3;i++){const r=effect(s,'seb-sk-ripple',p);r.style.animationDelay=(i*90)+'ms';}
      return T.skill.impact;
    }
    effect(s,'seb-slash',p);return 220;
  }
  function skillStatus(s,type,p){
    if(type==='stun'){const l=effect(s,'seb-sk-lock',p);effect(s,'seb-sk-lock seb-sk-lock-2',p);return T.skill.status;}
    if(type==='resonance'){for(let i=0;i<2;i++){const r=effect(s,'seb-sk-ripple seb-sk-ripple-soft',p);r.style.animationDelay=(i*150)+'ms';}return T.skill.status;}
    effect(s,'seb-status-ring',p);return 70;
  }

  window.NDStoryBattleFx = {bind, TUNE, skillCast, skillImpact, skillStatus, boss, devour, throwCard, trap, defeat, lethal, markDying, deathFx, burnFlames, mirror, cardClasses, rosterVisible};
})();
