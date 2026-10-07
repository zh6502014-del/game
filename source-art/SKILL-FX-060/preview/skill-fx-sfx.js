/* STORY-SKILL-FX v2 sound recipes. Synthesized, low and dry (no bright chimes), timed to the beats in story-skill-fx.js.
 * In the game: registers into game.js's ND_SFX_FALLBACK.recipes and plays through window.playSfx(name) (user volume/mute apply).
 * Standalone (preview page): builds a tiny synth with the same tone()/noise() helpers and defines window.playSfx.
 */
(() => {
  'use strict';
  const R = {
    fxQuakeStomp(t){this.tone(t,72,.38,{type:'sine',to:38,gain:.62});this.noise(t,.32,{type:'lowpass',freq:900,to:160,gain:.42});for(let i=0;i<4;i++)this.noise(t+.05+i*.05,.03,{freq:1400+i*300,q:2,gain:.1});},
    fxQuakeCrack(t){this.noise(t,.4,{type:'lowpass',freq:220,to:900,gain:.34});this.tone(t,48,.4,{type:'sine',to:62,gain:.3});for(let i=0;i<7;i++)this.noise(t+.03+i*.05,.025,{freq:900+((i*37)%5)*260,q:3,gain:.13});},
    fxQuakeImpact(t){this.tone(t,92,.75,{type:'sine',to:30,gain:.78});this.noise(t,.62,{type:'lowpass',freq:1900,to:140,gain:.55});this.noise(t,.07,{type:'highpass',freq:2400,gain:.18});
      for(let i=0;i<9;i++)this.noise(t+.06+i*.05+(i%3)*.012,.03,{freq:1100+(i%4)*420,q:2.4,gain:.14-i*.011});},
    fxStun(t){this.tone(t,196,.95,{type:'sine',to:176,gain:.11});this.tone(t,207,.95,{type:'sine',to:184,gain:.09});this.noise(t,.9,{freq:700,to:420,q:3,gain:.07});this.tone(t,98,.5,{type:'sine',to:80,gain:.12});},
    fxShadowGather(t){this.noise(t,.42,{freq:280,to:1500,q:1.1,gain:.3});this.tone(t,58,.42,{type:'sine',to:88,gain:.25});},
    fxShadowBurst(t){this.noise(t,.6,{type:'lowpass',freq:1300,to:180,gain:.36});this.tone(t,112,.42,{type:'sine',to:44,gain:.32});this.noise(t+.02,.28,{freq:900,to:300,q:.9,gain:.14});},
    fxUnityGather(t){this.noise(t,.46,{freq:600,to:2400,q:2,gain:.22});this.tone(t,150,.46,{type:'sine',to:300,gain:.16});},
    fxUnityStrike(t){this.noise(t,.12,{type:'highpass',freq:3200,gain:.24});[612,927].forEach(f=>this.tone(t,f,.32,{type:'sine',to:f*.97,gain:.06}));this.tone(t,102,.4,{type:'sine',to:44,gain:.52});this.noise(t+.01,.3,{type:'lowpass',freq:1500,to:260,gain:.3});},
    fxResCharge(t){this.tone(t,86,.38,{type:'sine',to:250,gain:.2});this.noise(t,.38,{freq:380,to:1700,q:1.4,gain:.13});},
    fxResFire(t){this.noise(t,.08,{type:'highpass',freq:1500,to:3800,gain:.32});this.tone(t,140,.2,{type:'sine',to:58,gain:.44});this.noise(t+.02,.22,{freq:2100,to:650,q:1.6,gain:.13});},
    fxResImpact(t){this.tone(t,82,.42,{type:'sine',to:40,gain:.5});this.noise(t,.3,{type:'lowpass',freq:1600,to:300,gain:.32});[0,.085,.17].forEach((d,i)=>this.tone(t+d,170-i*12,.55,{type:'sine',to:122-i*8,gain:.17-i*.035}));},
    fxResTick(t){[0,.16].forEach((d,i)=>this.tone(t+d,165,.36,{type:'sine',to:128,gain:.11-i*.03}));this.noise(t,.3,{freq:500,to:260,q:2,gain:.06});}
  };
  if (typeof ND_SFX_FALLBACK !== 'undefined' && ND_SFX_FALLBACK.recipes) { Object.assign(ND_SFX_FALLBACK.recipes, R); return; }
  // ---- standalone synth (preview page) ----
  const S = {ctx: null, out: null, buf: null, volume: .8, muted: false,
    ensure(){ if (this.ctx) return this.ctx; const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
      const c = this.ctx = new C(); this.out = c.createGain(); this.out.connect(c.destination);
      const len = Math.floor(c.sampleRate * .5); this.buf = c.createBuffer(1, len, c.sampleRate); const d = this.buf.getChannelData(0); let s = 1;
      for (let i = 0; i < len; i++) { s = (s * 16807) % 2147483647; d[i] = s / 1073741823.5 - 1; } return c; },
    tone(t,freq,dur,{type='sine',gain=.3,to=null}={}){const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur);
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(this.out);o.start(t);o.stop(t+dur+.02);},
    noise(t,dur,{gain=.3,type='bandpass',freq=2000,q=.8,to=null}={}){const c=this.ctx,src=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();src.buffer=this.buf;f.type=type;f.frequency.setValueAtTime(freq,t);if(to)f.frequency.exponentialRampToValueAtTime(to,t+dur);f.Q.value=q;
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+dur);src.connect(f);f.connect(g);g.connect(this.out);src.start(t);src.stop(t+dur+.02);},
    play(name){ const r = R[name]; if (!r || this.muted) return; const c = this.ensure(); if (!c) return;
      const go = () => { this.out.gain.value = this.volume; try { r.call(this, c.currentTime + .01); } catch (e) {} };
      c.state === 'running' ? go() : c.resume().then(go).catch(() => {}); }
  };
  window.NDSkillSfx = S;
  if (typeof window.playSfx !== 'function') window.playSfx = name => S.play(name);
})();
