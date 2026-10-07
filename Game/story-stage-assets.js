/* Reusable stage compositions. Stable story steps still own actions and progress. */
(()=>{
 'use strict';
 const backgrounds={
  hall:{path:'assets/characters/nightfall-hall.webp',title:'石造通道'},
  lab:{path:'assets/story/backgrounds/lab.webp',title:'曜火研究室'},
  shelter:{path:'assets/story/backgrounds/shelter.webp',title:'藏身處'},
  tower:{path:'assets/story/backgrounds/tower.webp',title:'鐘樓內部'},
  road:{path:'assets/story/backgrounds/road.webp',title:'城外舊路'},
  archiveOuter:{path:'assets/story/complete-020/backgrounds/c4-outer.webp',title:'文件庫外廊'},
  archiveHall:{path:'assets/story/complete-020/backgrounds/c4-archive.webp',title:'行政文件庫'},
  archiveInner:{path:'assets/story/complete-020/backgrounds/c4-inner.webp',title:'文件庫內庫'},
  chiwuOutside:{path:'assets/story/complete-020/backgrounds/a3-chiwu-outside.webp',title:'尺烏據點門外'},
  mine:{path:'assets/story/complete-020/backgrounds/bg-deepholm-mine.webp',title:'迪普霍姆礦坑'},
  mineLab:{path:'assets/story/complete-020/backgrounds/bg-mine-lab.webp',title:'礦坑深處'},
  royalControl:{path:'assets/story/complete-020/backgrounds/royal-control.webp',title:'王室控制室'},
  royalControlH1:{path:'assets/story/complete-020/backgrounds/royal-control-h1.webp',title:'王室控制室'},
  bossHall:{path:'assets/story/complete-020/backgrounds/boss-hall-interior.webp',title:'尺烏基地內部'},
  // Location keys that continuation() already asks for (F2-*, F3-*, G1 step 10+). They were never defined, so those
  // scenes had no background path, failed to decode, and the stage kept the previous frame with no characters on it.
  table:{path:'assets/story/complete-020/backgrounds/g1-table.webp',title:'紀錄室長桌'},
  // STORY-SCENES-029: five location plates that replace borrowed generic backgrounds.
  makuStreet:{path:'assets/story/scenes-029/maku-street.webp',title:'暮城入口街道'},
  bellStairs:{path:'assets/story/scenes-029/bell-stairs.webp',title:'鐘樓維修階梯'},
 };
 const names={rin:'凜','rin-wounded':'凜',shuo:'朔','shuo-young':'朔','shuo-wounded':'朔',gran:'格蘭','gran-young':'格蘭',eve:'伊芙','eve-armed':'伊芙',phosphor:'磷',father:'納爾瓦','father-young':'納爾瓦',herman:'赫爾曼',ito:'伊藤',boss:'尺烏首腦',louis:'路易斯'};
 const matchesSpeaker = (actor, speaker) => actor.name === speaker || (actor.id === 'father' && speaker === '父親') || (actor.id === 'father-young' && speaker === '鳴者');
 const actors=Object.fromEntries(Object.entries(names).map(([id,name])=>[id,{id,name,path:`assets/story/actors/${id}.webp`}]));
 for(const id of ['father','father-young'])actors[id].path=`assets/story/actors/narva-025/${id}.webp`;
 actors['father-wounded']={id:'father-wounded',name:'納爾瓦',path:'assets/story/actors/narva-025/father-wounded.webp'};
 // A frame identifies a narrative beat, not a new bitmap. Locations and cast are shared.
 const stage=(background,cast,art)=>({background,cast,art});
 const layouts={
  // A1 carries the former A2 as frames 3-5.
  A1:[stage('hall',['rin','boss']),stage('hall',['rin']),stage('lab',['rin','herman']),stage('lab',['rin','herman']),stage('lab',[],'assassin-resonance'),stage('hall',['rin-wounded'])],
  A3:[stage('road',['rin-wounded']),stage('hall',[],'assassin-home'),stage('road',['rin-wounded'])],
  S1:[stage('tower',['shuo-young','father-young']),stage('tower',[],'swordsman-bookmark'),stage('tower',['shuo-young','father-young'])],
  S2:[stage('tower',['father-young','shuo-young']),stage('tower',[],'swordsman-records'),stage('tower',['father-young','shuo-young'])],
  S3:[stage('tower',['shuo-young','ito','father-young']),stage('tower',[],'swordsman-master'),stage('hall',['shuo-wounded'])],
  T1:[stage('road',['gran-young']),stage('road',[],'tank-bell'),stage('road',['gran-young'])],
  T2:[stage('road',['gran-young']),stage('road',[],'tank-return'),stage('road',['gran-young'])],
  T3:[stage('road',['gran-young']),stage('road',[],'tank-shield'),stage('road',['gran-young'])],
  E1:[stage('lab',['eve','herman']),stage('lab',[],'gunner-echo'),stage('lab',['eve','herman'])],
  E2:[stage('lab',['eve','herman']),stage('lab',[],'gunner-basement'),stage('lab',['eve'])],
  E3:[stage('lab',['eve']),stage('lab',['eve-armed']),stage('lab',[],'gunner-first-shot')],
  P1:[stage('road',['father-young']),stage('road',[],'p1-morwell-ruins'),stage('road',[],'p1-morwell-ruins')],
  P2:[stage('road',['father','phosphor']),stage('road',[],'phosphor-memory'),stage('shelter',['father','phosphor'])],
  P3:[stage('road',['father','phosphor']),stage('road',[],'phosphor-files'),stage('shelter',['father','phosphor'])],
  P4:[stage('shelter',['father','phosphor']),stage('shelter',[],'phosphor-parting'),stage('road',['phosphor'])],
  B1:[stage('road',['gran','phosphor']),stage('road',[],'tank-refusal'),stage('road',['gran','phosphor'])],
  B2:[stage('shelter',['gran','phosphor']),stage('shelter',[],'swordsman-return'),stage('shelter',['shuo','phosphor','gran'])],
  B3:[stage('hall',['rin-wounded']),stage('road',[],'assassin-trail'),stage('road',['rin-wounded','phosphor'])],
  C1:[stage('shelter',['shuo','phosphor','gran']),stage('shelter',[],'party-arrival'),stage('shelter',['eve','phosphor','shuo','gran'])],
  C2:[stage('shelter',['eve','phosphor','gran']),stage('shelter',[],'gunner-stop'),stage('shelter',['eve','phosphor'])],
  C3:[stage('shelter',['shuo','eve','gran','phosphor']),stage('road',[],'party-rescue'),stage('shelter',['rin-wounded','phosphor'])],
  C4:[stage('shelter',['phosphor','rin-wounded','eve']),stage('archiveHall',['rin-wounded','eve','shuo']),stage('shelter',[],'party-orders')],
  C5:[stage('shelter',['eve-armed','rin-wounded']),stage('shelter',[],'party-gun'),stage('shelter',[],'party-gun')],
  C6:[stage('shelter',[],'party-gun'),stage('shelter',[],'party-stay'),stage('shelter',['eve-armed','rin-wounded','phosphor','gran'])],
  C7:[stage('road',['gran','phosphor','shuo','eve-armed','rin-wounded']),stage('road',['gran','phosphor','shuo','eve-armed','rin-wounded']),stage('road',['gran','phosphor','shuo','eve-armed','rin-wounded'])],
  C8:[stage('shelter',['eve','phosphor','shuo','gran','rin-wounded']),stage('shelter',[],'party-zone'),stage('shelter',['phosphor','eve'])],
  C9:[stage('road',['shuo','rin-wounded','eve','phosphor','gran']),stage('road',['phosphor','eve']),stage('road',['gran','shuo','rin-wounded','eve','phosphor'])]
 };
 // STORY-REWRITE-050: scenes for the rewritten chapters (frames as laid out in story-chapters.js).
 Object.assign(layouts,{
  A1:[stage('hall',['rin','boss']),stage('lab',['eve','herman']),stage('lab',['rin','herman']),stage('lab',['rin','herman']),stage('lab',[],'assassin-resonance'),stage('hall',['rin-wounded'])],
  S1:[...layouts.S1,stage('tower',[])],
  P3:[stage('road',['father','phosphor']),stage('road',[],'phosphor-parting'),stage('road',['phosphor'])],
  P4:[stage('road',['phosphor'])],
  B1:[stage('road',['shuo','phosphor']),stage('road',[],'swordsman-return'),stage('road',['gran','shuo','phosphor'])],
  B2:[stage('makuStreet',['shuo','phosphor'])],
  C4:[stage('archiveHall',['shuo','phosphor']),stage('archiveHall',['eve-armed','phosphor','shuo']),stage('archiveOuter',['eve-armed','shuo','phosphor']),stage('archiveInner',[],'c4-inner-vault')],
  C5:[stage('archiveHall',['eve-armed','rin-wounded','phosphor','shuo']),stage('road',['phosphor','rin-wounded','eve-armed','shuo'])],
  C8:[stage('hall',['shuo','phosphor','eve-armed','rin-wounded']),stage('hall',['eve-armed','phosphor','shuo','rin-wounded'])],
  C9:[stage('hall',['rin-wounded','eve-armed','shuo','phosphor']),stage('hall',['father-wounded','phosphor','shuo','eve-armed','rin-wounded']),stage('hall',['gran','shuo','eve-armed','rin-wounded']),stage('hall',['gran','eve-armed','shuo','rin-wounded'])]
 });
 const artById=new Map(window.NDStoryArt.scenes.map(scene=>[scene.id,scene]));
 // A voice label describes the current line; it never adds a person to the scene.
 function speakerPresentation(step,scene={}){
  const prompts={inspect:'調查',search:'尋物',action:'行動',puzzle:'拼合',task:'查證與接力',route:'撤離路線',battle:'戰鬥目標',choice:'選擇',complete:'收錄'};
  if(step.type!=='dialogue')return {name:step.type==='narration'?'旁白':step.type==='choice'?'你的選擇':step.type==='complete'?'記憶收錄':'當前任務',kind:step.type==='narration'?'narration':'task',label:step.type==='narration'?'敘述':prompts[step.type]||'提示',actorId:null};
  if(step.speaker==='納爾瓦的錄音'||step.speaker==='父親的錄音')return {name:'納爾瓦',kind:'recording',label:'錄音',actorId:null};
  if(step.speaker==='赫爾曼的信')return {name:'赫爾曼',kind:'offscreen',label:'信',actorId:null};
  if(step.speaker==='暮晶中的聲音')return {name:step.speaker,kind:'echo',label:'殘響',actorId:null};
  if(step.speaker==='未來磷'&&!(scene.actors||[]).some(person=>person.name==='未來磷'))return {name:'未來磷',kind:'dialogue',label:'成年磷 · 對話',actorId:null};
  const actor=(scene.actors||[]).find(person=>matchesSpeaker(person,step.speaker)||(step.speaker==='納爾瓦'&&person.id.startsWith('father')));
  // An illustration can depict the speaker without a separate actor layer.
  const offscreen=scene.kind==='layered'&&!actor;
  return {name:step.speaker||'未具名聲音',kind:offscreen?'offscreen':'dialogue',label:offscreen?'畫外音':'對話',actorId:actor?.id||null};
 }
 // New rescue scenes stay neutral until the narrated event has actually occurred.
 // Optional art from 020 is accepted only by explicit actor identity; chapter posters
 // are not used here because a fixed poster can reveal injuries or reunions early.
 function continuation(nodeId, step) {
  const chapter = window.NDStoryChapters?.find(item => item.id === nodeId);
  if (!chapter) return null;
  // Full-frame illustrations (STORY-ART-020) for the beats they depict; positions are 1-based step numbers.
  // STORY-CONDENSE-026: the warning/commission scene (f1) now closes D7; F4/H1 ranges follow the condensed step lists.
  const shots = { D2: [[1, 11, 'd2-reunion', '中繼站外的重逢']], D7: [[9, 18, 'f1', '警告與王室委託']], F4: [[7, 13, 'f4', '鐘聲暫歇']], G1: [], H1: [[16, 17, 'h1-louis-showdown', '與路易斯決戰']] };
  const position = (window.NDStoryPerformances?.[nodeId]?.steps || []).findIndex(item => item.id === step.id) + 1;
  const shot = step.royalCutaway ? null : (shots[nodeId] || []).find(([from, to]) => position >= from && position <= to);
  if (shot) return { id: `${nodeId}:${step.id}:illustration`, kind: 'illustration', background: { id: shot[2], path: ['d2-reunion','f1'].includes(shot[2]) ? `assets/story/narva-025/${shot[2]}.webp` : `assets/story/complete-020/chapters/${shot[2]}.webp`, title: shot[3] }, actors: [], title: shot[3] };
  const supplied = window.NDStoryChapterArt || {};
  const frame = step.frame;
  const castByNode = {
   D2: ['phosphor', 'eve', 'gran', 'shuo', 'rin-wounded', 'father'],
   D3: ['phosphor', 'father', 'rin-wounded', 'shuo', 'gran'],
   D4: ['phosphor', 'eve', 'gran', 'shuo', 'rin-wounded'],
   D5: ['phosphor', 'eve', 'shuo'], D6: ['phosphor', 'eve', 'gran', 'shuo', 'rin-wounded'],
   D7: ['phosphor', 'gran', 'eve'], F1: ['phosphor', 'eve', 'rin-wounded', 'shuo', 'gran'],
      F4: ['phosphor', 'eve', 'gran', 'shuo', 'rin-wounded'], G1: ['father-wounded', 'eve', 'gran', 'shuo', 'rin-wounded', 'phosphor'],
      H1: ['eve', 'father', 'gran', 'shuo', 'rin-wounded', 'phosphor']
  };
  let people = (step.royalCutaway ? [] : castByNode[nodeId] || []).map(id => ({ ...actors[id] }));
  const extra = id => {
   const asset = supplied.actors?.[id];
   return asset?.path ? { id, path: asset.path, name: id.startsWith('phosphor-future') ? '未來磷' : '納爾瓦' } : null;
  };
  // Adults without delivered portraits remain named dialogue, never borrowed faces.
  if (step.speaker === '未來磷') {
   const actor = extra(['D6','D7','F1','F4'].includes(nodeId) ? 'phosphor-future-tired' : 'phosphor-future') || extra('phosphor-future');
   if (actor) people.push(actor);
  }
  if (step.speaker === '納爾瓦' && ['D7','F1','F4'].includes(nodeId)) {
   const actor = extra('father-wounded'); if (actor) people.push(actor);
  }
  let active = people.find(person => matchesSpeaker(person, step.speaker) || (step.speaker === '納爾瓦' && person.id === 'father'));
  let visible = people.slice(0, 2);
  if (active && !visible.includes(active)) visible = [visible[0], active];
  // STORY-H1-LOUIS-044: from the moment Louis walks out of the console (H1 step 5) until the fight he is on screen, opposite whoever is speaking
  // (Eve unless a party member speaks). He does not return after the fight; the illustration shots (15-16) already show him.
  const h1No = Number(step.id.split('-').at(-1));
  if (nodeId === 'H1' && !step.royalCutaway && h1No >= 5 && h1No <= 17) {
   const louis = { ...actors.louis };
   const partySide = active && active.id !== 'louis' ? active : (people.find(person => person.id === 'eve') || people[0]);
   people.push(louis);
   visible = [partySide, louis];
   if (step.speaker === louis.name) active = louis;
  }
  visible = visible.filter(Boolean).map((person, index) => ({ ...person, active: person === active, position: visible.length === 1 ? 'center' : index ? 'right' : 'left' }));
  // Relay-station chapters use the delivered relay locations (STORY-ART-020) instead of generic hall/road.
  const stepNo = Number(step.id.split('-').at(-1));
  const relayKey = { D3: 'relay-interior', D4: 'relay-interior', D5: 'relay-interior', D6: 'relay-interior', D7: 'relay-aid' }[nodeId]
   || (nodeId === 'D2' && step.id.startsWith('D2-step-') && stepNo >= 7 ? 'relay-exterior' : null);
  const relayBg = !step.royalCutaway && relayKey ? supplied.backgrounds?.[relayKey] : null;
  // F2/F3 continue inside F1/F4's step list under their own id prefix; G1's post-shot table talk (step 10+) shares the same room as the g1 illustration.
  const locationKey = !step.royalCutaway ? (nodeId === 'H1' ? 'royalControlH1'
   : step.id.startsWith('F1-') ? 'makuStreet'
   : step.id.startsWith('F2-') ? 'dispatch' : step.id.startsWith('F3-') ? 'ramp'
   : (nodeId === 'F4' && step.id.startsWith('F4-')) || (nodeId === 'G1' && stepNo === 1) ? 'ramp'
   : nodeId === 'G1' && stepNo >= 10 ? 'table'
   : nodeId === 'D3' ? 'relayGuardroom'
   : nodeId === 'D5' || nodeId === 'D6' ? 'relayPower' : null) : null;
  const bg = locationKey ? { id: locationKey, ...backgrounds[locationKey] } : relayBg?.path ? { id: relayKey, path: relayBg.path, title: relayBg.title } : backgrounds[step.royalCutaway ? 'royalControl' : chapter.background];
  return { id: `${nodeId}:${step.id}:continuation`, kind: 'layered', background: { ...bg }, actors: visible, title: chapter.title };
 }
 function resolve(nodeId,step){
  // A merged chapter keeps each beat's original scene layout, addressed by the id prefix of its steps.
  {const home=String(step.id).split('-')[0],m=window.NDStoryMergedNodes?.[home];if(m&&m.into===nodeId){nodeId=home;step={...step,frame:step.frame-m.offset};}}
  // H2「硬幣」: every beat is a full-frame illustration (its performance frame), no layered cast.
  if(nodeId==='H2')return null;
  // STORY-REWRITE-050-ART: step-level illustrations for the rewritten storyline.
  const REWRITE_ART={
  'S1-prologue-01':'prologue-vesperland',
  'S1-prologue-02':'prologue-vesperland',
  'S1-prologue-03':'prologue-nightfall',
  'S1-prologue-04':'prologue-nightfall',
  'S1-prologue-05':'prologue-bell-prayer',
  'S1-prologue-06':'prologue-bell-prayer',
  'S1-prologue-07':'prologue-bell-prayer',
  'A1-step-05-b':'a1-eve-storms-out',
  'A1-step-05-c':'a1-eve-storms-out',
  'A1-step-05-d':'a1-eve-storms-out',
  'A1-step-05-e':'a1-eve-storms-out',
  'E3-step-00-a':'e3-lab-safe',
  'E3-step-00-b':'e3-lab-safe',
  'E3-step-00-c':'e3-lab-safe',
  'E3-step-00-d':'e3-lab-safe',
  'E3-step-00-e':'e3-lab-safe',
  'E3-step-00-f':'e3-letter',
  'E3-letter-a':'e3-letter',
  'E3-letter-b':'e3-letter',
  'E3-letter-c':'e3-letter',
  'E3-letter-d':'e3-letter',
  'E3-letter-e':'e3-letter',
  'E3-letter-f':'e3-letter',
  'E3-step-08-b':'e3-rin-rooftop',
  'P3-r10':'farewell-outskirts',
  'P3-r11':'farewell-outskirts',
  'P3-r12':'farewell-outskirts',
  'P3-r13':'farewell-outskirts',
  'P3-r14':'farewell-outskirts',
  'P3-r15':'farewell-outskirts',
  'P3-r16':'farewell-outskirts',
  'B1-r01':'b1-shuo-wolves',
  'B1-r02':'b1-shuo-wolves',
  'B1-r03':'b1-shuo-wolves',
  'B1-r04':'b1-shuo-wolves',
  'B1-r05':'b1-shuo-aftermath',
  'B1-r06':'b1-shuo-aftermath',
  'B1-r07':'b1-shuo-aftermath',
  'B1-r08':'b1-shuo-aftermath',
  'B2-r02':'b2-city-bookmark',
  'B2-r03':'b2-city-bookmark',
  'B2-r04':'b2-city-bookmark',
  'B2-r05':'b2-city-bookmark',
  'B2-r06':'b2-city-bookmark',
  'B2-r07':'b2-city-bookmark',
  'B2-r08':'b2-city-bookmark',
  'B2-r09':'b2-city-bookmark',
  'B2-r10':'b2-city-bookmark',
  'B2-r11':'b2-city-bookmark',
  'B2-r12':'b2-city-bookmark',
  'B2-r13':'b2-city-bookmark',
  'C4-r03':'c4-archive-meeting',
  'C4-r04':'c4-archive-meeting',
  'C4-r05':'c4-archive-meeting',
  'C4-r06':'c4-archive-meeting',
  'C4-r07':'c4-archive-meeting',
  'C4-r08':'c4-archive-meeting',
  'C4-r09':'c4-archive-meeting',
  'C4-r10':'c4-archive-meeting',
  'C4-r11':'c4-archive-meeting',
  'C4-r13':'c4-archive-meeting',
  'C4-r14':'c4-archive-meeting',
  'C4-r15':'c4-archive-meeting',
  'C4-r20':'c4-rin-joins',
  'C5-r01':'c5-eve-gun-rin',
  'C5-r02':'c5-eve-gun-rin',
  'C5-r03':'c5-eve-gun-rin',
  'C5-r04':'c5-eve-gun-rin',
  'C5-r05':'c5-eve-gun-rin',
  'C5-r06':'c5-eve-gun-rin',
  'C5-r07':'c5-eve-gun-rin',
  'C5-r08':'c5-eve-gun-rin',
  'C5-r09':'c5-eve-gun-rin',
  'C5-r10':'c5-eve-gun-rin',
  'C5-r11':'c5-eve-gun-rin',
  'C5-r12':'c5-eve-gun-rin',
  'C5-r13':'c5-eve-gun-rin',
  'C5-r14':'c5-eve-gun-rin',
  'C5-r15':'c5-eve-gun-rin',
  'C5-r16':'c5-eve-gun-rin',
  'C8-r06':'mine-recorder',
  'C8-r07':'mine-recorder',
  'C8-r08':'mine-recorder',
  'C8-r09':'mine-recorder',
  'C8-r10':'mine-recorder',
  'C8-r11':'mine-recorder',
  'C8-r12':'mine-recorder',
  'C8-r13':'mine-recorder',
  'C8-r14':'mine-recorder',
  'C9-r06':'mine-narva-wounded',
  'C9-r07':'mine-narva-wounded',
  'C9-r08':'mine-narva-wounded',
  'C9-r09':'mine-narva-wounded',
  'C9-r10':'mine-narva-wounded',
  'C9-r11':'mine-narva-wounded',
  'C9-r12':'mine-narva-wounded',
  'C9-r13':'mine-narva-wounded',
  'C9-r14':'mine-narva-wounded',
  'C9-r15':'mine-narva-wounded',
  'C9-r18':'mine-gran-last-stand',
  'C9-r19':'mine-gran-last-stand',
  'C9-r20':'mine-gran-last-stand',
  'C9-r21':'mine-gran-last-stand',
  'C9-r22':'mine-gran-last-stand',
  'C9-r23':'mine-gran-last-stand',
  'C9-r24':'mine-griffin-battle',
  'C9-r25':'mine-griffin-battle',
  'C9-r01':'c9-abyss-clash',
  'C9-r02':'c9-abyss-clash',
  'C9-r03':'c9-abyss-clash',
  'C9-r04':'c9-abyss-clash',
  'C9-r05':'c9-abyss-clash',
  'P1-step-04':'p1-morwell-ruins',
  'P1-step-05':'p1-morwell-ruins',
  'P1-step-06':'p1-morwell-ruins',
  'P1-step-07':'p1-morwell-ruins',
  'P1-step-08':'p1-morwell-ruins',
  'P3-r01':'p3-notice-board',
  'P3-r02':'p3-notice-board',
  'P3-r03':'p3-notice-board',
  'P3-r04':'p3-notice-board',
  'P3-r05':'p3-notice-board',
  'A2-step-04':'a2-herman-recoil',
  'A2-step-05':'a2-herman-recoil',
  'A2-step-06':'a2-herman-recoil',
  'A1-step-06':'assassin-lab',
  'A1-step-07':'assassin-lab',
  'A1-step-08':'assassin-lab',
  'A3-step-07-b':'assassin-trail',
  'E2-step-01':'gunner-sealed',
  'E2-step-02':'gunner-sealed',
  'E2-step-03':'gunner-sealed',
  'E2-argue-01':'gunner-sealed',
  'E2-argue-02':'gunner-sealed',
  'E2-argue-03':'gunner-sealed',
  'E2-step-04':'gunner-sealed',
  'H1-r18':'h1-louis-fallen',
  'B1-r13':'tank-refusal',
  'B1-r14':'tank-refusal',
  'B1-r15':'tank-refusal',
  'B1-r16':'tank-refusal',
  'B1-r17':'tank-refusal',
  'G1-r02':'truth-table',
  'G1-r03':'truth-table',
  'G1-r04':'truth-table',
  'G1-r05':'truth-table',
  'G1-r06':'truth-table',
  'G1-r07':'truth-table',
  'G1-r08':'truth-table',
  'G1-r09':'truth-table',
  'G1-r10':'truth-table',
  'G1-r11':'truth-table',
  'G1-r12':'truth-table',
  'G1-r13':'truth-table',
  'G1-r14':'truth-table',
  'G1-r15':'truth-table',
  'G1-r16':'truth-table'
  };
  // SCENE-AUDIT-20261005: lines whose picture did not match who is present or where they are.
  Object.assign(REWRITE_ART,{'E2-argue-04':'a1-eve-storms-out','E2-argue-04-b':'a1-eve-storms-out','C9-r26':'mine-griffin-battle','B1-r09':'b1-soldiers-arrive','C4-r16':'c4-outer-blockade','C4-r17':'c4-outer-blockade','C4-r18':'c4-outer-blockade','C4-r19':'c4-outer-blockade','C9-r15-b':'mine-narva-wounded'});
  const STAGE_FIX={
   'B1-r18':['road',['shuo','phosphor']],
   'A3-step-01':['chiwuOutside',['rin-wounded']],
   'A3-step-02':['chiwuOutside',['rin-wounded']],
   'A3-step-06':['chiwuOutside',['rin-wounded']],
   'C9-r17':['mineLab',['shuo','rin-wounded']],
   'G1-r01':['table',['father-wounded','gran']],
   'G1-r17':['table',['father-wounded','phosphor']],
   'G1-r18':['table',['father-wounded','phosphor']],
   'H1-r01':['bellStairs',['father','eve']]
  };
  if(STAGE_FIX[step.id]){const [bgKey,cast]=STAGE_FIX[step.id],speaker=step.type==='dialogue'?cast.find(id=>matchesSpeaker(actors[id],step.speaker)):null;const portraits=cast.map((id,index)=>({...actors[id],position:cast.length===1?'center':index?'right':'left',active:id===speaker}));const bg={id:bgKey,...backgrounds[bgKey]};return {id:`${nodeId}:${step.id}:${cast.join('+')}`,kind:'layered',background:bg,actors:portraits,title:bg.title};}
  {const mapped=REWRITE_ART[step.id],image=mapped&&artById.get(mapped);if(image)return {id:`${nodeId}:${step.id}:${mapped}`,kind:'illustration',background:{...image},actors:[],title:image.title};}
  const nextScene=continuation(nodeId,step);if(nextScene)return nextScene;
  const search=window.NDStorySearchAssets?.scenes[step.searchScene];
  if(search){
   const covers=search.covers||[],covered=new Set(covers.flatMap(p=>p.targets));
   // The story stage uses the same closed covers as the searching surface.
   // Only the recorder explicitly brought onto the table may bypass a cover.
   const visible=search.placements.filter(p=>p.decorative||!covered.has(p.id)||(p.id==='recorder'&&step.recorderOnTable));
   const props=visible.map(p=>({...p,...(p.id==='recorder'&&step.recorderOnTable?{x:62,y:45,w:19,h:24}:{}),path:window.NDStorySearchAssets.props[p.prop].path,name:window.NDStorySearchAssets.props[p.prop].label,lit:p.id==='lamp'&&Boolean(step.lampLit),retained:p.id==='recorder'&&Boolean(step.recorderOnTable)}));
   props.push(...covers.map(p=>({...p,path:window.NDStorySearchAssets.props[p.prop].path,name:p.label,decorative:true})));
   return {id:`${nodeId}:${step.id}:search:${Boolean(step.lampLit)}`,kind:'search',background:search.background,actors:[],title:search.title,searchScene:step.searchScene,props};
  }
  const entry=layouts[nodeId]?.[step.frame];
  if(!entry)return null;
  let {background,cast,art}=entry;
  if(nodeId==='C8')background='mine';
  if(nodeId==='C9')background=step.frame<=1?'mine':'mineLab';
  const stepNumber=Number(step.id.split('-').at(-1));
  // STORY-A2-ART-034: A2 steps 4-5 (the shot, the backlash) show the accident illustration; it is only reachable after the battle step, so it never spoils the fight.
  if(nodeId==='S3'&&stepNumber<6&&art==='swordsman-master'){background='tower';cast=['shuo-young'];art=null;}
  // S3 steps 8-10: Shuo drops the gate and leaves down the maintenance stairs.
  if(nodeId==='S3'&&stepNumber>=8)background='bellStairs';
  // C4 steps 11-16: approach and first fight in the outer corridor, before entering the archive hall.
  if(nodeId==='C4'&&stepNumber>=11&&stepNumber<=16){background='archiveOuter';cast=['rin-wounded','eve','shuo'];}
  // C4 steps 26-34: inner-vault guards arrive, second fight and opening the sealed cabinet.
  if(nodeId==='C4'&&stepNumber>=26&&stepNumber<=34)background='archiveInner';
  // C9 step 1 is the plan at the hideout; the rest happens inside the sealed observation zone.
  if(nodeId==='C9'&&stepNumber>=2)background='c9Zone';
  if(nodeId==='C9'&&stepNumber>=14&&stepNumber<=17)art='c9-abyss-emergence';
  if(nodeId==='A1'&&!step.id.startsWith('A2-')&&stepNumber<=4)background='bossHall';
  if(nodeId==='A1'&&step.id.startsWith('A2-')&&stepNumber<=3)art=stepNumber===3?'a2-herman-picks-gun':'a2-lab-standoff'; // STORY-A2-ART-046: step 3 (Herman grabs the unfinished gun) has its own illustration.
  if(nodeId==='E3'&&stepNumber>=5&&stepNumber<=7)art='e3-lab-doorway-block';
  // STORY-C2-ART-048: C2 steps 1-2 (low-intensity test, the fragment surfaces) use the test illustration; step 3 (Gran stops Eve's hand) uses the stop illustration, like step 4.
  if(nodeId==='C2'&&stepNumber<=2)art='c2-stage-1';
  if(nodeId==='C2'&&stepNumber===3)art='gunner-stop';
  if(nodeId==='C3'&&stepNumber>=3&&stepNumber<=4)art='c3-shelter-ambush';
  // STORY-B1-ART-043: the wolf attack (B1 steps 1-2, up to the fight) uses the battle illustration.
  if(nodeId==='B1'&&stepNumber>=1&&stepNumber<=2)art='b1-wolf-battle';
  if(nodeId==='C4'&&stepNumber>=13&&stepNumber<=16)art='c4-outer-corridor';
  if(nodeId==='C4'&&stepNumber>=27&&stepNumber<=32)art='c4-inner-vault';
  if(nodeId==='A3'&&stepNumber===7)art='a3-treason-notice';
  if(nodeId==='C6'&&stepNumber===4){background='shelter';cast=['phosphor','gran'];art=null;}
  // After the news of his death, Herman must not remain physically present.
  if(nodeId==='E2'&&Number(step.id.split('-').at(-1))>=5)cast=['eve'];
  if(art){const image=artById.get(art);return {id:`${nodeId}:${step.frame}:${art}`,kind:'illustration',background:{...image},actors:[],title:image.title};}
  const speaker=step.type==='dialogue'?cast.find(id=>matchesSpeaker(actors[id],step.speaker)):null;
  // Frame the current exchange with at most two people, rather than crowding mobile screens.
  let visible=cast.slice(0,2);
  if(speaker&&!visible.includes(speaker))visible=[visible[0],speaker];
  const portraits=visible.map((id,index)=>({...actors[id],position:visible.length===1?'center':index?'right':'left',active:id===speaker}));
  const bg={id:background,...backgrounds[background]};
  return {id:`${nodeId}:${step.frame}:${portraits.map(p=>p.id).join('+')}`,kind:'layered',background:bg,actors:portraits,title:bg.title};
 }
 // Guarantee: whoever speaks on a layered scene is drawn on screen, whenever a portrait exists for them.
 // (Characters with no portrait art, e.g. 路易斯 or unnamed townspeople, stay a labelled off-screen voice.)
 const resolveScene=resolve;
 function resolveWithSpeaker(nodeId,step){
  const scene=resolveScene(nodeId,step);
  if(!scene||scene.kind!=='layered'||step.type!=='dialogue'||!step.speaker)return scene;
  const shown=scene.actors||[];
  if(shown.some(person=>person.name===step.speaker||matchesSpeaker(person,step.speaker)||(step.speaker==='納爾瓦'&&person.id.startsWith('father'))))return scene;
  const ids=Object.keys(actors).filter(id=>actors[id].name===step.speaker);
  if(!ids.length)return scene;
  const id=ids.find(item=>!/-(young|armed)$/.test(item))||ids[0];
  const keep=shown.length<2?shown:[shown[0]];
  const people=[...keep,actors[id]].map((person,index,all)=>({...person,position:all.length===1?'center':index?'right':'left',active:person.id===id}));
  return {...scene,id:`${scene.id}+${id}`,actors:people};
 }
 window.NDStageAssets={backgrounds,actors,layouts,resolve:resolveWithSpeaker,speakerPresentation};
})();
