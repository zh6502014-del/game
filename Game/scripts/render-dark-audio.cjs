#!/usr/bin/env node
/* AUDIO-DARK-051: reproducible local synthesis. No external sound recordings, downloads or musical samples.
 * Requires Playwright and its Chromium (or the bundled runtime's module path).
 * Usage: node scripts/render-dark-audio.cjs
 * OfflineAudioContext renders the SAME recipes as runtime fallback. BGM is a seamless 24s sustained drone.
 */
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
let chromium;try{({chromium}=require('playwright'));}catch(_){({chromium}=require('/Users/songer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));}
const root=path.resolve(__dirname,'..'),out=path.join(root,'assets/audio/dark-051'),source=path.join(root,'source-art/AUDIO-DARK-051'),evidence=path.join(root,'test-results/audio-dark-051');
for(const d of [out,source,evidence])fs.mkdirSync(d,{recursive:true});
const rate=24000;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function wav(samples){
  const b=Buffer.alloc(44+samples.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(samples.length*2,40);
  for(let i=0;i<samples.length;i++)b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),44+i*2);return b;
}
function stats(d){let peak=0,sum=0,dc=0,clip=0;for(const x of d){peak=Math.max(peak,Math.abs(x));sum+=x*x;dc+=x;if(Math.abs(x)>=.999)clip++;}return {peak,rms:Math.sqrt(sum/d.length),dc:dc/d.length,clippedSamples:clip,firstSample:d[0],lastSample:d[d.length-1],edgeJump:Math.abs(d[0]-d[d.length-1])};}
function extractObject(s,start,end){return s.slice(s.indexOf(start),s.indexOf(end,s.indexOf(start)));}
function decodeData(result){const raw=Buffer.from(result,'base64');return new Float32Array(raw.buffer,raw.byteOffset,raw.length/4);}
(async()=>{
 const game=fs.readFileSync(path.join(root,'game.js'),'utf8'),story=fs.readFileSync(path.join(root,'story-battle-sfx.js'),'utf8');
 const prev=JSON.parse(fs.readFileSync(path.join(source,'previous-audio.json'),'utf8'));
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const p=await browser.newPage();
  const prefix='const AUDIO_URLS={},AUDIO_DEFAULTS={},AudioBank={};';
  const current=extractObject(game,'const ND_SFX_FALLBACK={','function ndAudioFailed');
  await p.addScriptTag({content:prefix+current+story+';window.synth=ND_SFX_FALLBACK;'});
  const durations=await p.evaluate(()=>synth.durations),assets=[],data={};
  for(const [name,duration] of Object.entries(durations)){
   const raw=await p.evaluate(async({name,duration,rate})=>{
    const c=new OfflineAudioContext(1,Math.ceil(duration*rate),rate),s=Object.create(synth);
    s.ctx=c;s.bus=c.createGain();s.bus.gain.value=.72;s.bus.connect(c.destination);s.noiseBuf=s.makeNoise(c);s.track=()=>{};
    s.recipes[name].call(s,.01);const b=await c.startRendering(),d=b.getChannelData(0);
    let bytes='';const arr=new Uint8Array(d.buffer);for(let i=0;i<arr.length;i+=16384)bytes+=String.fromCharCode(...arr.subarray(i,i+16384));return btoa(bytes);
   },{name,duration,rate});
   const d=decodeData(raw);data[name]=d;const b=wav(d),m=stats(d);if(m.peak>.84||m.rms<.0001||m.clippedSamples)throw Error(`Bad levels: ${name} ${JSON.stringify(m)}`);
   const file=`assets/audio/dark-051/${name}.wav`;fs.writeFileSync(path.join(root,file),b);assets.push({key:name,path:file,type:'sfx',duration:d.length/rate,bytes:b.length,sha256:sha(b),...m});
  }
  // A single static, slowly breathing low register sonority per mode. All cycles repeat every 24 s.
  const modes={setupBgm:[65.406,98,138.59],bgm:[55,82.407,116.54],resultBgm:[65.406,98,130.813]};
  for(const [name,pitches] of Object.entries(modes)){
   const length=rate*24,d=new Float32Array(length);
   for(let i=0;i<length;i++){
    const t=i/rate;let v=0;
    pitches.forEach((f,j)=>{const q=Math.round(f*24)/24,a=j===0?.23:.08;
      v+=a*Math.sin(2*Math.PI*q*t)*(.83+.17*Math.cos(2*Math.PI*t/24+j));
      v+=a*.22*Math.sin(2*Math.PI*(q+1/24)*t)*(.8+.2*Math.cos(2*Math.PI*t/12));
    });
    d[i]=v;
   }
   const b=wav(d),m=stats(d),file=`assets/audio/dark-051/${name}.wav`;fs.writeFileSync(path.join(root,file),b);assets.push({key:name,path:file,type:'loop',duration:24,bytes:b.length,sha256:sha(b),...m});
  }
  const previewKeys=['cardPickup','cardPlace','cardFlip','hit','shield','gunshot','skillCast','victory','defeat'];
  function preview(name,clips){let at=rate*.25;const d=new Float32Array(Math.ceil(rate*.5+clips.reduce((n,c)=>n+c.length+rate*.22,0)));for(const c of clips){for(let i=0;i<c.length;i++)d[at+i]=c[i]*.7;at+=c.length+rate*.22;}fs.writeFileSync(path.join(evidence,name),wav(d));return d.length/rate;}
  const previewDuration=preview('after-preview.wav',previewKeys.map(k=>data[k]));
  // Capture former synthesized fallback (not former remotely hosted recordings) as an honest before reference.
  const oldPage=await browser.newPage();
  const oldObject=extractObject(prev.bgmAndSfx,'const ND_SFX_FALLBACK={','function ndAudioFailed');
  await oldPage.addScriptTag({content:prefix+oldObject+prev.story+';window.oldSynth=ND_SFX_FALLBACK;'});
  const beforeClips=[];
  for(const name of previewKeys){
   const duration=name==='defeat'?3.5:durations[name];
   const raw=await oldPage.evaluate(async({name,duration,rate})=>{
    const c=new OfflineAudioContext(1,Math.ceil(duration*rate),rate),s=Object.create(oldSynth);s.ctx=c;s.bus=c.createGain();s.bus.connect(c.destination);
    s.noiseBuf=c.createBuffer(1,Math.ceil(rate*.5),rate);const noise=s.noiseBuf.getChannelData(0);let seed=1;for(let i=0;i<noise.length;i++){seed=seed*16807%2147483647;noise[i]=seed/1073741823.5-1;}
    s.recipes[name].call(s,.01);const d=(await c.startRendering()).getChannelData(0),arr=new Uint8Array(d.buffer);let bytes='';for(let i=0;i<arr.length;i+=16384)bytes+=String.fromCharCode(...arr.subarray(i,i+16384));return btoa(bytes);
   },{name,duration,rate});beforeClips.push(decodeData(raw));
  }
  preview('before-fallback-preview.wav',beforeClips);
  const totalBytes=assets.reduce((n,a)=>n+a.bytes,0);if(totalBytes>6*1024*1024)throw Error('Budget exceeded');
  const manifest={ticket:'AUDIO-DARK-051',date:'2026-10-03',origin:'Original deterministic procedural synthesis; no field recordings, third-party samples or downloaded music',license:'Original project-generated assets; no third-party sample license obligations',format:{container:'WAV',encoding:'PCM signed 16-bit little-endian',channels:1,sampleRate:rate},render:{engine:'Chromium OfflineAudioContext (SFX); periodic additive DSP (music)',browserVersion:browser.version(),nodeVersion:process.version,seed:51051,sfxGain:.72,noPerFilePeakNormalization:true},totalBytes,assetCount:assets.length,assets};
  fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  fs.writeFileSync(path.join(source,'generation.json'),JSON.stringify({...manifest,sourceHashes:{'game.js':sha(game),'story-battle-sfx.js':sha(story),'scripts/render-dark-audio.cjs':sha(fs.readFileSync(__filename))},preview:{keys:previewKeys,afterSeconds:previewDuration,before:'Prior synthesized fallback only; not a recording of unavailable remote clips'},listening:'Buffer measurements and browser decode/playback are technical verification; not subjective listening.'},null,2)+'\n');
  console.log(JSON.stringify({assetCount:assets.length,totalBytes,previewDuration,maxPeak:Math.max(...assets.map(a=>a.peak)),minimumRms:Math.min(...assets.map(a=>a.rms))},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
