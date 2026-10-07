const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
const sharp=require('/Users/songer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const sources={
 'archive-paper-ivory':'/Users/songer/.codex/generated_images/01a10176-2ff3-71f0-85f9-897e2e91133a/exec-831285d7-3637-4c00-affe-4f58b4d2264a.png',
 'archive-paper-note':'/Users/songer/.codex/generated_images/01a10176-2ff3-71f0-85f9-897e2e91133a/exec-32d29874-ad87-4b96-a14a-cd3ad4f8f71d.png'
};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const prompts=JSON.parse(await fs.readFile(path.join(__dirname,'prompts.json'),'utf8'));
 await fs.mkdir(path.join(__dirname,'originals'),{recursive:true});
 await fs.mkdir(path.join(__dirname,'runtime'),{recursive:true});
 const entries=[];
 for(const entry of prompts){
  const original=await fs.readFile(sources[entry.id]);
  const sourcePath=path.join(__dirname,'originals',entry.id+'.png');
  await fs.writeFile(sourcePath,original);
  const sm=await sharp(original).metadata();
  const runtime=await sharp(original).resize({width:512,height:512,fit:'inside',withoutEnlargement:true}).webp({quality:85,effort:6}).toBuffer();
  const dest=path.join(__dirname,'runtime',entry.id+'.webp');
  await fs.writeFile(dest,runtime);
  const dm=await sharp(runtime).metadata();
  if(runtime.length>102400)throw Error('Material budget exceeded');
  entries.push({...entry,mode:'built-in image_gen',transparent_background:false,referenced_image_paths:[],source_path:sources[entry.id],
   original:{path:sourcePath,width:sm.width,height:sm.height,bytes:original.length,sha256:sha(original)},
   runtime:{path:dest,width:dm.width,height:dm.height,bytes:runtime.length,sha256:sha(runtime),has_alpha:!!dm.hasAlpha,quality:85,effort:6,fit:'inside'},
   qa:'Generated image inspected: one flat unmarked material tile, no edge silhouette, no writing or objects. Fine grain and subtle fibers, no strong crease/stain. Tiling seam visibility must be assessed in the rendered reader.'});
 }
 await fs.writeFile(path.join(__dirname,'generation.json'),JSON.stringify({task:'ART-ARCHIVE-MATERIALS-055',entries},null,2)+'\n');
 console.log(entries.map(e=>({id:e.id,source:[e.original.width,e.original.height,e.original.bytes],runtime:[e.runtime.width,e.runtime.height,e.runtime.bytes]})));
})().catch(e=>{console.error(e);process.exitCode=1;});
