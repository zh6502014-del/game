const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../../..');
const prefix='../../../';
const styles=[...fs.readFileSync(path.join(root,'Nightfall-Duel-Story.html'),'utf8').matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(m=>m[1].split('?')[0]);
const page=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>文件庫美術素材預覽</title>${styles.map(s=>`<link rel="stylesheet" href="${prefix}${s}">`).join('')}<link rel="stylesheet" href="materials.css"><style>body{margin:0;background:#080e0f;font-family:system-ui;color:#ece3ce}.preview-intro{max-width:900px;margin:36px auto;padding:24px}.preview-intro h1{font-size:24px}.preview-intro button{font:inherit;padding:12px 20px;background:#294033;color:#ead9b3;border:1px solid #9d865b;border-radius:4px;cursor:pointer}.preview-intro p{line-height:1.8}.preview-intro a{color:#d5b77b}</style></head><body><div class="preview-intro"><h1>文件庫美術素材預覽</h1><p>新卷宗封皮、正文紙材與批註紙材。使用當前閱讀元件與獨立測試資料，不載入正式章節與存檔。</p><button id="launch" type="button">開啟文件庫</button><p>卷宗 0426 展示正文與王室附頁；0428 展示批註紙材。其他卷宗沿用目前閱讀資料。</p><a href="../HANDOFF.md">素材與交接說明</a></div><script src="${prefix}story-search-assets.js"></script><script src="${prefix}story-search.js"></script><script>
window.previewEvents={collected:[],completed:0,cancelled:0};
// Registry asset paths are relative to the game root; this demo lives three levels below it.
for(const prop of Object.values(NDStorySearchAssets.props))if(prop.path?.startsWith('assets/'))prop.path='../../../'+prop.path;
for(const scene of Object.values(NDStorySearchAssets.scenes))if(scene.background?.path?.startsWith('assets/'))scene.background.path='../../../'+scene.background.path;
const params=new URLSearchParams(location.search);
if(params.get('material')==='old')document.querySelector('link[href="materials.css"]').remove();
else NDStorySearchAssets.props['archive-folder'].path='../folder/runtime/archive-folder-v2.webp';
function launchArchive(){NDStorySearch.open('archive-vault',{targetIds:['sealed-order'],items:[{id:'sealed-order',label:'運送紀錄',text:'件號 0426。測試品、暮晶與實驗物資，全數運往迪普霍姆。各箱依封條上的件號交接；抵達礦區後，交由現地值守人員點收。收件項目與來信相符。'}],trigger:document.querySelector('#launch'),onCollect:id=>previewEvents.collected.push(id),onComplete:()=>previewEvents.completed++,onCancel:()=>previewEvents.cancelled++});}
document.querySelector('#launch').addEventListener('click',launchArchive);
if(params.has('auto'))launchArchive();
</script></body></html>`;
fs.writeFileSync(path.join(__dirname,'index.html'),page);
fs.writeFileSync(path.join(__dirname,'source-styles.json'),JSON.stringify(styles,null,2)+'\n');
console.log('Preview built from '+styles.length+' current production styles.');
