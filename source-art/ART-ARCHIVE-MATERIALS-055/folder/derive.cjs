const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('/Users/songer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = __dirname;
const generatedSource = '/Users/songer/.codex/generated_images/01a10714-6f17-7940-b502-e69e6ebb7280/exec-8def67b9-d0f5-40d9-96e6-5ca997ff68c4.png';
const original = path.join(root, 'original/archive-folder-v2.png');
const runtime = path.join(root, 'runtime/archive-folder-v2.webp');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
async function inspect(file) {
  const metadata = await sharp(file).metadata();
  const {data, info} = await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const histogram = Array(256).fill(0);
  const bounds = {left:info.width, top:info.height, right:-1, bottom:-1};
  const frameEdges = {top:0, right:0, bottom:0, left:0};
  let interiorAlphaMin = 255;
  let interiorAlphaMax = 0;
  for (let y=0; y<info.height; y++) for (let x=0; x<info.width; x++) {
    const a = data[(y*info.width+x)*4+3];
    histogram[a]++;
    if (x>info.width*.2 && x<info.width*.9 && y>info.height*.2 && y<info.height*.9) {
      interiorAlphaMin=Math.min(interiorAlphaMin,a); interiorAlphaMax=Math.max(interiorAlphaMax,a);
    }
    if (a>10) {
      bounds.left=Math.min(bounds.left,x); bounds.top=Math.min(bounds.top,y);
      bounds.right=Math.max(bounds.right,x); bounds.bottom=Math.max(bounds.bottom,y);
      if (y===0) frameEdges.top++;
      if (x===info.width-1) frameEdges.right++;
      if (y===info.height-1) frameEdges.bottom++;
      if (x===0) frameEdges.left++;
    }
  }
  return {
    path:path.relative(root,file), width:metadata.width, height:metadata.height,
    bytes:fs.statSync(file).size, sha256:hash(file), format:metadata.format, hasAlpha:metadata.hasAlpha,
    alpha:{zeroPixels:histogram[0], partialPixels:histogram.slice(1,255).reduce((a,b)=>a+b,0), opaquePixels:histogram[255], min:histogram.findIndex(n=>n>0), max:histogram.findLastIndex(n=>n>0), boundsOver10:bounds, frameEdgesOver10:frameEdges, interior:{min:interiorAlphaMin,max:interiorAlphaMax}, histogram}
  };
}
(async()=>{
  fs.mkdirSync(path.dirname(original),{recursive:true});
  fs.mkdirSync(path.dirname(runtime),{recursive:true});
  if (!fs.existsSync(original)) fs.copyFileSync(generatedSource,original);
  const settings={width:406,height:512,fit:'inside',withoutEnlargement:true,kernel:'lanczos3',quality:90,alphaQuality:100,effort:6};
  await sharp(original).resize({width:settings.width,height:settings.height,fit:settings.fit,withoutEnlargement:settings.withoutEnlargement,kernel:settings.kernel}).webp({quality:settings.quality,alphaQuality:settings.alphaQuality,effort:settings.effort}).toFile(runtime);
  const originalInfo=await inspect(original),runtimeInfo=await inspect(runtime);
  const prompts=JSON.parse(fs.readFileSync(path.join(root,'prompt.json'),'utf8'));
  const manifest={task_id:'ART-ARCHIVE-MATERIALS-055',asset_id:'archive-folder-v2',status:'asset-frozen-awaiting-product-demo',generated_at:'2026-10-04',tool:'built-in image_gen.imagegen',tool_arguments:{prompt:prompts.prompt,transparent_background:true,referenced_image_paths:prompts.referenced_image_paths},tool_source_path:generatedSource,source:originalInfo,runtime:runtimeInfo,derivation:{...settings,operations:['proportional resize','WebP encode; preserve generated alpha'],pixel_painting:false,source_hash_matches_tool:hash(generatedSource)===originalInfo.sha256},references:prompts.referenced_image_paths.map(file=>({path:file,sha256:hash(file)})),label_geometry:{coordinate_space:'full canvas percentage',requested_center:{x:23.7,y:5.7},visual_estimated_center:{x:24.5,y:5.7},conservative_empty_safe_rectangle:{left:10.5,top:3.3,right:38,bottom:8.3},existing_css_center_within_safe_rectangle:true,css_adjustment_required:false,optional_optical_center_css:'left:24.5%;top:5.7%',measurement_note:'Hand-inspected image estimate; product should confirm four-digit HTML overlay in assembled scene.'},visual_qa:{silhouette_complete:true,transparent_background:true,no_baked_checkerboard:true,no_baked_cast_shadow_or_glow:true,blank_label:true,no_text_seals_icons_or_ties:true,front_elevation:true,materials:'Warm beige pressboard, dark forest-green cloth spine, restrained antique brass label trim; fine scuffs but no stains or tears.',source_resolution_note:'Tool ignored the approximate 816×1024 request and returned 1119×1405; accepted source within budget, derived once without regenerating.',alpha_note:'Generated face has near-opaque alpha mainly 251–253 instead of 255; preserve as generated. Interior minimum recorded below. At runtime this is visually solid; product scene QA remains required.'},out_of_scope:['Production asset mapping','Shared CSS/JS/HTML edits','Gameplay and save behavior','Full game integration tests']};
  fs.writeFileSync(path.join(root,'generation.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(JSON.stringify({source:{...originalInfo,alpha:{...originalInfo.alpha,histogram:undefined}},runtime:{...runtimeInfo,alpha:{...runtimeInfo.alpha,histogram:undefined}}},null,2));
})();
