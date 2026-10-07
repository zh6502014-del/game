/* Fixed, local route-planning interaction for T1. It never changes combat or saves. */
(()=>{
 const scene={
  id:'evac-route',title:'格蘭 · 撤離路線',
  intro:'從街口畫到高地接應處，路線必須經過已勘查通道。這只核對現有資料，不保證撤離永久安全。',
  start:'A5',required:'C3',end:'E1',blocked:new Set(['B1','B2','B4','D1','D2','D4'])
 };
 const columns=['A','B','C','D','E'];
 const cells=columns.flatMap(column=>[1,2,3,4,5].map(row=>column+row));
 const label=id=>id===scene.start?'街口 · 起點':id===scene.required?'已勘查通道':id===scene.end?'高地接應處':scene.blocked.has(id)?'不可通行地段':'可走地段';
 const adjacent=(a,b)=>Math.abs(columns.indexOf(a[0])-columns.indexOf(b[0]))+Math.abs(Number(a[1])-Number(b[1]))===1;
 const valid=path=>path.at(-1)===scene.end&&path.includes(scene.required);
 let active=null;
 function open(id,{onComplete,practice=false,trigger=document.activeElement}={}){
  if(active||id!==scene.id)return null;
  let path=[scene.start],focus=scene.start,closed=false,confirmed=false;
  const dialog=document.createElement('dialog');dialog.className='story-route-dialog sq-dialog';dialog.dataset.sq='route';dialog.dataset.scene=id;
  const cellMarkup=cell=>`<button class="story-route-cell" data-route-cell="${cell}" data-state="${cell===scene.start?'start':cell===scene.required?'required':cell===scene.end?'end':scene.blocked.has(cell)?'blocked':'open'}" aria-label="${cell}，${label(cell)}" ${scene.blocked.has(cell)?'disabled':''}><span>${cell}</span><small>${label(cell)}</small></button>`;
  dialog.innerHTML=`<header><div><p class="sq-eyebrow"><b class="sq-badge">支線</b><span>路線 · 故事互動</span></p><h2>${scene.title}</h2></div><button data-route-close>關閉</button></header><p class="story-route-objective">${scene.intro}</p><div class="story-route-map" role="grid" aria-label="撤離簡圖">${[1,2,3,4,5].map(row=>columns.map(col=>cellMarkup(col+row)).join('')).join('')}</div><p class="story-route-status" role="status"></p><div class="story-route-controls"><button data-route-undo>撤回一步</button><button data-route-reset>重畫路線</button><button data-route-hint>提示下一步</button><button data-route-confirm disabled>確認路線</button></div><details><summary>操作說明</summary><p>點相鄰格延伸路線；點已畫過的格子可退回。只有經過已勘查通道並到達高地接應處，才可確認。不限時，也不扣分。</p></details>`;
  const status=dialog.querySelector('.story-route-status');
  const cell=id=>dialog.querySelector(`[data-route-cell="${id}"]`);
  function announce(text){status.textContent=text;}
  function render(message){
   for(const id of cells){const button=cell(id);button.dataset.path=path.includes(id)?'true':'false';button.dataset.tail=id===path.at(-1)?'true':'false';button.tabIndex=id===focus?0:-1;}
   const ready=valid(path);dialog.querySelector('[data-route-confirm]').disabled=!ready;
   if(message)announce(message);else if(ready)announce('路線已接通：已經過勘查通道並到達高地接應處。確認後繼續劇情。');else announce(`目前路線 ${path.length} 格。${path.includes(scene.required)?'已經過勘查通道。':'仍需經過已勘查通道。'}`);
  }
  function select(id){
   focus=id;
   const at=path.indexOf(id),tail=path.at(-1);
   if(at>=0){path=path.slice(0,at+1);render(`已退回 ${id}，可以改畫後段路線。`);return;}
   if(scene.blocked.has(id)){render(`${label(id)}不能畫入路線。`);return;}
   if(!adjacent(tail,id)){render('只能連接目前尾端相鄰的格子。');return;}
   path.push(id);render();
  }
  function hint(){
   const tail=path.at(-1);let next='';
   if(!path.includes(scene.required)){
    const choices={A5:'A4',A4:'A3',A3:'B3',B3:'C3',B5:'C5',C5:'C4',C4:'C3'};next=choices[tail]||'C3';
    announce(`提示：先想辦法經過「已勘查通道」。${adjacent(tail,next)&&!path.includes(next)?` 可接著畫到 ${next}。`:''}`);
   }else if(tail!==scene.end){
    const choices={C3:'D3',D3:'E3',E3:'E2',E2:'E1'};next=choices[tail]||'E1';announce(`提示：從已勘查通道往高地接應處延伸。${adjacent(tail,next)&&!path.includes(next)?` 可接著畫到 ${next}。`:''}`);
   }else announce('已到達接應處；確認路線即可繼續。');
  }
  dialog.addEventListener('click',event=>{
   if(closed||!dialog.open)return;
   const button=event.target.closest('button');if(!button||button.disabled)return;
   if(button.hasAttribute('data-route-close')){dialog.close();return;}
   if(button.dataset.routeCell){select(button.dataset.routeCell);return;}
   if(button.hasAttribute('data-route-undo')){if(path.length>1){path.pop();focus=path.at(-1);render('已撤回最後一格。');}else render('街口是起點，無法再撤回。');return;}
   if(button.hasAttribute('data-route-reset')){path=[scene.start];focus=scene.start;render('已回到街口，重新規劃。');return;}
   if(button.hasAttribute('data-route-hint')){hint();return;}
   if(button.hasAttribute('data-route-confirm')&&valid(path)&&!confirmed){confirmed=true;announce('路線已確認。');dialog.close('complete');}
  });
  dialog.addEventListener('keydown',event=>{
   if(closed||!dialog.open)return;
   if(event.key==='Escape'){event.preventDefault();dialog.close();return;}
   const current=document.activeElement?.dataset?.routeCell;if(!current)return;
   const x=columns.indexOf(current[0]),y=Number(current[1])-1;const move={ArrowLeft:[x-1,y],ArrowRight:[x+1,y],ArrowUp:[x,y-1],ArrowDown:[x,y+1]}[event.key];
   if(move){event.preventDefault();const target=columns[move[0]]&&(move[1]>=0&&move[1]<5?columns[move[0]]+(move[1]+1):null);if(target&&!scene.blocked.has(target)){focus=target;render();cell(target).focus();}}
  });
  dialog.addEventListener('close',()=>{closed=true;dialog.remove();if(active===dialog)active=null;if(trigger?.isConnected)trigger.focus();if(confirmed&&!practice)onComplete?.();},{once:true});
  document.body.append(dialog);active=dialog;dialog.showModal();render();cell(scene.start).focus();return dialog;
 }
 window.NDStoryRoute={open,scenes:{[scene.id]:{title:scene.title}},spec:{start:scene.start,required:scene.required,end:scene.end,blocked:[...scene.blocked],valid}};
})();
