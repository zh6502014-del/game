/* SHIELD-RHYTHM-077 v2 — music-synced shield rhythm; self-contained presentation/gameplay; no combat RNG or saves.
   Music: "Determined Pursuit (epic orchestra loop)" by Emma_MA, CC0 (OpenGameArt). 160 BPM, first grid beat at 1.908s
   (librosa beat fit). Challenge t=0 is music 3.033s; four half-note count-ins (0.75s) fall on music 0.033/0.783/1.533/2.283. */
(() => {
 'use strict';
 const BPM=160, Q=60/BPM, HALF=Q*2, DURATION=30, MUSIC_AT_ZERO=3.033, COUNT_IN=4*HALF, PERFECT=.07, WINDOW=.15, MAX_MISSES=3;
 const MUSIC_URL='assets/audio/story/shield-rhythm-theme.mp3', SFX_DIR='assets/audio/story/shield-rhythm/';
 // Designed cue set (storage/source-audio/SHIELD-RHYTHM-077/gen_shield_sfx.py): tuned to the soundtrack's C centre; gains from the demo mix.
 const SFX=Object.freeze({block:['sr-block-1','sr-block-2','sr-block-3'],perfect:['sr-perfect'],hold:['sr-hold-loop'],roll:['sr-roll-1','sr-roll-2','sr-roll-3'],grab:['sr-grab'],release:['sr-release'],miss:['sr-miss-1','sr-miss-2'],break:['sr-break'],});
 const SFX_GAIN=Object.freeze({block:.7,perfect:.55,grab:.7,hold:.3,roll:.42,release:.8,miss:.75,break:.9});
 // Chart in quarter beats from t=0. Intro: every half note. From beat 40 (15s) the orchestra opens up: pickups before each bar.
 // Holds (press on the head, keep holding, release on the tail) sit on one-bar phrases; the last hold is the finisher.
 const RELEASE=.18, RELEASE_PERFECT=.08;
 const JUDGE=52; // % from left: the front face of 格蘭's shield in hold-the-gate.webp (scene plate is scaled 1.08 around centre).
 // v2.6: ONE continuous chart in two segments (第一波 0–30s, 第二波 30–66s); combo carries, misses reset when 第二波 starts.
 // 第二波 opens with a 6s bridge of half notes over the quiet build (music 33–39s), crashes on the drop (t=36 = music 39.033s),
 // then the dense part (eighth pairs). Each note carries its own flight speed: 第二波 notes fly ~36% faster.
 const HOLDS=[[12,16],[28,32],[48,52],[64,68],[72,76]];
 const inHold=j=>HOLDS.some(([a,b])=>j>=a&&j<=b);
 const CHART=[];
 for(let j=4;j<=38;j+=2)if(!inHold(j))CHART.push([j]);
 for(let j=40;j<=76;j+=2){if(!inHold(j))CHART.push([j]);if(j%8===6&&j<76&&!inHold(j+1))CHART.push([j+1]);}
 const HOLDS2=[[12,16],[28,32],[48,52],[64,68],[72,76]];
 const TAPS2=[4,6, 8,9,10, 17,18,19, 20,21,22,23, 24,25,26,27, 33,34,35, 36,37,38,38.5,39, 40,41,42,43, 44,45,46,47, 53,54,55, 56,57,57.5,58,59, 60,61,62,63, 69,70,71].map(j=>[j]);
 const DROP=96; // quarter beats from t=0: t=36s
 const BRIDGE=[80,82,84,86,88,90,92,94].map(j=>[j]);
 const SEGMENTS=Object.freeze([Object.freeze({start:0,end:30,lead:2.1}),Object.freeze({start:30,end:66,lead:1.55})]);
 const segOf=t=>t>=SEGMENTS[1].start-1e-9?1:0;
 const LIST=[...CHART,...HOLDS,...BRIDGE,[DROP],...TAPS2.map(([j])=>[j+DROP]),...HOLDS2.map(([a,b])=>[a+DROP,b+DROP])].sort((a,b)=>a[0]-b[0]);
 const NOTES=Object.freeze(LIST.map(([a,b])=>{const time=+(a*Q).toFixed(6),seg=segOf(time),lead=SEGMENTS[seg].lead;return Object.freeze(b==null?{time,seg,lead,speed:(100-JUDGE)/lead*1.02}:{time,end:+(b*Q).toFixed(6),seg,lead,speed:(100-JUDGE)/lead*1.02});}));
 const TIMES=Object.freeze(NOTES.map(n=>n.time)), COUNT=TIMES.length;
 const lastOf=k=>NOTES.reduce((x,n,i)=>n.seg===k?i:x,-1);
 const HEAVY=new Set([lastOf(0),NOTES.findIndex(n=>Math.abs(n.time-DROP*Q)<1e-6),lastOf(1)]);
 const trackNotes=()=>NOTES.map((n,i)=>n.end==null?'':`<i class="sr-hold${HEAVY.has(i)?' heavy':''}" data-body="${i}"><em></em></i>`).join('')+NOTES.map((n,i)=>`<i class="sr-note${n.end!=null?' hold':''}${HEAVY.has(i)?' heavy':''}" data-note="${i}"></i>`).join('');
 function engine({from=0,to=SEGMENTS.length-1}={}){
  const notes=NOTES.map(n=>({...n,hold:n.end!=null,state:n.seg<from||n.seg>to?'skip':'pending'}));
  const start=SEGMENTS[from].start,end=SEGMENTS[to].end;let segment=from;
  let misses=0,hits=0,perfects=0,combo=0,best=0,state='running',lastMissKind='';
  const miss=(n,kind='late')=>{if(n.state==='hit'||n.state==='miss')return;n.state='miss';lastMissKind=kind;misses++;combo=0;if(misses>MAX_MISSES)state='failed';};
  const held=()=>notes.find(n=>n.state==='holding');
  function advance(t){
   if(state!=='running')return;
   // Wave boundary first, so a late miss on wave 2's first note counts against wave 2's fresh allowance.
   while(segment<to&&t>=SEGMENTS[segment].end){segment++;misses=0;}
   for(const n of notes){
    if(n.state==='pending'&&t>n.time+WINDOW)miss(n,'late');
    else if(n.state==='holding'&&t>n.end+RELEASE)miss(n,'held');
    if(state==='failed')break;
   }
   if(state==='running'&&t>=end)state='success';
  }
  function nearest(t){let k=0,d=Infinity;notes.forEach((n,i)=>{if(n.state==='skip')return;const x=Math.abs(n.time-t);if(x<d){d=x;k=i;}});return k;}
  const score=d=>{hits++;combo++;best=Math.max(best,combo);if(d<=PERFECT+1e-9){perfects++;return 'perfect';}return 'good';};
  function input(t){
   advance(t);if(state!=='running'||t<start||t>=end||held())return 'ignored';
   // The nearest note owns this press, even if already judged: no double deductions, spam still fails.
   const n=notes[nearest(t)];if(n.state!=='pending')return 'ignored';
   const d=Math.abs(t-n.time);
   if(d<=WINDOW+1e-9){if(n.hold){n.state='holding';n.head=d<=PERFECT+1e-9?'perfect':'good';return 'hold';}n.state='hit';return score(d);}
   miss(n,'early');return 'miss';
  }
  function release(t){
   const n=held();if(!n)return 'ignored';
   advance(t);if(n.state!=='holding'||state!=='running')return 'ignored';
   if(t<n.end-RELEASE){miss(n,'released');return 'released';}
   const d=Math.abs(t-n.end);n.state='hit';hits++;combo++;best=Math.max(best,combo);
   if(d<=RELEASE_PERFECT&&n.head==='perfect'){perfects++;return 'perfect';}return 'good';
  }
  return {notes,start,end,from,to,get segment(){return segment;},advance,input,release,get holding(){return held()||null;},get lastMissKind(){return lastMissKind;},get misses(){return misses;},get hits(){return hits;},get perfects(){return perfects;},get combo(){return combo;},get best(){return best;},get state(){return state;}};
 }
 let active=null;const buffers=new Map();
 // fetch() is blocked when the page is opened by double-click (file://); fall back to a base64 copy loaded by <script>.
 let embedded=null;
 function loadEmbed(){
  if(embedded)return embedded;
  embedded=new Promise(ok=>{if(window.NDShieldEmbed)return ok(window.NDShieldEmbed);try{const s=document.createElement('script');s.src='assets/audio/story/shield-rhythm-embed.js';s.onload=()=>ok(window.NDShieldEmbed||null);s.onerror=()=>ok(null);document.head.append(s);}catch(_){ok(null);}});
  return embedded;
 }
 function decode(context,b){return new Promise((ok,no)=>{const p=context.decodeAudioData(b,ok,no);if(p?.then)p.then(ok,no);});}
 function load(context,url){
  if(buffers.has(url))return Promise.resolve(buffers.get(url));
  const viaEmbed=()=>loadEmbed().then(d=>{const b64=d?.[url];if(!b64)return null;const bin=atob(b64),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return decode(context,u.buffer);}).then(buf=>{if(buf)buffers.set(url,buf);return buf||null;}).catch(()=>null);
  if(typeof fetch!=='function')return viaEmbed();
  return fetch(url).then(r=>{if(!r.ok)throw Error(r.status);return r.arrayBuffer();}).then(b=>decode(context,b))
   .then(buf=>{buffers.set(url,buf);return buf;}).catch(viaEmbed);
 }
 const sfxUrl=name=>SFX_DIR+name+'.mp3';
 function loadSfx(context){return Promise.all(Object.values(SFX).flat().map(n=>load(context,sfxUrl(n))));}
 const pips=Array.from({length:MAX_MISSES},(_,i)=>`<i data-pip="${i}"></i>`).join('');
 // Hand-painted FX sprites already shipped for story skills (fx-060), reused as canvas particles.
 const SPRITES={motes:[1,2,3,4,5].map(i=>`assets/story/fx/awaken/fx-gold-motes-${i}.webp`),shards:[1,2,3,4,5,6].map(i=>`assets/story/fx/awaken/fx-awaken-shard-${i}.webp`)};
 let sprites=null;
 const PRELOAD=['assets/story/minigames/shield-rhythm/fx-shield-ward.webp','assets/story/minigames/shield-rhythm/fx-shield-crack.webp'];
 function loadSprites(){if(sprites||typeof Image!=='function')return sprites;sprites={};sprites.preload=PRELOAD.map(src=>{const im=new Image();im.src=src;return im;});for(const [k,list] of Object.entries(SPRITES))sprites[k]=list.map(src=>{const im=new Image();im.decoding='async';im.src=src;return im;});return sprites;}
 function open({onComplete,practice=false,trigger=document.activeElement}={}){
  if(active?.isConnected)return null;
  const dialog=document.createElement('dialog');dialog.className='shield-rhythm-dialog';dialog.id='shield-rhythm-dialog';
  dialog.innerHTML=`<header><div><p>格蘭 · 城門防線</p><h2>撐住，直到她們離開</h2></div><button type="button" data-sr="exit" aria-label="退出撐盾">退出</button></header>`+
  `<div class="sr-hud"><div class="sr-evac"><span data-wave-label>第 1 / ${SEGMENTS.length} 波</span><b data-time>30.0 秒</b></div><div class="sr-guard"><span data-misses hidden>失誤 0 / ${MAX_MISSES}</span><span class="sr-pips" aria-hidden="true">${pips}</span></div></div>`+
  `<p class="sr-status" role="status" aria-live="polite">準備好了，就舉起盾。</p>`+
  `<div class="sr-stage"><div class="sr-track" aria-hidden="true"><i class="sr-lane"></i><i class="sr-judge"><b></b></i><i class="sr-burst"></i>${trackNotes()}</div>`+
  `<div class="sr-scene" role="img" aria-label="格蘭舉盾抵擋夜域，掩護母女穿過城門"><div class="sr-plate"></div><div class="sr-plate held"></div><div class="sr-gate"></div><div class="sr-night"></div><i class="sr-guide"></i><i class="sr-ward"></i><i class="sr-flash"></i><i class="sr-ring"></i><i class="sr-glint"></i><i class="sr-smoke"></i><canvas class="sr-sparks"></canvas>`+
  `<i class="sr-crackfx"></i><i class="sr-vignette"></i>`+
  `<span class="sr-feedback" aria-hidden="true"></span><span class="sr-count" aria-hidden="true"></span><div class="sr-banner" aria-hidden="true"><b></b></div><i class="sr-fade"></i></div></div>`+
  `<div class="sr-dock"><button type="button" class="sr-hit" data-sr="hit" disabled>撐盾 <kbd>Space</kbd></button>`+
  `<div class="sr-actions"><button type="button" data-sr="start">開始挑戰</button><button type="button" data-sr="resume" hidden>準備繼續</button><button type="button" data-sr="confirm" hidden>繼續故事</button></div></div><p class="sr-foot"><span data-mode></span></p>`;
  const q=s=>dialog.querySelector(s);let notes=Array.from(dialog.querySelectorAll('[data-note]')),bodies=new Map(Array.from(dialog.querySelectorAll('[data-body]')).map(el=>[+el.dataset.body,el]));
  let checkpoint=0,seenSeg=0;
  const status=q('.sr-status'),mode=q('[data-mode]'),hit=q('[data-sr="hit"]'),start=q('[data-sr="start"]'),resume=q('[data-sr="resume"]'),confirm=q('[data-sr="confirm"]');
  const canvas=q('.sr-sparks'),g2=canvas?.getContext?.('2d')||null;
  let run=engine({to:practice?0:SEGMENTS.length-1}),phase='ready',isPractice=practice,closed=false,confirmed=false,epoch=0;
  let context=null,master=null,musicBus=null,sfxBus=null,music=null,musicSource=null,useAudio=false,anchor=0,offset=0,latency=0,countStart=0,soundIndex=0,countIndex=0,raf=0,timer=0,unlockTimer=0,outroTimer=0,leaveTimer=0;
  let lastCount=-1,lastMiss=-1,lastFeedback=-9,feedback='',grade='',keyDown=false,pointerDown=false,lastPointer=-Infinity;
  let front=0,kick=0,lastFrame=0,sparks=[],holdVoice=null,holdFx=0,rollNote=null,rollNext=0;const rollVoices=[];
  const voices=new Set(),motion=!(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
  const clock=()=>useAudio&&context?context.currentTime:performance.now()/1000;
  const elapsed=()=>offset+clock()-anchor-latency;
  function vol(key,fallback){
   if(typeof audioEnabled!=='undefined'&&!audioEnabled)return 0;
   const value=typeof getAudioVolume==='function'?Number(getAudioVolume(key)):fallback;
   return Number.isFinite(value)?Math.max(0,Math.min(1,value)):fallback;
  }
  // Game sliders default to .1 for full-scale files; this cue set is mixed so .1 sits at the story-music level.
  const volume=()=>vol('shield',.1);
  function track(node,stopAt){const voice={node};voices.add(voice);node.onended=()=>{voices.delete(voice);try{node.disconnect();}catch(_){}};node.start(...stopAt);return node;}
  function clearVoices(){for(const voice of voices){try{voice.node.stop();}catch(_){}try{voice.node.disconnect();}catch(_){}}voices.clear();musicSource=null;}
  function stopLoops(){cancelAnimationFrame(raf);clearInterval(timer);raf=timer=0;clearVoices();}
  function env(at,peak,decay,attack=.006){const gain=context.createGain();gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(peak,at+attack);gain.gain.exponentialRampToValueAtTime(.0001,at+decay);return gain;}
  function tone(at,{freq=100,to=42,type='sine',peak=.5,decay=.2,bus=sfxBus}={}){
   if(!useAudio||!context||!bus)return;
   try{const osc=context.createOscillator(),gain=env(at,peak,decay);osc.type=type;osc.frequency.setValueAtTime(freq,at);osc.frequency.exponentialRampToValueAtTime(to,at+decay*.7);osc.connect(gain);gain.connect(bus);track(osc,[at]);osc.stop(at+decay+.02);}catch(_){/* visual clock stays valid */}
  }
  function noise(at,{peak=.3,decay=.12,freq=1800,q=1.2,type='bandpass'}={}){
   if(!useAudio||!context?.createBuffer||!context.createBufferSource)return;
   try{const len=Math.ceil(context.sampleRate*decay),buf=context.createBuffer(1,len,context.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
    const src=context.createBufferSource(),f=context.createBiquadFilter(),gain=env(at,peak,decay,.002);src.buffer=buf;f.type=type;f.frequency.value=freq;f.Q.value=q;src.connect(f);f.connect(gain);gain.connect(sfxBus);track(src,[at]);}catch(_){}
  }
  // Count-in / fallback pulse when the soundtrack is unavailable. Dark war-drum, never a melodic blip.
  function drum(at,counting=false){tone(at,{freq:counting?150:100,to:42,peak:counting?.25:.55,decay:.19,bus:musicBus||sfxBus});}
  // Designed cue: round-robin variant + tiny pitch drift (presentation randomness only) so repeated blocks never machine-gun.
  let lastVariant={};
  function cue(kind,{rate=1,gain=1,loop=false,at=0,drift=true}={}){
   if(!useAudio||!context?.createBufferSource)return null;
   const list=SFX[kind];let i=Math.floor(Math.random()*list.length);if(list.length>1&&i===lastVariant[kind])i=(i+1)%list.length;lastVariant[kind]=i;
   const buf=buffers.get(sfxUrl(list[i]));if(!buf)return null;
   try{const src=context.createBufferSource(),g=context.createGain(),t=Math.max(context.currentTime,at||0);src.buffer=buf;src.loop=loop;src.playbackRate.value=rate*(loop||!drift?1:1+(Math.random()-.5)*.03);
    g.gain.setValueAtTime(loop?.0001:SFX_GAIN[kind]*gain,t);if(loop)g.gain.exponentialRampToValueAtTime(SFX_GAIN[kind]*gain,t+.07);
    src.connect(g);g.connect(sfxBus);track(src,[t]);return {src,gain:g};}catch(_){return null;}
  }
  // Brief music dip so a big impact has room (sidechain-style), then recover.
  function duck(db=-4,hold=.12,back=.35){
   if(!musicBus||!context||!musicSource)return;const t=context.currentTime,g=musicBus.gain;
   try{g.cancelScheduledValues?.(t);g.setValueAtTime(g.value||1,t);g.linearRampToValueAtTime?.(10**(db/20),t+.015);g.setValueAtTime(10**(db/20),t+.015+hold);g.linearRampToValueAtTime?.(1,t+.015+hold+back);}catch(_){}
  }
  function playHit(kind){
   if(!useAudio||!context)return;const at=context.currentTime;
   if(kind==='miss'&&cue('miss')){duck(-5,.1,.4);return;}
   if(kind!=='miss'&&cue('block',{gain:kind==='good'?.9:1})){if(kind==='perfect')cue('perfect');return;}
   if(kind==='miss'){tone(at,{freq:90,to:32,type:'triangle',peak:.9,decay:.45});noise(at,{peak:.5,decay:.32,freq:420,q:.7,type:'lowpass'});return;}
   noise(at,{peak:kind==='perfect'?.55:.4,decay:.16,freq:2600,q:2});
   tone(at,{freq:150,to:55,peak:kind==='perfect'?.75:.55,decay:.18});
  }
  // Holding the shield against a torrent: a low strained drone under the music until release.
  // Hold = drum roll: rapid shield strikes on every 16th note from the head to the tail, swelling slightly louder (no pitch change).
  const ROLL=Q/4;
  function stopRoll(){rollNote=null;const t=context?.currentTime||0;for(const v of rollVoices.splice(0)){if(v.when>t+.005)try{v.src.stop();}catch(_){}}}
  function rollTick(when,p){
   const v=cue('roll',{at:when,gain:.7+.3*p,drift:false});
   if(v){rollVoices.push({src:v.src,when});if(rollVoices.length>12)rollVoices.shift();}else noise(when,{peak:.22+.18*p,decay:.05,freq:2600,q:1.6});
  }
  function holdSound(on){
   stopRoll();if(on&&run.holding){rollNote=run.holding;rollNext=rollNote.time+ROLL;}
   if(holdVoice){const {osc,osc2,src,gain}=holdVoice;holdVoice=null;try{const t=context.currentTime;gain.gain.cancelScheduledValues?.(t);gain.gain.setValueAtTime(gain.gain.value||.2,t);gain.gain.exponentialRampToValueAtTime(.0001,t+.09);(src||osc).stop(t+.11);osc2?.stop(t+.11);}catch(_){}}
   if(!on||!useAudio||!context||!sfxBus)return;
   const loop=cue('hold',{loop:true});if(loop){holdVoice=loop;return;}
   try{const t=context.currentTime,osc=context.createOscillator(),osc2=context.createOscillator(),gain=context.createGain(),f=context.createBiquadFilter?.();
    osc.type='sawtooth';osc2.type='sawtooth';osc.frequency.setValueAtTime(55,t);osc2.frequency.setValueAtTime(82.6,t);osc2.detune&&(osc2.detune.value=7);
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.22,t+.08);
    if(f){f.type='lowpass';f.frequency.value=380;osc.connect(f);osc2.connect(f);f.connect(gain);}else{osc.connect(gain);osc2.connect(gain);}gain.connect(sfxBus);
    track(osc,[t]);track(osc2,[t]);holdVoice={osc,osc2,gain};}catch(_){}
  }
  function playMusic(fromMusicTime,at){
   if(!useAudio||!music||!context.createBufferSource)return false;
   try{const src=context.createBufferSource();src.buffer=music;src.connect(musicBus);const skip=Math.max(0,fromMusicTime);track(src,[at+Math.max(0,-fromMusicTime),skip]);musicSource=src;return true;}catch(_){return false;}
  }
  function fadeMusic(seconds=.6){if(!musicBus||!context)return;const now=context.currentTime;try{musicBus.gain.cancelScheduledValues?.(now);musicBus.gain.setValueAtTime(musicBus.gain.value||.0001,now);musicBus.gain.exponentialRampToValueAtTime?.(.0001,now+seconds);}catch(_){}}
  function levels(){if(!master)return;const v=volume();master.gain.setValueAtTime(Math.min(1,v*5),context.currentTime);}
  function schedule(){
   if(closed)return;
   if(master)levels();
   mode.textContent=!useAudio?'無聲視覺模式':volume()===0?'已靜音 · 依圓點撐盾':musicSource?'配樂同步 · Determined Pursuit（CC0）':'鼓點同步';
   const now=clock(),horizon=now+.1;
   if(rollNote&&useAudio&&phase==='running'&&run.holding===rollNote)while(rollNext<rollNote.end-1e-6){
    const at=anchor+rollNext-offset;if(at>horizon)break;
    if(at>=now-.02)rollTick(Math.max(now,at),Math.max(0,Math.min(1,(rollNext-rollNote.time)/(rollNote.end-rollNote.time))));
    rollNext+=ROLL;
   }
   if(phase==='countdown')while(countIndex<4&&countStart+countIndex*HALF<=horizon){const at=countStart+countIndex++*HALF;if(at>=now-.025&&!musicSource)drum(Math.max(now,at),true);}
   if(!musicSource&&(phase==='running'||phase==='countdown'))while(soundIndex<COUNT){
    const at=anchor+TIMES[soundIndex]-offset;
    if(at>horizon)break;
    if(TIMES[soundIndex]>=offset&&at>=now-.025)drum(Math.max(now,at));
    soundIndex++;
   }
  }
  function pulse(el,cls){if(!el?.classList)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);}
  const pick=list=>list?.[Math.floor(Math.random()*list.length)];
  function emit(kind,n,{spread=1.9,dir=-.25,speed=[180,440],mote=.4}={}){
   const w=canvas.clientWidth,h=canvas.clientHeight,x=w*JUDGE/100,y=h*.54,set=sprites||{};
   for(let i=0;i<n;i++){const a=dir+(Math.random()-.5)*spread,s=speed[0]+Math.random()*(speed[1]-speed[0]),img=kind==='miss'?pick(set.shards):Math.random()<mote?pick(set.motes):null;
    sparks.push({x:x+(Math.random()-.5)*10,y:y+(Math.random()-.5)*h*.5,vx:Math.cos(a)*s,vy:Math.sin(a)*s-60,life:0,max:.45+Math.random()*.45,size:kind==='miss'?2.6:1.2+Math.random()*1.8,
     img:img?.complete&&img.naturalWidth?img:null,px:kind==='miss'?10+Math.random()*16:12+Math.random()*20,rot:Math.random()*6.3,spin:(Math.random()-.5)*12,hue:kind==='miss'?'184,210,220':kind==='perfect'?'255,236,180':'240,205,130'});}
  }
  function burst(kind){
   if(!g2||!motion)return;
   if(kind==='miss')emit('miss',14,{spread:1.4,dir:Math.PI,speed:[90,260]});
   else if(kind==='release')emit('perfect',40,{spread:2.4,speed:[220,560],mote:.6});
   else emit(kind,kind==='perfect'?26:16);
  }
  function drawSparks(dt){
   if(!g2)return;const w=canvas.clientWidth|0,h=canvas.clientHeight|0;if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
   g2.clearRect(0,0,w,h);if(!sparks.length)return;g2.globalCompositeOperation='lighter';
   sparks=sparks.filter(p=>{p.life+=dt;if(p.life>p.max)return false;p.vy+=520*dt;p.vx*=.985;p.x+=p.vx*dt;p.y+=p.vy*dt;const k=1-p.life/p.max;
    if(p.img){p.rot+=p.spin*dt;g2.save();g2.globalAlpha=k;g2.translate(p.x,p.y);g2.rotate(p.rot);g2.drawImage(p.img,-p.px/2,-p.px/2,p.px,p.px*p.img.naturalHeight/p.img.naturalWidth);g2.restore();return true;}
    g2.strokeStyle=`rgba(${p.hue},${k})`;g2.lineWidth=p.size;g2.beginPath();g2.moveTo(p.x,p.y);g2.lineTo(p.x-p.vx*.03,p.y-p.vy*.03);g2.stroke();return true;});
   g2.globalCompositeOperation='source-over';
  }
  function paint(){
   const now=clock(),t=phase==='running'?Math.max(run.start,Math.min(run.end,elapsed())):offset,dt=Math.min(.05,Math.max(0,now-(lastFrame||now)));lastFrame=now;
   const S=SEGMENTS[run.segment];q('[data-time]').textContent=Math.max(0,Math.min(S.end-S.start,S.end-t)).toFixed(1)+' 秒';
   const label=q('[data-wave-label]'),lt=`第 ${run.segment+1} / ${SEGMENTS.length} 波`;if(label&&label.textContent!==lt)label.textContent=lt;
   // Front line: hits shove the darkness right, misses shove 格蘭 back left; impulses spring back.
   kick*=Math.exp(-dt*7);front+=(-run.misses*1.1-front)*Math.min(1,dt*1.6);
   const push=front+kick;
   const beat=phase==='running'||phase==='countdown'?1-((elapsed()+COUNT_IN*8)%Q)/Q:0;
   dialog.style.setProperty('--push',(motion?push:push*.3).toFixed(3)+'%');
   dialog.style.setProperty('--pressure',String(Math.min(1,run.misses/(MAX_MISSES+1))));
   dialog.style.setProperty('--advance',String(Math.max(0,Math.min(1,(t-S.start)/(S.end-S.start)))));
   dialog.style.setProperty('--beat',beat.toFixed(3));
   q('[data-misses]').textContent=`失誤 ${Math.min(MAX_MISSES,run.misses)} / ${MAX_MISSES}`;
   dialog.dataset.misses=String(Math.min(MAX_MISSES,run.misses));dialog.dataset.phase=phase;dialog.dataset.wave=String(run.segment+1);
   const holding=run.holding;
   notes.forEach((el,i)=>{const n=run.notes[i],delta=n.time-t;el.style.left=(JUDGE+delta*n.speed)+'%';el.hidden=delta<-.25||delta>n.lead||n.state!=='pending';
    const body=bodies.get(i);if(!body)return;
    const from=n.state==='holding'?JUDGE:JUDGE+delta*n.speed,to=JUDGE+(n.end-t)*n.speed;
    body.style.left=from+'%';body.style.width=Math.max(0,to-from)+'%';
    body.hidden=n.state==='hit'||n.state==='miss'||n.state==='skip'||from>102||to<JUDGE-6;
    body.dataset.state=n.state;});
   dialog.dataset.holding=holding?'true':'';
   if(holding&&phase==='running'){front=Math.min(3.2,front+dt*1.4);holdFx+=dt;if(holdFx>.06&&g2&&motion){holdFx=0;emit('good',2,{spread:1.2,dir:-.5,speed:[120,260],mote:.7});}}
   q('.sr-feedback').textContent=now-lastFeedback<.5?feedback:'';
   dialog.dataset.impact=now-lastFeedback<.22&&grade?(grade==='release'?'perfect':grade):'';
   drawSparks(dt);
  }
  // 第二波 arrives mid-play: no pause, no count-in. Banner flashes over the scene, shield gets a fresh miss allowance, combo carries.
  function surge(){
   lastMiss=run.misses;if(!isPractice)checkpoint=run.segment;
   const banner=q('.sr-banner');banner.querySelector('b').textContent='第二波攻勢';pulse(banner,'surge');
   status.textContent='第二波攻勢 · 節奏更密、來得更快。失誤額度重新計算。';
   if(useAudio){tone(context.currentTime,{freq:70,to:36,type:'triangle',peak:.9,decay:1.4});duck(-3,.2,.8);}burst('perfect');pulse(dialog,'shake-s');
  }
  function leave(){
   if(closed||confirmed||phase!=='success'||isPractice)return;confirmed=true;clearTimeout(outroTimer);outroTimer=0;
   dialog.dataset.leaving='true';
   const done=()=>{if(closed)return;try{onComplete?.();}finally{dialog.close('complete');}};
   leaveTimer=setTimeout(done,motion?700:150);
  }
  function finish(){
   q('.sr-banner')?.classList?.remove('surge');phase=run.state;offset=Math.min(run.end,Math.max(0,elapsed()));clearInterval(timer);timer=0;hit.disabled=true;holdSound(false);
   const won=phase==='success';
   if(useAudio){fadeMusic(won?2.4:.35);if(!won){if(!cue('break'))playHit('miss');}else tone(context.currentTime,{freq:70,to:36,type:'triangle',peak:.9,decay:1.4});} // success keeps the original low boom (user choice)
   const banner=q('.sr-banner');banner.querySelector('b').textContent=won?'撐住了':'失敗了';
   if(won)burst('perfect');
   status.textContent=won?(isPractice?'練習完成。準備好後可以開始正式挑戰。':'撐住了。母女已經穿過城門。'):'失敗了。調整呼吸，再試一次。';
   if(won&&!isPractice){
    // Success hands straight back to the story after the hold-out shot; any press skips the wait.
    start.hidden=resume.hidden=true;confirm.hidden=false;confirm.textContent='繼續故事';
    outroTimer=setTimeout(leave,motion?2600:900);confirm.focus();
   }else{
    start.hidden=false;start.textContent=isPractice&&!practice?'開始正式挑戰':(checkpoint===1?'再試第二波':'再試一次');resume.hidden=true;
    confirm.hidden=true;start.focus();
   }
   paint();raf=requestAnimationFrame(outro);
  }
  function outro(){if(closed||!dialog.isConnected)return;paint();if(sparks.length)raf=requestAnimationFrame(outro);else raf=0;}
  function tick(){
   if(closed)return;
   if(!dialog.isConnected){cleanup();return;}
   if(!['running','countdown','interlude'].includes(phase))return;
   const now=clock(),count=q('.sr-count');
   if(phase==='countdown'){
    const c=Math.min(4,Math.max(1,Math.floor((now-countStart)/HALF)+1));
    if(c!==lastCount){lastCount=c;status.textContent=`預備 ${5-c} · 跟著鼓點呼吸`;if(count){count.textContent=c<4?String(4-c):'擋！';pulse(count,'show');}}
    if(now>=anchor+latency){phase='running';hit.disabled=false;hit.focus();status.textContent=(isPractice?'練習中':'守住城門')+' · 碎晶撞上金環時撐盾；黑流長音按住，到「放」再放開';}
   }
   if(phase==='running'){
    run.advance(elapsed());
    if(run.segment!==seenSeg){seenSeg=run.segment;surge();}
    if(run.misses!==lastMiss){if(lastMiss>=0){holdSound(false);feedback=run.lastMissKind==='held'?'太晚放開':'護盾受創';grade='miss';lastFeedback=now;kick-=2.6;burst('miss');pulse(dialog,'shake-l');playHit('miss');}lastMiss=run.misses;}
    if(run.state!=='running'){finish();return;}
   }
   paint();raf=requestAnimationFrame(tick);
  }
  function pause(){
   if(!['running','countdown','starting','interlude'].includes(phase))return;
   if(phase==='running')offset=Math.min(run.end,Math.max(0,elapsed()));
   // A hold cannot survive a pause (the key is no longer down): rewind to just before its head and replay it.
   const h=run.holding;if(h){h.state='pending';offset=Math.max(0,h.time-HALF);}
   epoch++;phase='paused';holdVoice=null;rollNote=null;stopLoops();hit.disabled=true;keyDown=pointerDown=false;resume.hidden=false;
   status.textContent='已暫停。回來後按「準備繼續」，重新倒數四拍。';paint();
   if(context?.state==='running')context.suspend().catch(()=>{});
  }
  function makeContext(){
   if(context)return context;const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return null;
   context=new Audio();master=context.createGain();
   // Safety limiter: dense rolls + music must never clip (clipping sounds like distortion).
   const lim=context.createDynamicsCompressor?.();if(lim){try{lim.threshold.value=-8;lim.knee.value=6;lim.ratio.value=12;lim.attack.value=.003;lim.release.value=.12;}catch(_){}master.connect(lim);lim.connect(context.destination);}else master.connect(context.destination);musicBus=context.createGain();musicBus.connect(master);sfxBus=context.createGain();sfxBus.connect(master);
   context.onstatechange=()=>{if(context?.state!=='running'&&useAudio)pause();};return context;
  }
  // Ready screen: the soundtrack fades in as soon as the dialog opens (looped, softer) and crossfades out when the count-in starts.
  let readySrc=null,readyGain=null,readyBusy=false;
  async function readyMusic(){
   if(closed||phase!=='ready'||readySrc||readyBusy||vol('shield',.1)===0)return;readyBusy=true;
   try{
    if(!makeContext())return;levels();
    if(context.state!=='running'){let to=0;try{await Promise.race([context.resume(),new Promise(ok=>{to=setTimeout(ok,1000);})]);}finally{clearTimeout(to);}}
    if(context.state!=='running')return;
    const buf=await load(context,MUSIC_URL);
    if(!buf||closed||phase!=='ready'||readySrc)return;
    music=music||buf;
    const t=context.currentTime,src=context.createBufferSource(),g=context.createGain();src.buffer=buf;src.loop=true;
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.6,t+2.4);src.connect(g);g.connect(master);src.start(t);readySrc=src;readyGain=g;
    loadSfx(context);
   }catch(_){}finally{readyBusy=false;}
  }
  function stopReady(sec=.4){
   if(!readySrc)return;const src=readySrc,g=readyGain;readySrc=readyGain=null;
   try{const t=context.currentTime;g.gain.cancelScheduledValues?.(t);g.gain.setValueAtTime(Math.max(.0001,g.gain.value||.6),t);g.gain.exponentialRampToValueAtTime(.0001,t+sec);src.stop(t+sec+.05);}catch(_){try{src.stop();}catch(__){}}
  }
  async function begin(reset,nextPractice){
   if(closed||phase==='starting')return;
   stopLoops();const token=++epoch;phase='starting';delete dialog.dataset.leaving;
   if(reset){isPractice=nextPractice;run=engine({from:checkpoint,to:nextPractice?checkpoint:SEGMENTS.length-1});offset=run.start;lastMiss=0;feedback='';grade='';front=kick=0;}
   hit.disabled=true;start.hidden=resume.hidden=confirm.hidden=true;keyDown=pointerDown=false;
   status.textContent='準備鼓點…';
   try{
    useAudio=false;
    makeContext();
    if(context&&context.state!=='running'){
     try{await Promise.race([context.resume(),new Promise((_,reject)=>{unlockTimer=setTimeout(()=>reject(new Error('audio unlock timed out')),1200);})]);}
     finally{clearTimeout(unlockTimer);unlockTimer=0;}
    }
    useAudio=!!context&&context.state==='running';
    if(useAudio&&(!music||!buffers.has(sfxUrl('sr-block-1')))){status.textContent='載入配樂…';const loaded=await Promise.race([Promise.all([load(context,MUSIC_URL),loadSfx(context)]),new Promise(ok=>{unlockTimer=setTimeout(()=>ok([null,null]),4000);})]);clearTimeout(unlockTimer);unlockTimer=0;music=loaded[0]||buffers.get(MUSIC_URL)||null;}
   }catch(_){useAudio=false;}
   if(!useAudio)stopReady(.2);
   if(closed||token!==epoch)return;
   if(document.hidden){phase='countdown';pause();return;}
   if(useAudio){latency=Math.max(0,Math.min(.12,(context.outputLatency||0)));musicBus.gain.cancelScheduledValues?.(context.currentTime);musicBus.gain.setValueAtTime(1,context.currentTime);}else latency=0;
   countStart=clock()+.1;countIndex=0;lastCount=-1;
   seenSeg=run.segment;soundIndex=TIMES.findIndex(t=>t>=offset);if(soundIndex<0)soundIndex=COUNT;
   // Four half-note count-ins precede the resume point; with the soundtrack the music is rolled back by the same amount,
   // so the bars leading into the paused moment replay under the count-in and the next note stays on the music grid.
   anchor=countStart+COUNT_IN;
   playMusic(MUSIC_AT_ZERO+offset-COUNT_IN,countStart);stopReady(.45);
   phase='countdown';dialog.dataset.phase=phase;hit.focus();schedule();timer=setInterval(schedule,25);raf=requestAnimationFrame(tick);paint();
  }
  function strike(){
   if(phase==='success'&&!isPractice){leave();return;}
   if(phase!=='running'||closed)return;
   const result=run.input(elapsed());
   pulse(hit,'pressed');
   if(result!=='ignored'){
    grade=result;lastFeedback=clock();lastMiss=run.misses;dialog.dataset.impact=result;
    if(result==='hold'){grade='good';feedback='撐住──';kick+=1;burst('good');pulse(dialog,'shake-s');pulse(q('.sr-ring'),'go');pulse(q('.sr-glint'),'go');playHit('good');cue('grab');holdSound(true);if(run.state!=='running')finish();else paint();return;}
    feedback=result==='perfect'?'完美格擋':result==='good'?'擋下':'太早了';
    if(result==='miss'){kick-=2.6;burst('miss');pulse(dialog,'shake-l');playHit('miss');}
    else{kick+=result==='perfect'?1.6:1;front=Math.min(2.4,front+.35);burst(result);pulse(dialog,'shake-s');pulse(q('.sr-ring'),'go');pulse(q('.sr-glint'),'go');pulse(q('.sr-burst'),'go');playHit(result);}
   }
   if(run.state!=='running')finish();else paint();
  }
  function letGo(){
   if(phase!=='running'||closed||!run.holding)return;
   const result=run.release(elapsed());holdSound(false);if(result==='ignored')return;
   lastFeedback=clock();lastMiss=run.misses;
   if(result==='released'){grade='miss';feedback='太早放開';kick-=2.6;burst('miss');pulse(dialog,'shake-l');playHit('miss');}
   else{grade='release';feedback=result==='perfect'?'完美推回':'推回去';kick+=3.2;front=Math.min(3.2,front+.8);burst('release');pulse(dialog,'shake-s');pulse(q('.sr-ring'),'go');pulse(q('.sr-glint'),'go');pulse(q('.sr-burst'),'go');if(cue('release'))duck(-4,.15,.5);else{playHit('perfect');tone(context?.currentTime||0,{freq:62,to:34,type:'triangle',peak:.8,decay:.5});}}
   dialog.dataset.impact=grade==='release'?'perfect':grade;
   if(run.state!=='running')finish();else paint();
  }
  function key(event){
   if(event.code!=='Space'&&event.key!==' '&&!(event.key==='Enter'&&event.target===hit))return;
   if(phase==='success'&&!isPractice&&!confirmed){event.preventDefault();leave();return;}
   // Native activation is retained for menus; during countdown/game Space has one owner.
   if(!['running','countdown'].includes(phase))return;
   event.preventDefault();if(event.repeat||keyDown||pointerDown)return;keyDown=true;strike();
  }
  const releaseKey=event=>{if(event.code==='Space'||event.key===' '||event.key==='Enter'){const was=keyDown;keyDown=false;if(was&&!pointerDown)letGo();}};
  const releasePointer=()=>{const was=pointerDown;pointerDown=false;if(was&&!keyDown)letGo();};
  function hidden(){if(document.hidden)pause();}
  function cleanup(){
   if(closed)return;closed=true;epoch++;stopLoops();try{window.NDMusicHold?.(false)}catch(e){}stopReady(.2);clearTimeout(unlockTimer);clearTimeout(outroTimer);clearTimeout(leaveTimer);unlockTimer=outroTimer=leaveTimer=0;
   window.removeEventListener('blur',pause);window.removeEventListener('keyup',releaseKey);window.removeEventListener('pointerup',releasePointer);window.removeEventListener('pointercancel',releasePointer);document.removeEventListener('visibilitychange',hidden);
   if(context){context.onstatechange=null;master?.disconnect();context.close().catch(()=>{});}context=master=musicBus=sfxBus=null;
   dialog.remove();if(active===dialog)active=null;if(trigger?.isConnected)trigger.focus();
  }
  dialog.addEventListener('keydown',key);
  hit.addEventListener('pointerdown',event=>{event.preventDefault();if(event.button!==0||pointerDown||keyDown)return;pointerDown=true;lastPointer=performance.now();strike();});
  // Keyboard Enter / assistive click has no preceding pointerdown; pointer clicks are already judged.
  hit.addEventListener('click',event=>{event.preventDefault();if(event.detail===0&&!keyDown&&!pointerDown&&performance.now()-lastPointer>500)strike();});
  dialog.addEventListener('click',event=>{
   const action=event.target.closest('[data-sr]')?.dataset.sr;if(!action||closed)return;
   if(action==='exit')dialog.close();
   else if(action==='start')begin(true,practice);
   else if(action==='practice')begin(true,true);
   else if(action==='resume'&&phase==='paused')begin(false,isPractice);
   else if(action==='confirm'&&phase==='success'&&!confirmed)leave();
  });
  dialog.addEventListener('cancel',event=>{event.preventDefault();dialog.close();});
  dialog.addEventListener('close',cleanup,{once:true});
  window.addEventListener('blur',pause);window.addEventListener('keyup',releaseKey);window.addEventListener('pointerup',releasePointer);window.addEventListener('pointercancel',releasePointer);document.addEventListener('visibilitychange',hidden);
  loadSprites();document.body.append(dialog);active=dialog;dialog.showModal();try{window.NDMusicHold?.(true)}catch(e){}paint();readyMusic();dialog.addEventListener('pointerdown',readyMusic);dialog.addEventListener('keydown',readyMusic);mode.textContent='按開始後啟用配樂';start.focus();return dialog;
 }
 window.NDShieldRhythm={open,spec:Object.freeze({segments:SEGMENTS,drop:DROP*Q,notes:NOTES,holds:HOLDS.length,release:RELEASE,duration:DURATION,count:COUNT,beat:Q,half:HALF,countIn:COUNT_IN,bpm:BPM,musicAtZero:MUSIC_AT_ZERO,window:WINDOW,perfect:PERFECT,maxMisses:MAX_MISSES,judge:JUDGE,times:TIMES,engine})};
})();
