/* Result-driven presentation; never mutates S, draws RNG, or resolves damage. */
(() => {
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active=null;
  const seen=new Set();
  function animate(el,frames,options){if(!el||reduced())return;const a=el.animate(frames,options);active?.animations.push(a);return a;}
  function cancel(){if(!active)return;active.timers.forEach(clearTimeout);active.animations.forEach(a=>a.cancel());active.layer.remove();active.resolve?.();active=null;}
  function makeLayer(){const layer=document.createElement('div');layer.className='combat-fx-layer';layer.setAttribute('aria-hidden','true');document.body.append(layer);return layer;}
  function point(el){const b=el?.getBoundingClientRect();return b?{x:b.x+b.width/2,y:b.y+b.height/2,w:b.width,h:b.height}:null;}
  function element(layer,cls,p){const el=document.createElement('div');el.className=cls;el.style.left=p.x+'px';el.style.top=p.y+'px';layer.append(el);return el;}
  function pop(layer,p,event,index){
    const reason=event.reason||'';const critical=reason.includes('爆擊');
    const type=event.type==='shield'?'shield':event.type==='miss'?'miss':event.type==='domain'?'domain':reason.includes('灼傷')?'burn':reason.includes('反擊')?'counter':critical?'critical':event.shield<0?'shield':'hit';
    const box=element(layer,'fx-number fx-'+type,{x:p.x,y:p.y+index*32});
    box.append(NDVisuals.icon(type,22));
    const values=[];
    if(event.type==='miss')values.push('閃避');
    else {if(event.hp)values.push(`${event.hp>0?'+':''}${event.hp} HP`);if(event.shield)values.push(`${event.shield>0?'+':''}${event.shield} 護盾`);if(!values.length)values.push(event.type==='domain'?'領域轉換':'格擋');}
    const value=document.createElement('strong');value.textContent=values.join('  ');box.append(value);
    const label=document.createElement('small');label.textContent=({critical:'爆擊',burn:'灼傷',counter:'反擊',domain:'領域轉換',shield:event.shield>0?'護盾增加':'護盾吸收',hit:'命中',miss:'MISS'})[type];box.append(label);
    animate(box,[{opacity:0,translate:'-50% 8px',scale:'.9'},{opacity:1,translate:'-50% -8px',scale:'1.05',offset:.2},{opacity:1,translate:'-50% -20px',scale:'1',offset:.72},{opacity:0,translate:'-50% -40px',scale:'1'}],{duration:1150,fill:'forwards',easing:'ease-out'});
    if(reduced())box.style.transform='translateX(-50%)';
  }
  // Damped impulse: starts at rest, moves in the applied direction, loses energy.
  function recoil(el,dx,dy,power=1){
    const frames=Array.from({length:25},(_,i)=>{
      const t=i/24, displacement=i===24?0:Math.exp(-6*t)*Math.sin(3*Math.PI*t);
      return {translate:`${dx*power*displacement}px ${dy*power*displacement}px`,offset:t};
    });
    animate(el,frames,{duration:460,easing:'linear',composite:'add'});
  }
  function sparks(layer,p,ux,uy,power,profile){
    if(reduced())return;
    // Deterministic velocities; constant downward acceleration, no gameplay RNG.
    for(let i=0;i<6;i++){
      const speed=(70+i*18)*power,angle=(i-2.5)*.31;
      const vx=(ux*Math.cos(angle)-uy*Math.sin(angle))*speed;
      const vy=(uy*Math.cos(angle)+ux*Math.sin(angle))*speed-90;
      const spark=element(layer,'fx-spark fx-spark-'+profile.job,p);
      markAttack(spark,profile);
      const frames=Array.from({length:13},(_,j)=>{const t=j/12*.48;return {translate:`${vx*t}px ${vy*t+360*t*t}px`,opacity:1-j/12,offset:j/12}});
      animate(spark,frames,{duration:480,easing:'linear',fill:'forwards'});
    }
  }
  const jobs=new Set(['swordsman','tank','assassin','gunner']);
  // Events belong to the recipient. The opposite combatant supplies the weapon,
  // including counters and the assassin's night dodge converted into an attack.
  function attackProfile(targetSide,pending,combatants,event){
    const sourceSide=targetSide==='player'?'ai':'player';
    const card=pending?.[sourceSide];
    const sourceHud=document.querySelector('.duel-screen>.duel-side.'+(sourceSide==='player'?'player':'enemy'));
    const candidates=[combatants?.[sourceSide]?.job,card?.job,sourceHud?.dataset.job,sourceHud?.querySelector('.duel-avatar[data-art]')?.dataset.art];
    const job=candidates.find(value=>jobs.has(value))||'neutral';
    // A counter is the actor's own weapon response, not the pending spell.
    const spirit=card?.k==='spirit'&&!event.reason?.includes('反擊');
    const style=spirit?'spirit':({swordsman:'slash',assassin:'ambush',tank:'shield-bash',gunner:'bullet',neutral:'slash'})[job];
    return {job,style,sourceSide,targetSide};
  }
  function markAttack(el,profile){
    el.dataset.attackJob=profile.job;el.dataset.attackStyle=profile.style;
    el.dataset.sourceSide=profile.sourceSide;el.dataset.targetSide=profile.targetSide;
    return el;
  }
  function shape(el,paths,viewBox='0 0 160 160'){
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox',viewBox);svg.setAttribute('aria-hidden','true');
    for(const [d,cls] of paths){const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',d);if(cls)path.setAttribute('class',cls);svg.append(path)}
    el.append(svg);return el;
  }
  function launchAttack(layer,profile,{origin,contact,p,ux,uy,travel,miss,opposite}){
    if(reduced())return;
    const angle=Math.atan2(uy,ux),degrees=angle*180/Math.PI;
    const end=miss?{x:contact.x+ux*p.w*.8,y:contact.y+uy*p.h*.8}:contact;
    const delta={x:end.x-origin.x,y:end.y-origin.y};
    const lunge=profile.style==='shield-bash'?17:profile.style==='ambush'?15:profile.style==='bullet'?-7:11;
    animate(opposite,[{translate:'0 0'},{translate:`${ux*lunge}px ${uy*lunge}px`,offset:.6},{translate:'0 0'}],{duration:travel+180,easing:'cubic-bezier(.22,.7,.28,1)',composite:'add'});
    if(profile.style==='bullet'){
      const muzzle=markAttack(element(layer,'fx-muzzle',origin),profile);
      muzzle.style.rotate=angle+'rad';
      shape(muzzle,[['M10 32 32 26 24 9 40 24 62 32 40 40 24 55 32 38Z','fx-metal-fill']],'0 0 64 64');
      animate(muzzle,[{opacity:0,scale:'.5'},{opacity:.9,scale:'1',offset:.2},{opacity:0,scale:'.7'}],{duration:100,fill:'forwards'});
      const trail=markAttack(element(layer,'fx-projectile fx-attack-motion',origin),profile);
      trail.style.rotate=angle+'rad';
      animate(trail,[{translate:'0 0',opacity:0},{translate:`${delta.x*.08}px ${delta.y*.08}px`,opacity:1,offset:.08},{translate:`${delta.x}px ${delta.y}px`,opacity:1,offset:.94},{translate:`${delta.x}px ${delta.y}px`,opacity:0}],{duration:travel,easing:'linear',fill:'forwards'});
      return;
    }
    if(profile.style==='shield-bash'){
      // The shield stays in the contact area: a short heavy press, not a thrown shield.
      const press={x:ux*28,y:uy*28};
      const ram=markAttack(element(layer,'fx-attack-motion fx-shield-bash',{x:end.x-press.x,y:end.y-press.y}),profile);
      shape(ram,[['M80 14 126 33 122 89Q111 127 80 146 49 127 38 89L34 33Z','fx-shield-body'],['M80 27 113 41 110 86Q103 112 80 132 57 112 50 86L47 41Z','fx-engraved-line'],['M80 41 94 78 80 110 66 78Z','fx-metal-fill']]);
      ram.style.rotate=(degrees*.08)+'deg';
      animate(ram,[{translate:'0 0',opacity:0},{translate:`${press.x*.06}px ${press.y*.06}px`,opacity:.8,offset:.24},{translate:`${press.x}px ${press.y}px`,opacity:.9,offset:.91},{translate:`${press.x}px ${press.y}px`,opacity:0}],{duration:travel,easing:'cubic-bezier(.5,0,.9,.55)',fill:'forwards'});
      return;
    }
    if(profile.style==='ambush'){
      const rush=markAttack(element(layer,'fx-attack-motion fx-assassin-rush',origin),profile);
      rush.style.rotate=angle+'rad';
      shape(rush,[['M8 88 43 45 73 43 116 73 75 60 49 93Z','fx-shadow-echo'],['M22 103 59 52 88 49 126 77 83 69 59 104Z','fx-shadow-body'],['M89 50 105 62 150 46 119 69 108 71Z','fx-blade-fill'],['M92 88 111 80 148 91 117 87 107 96Z','fx-blade-fill']]);
      animate(rush,[{translate:'0 0',opacity:0},{translate:`${delta.x*.12}px ${delta.y*.12}px`,opacity:.8,offset:.17},{translate:`${delta.x}px ${delta.y}px`,opacity:.9,offset:.85},{translate:`${delta.x}px ${delta.y}px`,opacity:0}],{duration:travel,easing:'cubic-bezier(.13,.65,.3,1)',fill:'forwards'});
      return;
    }
    // A broad curved weapon sweep crosses the contact region, never a straight bullet.
    const spirit=profile.style==='spirit';
    const sweep=markAttack(element(layer,'fx-attack-motion fx-sword-sweep'+(spirit?' fx-spirit-sweep':''),{x:end.x-ux*24,y:end.y-uy*24}),profile);
    shape(sweep,[['M19 131Q98 144 142 28 149 110 79 136 44 145 19 131Z','fx-sweep-body'],['M24 132Q99 140 142 28','fx-sweep-edge'],['M43 148Q117 140 149 63','fx-sweep-echo']]);
    sweep.style.setProperty('--fx-sweep-size',Math.max(96,Math.min(spirit?250:170,p.h*(spirit?1.5:1.1)))+'px');
    animate(sweep,[{rotate:(degrees-55)+'deg',opacity:0,scale:'.86'},{rotate:(degrees-30)+'deg',opacity:.95,scale:'1',offset:.35},{rotate:(degrees+16)+'deg',opacity:.8,scale:'1',offset:.91},{rotate:(degrees+20)+'deg',opacity:0,scale:'1'}],{duration:travel,easing:'cubic-bezier(.25,.2,.3,1)',fill:'forwards'});
  }
  function impactAttack(layer,profile,contact,power,absorbed){
    if(reduced())return;
    const kind=absorbed?'shield':profile.style;
    const strike=markAttack(element(layer,'fx-strike fx-impact-'+kind+(power>1?' fx-strike-critical':''),contact),profile);
    strike.dataset.impactMode=absorbed?'shield':'damage';
    if(kind==='shield'||kind==='shield-bash'){
      shape(strike,[['M80 16A64 64 0 1 1 79.9 16','fx-pressure-ring'],['M80 34 111 48 106 92 80 120 54 92 49 48Z','fx-impact-shield-shape'],['M10 64 27 70M133 70 150 64M29 120 41 111M120 111 132 122','fx-pressure-rays']]);
    }else if(kind==='ambush'){
      shape(strike,[['M22 125 104 33 91 60Z','fx-cut-fill'],['M59 140 137 55 118 86Z','fx-cut-fill'],['M29 123 102 38M67 132 133 60','fx-cut-edge']]);
    }else if(kind==='bullet'){
      shape(strike,[['M80 42 87 71 116 80 87 88 80 118 72 88 43 80 72 71Z','fx-metal-fill'],['M80 19 80 35M80 126 80 143M19 80 36 80M126 80 143 80M34 35 45 45M115 115 129 129','fx-pressure-rays']]);
    }else{
      shape(strike,[['M15 142 136 15 111 59Z','fx-cut-fill'],['M20 137 135 17','fx-cut-edge']]);
    }
    animate(strike,[{opacity:.98,scale:kind==='shield-bash'?'.65':'.9'},{opacity:.8,scale:'1',offset:.2},{opacity:0,scale:kind==='shield-bash'?'1.2':'1.04'}],{duration:kind==='shield-bash'?360:280,fill:'forwards',easing:'ease-out'});
  }
  // DUEL-SFX-062: sound follows the drawn timeline — a swing when the weapon leaves, the impact when it lands.
  // Presentation only (reads the finished events); missing ndDuelSfx simply means silence.
  const sfx=name=>{try{window.ndDuelSfx?.(name)}catch(e){}};
  const SWING={slash:'swingBlade','shield-bash':'swingHeavy',ambush:'swingShadow',bullet:'shot',spirit:'swingSpirit'};
  const IMPACT={slash:'hitBlade','shield-bash':'hitHeavy',ambush:'hitShadow',bullet:'hitBullet',spirit:'hitSpirit'};
  function impactCue(event,profile,power){
    const reason=event.reason||'';
    if(event.type==='miss')return 'evade';
    if(event.type==='domain')return 'domainHeal';
    if(event.type==='shield')return null;               // shield gain already sounded when the card was cast
    if(reason.includes('灼傷'))return 'burn';
    if(reason.includes('反擊'))return 'counter';
    if(!(event.hp<0||event.shield<0))return null;
    if(event.shield<0&&!event.hp)return 'blockShield';  // fully absorbed by shield
    if(power>1)return 'hitCrit';
    return IMPACT[profile.style]||'hitBlade';
  }
  function play({session,round,result,pending,combatants}){
    const key=session+':'+round;if(seen.has(key))return Promise.resolve();seen.add(key);if(seen.size>100)seen.delete(seen.values().next().value);
    cancel();window.NDEnvironment?.playSkills(pending);const layer=makeLayer();const state={layer,timers:[],animations:[],resolve:null};active=state;
    const later=(fn,ms)=>state.timers.push(setTimeout(()=>{if(active===state)fn()},reduced()?0:ms));
    let duration=850;
    for(const side of ['player','ai']){
      const hud=document.querySelector('.duel-screen>.duel-side.'+(side==='player'?'player':'enemy'));
      const slot=document.querySelector('.slot.'+(side==='player'?'you':'enemy'));
      const opposite=document.querySelector('.slot.'+(side==='player'?'enemy':'you'));
      const p=point(slot),h=point(hud),source=point(opposite);if(!p||!h||!source)continue;
      const card=pending?.[side==='player'?'player':'ai'];
      const distance=Math.hypot(p.x-source.x,p.y-source.y)||1;
      const ux=(p.x-source.x)/distance,uy=(p.y-source.y)/distance;
      const contact={x:p.x-ux*p.w*.43,y:p.y-uy*p.h*.43};
      const origin={x:source.x+ux*source.w*.43,y:source.y+uy*source.h*.43};
      const travel=Math.max(110,Math.min(210,Math.hypot(contact.x-origin.x,contact.y-origin.y)/2.8));
      let ward=null;
      if(card?.k==='defense'){
        ward=element(layer,'fx-ward',p);ward.append(NDVisuals.icon('defense',64));sfx('ward');
        animate(ward,[{opacity:0,scale:'.92'},{opacity:.8,scale:'1',offset:.2},{opacity:.8,scale:'1',offset:.75},{opacity:0,scale:'1'}],{duration:1000,fill:'forwards'});
      }
      const events=result?.[side]?.events||[];
      events.forEach((event,index)=>{
        const burn=event.reason?.includes('灼傷'),miss=event.type==='miss';
        const harm=event.hp<0||event.shield<0,power=event.reason?.includes('爆擊')?1.5:1;
        const profile=attackProfile(side,pending,combatants,event);
        const physical=!burn&&(harm||miss),launch=80+index*540;
        const impact=launch+(physical?travel:0);duration=Math.max(duration,impact+1200);
        if(physical)later(()=>{
          if(!reason_isCounter(event))sfx(SWING[profile.style]||'swingBlade');
          launchAttack(layer,profile,{origin,contact,p,ux,uy,travel,miss,opposite});
          if(miss)animate(slot,[{translate:'0 0'},{translate:`${-uy*p.h*.75}px ${ux*p.h*.75}px`,offset:.32},{translate:`${-uy*p.h*.75}px ${ux*p.h*.75}px`,offset:.56},{translate:'0 0'}],{duration:travel+300,easing:'cubic-bezier(.3,0,.3,1)'});
        },launch);
        later(()=>{
          const cue=impactCue(event,profile,power);if(cue)sfx(cue);
          const hpBox=point(hud.querySelector('.duel-hp strong'));pop(layer,hpBox?{x:hpBox.x,y:hpBox.y+hpBox.h/2+6}:{x:h.x,y:h.y+h.h/2+8},event,index);
          if(miss||reduced())return;
          if(event.type==='domain'){
            const ring=element(layer,'fx-domain',p);ring.append(NDVisuals.icon('domain',80));
            animate(ring,[{opacity:0,scale:'.7'},{opacity:.8,scale:'1',offset:.35},{opacity:0,scale:'1.3'}],{duration:800,fill:'forwards'});return;
          }
          if(!harm)return;
          if(burn){
            const ember=element(layer,'fx-ember',p);
            animate(ember,[{opacity:0,scale:'.8'},{opacity:.7,scale:'1',offset:.3},{opacity:0,scale:'1.15'}],{duration:600,fill:'forwards'});return;
          }
          const absorbed=event.shield<0&&!event.hp;
          recoil(slot,ux*(absorbed?3:10),uy*(absorbed?3:10),power);
          if(!absorbed)recoil(hud,ux*4,uy*4,power);
          if(ward)recoil(ward,ux*3,uy*3,power);
          impactAttack(layer,profile,contact,power,absorbed);
          if(profile.style!=='ambush')sparks(layer,contact,absorbed?-ux:ux,absorbed?-uy:uy,power,profile);
        },impact);
      });
    }
    return new Promise(resolve=>{state.resolve=resolve;state.timers.push(setTimeout(()=>{if(active===state){state.animations.forEach(a=>a.cancel());layer.remove();active=null;}resolve()},reduced()?650:duration));});
  }
  function reason_isCounter(event){return !!event.reason?.includes('反擊')}
  function freeShield(amount){cancel();const hud=point(document.querySelector('.duel-side.player'));if(!hud)return;const layer=makeLayer();active={layer,timers:[],animations:[],resolve:null};pop(layer,{x:hud.x,y:hud.y+hud.h/2}, {type:'shield',reason:'護盾',hp:0,shield:amount},0);active.timers.push(setTimeout(cancel,1100));}
  window.NDCombatFX=Object.freeze({play,cancel,freeShield});
  addEventListener('resize',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel()});
})();
