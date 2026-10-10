/* Story battle presentation: authoritative actions and randomness stay in the engine. */
(() => {
  'use strict';
  const JOBS = {swordsman:'劍客', tank:'坦克', assassin:'刺客', gunner:'槍客'};
  const PASSIVES = {
    swordsman:'武士魂：自己的回合開始時，生命低於 3，下一次普攻 +1；出手後消耗。',
    tank:'初始護盾 2。傷害先扣護盾，再扣生命；護盾不會自動回復。',
    assassin:'殘影可閃避下一次直接攻擊；持續傷害不會消耗殘影。',
    gunner:'遠距攻擊不受反擊。每第 4 次普攻有 10% 機率傷害 +1，之後重新累計。'
  };
  const copy = value => JSON.parse(JSON.stringify(value));
  const num = value => String(Number(Number(value || 0).toFixed(2)));
  let current = null;
  const Fx = window.NDStoryBattleFx;
function node(tag, cls, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = String(text);
    return el;
  }
  function button(text, action, key, cls = '') {
    const el = node('button', 'seb-button ' + cls, text);
    el.type = 'button'; el.dataset.sebAction = action; el.dataset.sebFocus = key || action;
    return el;
  }
  const display = s => s.view || s.state;
  const unit = (s, id, live = false) => (live ? s.state : display(s)).units.find(u => u.id === id);
  function actions(s, actorId) { return s.engine.legalActions(s.state, actorId || s.actorId); }
  function focus(s, key) {
    const el = [...s.root.querySelectorAll('[data-seb-focus]')].find(x => x.dataset.sebFocus === key && !x.disabled && x.getClientRects().length);
    if (el) el.focus({preventScroll:true});
    return el;
  }
  function announce(s, text) { s.live.textContent = text || ''; }
  // The skill as this unit has it now (an awakened 凜's 殘影 always counters).
  const abil = (s, u) => s.engine.skillFor ? s.engine.skillFor(u) : s.engine.skill(u.job);
  function objective(s) {
    const o = s.state.objective;
    if (s.state.reinforce) { const r = s.state.reinforce, kills = Math.min(r.goal, display(s).kills ?? r.kills); return '擊倒士兵 ' + kills + ' / ' + r.goal + ' · 我方全數倒下即失敗'; }
    return o.type === 'survive' ? '牽制 ' + o.rounds + ' 回合 · ' + (o.requireBothAlive ? '雙方全員存活' : '我方全數倒下即失敗') : '擊敗所有敵人 · 我方全數倒下即失敗';
  }
  function labels(s, u, compact = false) {
    const st = u.statuses, list = [];
    if (u.hp <= 0) return ['已倒下'];
    if (st.stun) list.push(compact ? '暈眩' : '暈眩：跳過行動');
    if (st.shadow) list.push(compact ? '殘影' : '殘影：下次直接攻擊必閃');
    if (st.spirit) list.push(compact ? '魂 +1' : '武士魂：普攻 +1');
    if (st.unityReadyTurn != null) list.push(st.unityReadyTurn > display(s).teams[u.side].turn ? (compact ? '合一待發' : '人劍合一：下回合生效') : (compact ? '合一 +1' : '人劍合一：普攻 +1'));
    if (st.resonance && !compact) list.push('震盪：剩 ' + st.resonance.ticks + ' 次傷害');
    if (u.job === 'gunner') list.push(compact ? '蓄 ' + u.shots + '/3' : '普攻累計 ' + u.shots + '/3');
    return list;
  }
  function unavailable(s, type, u) {
    if (!u || u.hp <= 0) return '角色已倒下';
    if (s.busy) return '戰鬥演出中';
    if (s.state.status !== 'playing') return '戰鬥已結束';
    if (u.statuses.stun) return '暈眩中，本回合不能行動';
    if (type === 'attack') return u.attacked ? '本回合已普通攻擊' : '目前沒有合法目標';
    if (u.skillUsed) return '本回合已使用招式';
    if (u.job === 'assassin' && u.statuses.shadow) return '殘影仍在身上';
    if (u.job === 'swordsman' && u.statuses.unityReadyTurn != null) return '人劍合一尚未消耗';
    const ability = s.engine.skill(u.job);
    if (s.state.teams.player.energy < ability.cost) return '暮晶不足：需要 ' + ability.cost + ' 點';
    return '目前無法施放';
  }
  function localArt(u, card) {
    const fallback = u.job === 'gunner' ? 'assets/story/actors/gun-unify/' + (card ? 'gunner-card' : 'gunner') + '.webp' : 'assets/' + (card ? 'cards/' : 'characters/') + u.job + '.webp';
    if (u.portrait) {
      try { const url = new URL(u.portrait, document.baseURI); if (url.origin === location.origin && /^(https?:|file:)$/.test(url.protocol)) return [u.portrait, fallback]; } catch (_) {}
    }
    return [fallback, fallback];
  }
  function art(u, card = false) {
    const wrap = node('span', card ? 'seb-skill-art' : 'seb-portrait');
    wrap.setAttribute('aria-hidden','true');
    wrap.append(node('span','seb-art-fallback',JOBS[u.job]));
    const img = node('img', 'seb-art-image'); img.alt = ''; img.draggable = false; img.decoding = 'async';
    let [src, fallback] = localArt(u, card);
    img.addEventListener('error', () => { if (src !== fallback) { src = fallback; img.src = fallback; } else { img.hidden = true; wrap.classList.add('seb-art-failed'); } });
    img.src = src; wrap.append(img); return wrap;
  }
  function legalTargets(s, selection = s.pending) {
    if (!selection || s.busy) return [];
    return actions(s, selection.actorId).filter(a => a.type === selection.type).map(a => a.targetId || a.actorId);
  }
  function energy(s, side) {
    const amount = display(s).teams[side].energy;
    const box = node('div', 'seb-energy'); box.dataset.sebEnergy = side;
    box.setAttribute('aria-label', (side === 'player' ? '我方' : '敵方') + '暮晶 ' + amount + '，上限 3');
    const gems = node('span','seb-gems'); gems.setAttribute('aria-hidden','true');
    for (let i=0;i<3;i++) gems.append(node('span','seb-gem' + (i<amount?' seb-filled':'')));
    box.append(gems,node('strong','seb-energy-value',amount + ' / 3'),node('span','seb-energy-label',side==='player'?'全隊暮晶':'敵方暮晶'));
    return box;
  }
  // Effective attack (人劍合一 / 武士魂 raise it above the base value); the badge turns amber while raised.
  function attackNow(s, u) {
    const src = s.view || s.state;
    try { return s.engine.attackValue ? s.engine.attackValue(src, u) : u.attack; } catch (e) { return u.attack; }
  }
  function unitCard(s, u) {
    const wrap = node('article','seb-unit-wrap'); wrap.dataset.job=u.job; wrap.dataset.side=u.side;
    const card = button('', 'unit', 'unit-' + u.id, 'seb-unit');
    card.dataset.sebUnit=u.id; card.dataset.unitId=u.id; card.dataset.side=u.side; card.dataset.job=u.job;
    card.dataset.sebTarget=String(legalTargets(s).includes(u.id));
    card.classList.toggle('seb-targetable',legalTargets(s).includes(u.id));
    card.classList.toggle('seb-selected',u.id===s.actorId);
    card.classList.toggle('seb-down',u.hp<=0);
    Fx.cardClasses(s,u,card,wrap);
    card.classList.toggle('seb-has-stun',u.hp>0&&Boolean(u.statuses.stun));
    // 2026-10-05: no flame rim and no corner badge; a lingering shock (resonance) shows as a blurred, trembling portrait instead.
    card.classList.toggle('seb-has-tremor',u.hp>0&&Boolean(u.statuses.resonance));
    const attackReady = u.hp>0 && !u.attacked && !u.statuses.stun;
    const skillReady = !s.busy && u.side==='player' && actions(s,u.id).some(a=>a.type==='skill');
    card.dataset.attackReady=String(attackReady); card.dataset.skillReady=String(skillReady);
    if(u.side==='player')card.setAttribute('aria-pressed',String(u.id===s.actorId));
    card.setAttribute('aria-label',[u.name,JOBS[u.job],'生命 '+num(u.hp)+'/'+num(u.maxHp),'攻擊 '+num(attackNow(s,u))+(attackNow(s,u)>u.attack?'（強化）':''),'護盾 '+num(u.shield),...labels(s,u),u.side==='player'?'點選角色後點敵人普攻，或拖向敵人':'敵方角色，可選作目標'].join('，'));
    card.append(art(u));
    // STORY-STATUS-FX: persistent stun/burn indicators (CSS-drawn, no art assets) so an active
    // status stays visible on the card for its whole duration, not just the moment it's applied.
    // The corner burn orb was removed: the flame rim on the token edge is the burn indicator.
    // STORY-BURN-FLAMES: flame tongues licking around the unit's edge while burning (CSS-drawn).
    // STORY-STUN-HALO: stars orbiting just above the head while stunned (CSS-drawn, lives beside the clipping button).
    let stunHalo=null;
    if(u.hp>0&&u.statuses.stun){
      stunHalo=node('span','seb-stun-halo');stunHalo.setAttribute('aria-hidden','true');
      stunHalo.append(node('i','seb-stun-ring'));
      for(let i=0;i<4;i++){const st=node('i','seb-stun-star');st.style.setProperty('--i',String(i));stunHalo.append(st);}
    }
    const burnFlames=null;
    const base=node('span','seb-unit-base');
    const identity=node('span','seb-unit-identity');
    identity.append(node('strong','seb-unit-name',u.name),node('span','seb-unit-role',(u.isHero?'主角 · ':u.side==='player'?'夥伴 · ':'敵方 · ')+JOBS[u.job]));
    const stats=node('span','seb-stat-badges');
    const hp=node('span','seb-stat seb-hp');hp.append(node('small','','血'),node('strong','seb-hp-number',num(u.hp)));
    const shield=node('span','seb-stat seb-shield');shield.append(node('small','','盾'),node('strong','seb-shield-number',num(u.shield)));
    const atkValue=attackNow(s,u),atk=node('span','seb-stat seb-atk'+(atkValue>u.attack?' seb-buffed':''));atk.append(node('small','','攻'),node('strong','seb-attack-number',num(atkValue)));
    stats.append(hp,shield,atk);base.append(identity,stats);card.append(base);
    // The attack/skill state icons stay on every card; they dim when unavailable instead of disappearing.
    {
      const allowances=node('span','seb-allowances');
      const chip=(kind,ready,used,label)=>{const el=node('span','seb-allowance seb-allowance-'+kind+(ready?' seb-ready':''));el.dataset.state=ready?'ready':'off';el.setAttribute('role','img');el.setAttribute('aria-label',label+(ready?'：可使用':used?'：本回合已使用':'：目前無法使用'));el.title=label+(ready?'（可使用）':used?'（已使用）':'（無法使用）');return el;};
      const mine=u.side==='player';
      allowances.append(chip('attack',mine&&attackReady,u.attacked,'普攻'),chip('skill',mine&&skillReady,u.skillUsed,'招式'));
      card.append(allowances);
    }
    card.append(node('span','seb-target-label','目標'));
    wrap.append(card);
    // The unit button clips its own overflow, so the flame layer lives beside it in the same grid cell.
    if(burnFlames)wrap.append(burnFlames);
    if(stunHalo)wrap.append(stunHalo);
    const status=node('div','seb-status-strip');
    const texts=labels(s,u,true);
    if(!texts.length)status.append(node('span','seb-unit-job','狀態正常'));
    else for(const text of texts)status.append(node('span','seb-status',text));
    // The small "i" button is gone: tapping the portrait image opens the same ability/status hint (see onClick).
    wrap.append(status);return wrap;
  }
  function roster(s, side) {
    const row=node('section','seb-roster seb-roster-'+side);row.setAttribute('aria-label',side==='player'?'我方角色':'敵方角色');
    const units=display(s).units.filter(u=>u.side===side&&Fx.rosterVisible(s,u));
    row.dataset.count=units.length;
    row.style.setProperty('--seb-count',String(units.length));
    units.forEach((u,i)=>{const card=unitCard(s,u);if(units.length<=3)card.style.gridColumn=String([2,1,3][i]);row.append(card);});
    return row;
  }
  function skillCard(s,u) {
    const ability=abil(s,u), legal=!s.busy && actions(s,u.id).some(a=>a.type==='skill');
    const holder=node('div','seb-skill-wrap');holder.dataset.owner=u.id;
    const card=button('','skill','skill-'+u.id,'seb-skill-card');card.dataset.sebOwner=u.id;
    card.setAttribute('aria-disabled',String(!legal));card.setAttribute('aria-pressed',String(s.pending?.type==='skill'&&s.pending.actorId===u.id));
    card.setAttribute('aria-label',u.name+'的'+ability.name+'，消耗'+ability.cost+'暮晶。'+(legal?'點選後選擇'+(ability.target==='self'?'本人':'敵方')+'，或拖曳施放。':unavailable(s,'skill',unit(s,u.id,true))));
    card.append(art(u,true),node('span','seb-skill-cost',ability.cost),node('span','seb-skill-owner',u.name),node('strong','seb-skill-name',ability.name));
    if(!legal)card.append(node('span','seb-skill-lock',u.hp<=0?'已倒下':u.skillUsed?'已使用':s.state.teams.player.energy<ability.cost?'能量不足':'待命'));
    const info=button('i','skill-info','skill-info-'+u.id,'seb-skill-info');info.dataset.sebOwner=u.id;info.setAttribute('aria-label','查看'+ability.name+'詳情');
    holder.append(card,info);return holder;
  }
  // H2: the awakened 凜's second card. One tap fires it at every enemy (no target to pick).
  function coneCard(s,u) {
    const cone=s.engine.cone(u),legal=!s.busy&&actions(s,u.id).some(a=>a.type==='cone');
    const holder=node('div','seb-skill-wrap seb-cone-wrap');holder.dataset.owner=u.id;
    const card=button('','cone','cone-'+u.id,'seb-skill-card seb-cone-card');card.dataset.sebOwner=u.id;
    card.setAttribute('aria-disabled',String(!legal));
    const reason=u.hp<=0?'已倒下':u.coneUsed?'已使用':s.state.teams.player.energy<cone.cost?'能量不足':'待命';
    card.setAttribute('aria-label',u.name+'的'+cone.name+'，消耗'+cone.cost+'暮晶。'+cone.description+(legal?'點一下即對所有敵人施放。':reason));
    card.title=cone.name+' · '+cone.cost+' 暮晶：'+cone.description;
    const pic=node('span','seb-skill-art seb-cone-art');pic.setAttribute('aria-hidden','true');
    const img=node('img','seb-art-image');img.alt='';img.draggable=false;img.decoding='async';img.src='assets/story/fx/awaken/fx-crystal-cone.webp';img.addEventListener('error',()=>{img.hidden=true;});pic.append(img);
    card.append(pic,node('span','seb-skill-cost',cone.cost),node('span','seb-skill-owner',u.name),node('strong','seb-skill-name',cone.name));
    if(!legal)card.append(node('span','seb-skill-lock',reason));
    holder.append(card);return holder;
  }
  // STORY-BATTLE-PORTRAIT-087: phones can now play upright (story-battle-mobile.css); the rotate prompt stays available but off.
  const PORTRAIT_GATE=false;
  function rotatePrompt(s) {
    const box=node('section','seb-rotate');box.setAttribute('aria-label','請旋轉裝置');
    const icon=node('span','seb-rotate-icon','↻');icon.setAttribute('aria-hidden','true');
    box.append(icon,node('h2','','橫向展開戰場'),node('p','','請旋轉裝置，讓角色與招式完整呈現。你的戰鬥進度會保留。'),button('返回故事','leave','rotate-leave','seb-primary'));
    return box;
  }
  function resultPanel(s) {
    const st=display(s),won=st.status==='won';const box=node('section','seb-result');box.setAttribute('aria-label','戰鬥結果');
    box.append(node('span','seb-eyebrow','戰鬥結束'),node('h2','',won?'目標達成':st.status==='draw'?'未分勝負':'挑戰未完成'),node('p','seb-result-reason',st.reason||''));
    const buttons=node('div','seb-modal-actions');
    if(won)buttons.append(button('繼續故事','continue','result-primary','seb-primary'));
    else buttons.append(button('重新挑戰','retry','result-primary','seb-primary'),button('返回場景','return','result-return'));
    box.append(buttons);return box;
  }
  function render(s,focusTo) {
    if(current!==s)return;
    if(!s.busy){const sel=s.state.units.find(x=>x.id===s.actorId);if(!sel||sel.side!=='player'||sel.hp<=0){const alive=s.state.units.find(x=>x.side==='player'&&x.hp>0);if(alive){s.actorId=alive.id;s.pending=null;}}}
    const activeKey=s.root.contains(document.activeElement)?document.activeElement.dataset.sebFocus:null;
    const st=display(s);
    s.root.dataset.busy=String(s.busy);s.root.setAttribute('aria-busy',String(s.busy));s.root.dataset.rotated=String(s.rotated);s.root.dataset.displayStatus=st.status;
    s.shell.replaceChildren();s.shell.inert=Boolean(s.modal||s.rotated);
    const header=node('header','seb-header');
    const title=node('div','seb-title-block');title.append(node('span','seb-eyebrow','NIGHTFALL DUEL'),node('h1','seb-title',s.config.name||'暮晶交鋒'));title.querySelector('h1').id='seb-title';
    const meta=node('div','seb-meta');meta.append(node('strong','seb-round','第 '+st.round+' 回合'),node('span','seb-phase',st.status==='playing'?(s.busy?(st.side==='enemy'?'敵方行動':'戰鬥演出'):'我方行動'):'戰鬥結束'),node('span','seb-objective',objective(s)));
    const nav=node('div','seb-nav');nav.append(button('說明','rules','rules'),button('戰報','toggle-log','toggle-log'),button('離開','leave','leave'));
    header.append(title,meta,nav);s.shell.append(header);
    const field=node('div','seb-field');
    const enemyEnergy=energy(s,'enemy');enemyEnergy.classList.add('seb-enemy-energy');field.append(enemyEnergy,roster(s,'enemy'));
    const message=node('div','seb-battle-message');message.setAttribute('aria-live','off');
    if(s.pending){const actor=unit(s,s.pending.actorId);message.append(node('span','',s.pending.type==='attack'?'選擇 '+actor.name+' 的普攻目標':'將「'+s.engine.skill(actor.job).name+'」交給'+(s.engine.skill(actor.job).target==='self'?'本人':'敵方目標')));}
    else message.append(node('span','',s.message||(s.busy?'戰鬥演出中':'拖曳角色攻擊 · 拖曳招式施放')));
    const playerEnergy=energy(s,'player');playerEnergy.classList.add('seb-player-energy');field.append(message,roster(s,'player'),playerEnergy);
    if(st.status!=='playing')field.append(resultPanel(s));
    s.shell.append(field);
    const hand=node('footer','seb-hand');hand.setAttribute('aria-label','全隊常駐招式卡');
    const handLabel=node('div','seb-hand-label');
    const prompt=s.pending?(s.pending.type==='attack'?'選擇目標':'選擇招式目標'):(s.busy?'戰鬥演出中':s.message||'選擇角色或招式，再選擇目標');
    handLabel.append(node('strong','',prompt),node('span','',s.pending?'點擊亮框角色，或按取消。':(window.matchMedia?.('(hover:none) and (pointer:coarse)').matches?'拖曳可直接操作；點角色圖片查看說明。':'拖曳可直接操作；點角色圖片查看說明；按 E 結束回合。')));
    const cards=node('div','seb-hand-cards');for(const u of st.units.filter(x=>x.side==='player')){cards.append(skillCard(s,u));if(u.cone&&u.hp>0)cards.append(coneCard(s,u));}
    const rail=node('aside','seb-action-rail');rail.setAttribute('aria-label','回合操作');
    // The selected-name label ("凜 · 普攻") was removed with the attack button; the rail now only holds cancel + end turn.
    // The separate 普通攻擊 button was removed: attacks start by dragging a character or tapping it, then its target.
    if(s.pending)rail.append(button('取消','cancel-target','cancel-target'));
    const end=button(s.busy?'演出中…':'結束回合','end-turn','end-turn','seb-primary seb-end-turn');end.disabled=s.busy||st.status!=='playing';end.setAttribute('aria-keyshortcuts','E');if(!s.busy)end.append(node('kbd','seb-key','E'));rail.append(end);
    hand.append(handLabel,cards,rail);
    s.shell.append(hand);
    s.rotate.replaceChildren(rotatePrompt(s));s.rotate.inert=!s.rotated;s.rotate.hidden=!s.rotated;
    if(!s.modal){if(s.rotated)focus(s,'rotate-leave');else if(!focus(s,focusTo||activeKey))s.root.focus({preventScroll:true});}
  }
  function closeModal(s) {
    if(!s.modal)return;
    s.modal.remove();s.modal=null;s.shell.inert=s.rotated;s.rotate.inert=!s.rotated;focus(s,s.rotated?'rotate-leave':s.modalFocus||'leave');
  }
  function openModal(s,title,body,kind='info',focusFrom) {
    cancelGesture(s);hidePreview(s);closeModal(s);s.modalFocus=focusFrom||document.activeElement?.dataset.sebFocus;
    const backdrop=node('div','seb-modal-backdrop');const dialog=node('section','seb-modal');
    dialog.setAttribute('role',kind==='leave'?'alertdialog':'dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','seb-modal-title');
    const heading=node('h2','',title);heading.id='seb-modal-title';dialog.append(heading,body);
    const actionsBox=node('div','seb-modal-actions');
    if(kind==='leave')actionsBox.append(button('繼續戰鬥','cancel-leave','modal-primary','seb-primary'),button('離開並返回故事','confirm-leave','confirm-leave'));
    else actionsBox.append(button('返回戰場','close-detail','modal-primary','seb-primary'));
    dialog.append(actionsBox);backdrop.append(dialog);s.root.append(backdrop);s.modal=backdrop;s.shell.inert=true;s.rotate.inert=true;focus(s,'modal-primary');
  }
  function details(s,id,isSkill) {
    if(s.busy)return;
    const u=unit(s,id);if(!u)return;
    const ability=abil(s,u),body=node('div','seb-detail-body');
    body.append(art(u,isSkill),node('p','seb-detail-owner',u.name+' · '+JOBS[u.job]));
    if(isSkill){body.append(node('p','seb-detail-cost','消耗 '+ability.cost+' 暮晶'),node('p','',ability.description),node('p','seb-detail-availability',actions(s,id).some(a=>a.type==='skill')?'選擇招式後點選'+(ability.target==='self'?'本人':'敵人')+'，也可以直接拖曳。':unavailable(s,'skill',unit(s,id,true))));}
    else body.append(node('p','',PASSIVES[u.job]),node('p','',labels(s,u).join('；')||'目前沒有特殊狀態'),node('p','',ability.name+'（'+ability.cost+' 暮晶）：'+ability.description));
    openModal(s,isSkill?ability.name:u.name,body,'info',isSkill?'skill-info-'+id:'info-'+id);
  }
  // Lightweight, non-blocking story reminder: never pauses playback, never takes focus, auto-dismisses.
  function hideToast(s) {
    if(s.toastTimer){clearTimeout(s.toastTimer);s.toastTimer=null;}
    if(s.toast){s.toast.remove();s.toast=null;}
  }
  function showToast(s,lines,title,ms=5200) {
    hideToast(s);
    const box=node('aside','seb-toast');box.setAttribute('role','status');
    box.append(node('strong','seb-toast-title',title),...lines);
    box.addEventListener?.('click',()=>hideToast(s));
    s.root.append(box);s.toast=box;
    s.toastTimer=setTimeout(()=>{s.toastTimer=null;if(s.toast===box)hideToast(s);},ms);
  }
  function hidePreview(s) {
    if(s.hoverTimer){clearTimeout(s.hoverTimer);s.hoverTimer=null;}
    if(s.preview){s.preview.remove();s.preview=null;}
  }
  function hoverPreview(s,card) {
    hidePreview(s);
    s.hoverTimer=setTimeout(()=>{
      s.hoverTimer=null;if(current!==s||s.busy||s.modal||s.gesture||!card.isConnected)return;
      const u=unit(s,card.dataset.sebOwner),ability=abil(s,u);
      const box=node('aside','seb-hover-preview');box.setAttribute('role','tooltip');box.append(art(u,true),node('strong','',ability.name+' · '+ability.cost+' 暮晶'),node('span','seb-preview-owner',u.name),node('p','',ability.description));
      s.root.append(box);s.preview=box;
      const r=card.getBoundingClientRect(),b=box.getBoundingClientRect();
      box.style.left=Math.max(8,Math.min(innerWidth-b.width-8,r.left+r.width/2-b.width/2))+'px';
      box.style.top=Math.max(8,r.top-b.height-12)+'px';
    },240);
  }
  function showRules(s) {
    const body=node('div','seb-rules');
    body.append(node('p','',s.config.description||objective(s)),node('p','','暮晶由全隊共用。第一個回合為 0，下一回合起每回合增加 1，最多保留 3；使用後逐點累積。'),node('p','','每名角色每回合可普攻一次、施放招式一次。點選我方角色再點敵人，或直接拖曳角色攻擊。招式牌可拖向合法目標；自身招式請交給本人。'),node('p','','金框表示選中的角色，亮框與「目標」標記表示可選目標。技能沒有額外抽牌；夥伴由故事加入。按 Escape 可取消選取或關閉說明。'));
    openModal(s,'戰鬥說明',body);
  }
  function showLog(s) {
    const list=node('ol','seb-log-list');for(const text of s.state.log)list.append(node('li','',typeof text==='string'?text:text.text||''));openModal(s,'戰鬥紀錄',list);list.scrollTop=list.scrollHeight;
  }
  function clearFX(s,includePoses=false) {
    for(const animation of s.animations)animation.cancel();s.animations.clear();s.fx.replaceChildren();
    if(includePoses){for(const pose of s.poses.values()){pose.animation.cancel();if(pose.twin)pose.twin.cancel();}s.poses.clear();}
  }
  function sound(key) {
    // Existing audio manager owns user mute/volume preferences and resources.
    try { if(typeof window.playSfx==='function')window.playSfx(key); } catch (_) {}
  }
  function wait(s,ms,token) {
    if(current!==s||token!==s.playToken)return Promise.resolve(false);
    return new Promise(resolve=>{const timer=setTimeout(()=>{s.waiters.delete(timer);resolve(current===s&&token===s.playToken);},ms);s.waiters.set(timer,resolve);});
  }
  function cancelPlayback(s,sync=true) {
    hideToast(s);
    s.playToken++;for(const [timer,resolve] of s.waiters){clearTimeout(timer);resolve(false);}s.waiters.clear();clearFX(s,true);
    s.view=null;s.busy=false;
    if(sync&&current===s)render(s,s.state.status!=='playing'?'result-primary':undefined);
  }
  // STORY-SKILL-FX v2: context for NDSkillFX (canvas overlay, board to shake, cancel when playback is interrupted).
  function skillCtx(s,source,target,token) {return {canvas:s.fxCanvas,host:s.shell,source:{el:source},target:{el:target},cancelled:()=>current!==s||token!==s.playToken};}
  const skillFxReady=s=>!!(window.NDSkillFX&&window.NDSkillFX.ready&&s.fxCanvas);
  function unitElement(s,id) {return [...s.shell.querySelectorAll('[data-seb-unit]')].find(el=>el.dataset.sebUnit===id);}
  function centre(el) {const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};}
  function animate(s,el,frames,ms) {
    if(!el?.animate)return;
    const opts={duration:ms,easing:'ease-out',fill:'none'};
    const animation=el.animate(frames,opts);s.animations.add(animation);
    const twin=Fx.mirror(el,frames,opts);if(twin){s.animations.add(twin);twin.finished.then(()=>s.animations.delete(twin),()=>s.animations.delete(twin));}
    animation.finished.then(()=>s.animations.delete(animation),()=>s.animations.delete(animation));
  }
  function safeChargeDistance(sourceBox,targetBox,from,to) {
    const dx=to.x-from.x,dy=to.y-from.y,distance=Math.hypot(dx,dy)||1,unitX=dx/distance,unitY=dy/distance;
    const bounds={left:targetBox.left-sourceBox.width/2,right:targetBox.right+sourceBox.width/2,top:targetBox.top-sourceBox.height/2,bottom:targetBox.bottom+sourceBox.height/2};
    let enter=-Infinity,exit=Infinity;
    for(const [position,direction,min,max] of [[from.x,unitX,bounds.left,bounds.right],[from.y,unitY,bounds.top,bounds.bottom]]){
      if(Math.abs(direction)<.0001){if(position<min||position>max)return 0;continue;}
      const first=(min-position)/direction,second=(max-position)/direction;
      enter=Math.max(enter,Math.min(first,second));exit=Math.min(exit,Math.max(first,second));
    }
    if(exit<Math.max(0,enter))return 0;
    return Math.max(0,Math.min(118,distance,enter-4));
  }
  function chargeToken(s,source,target,job) {
    if(!source?.animate||!target)return;
    const from=centre(source),to=centre(target),dx=to.x-from.x,dy=to.y-from.y;
    const distance=Math.hypot(dx,dy)||1,unitX=dx/distance,unitY=dy/distance;
    const sourceBox=source.getBoundingClientRect(),targetBox=target.getBoundingClientRect();
    const cap=safeChargeDistance(sourceBox,targetBox,from,to);
    const weight=job==='tank'?.62:job==='assassin'?1:.82;
    const travel=cap*weight,baseLift=job==='tank'?12:job==='assassin'?25:18;
    // The rise is also bounded by the open space: both key poses stay inside the safe travel radius.
    const lift=Math.min(baseLift,cap*.34);
    const x=unitX*travel,y=unitY*travel;
    const transform='translate('+x+'px,'+y+'px)';
    const poseFrames=[
      {transform:'translate(0,0) scale(1)',offset:0},
      {transform:'translate(0,'+(-lift)+'px) scale('+(lift?job==='tank'?1.035:1.02:1)+')',offset:.22},
      {transform,offset:.78},
      {transform,offset:1}
    ],poseOpts={duration:job==='assassin'?220:260,easing:job==='tank'?'cubic-bezier(.2,.8,.2,1)':'cubic-bezier(.18,.72,.28,1)',fill:'forwards'};
    const animation=source.animate(poseFrames,poseOpts);
    s.poses.set(source,{animation,transform,twin:Fx.mirror(source,poseFrames,poseOpts)});
  }
  function gunnerRecoil(s,source,target) {
    if(!source?.animate)return;
    const from=centre(source),to=target?centre(target):from,dx=from.x-to.x,dy=from.y-to.y;
    const distance=Math.hypot(dx,dy)||1,x=dx/distance*10,y=dy/distance*10-12;
    animate(s,source,[
      {transform:'translate(0,0)',offset:0},
      {transform:'translate(0,-12px)',offset:.22},
      {transform:'translate('+x+'px,'+y+'px)',offset:.5},
      {transform:'translate(0,0)',offset:1}
    ],230);
  }
  async function returnActors(s,token) {
    if(!s.poses.size)return true;
    for(const [el,pose] of s.poses){
      pose.animation.cancel();if(pose.twin)pose.twin.cancel();
      if(el.isConnected)animate(s,el,[{transform:pose.transform},{transform:'translate(0,0)'}],160);
    }
    s.poses.clear();
    return wait(s,160,token);
  }
  function syncCounters(s) {
    for(const u of s.view.units){
      const card=unitElement(s,u.id);if(!card)continue;
      card.querySelector('.seb-hp-number').textContent=num(u.hp);
      card.querySelector('.seb-shield-number').textContent=num(u.shield);
      const atkNumber=card.querySelector('.seb-attack-number');
      if(atkNumber){const value=attackNow(s,u);atkNumber.textContent=num(value);atkNumber.closest('.seb-atk')?.classList.toggle('seb-buffed',value>u.attack);}
    }
    for(const el of s.shell.querySelectorAll('[data-seb-energy]')){
      const value=s.view.teams[el.dataset.sebEnergy].energy;
      el.querySelector('.seb-energy-value').textContent=value+' / 3';
      [...el.querySelectorAll('.seb-gem')].forEach((gem,i)=>gem.classList.toggle('seb-filled',i<value));
    }
  }
  function effect(s,cls,at,text) {
    const el=node('span','seb-fx '+cls,text);el.style.left=at.x+'px';el.style.top=at.y+'px';s.fx.append(el);return el;
  }
  function updateDisplay(s,event) {
    const target=s.view.units.find(u=>u.id===event.targetId),actor=s.view.units.find(u=>u.id===event.actorId);
    // These are display counters from emitted results, never a second combat calculation.
    if(event.type==='damage'&&target)target.hp=Math.max(0,target.hp-event.amount);
    if(event.type==='shield'&&target)target.shield=Math.max(0,target.shield-event.amount);
    if(event.type==='skill'&&actor)s.view.teams[actor.side].energy-=event.amount;
    if(event.type==='energy')s.view.teams[s.view.side].energy+=event.amount;
    if(event.type==='devour'){if(target)target.hp=0;if(actor)actor.hp=Math.min(actor.maxHp,actor.hp+event.amount);}
    if(event.type==='defeat'&&target)target.hp=0;
  }
  async function playEvent(s,event,token,frame) {
    if(current!==s||token!==s.playToken)return false;
    s.message=event.text||s.message;
    if(event.type==='transform'||event.type==='purge'||event.type==='summon'){
      const ok=await Fx.boss(s,event,token,frame);s.shell.classList.remove('seb-quake');
      const message=s.shell.querySelector('.seb-battle-message');if(message)message.textContent=s.message;clearFX(s);return ok;
    }
    if(event.type==='narrate'){
      const line=node('div','seb-narrate',event.text);line.setAttribute('aria-hidden','true');s.root.append(line);
      const message=s.shell.querySelector('.seb-battle-message');if(message)message.textContent=event.text;announce(s,event.text);
      const ok=await wait(s,1600,token);line.remove();return ok;
    }
    if(event.type==='turn'){
      s.view.side=frame.after.side;s.view.round=frame.after.round;
      s.view.teams[frame.after.side].turn=frame.after.teams[frame.after.side].turn;
      render(s);
    }
    if(event.type==='skill'){updateDisplay(s,event);render(s);}
    const actor=unit(s,event.actorId),source=unitElement(s,event.actorId),target=unitElement(s,event.targetId);
    let point=target?centre(target):source?centre(source):null;
    let duration=80;
    if(['attack','skill','counter'].includes(event.type)&&source){
      const from=centre(source),to=target?centre(target):from,job=actor?.job||'swordsman';
      if(event.type==='skill'){
        // STORY-SKILL-FX: each skill has its own cast; the hit/status events of this same frame pick it up via s.skillCast.
        s.skillCast={job,targetId:event.targetId,frame,cone:event.skill==='cone'};
        const kind=event.skill==='cone'?'cone':{tank:'quake',assassin:'shadow',swordsman:'unity',gunner:'resonance'}[job];
        const foeRoster=actor&&actor.side==='enemy'?'.seb-roster-player':'.seb-roster-enemy';
        const foes=event.skill==='cone'?[...s.shell.querySelectorAll(foeRoster+' [data-seb-unit]')].filter(el=>s.view.units.find(u=>u.id===el.dataset.sebUnit)?.hp>0):[];
        if(event.skill==='cone'&&!(skillFxReady(s)&&NDSkillFX.kinds.includes('cone'))){
          for(const el of foes){const to=centre(el),beam=effect(s,'seb-projectile seb-cone-beam',from);beam.style.width=Math.hypot(to.x-from.x,to.y-from.y)+'px';beam.style.transform='rotate('+Math.atan2(to.y-from.y,to.x-from.x)+'rad)';}
          sound('gunshot');duration=320;
        }else if(kind&&skillFxReady(s)){
          // v2: hand-painted sprite cast with its own sound cues; the hit/status events of this frame then only add numbers.
          s.skillCast.v2=true;
          const ctx=skillCtx(s,source,target||foes[0]||source,token);if(foes.length)ctx.targets=foes;
          const ok=await NDSkillFX.play(kind,ctx);
          if(!ok||current!==s||token!==s.playToken)return false;
          duration=40;
        }else{
          if(target&&job==='gunner')gunnerRecoil(s,source,target);
          duration=Fx.skillCast(s,job,source,target);
          if(!target)sound(job==='assassin'?'shadow':'buff');else sound(job==='gunner'?'gunshot':'skillCast');
        }
      }else{
      if(target&&job==='gunner'){
        gunnerRecoil(s,source,target);
        const beam=effect(s,'seb-projectile',from);beam.style.width=Math.hypot(to.x-from.x,to.y-from.y)+'px';beam.style.transform='rotate('+Math.atan2(to.y-from.y,to.x-from.x)+'rad)';
      }else if(target){
        chargeToken(s,source,target,job);
        if(job==='assassin'){for(const offset of [-12,12]){const ghost=effect(s,'seb-afterimage',{x:from.x+offset,y:from.y});ghost.style.width=source.clientWidth+'px';ghost.style.height=source.clientHeight+'px';}}
      }else{effect(s,job==='assassin'?'seb-shadow-ring':'seb-unity-ring',from);if(event.type==='skill')sound(job==='assassin'?'shadow':'buff');}
      if(event.type==='counter')sound('counter');
      else if(target)sound(job==='gunner'?'gunshot':(event.type==='skill'?'skillCast':'swing'));
      duration=240;
      }
    }else if(event.type==='evade'&&target){
      animate(s,target,[{transform:'translateY(0)',opacity:1},{transform:'translateY(-14px)',opacity:.4},{transform:'translateY(0)',opacity:1}],280);effect(s,'seb-float seb-float-evade',point,'閃避');sound('evade');duration=280;
    }else if(event.type==='damage'||event.type==='shield'){
      const wasUp=target&&s.view.units.find(u=>u.id===event.targetId)?.hp>0;
      updateDisplay(s,event);
      if(wasUp&&s.view.units.find(u=>u.id===event.targetId)?.hp<=0)Fx.lethal(s,event.targetId,frame);
      syncCounters(s);const refreshed=unitElement(s,event.targetId);
      // the roster may have re-laid out (a unit fell, order changed): aim at where the card is now, not where it was
      if(refreshed)point=centre(refreshed);
      if(point){effect(s,'seb-float '+(event.type==='shield'?'seb-float-shield':''),point,(event.type==='shield'?'盾 −':'生命 −')+num(event.amount));
        // AUDIO-MIX-061: a hand-painted (v2) skill already played its own impact; its hit/shield events add numbers and rings, not a second impact sound.
        const v2Hit=!!(s.skillCast&&s.skillCast.frame===frame&&s.skillCast.v2);
        if(event.type==='shield'){effect(s,'seb-shield-ring',point);if(!v2Hit)sound('shield');const cast=s.skillCast&&s.skillCast.frame===frame&&s.skillCast.targetId===event.targetId?s.skillCast:null;if(cast&&cast.job==='tank'&&!cast.v2)s.impactMs=Fx.skillImpact(s,cast.job,point,refreshed||target);}
        else if(frame.kind==='turn-start'){const el=refreshed||target;if(skillFxReady(s)&&el)NDSkillFX.play('resonanceTick',skillCtx(s,el,el,token));else{effect(s,'seb-dot-ring',point);if(event.amount>0)sound('burn');}}
        else if(event.amount>0){
          const cast=s.skillCast&&s.skillCast.frame===frame&&s.skillCast.targetId===event.targetId?s.skillCast:null;
          const coneHit=s.skillCast&&s.skillCast.frame===frame&&s.skillCast.cone;
          if(cast){if(!cast.v2)s.impactMs=Fx.skillImpact(s,cast.job,point,refreshed||target);}else if(coneHit)effect(s,'seb-status-ring',point);else effect(s,actor?.job==='tank'?'seb-ground-ring':'seb-slash',point);
          const source=unitElement(s,event.actorId),from=source?centre(source):point,dx=point.x-from.x,dy=point.y-from.y,distance=Math.hypot(dx,dy)||1;
          const knockX=dx/distance*9,knockY=dy/distance*9;
          animate(s,refreshed,[
            {transform:'translate(0,0) scale(1)',filter:'brightness(1)',offset:0},
            {transform:'translate('+knockX+'px,'+knockY+'px) scale(.94)',filter:'brightness(1.7)',offset:.32},
            {transform:'translate('+(-knockX*.24)+'px,'+(-knockY*.24)+'px) scale(1.01)',filter:'brightness(1.18)',offset:.64},
            {transform:'translate(0,0) scale(1)',filter:'brightness(1)',offset:1}
          ],190);if(!v2Hit)sound('hit');
        }
      }duration=Math.max(220,s.impactMs||0);s.impactMs=0;
    }else if(event.type==='devour'){
      duration=await Fx.devour(s,event,token);if(duration===false)return false;
    }else if(event.type==='throw'&&source){
      duration=Fx.throwCard(s,event,source);
    }else{
      if(event.type==='critical'&&point){effect(s,'seb-float seb-float-critical',point,'爆擊 +1');sound('crit');}
      const fromSkill=s.skillCast&&s.skillCast.frame===frame&&s.skillCast.targetId===event.targetId;
      let statusMs=0;
      const v2=fromSkill&&s.skillCast.v2;
      if(event.type==='stun'&&v2&&target){const ok=await NDSkillFX.play('stun',skillCtx(s,target,target,token));if(!ok||current!==s||token!==s.playToken)return false;statusMs=40;}
      else if(event.type==='resonance'&&v2)statusMs=40;
      else if(['stun','resonance'].includes(event.type)&&point&&fromSkill)statusMs=Fx.skillStatus(s,event.type,point);
      else if(['stun','resonance','unity','spirit'].includes(event.type)&&point)effect(s,'seb-status-ring',point);
      if(event.type==='stun'&&!v2)sound('lock');
      if(event.type==='unity'||event.type==='spirit')sound('buff');
      if(event.type==='energy')sound('energy');
      if(event.type==='defeat')Fx.defeat(s,event);
      if(event.type==='trap')Fx.trap(s,event,source,point);
      if(event.type==='result')sound(frame&&frame.after&&frame.after.status==='won'?'victory':'defeat');
      if(event.type==='turn')sound('turnStart');
      if(event.type==='resonance'&&!v2)sound('burn');
      if(event.type==='energy'){updateDisplay(s,event);render(s);}
      duration=Math.max(statusMs,event.type==='defeat'?650:['turn','result'].includes(event.type)?140:70);
    }
    const message=s.shell.querySelector('.seb-battle-message');if(message)message.textContent=s.message;
    const okay=await wait(s,duration,token);clearFX(s);return okay;
  }
  function isKingRatArrival(frame) {
    return frame.events.some(e=>e.type==='transform'&&e.targetId==='louis-armored')&&
      frame.events.some(e=>e.type==='summon'&&e.targetId?.startsWith('crystal-rat-'));
  }
  function readKingRatArrival(s,token) {
    if(current!==s||token!==s.playToken)return Promise.resolve(false);
    const narration='路易斯額前的暮晶猛然亮起，感應沿地面擴散。成群變異鼠從四周湧出，撲向眾人。';
    const dialogue='伊芙：「他在控制牠們！」';
    showToast(s,[node('p','seb-toast-narration',narration),node('p','seb-toast-line',dialogue)],'鼠群湧現');announce(s,narration+' '+dialogue);
    return Promise.resolve(true);
  }
  async function playback(s,result,before,focusTo) {
    const token=++s.playToken;
    const frames=result.frames?.length?result.frames:[{kind:'action',side:before.side,before,after:copy(s.state),events:result.events||[]}];
    if(s.reduced.matches){
      const arrival=frames.find(isKingRatArrival);
      if(arrival){s.view=copy(arrival.after);render(s);if(!await readKingRatArrival(s,token))return;}
      s.view=null;s.busy=false;render(s,s.state.status!=='playing'?'result-primary':focusTo);announce(s,s.message);return;
    }
    for(const frame of frames){
      if(current!==s||token!==s.playToken)return;
      s.view=copy(frame.before);render(s);
      for(const event of frame.events)if(!await playEvent(s,event,token,frame))return;
      if(!await returnActors(s,token))return;
      if(current!==s||token!==s.playToken)return;
      s.view=copy(frame.after);render(s);
      if(isKingRatArrival(frame)&&!await readKingRatArrival(s,token))return;
      if(!await wait(s,70,token))return;
    }
    if(current!==s||token!==s.playToken)return;
    s.view=null;s.busy=false;clearFX(s,true);render(s,s.state.status!=='playing'?'result-primary':focusTo);announce(s,s.message);
  }
  function takeAction(s,action) {
    if(s.busy||s.rotated||s.modal||s.state.status!=='playing')return;
    cancelGesture(s);hidePreview(s);s.pending=null;
    const before=copy(s.state);let result;
    try{result=action==='end-turn'?s.engine.endTurn(s.state):s.engine.act(s.state,action);}
    catch(error){s.message='這次行動未能完成，請返回故事後重試。';render(s);announce(s,s.message);return;}
    if(!result.ok){s.message=result.error||'目前無法執行';render(s);announce(s,s.message);return;}
    if(action!=='end-turn'&&action.type==='skill')sound('cardPlace');
    s.busy=true;s.message=(result.events||[]).slice(-2).map(e=>e.text).filter(Boolean).join(' ');
    s.view=before;render(s);
    playback(s,result,before,action==='end-turn'?'end-turn':'unit-'+action.actorId).catch(()=>{if(current===s){cancelPlayback(s);announce(s,'戰鬥結果已更新。');}});
  }
  function choose(s,actorId,type) {
    if(s.busy||s.rotated||s.state.status!=='playing')return;
    s.actorId=actorId;
    if(!actions(s,actorId).some(a=>a.type===type)){s.pending=null;s.message=unavailable(s,type,unit(s,actorId,true));render(s);announce(s,s.message);return;}
    s.pending={actorId,type};render(s);announce(s,'請選擇'+(type==='skill'&&s.engine.skill(unit(s,actorId).job).target==='self'?'本人':'敵方目標')+'；Escape 取消。');
  }
  function submitTarget(s,id) {
    if(!s.pending)return false;
    const action=actions(s,s.pending.actorId).find(a=>a.type===s.pending.type&&(a.targetId||a.actorId)===id);
    if(!action)return false;
    takeAction(s,action);return true;
  }
  function updateTargets(s,selection) {
    const allowed=legalTargets(s,selection);
    for(const el of s.shell.querySelectorAll('[data-seb-unit]')){const valid=allowed.includes(el.dataset.sebUnit);el.classList.toggle('seb-targetable',valid);el.dataset.sebTarget=String(valid);}
  }
  function cancelGesture(s) {
    const g=s.gesture;if(!g)return;
    if(g.timer)clearTimeout(g.timer);
    s.gesture=null;s.arrow.replaceChildren();s.arrow.removeAttribute('data-can-hit');s.root.classList.remove('seb-is-dragging');
    for(const el of s.shell.querySelectorAll('.seb-drag-source,.seb-drop-hover'))el.classList.remove('seb-drag-source','seb-drop-hover');
    try{if(s.root.hasPointerCapture(g.id))s.root.releasePointerCapture(g.id);}catch(_){}
    updateTargets(s,s.pending);
  }
  function targetAt(s,g,x,y) {
    const legal=legalTargets(s,g);if(!legal.length)return null;
    const exact=document.elementFromPoint(x,y)?.closest('[data-seb-unit]');
    if(exact&&legal.includes(exact.dataset.sebUnit))return exact;
    const pad=44;let best=null,bestDist=Infinity;
    for(const id of legal){
      const el=unitElement(s,id);if(!el)continue;
      const r=el.getBoundingClientRect();
      if(x<r.left-pad||x>r.right+pad||y<r.top-pad||y>r.bottom+pad)continue;
      const cx=r.left+r.width/2,cy=r.top+r.height/2,d=Math.hypot(x-cx,y-cy);
      if(d<bestDist){bestDist=d;best=el;}
    }
    return best;
  }
  // The action a drop on `unitEl` would perform (null when the drag would not do anything).
  function dropAction(s,g,unitEl) {
    return unitEl?actions(s,g.actorId).find(a=>a.type===g.type&&(a.targetId||a.actorId)===unitEl.dataset.sebUnit)||null:null;
  }
  function dragArrow(s,g,x,y,canHit) {
    const ns='http://www.w3.org/2000/svg';s.arrow.replaceChildren();s.arrow.setAttribute('viewBox','0 0 '+innerWidth+' '+innerHeight);
    s.arrow.dataset.canHit=String(Boolean(canHit));
    const line=document.createElementNS(ns,'path');
    line.setAttribute('d','M '+g.origin.x+' '+g.origin.y+' Q '+g.origin.x+' '+y+' '+x+' '+y);line.setAttribute('class','seb-drag-line');s.arrow.append(line);
    const head=document.createElementNS(ns,'circle');head.setAttribute('cx',x);head.setAttribute('cy',y);head.setAttribute('r','7');head.setAttribute('class','seb-drag-tip');s.arrow.append(head);
  }
  function pointerDown(s,e) {
    if(e.button!==0||!e.isPrimary)return;
    if(s.gesture){e.preventDefault();return;}
    s.suppressClickUntil=0;hidePreview(s);
    if(s.busy||s.rotated||s.modal||s.state.status!=='playing')return;
    const el=e.target.closest('[data-seb-action="unit"],[data-seb-action="skill"]');
    if(!el||!s.root.contains(el))return;
    const isSkill=el.dataset.sebAction==='skill',id=isSkill?el.dataset.sebOwner:el.dataset.sebUnit,u=unit(s,id,true);
    if(!u)return;
    if(s.pending&&legalTargets(s).includes(id)&&!isSkill)return;
    const g={id:e.pointerId,x:e.clientX,y:e.clientY,origin:centre(el),actorId:id,type:isSkill?'skill':'attack',source:el,dragging:false,long:false,timer:null};s.gesture=g;
    g.timer=setTimeout(()=>{if(s.gesture!==g||g.dragging)return;g.long=true;s.suppressClickUntil=performance.now()+700;cancelGesture(s);details(s,id,isSkill);},350);
  }
  function pointerMove(s,e) {
    const g=s.gesture;if(!g||g.id!==e.pointerId)return;
    const distance=Math.hypot(e.clientX-g.x,e.clientY-g.y);
    if(distance>2&&g.timer){clearTimeout(g.timer);g.timer=null;}
    if(!g.dragging&&distance<8)return;
    if(!g.dragging){
      if(!actions(s,g.actorId).some(a=>a.type===g.type)){s.suppressClickUntil=performance.now()+500;cancelGesture(s);announce(s,unavailable(s,g.type,unit(s,g.actorId,true)));return;}
      g.dragging=true;s.actorId=g.actorId;s.pending=null;s.root.classList.add('seb-is-dragging');g.source.classList.add('seb-drag-source');updateTargets(s,{actorId:g.actorId,type:g.type});
      if(g.type==='skill')sound('cardPickup');
      try{s.root.setPointerCapture(e.pointerId);}catch(_){}
    }
    e.preventDefault();
    const target=targetAt(s,g,e.clientX,e.clientY);
    // Green line == a drop here is guaranteed to succeed; remember it so releasing still counts if the pointer
    // slips a pixel off (or the layout re-rendered) between the last move and the release.
    g.lastId=target&&dropAction(s,g,target)?target.dataset.sebUnit:null;
    dragArrow(s,g,e.clientX,e.clientY,Boolean(g.lastId));
    for(const el of s.shell.querySelectorAll('.seb-drop-hover'))el.classList.remove('seb-drop-hover');
    if(g.lastId)unitElement(s,g.lastId)?.classList.add('seb-drop-hover');
    // Soft tick the moment a dragged skill card attaches to a legal character; resets when it leaves.
    const hoverId=g.lastId;
    if(hoverId!==g.hoverId){g.hoverId=hoverId;if(hoverId&&g.type==='skill')sound('cardFlip');}
  }
  function pointerUp(s,e) {
    const g=s.gesture;if(!g||g.id!==e.pointerId)return;
    if(g.dragging){
      e.preventDefault();s.suppressClickUntil=performance.now()+500;
      const target=targetAt(s,g,e.clientX,e.clientY)||(g.lastId?unitElement(s,g.lastId):null);
      const action=dropAction(s,g,target)||(g.lastId?actions(s,g.actorId).find(a=>a.type===g.type&&(a.targetId||a.actorId)===g.lastId):null);
      cancelGesture(s);s.pending=null;
      if(action)takeAction(s,action);else{if(g.type==='skill')sound('cardInvalid');render(s,'unit-'+g.actorId);announce(s,'已取消，沒有消耗暮晶或行動。');}
    }else cancelGesture(s);
  }
  function onClick(s,e) {
    e.stopPropagation();const el=e.target.closest('[data-seb-action]');if(!el||!s.root.contains(el)||el.disabled)return;
    if(e.detail!==0&&performance.now()<s.suppressClickUntil){e.preventDefault();return;}
    const action=el.dataset.sebAction;
    if(s.modal&&!['cancel-leave','confirm-leave','close-detail'].includes(action))return;
    if(['cancel-leave','close-detail'].includes(action)){closeModal(s);return;}
    if(action==='confirm-leave'||action==='return'){finish(s,false,'exit');return;}
    if(action==='leave'){const body=node('p','','這場戰鬥不會算作完成。返回故事後，可以重新挑戰。');openModal(s,'離開這場戰鬥？',body,'leave');return;}
    if(s.busy||s.rotated)return;
    if(action==='continue'&&s.state.status==='won'){finish(s,true,'completed');return;}
    if(action==='retry'&&s.state.status!=='playing'){cancelPlayback(s,false);s.state=s.engine.create(s.config);s.actorId='hero';s.pending=null;s.message='重新挑戰，暮晶從 0 開始。';render(s,'unit-hero');return;}
    if(action==='rules'){showRules(s);return;}
    if(action==='toggle-log'){showLog(s);return;}
    if(action==='skill-info'){details(s,el.dataset.sebOwner,true);return;}
    if(action==='unit-info'){details(s,el.dataset.sebOwner,false);return;}
    if(action==='cancel-target'){s.pending=null;render(s);return;}
    if(action==='unit'){
      const id=el.dataset.sebUnit;if(submitTarget(s,id))return;
      // Tapping the character picture (not the name/stat strip) shows the hint; legal attack targets above still win.
      if(e.detail!==0&&e.target.closest('.seb-portrait')){details(s,id,false);return;}
      const u=unit(s,id);if(u.side==='player')choose(s,id,'attack');else if(!s.pending)details(s,id,false);else announce(s,'此角色不是合法目標。');return;
    }
    if(action==='skill')choose(s,el.dataset.sebOwner,'skill');
    if(action==='cone'){const cone=actions(s,el.dataset.sebOwner).find(a=>a.type==='cone');if(cone){s.actorId=el.dataset.sebOwner;takeAction(s,cone);}else{const u=unit(s,el.dataset.sebOwner,true);s.message=!u||u.hp<=0?'角色已倒下':u.coneUsed?'本回合已使用晶錐':'暮晶不足：需要 '+(u.cone?u.cone.cost:1)+' 點';render(s);announce(s,s.message);}}
    if(action==='attack')choose(s,s.actorId,'attack');
    if(action==='end-turn')takeAction(s,'end-turn');
  }
  function onKey(s,e) {
    e.stopPropagation();
    if(e.key==='Escape'){
      e.preventDefault();if(s.gesture){s.suppressClickUntil=performance.now()+500;cancelGesture(s);s.pending=null;render(s);return;}
      if(s.modal)closeModal(s);else if(s.pending){s.pending=null;render(s);}else{const body=node('p','','這場戰鬥不會算作完成。返回故事後，可以重新挑戰。');openModal(s,'離開這場戰鬥？',body,'leave');}return;
    }
    // Hotkey: E ends the turn (same path as the button; takeAction ignores it while busy / in a modal / after the fight).
    if((e.key==='e'||e.key==='E')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.repeat&&!/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName||'')){
      if(!s.modal&&!s.rotated&&!s.busy&&!s.gesture&&s.state.status==='playing'){e.preventDefault();takeAction(s,'end-turn');}
      return;
    }
    if(e.key!=='Tab')return;
    const scope=s.modal||(s.rotated?s.rotate:s.shell),items=[...scope.querySelectorAll('button:not([disabled]),[tabindex="0"]')].filter(el=>el.getClientRects().length);
    if(!items.length){e.preventDefault();s.root.focus();return;}
    const first=items[0],last=items[items.length-1];
    if(e.shiftKey&&(document.activeElement===first||!scope.contains(document.activeElement))){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&(document.activeElement===last||!scope.contains(document.activeElement))){e.preventDefault();first.focus();}
  }
  function resize(s) {
    const next=(PORTRAIT_GATE&&innerWidth<=1024&&innerHeight>innerWidth);
    cancelGesture(s);hidePreview(s);s.pending=null;
    if(s.busy)cancelPlayback(s,false);
    if(next!==s.rotated){closeModal(s);s.rotated=next;}
    render(s,next?'rotate-leave':undefined);
  }
  function finish(s,success,reason) {
    if(current!==s||s.returned)return;
    s.returned=true;cancelGesture(s);hidePreview(s);cancelPlayback(s,false);current=null;
    s.root.remove();window.removeEventListener('resize',s.onResize);window.removeEventListener('blur',s.onBlur);
    s.reduced.removeEventListener('change',s.onMotionChange);
    for(const [el,value] of s.inertElements)if(el.isConnected)el.inert=value;
    document.body.style.overflow=s.bodyOverflow;
    if(s.previousFocus?.isConnected&&typeof s.previousFocus.focus==='function')s.previousFocus.focus({preventScroll:true});
    if(typeof s.onReturn==='function')s.onReturn(success,{status:s.state.status,round:s.state.round,reason});
  }
  function start(config={},onReturn) {
    if(current)throw new Error('A story energy battle is already active.');
    const engine=window.NDStoryEnergyEngine;if(!engine)throw new Error('Story battle engine has not loaded.');
    const copied=copy(config),state=engine.create(copied),root=node('div','story-energy-overlay');
    root.id='seb-battle-overlay';
    root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','seb-title');root.setAttribute('data-nd-plain','');root.tabIndex=-1;
    const shell=node('div','seb-shell'),live=node('div','seb-sr-only'),fx=node('div','seb-fx-layer'),rotate=node('div','seb-rotate-host');
    live.setAttribute('role','status');live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');fx.setAttribute('aria-hidden','true');
    const arrow=document.createElementNS('http://www.w3.org/2000/svg','svg');arrow.setAttribute('class','seb-drag-arrow');arrow.setAttribute('aria-hidden','true');
    root.append(shell,rotate,fx,arrow,live);
    const s={config:copied,state,engine,root,shell,live,fx,arrow,rotate,onReturn,actorId:'hero',pending:null,message:'',busy:false,view:null,returned:false,modal:null,gesture:null,playToken:0,waiters:new Map(),animations:new Set(),poses:new Map(),suppressClickUntil:0,rotated:(PORTRAIT_GATE&&innerWidth<=1024&&innerHeight>innerWidth),reduced:matchMedia('(prefers-reduced-motion: reduce)'),previousFocus:document.activeElement,bodyOverflow:document.body.style.overflow,inertElements:[]};
    s.fxCanvas=document.createElement('canvas');s.fxCanvas.className='seb-skill-canvas';s.fxCanvas.setAttribute('aria-hidden','true');root.append(s.fxCanvas);
    for(const el of [...document.body.children])if(el instanceof HTMLElement&&!['SCRIPT','STYLE','LINK'].includes(el.tagName)){s.inertElements.push([el,el.inert]);el.inert=true;}
    root.addEventListener('click',e=>onClick(s,e));root.addEventListener('keydown',e=>onKey(s,e),true);
    root.addEventListener('pointerdown',e=>pointerDown(s,e));root.addEventListener('pointermove',e=>pointerMove(s,e));root.addEventListener('pointerup',e=>pointerUp(s,e));
    root.addEventListener('pointercancel',e=>{if(s.gesture?.id===e.pointerId){s.suppressClickUntil=performance.now()+500;cancelGesture(s);s.pending=null;render(s);}});
    root.addEventListener('lostpointercapture',e=>{if(e.target===root&&s.gesture?.id===e.pointerId)cancelGesture(s);});
    root.addEventListener('contextmenu',e=>{if(e.target.closest('.seb-skill-card,.seb-unit'))e.preventDefault();});
    root.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse'||s.busy||s.gesture||s.modal)return;const card=e.target.closest('.seb-skill-card');if(card&&!card.contains(e.relatedTarget))hoverPreview(s,card);});
    root.addEventListener('pointerout',e=>{const card=e.target.closest('.seb-skill-card');if(card&&!card.contains(e.relatedTarget))hidePreview(s);});
    s.onResize=()=>resize(s);s.onBlur=()=>{if(s.gesture){s.suppressClickUntil=performance.now()+500;cancelGesture(s);s.pending=null;render(s);}};
    s.onMotionChange=e=>{if(e.matches&&current===s){cancelGesture(s);hidePreview(s);s.pending=null;cancelPlayback(s);}};
    s.reduced.addEventListener('change',s.onMotionChange);
    window.addEventListener('resize',s.onResize);window.addEventListener('blur',s.onBlur);
    document.body.style.overflow='hidden';document.body.append(root);current=s;render(s,s.rotated?'rotate-leave':'unit-hero');announce(s,'故事戰鬥開始。'+objective(s)+'。暮晶從 0 開始。');return true;
  }
  window.NDStoryEnergyBattle=Object.freeze({start,snapshot:()=>current?copy(current.state):null,close:()=>{if(current)finish(current,false,'cancelled');}});
  Fx.bind({node, effect, centre, unitElement, animate, wait, sound, render, updateDisplay, copy, num, isCurrent: s => current === s});
})();
