/* Presentation-only environment. Reads snapshots; never mutates game state or RNG. */
(()=>{
 'use strict';
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 let root=null,session=null,last=null,token=0,queue=Promise.resolve();
 const pending=new Map(),animations=new Set();
 function ensure(){
  if(root)return root;
  root=document.createElement('div');root.id='nd-environment';root.setAttribute('aria-hidden','true');
  for(const mode of ['day','night']){
   const layer=document.createElement('div');layer.className='environment-backdrop '+mode;root.append(layer);
   const img=new Image();img.onload=()=>{layer.style.backgroundImage=`url("${img.src}")`;layer.dataset.loaded='true'};
   img.onerror=()=>{layer.dataset.loaded='failed'};img.src=`assets/environments/${mode}.webp`;
  }
  const fog=document.createElement('div');fog.className='environment-fog';root.append(fog);document.body.prepend(root);return root;
 }
 function cancel(){token++;for(const [id,resolve] of pending){clearTimeout(id);resolve(false)}pending.clear();animations.forEach(a=>a.cancel());animations.clear();document.querySelectorAll('.environment-cast').forEach(e=>e.remove());queue=Promise.resolve();}
 function wait(ms){return new Promise(resolve=>{const id=setTimeout(()=>{pending.delete(id);resolve(true)},ms);pending.set(id,resolve)})}
 function leave(){cancel();last=null;session=null;if(root)root.classList.remove('active');delete document.body.dataset.environment;delete document.body.dataset.domain;}
 function sync(state){
  if(!state){leave();return}
  ensure();if(session!==state.session){cancel();session=state.session;root.dataset.environment='day'}
  last={session:state.session,p:{night:!!state.p.night,domainActive:!!state.p.domainActive},a:{night:!!state.a.night,domainActive:!!state.a.domainActive}};
  const mode=last.p.night||last.a.night?'night':'day';
  // DUEL-SFX-062: one low cue when the arena actually turns to night (not on every re-sync).
  if(mode==='night'&&root.dataset.environment==='day')try{window.ndDuelSfx?.('nightfall')}catch(e){}
  root.classList.add('active');root.dataset.environment=mode;document.body.dataset.environment=mode;
  const domain=last.p.domainActive||last.a.domainActive;document.body.dataset.domain=String(domain);
  const screen=document.querySelector('.duel-screen');
  if(screen&&!screen.querySelector('.environment-domain')){const d=document.createElement('div');d.className='environment-domain';d.setAttribute('aria-hidden','true');screen.prepend(d)}
 }
 function kind(card){return card?.k==='spirit'?'spirit':card?.k==='domain'?'domain':card?.k==='class'?card.job:null}
 function cast(card,side='player'){
  const name=kind(card);if(!name||!root?.classList.contains('active'))return Promise.resolve();const current=token;
  queue=queue.then(async()=>{
   if(current!==token||document.hidden)return;
   // DUEL-SFX-062: casting accent (reduced motion keeps the sound, only the flash is skipped). Tank shield sounds from its own cue.
   const cue={spirit:'castSpirit',domain:'castDomain',swordsman:'castClass',assassin:'castClass',gunner:'castClass'}[name];
   if(cue)try{window.ndDuelSfx?.(cue)}catch(e){}
   if(reduced())return;
   const elements=[];
   for(const host of [root,document.querySelector('.duel-screen')].filter(Boolean)){
    const el=document.createElement('div');el.className=`environment-cast cast-${name}`;el.dataset.side=side;el.setAttribute('aria-hidden','true');host.append(el);elements.push(el);
    const a=el.animate([{opacity:0},{opacity:.55,offset:.35},{opacity:0}],{duration:300,easing:'ease-out'});animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));
   }
   await wait(300);elements.forEach(e=>e.remove());
  });return queue;
 }
 function playSkills(cards){for(const side of ['player','ai'])cast(cards?.[side],side);return queue}
 window.NDEnvironment=Object.freeze({sync,leave,cancel,cast,playSkills});
 addEventListener('resize',cancel);document.addEventListener('visibilitychange',()=>{cancel();if(!document.hidden&&last)sync(last)});
 const init=()=>ensure();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
