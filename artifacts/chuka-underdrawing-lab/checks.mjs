import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {PROJECTS,SKETCHES,ART} from './src/data/projects.js';
import {boundPaper} from './src/scripts/board-math.js';
import {projectMarkup} from './src/lib/project-markup.js';
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(dir,file),'utf8');
const scripts=['src/data/projects.js','src/lib/project-markup.js','src/scripts/board-math.js','src/scripts/lab.js','src/scripts/motion.js','src/scripts/solid.js','src/scripts/case-page.js','worker.mjs','astro.config.mjs'];
for(const file of scripts){const r=spawnSync(process.execPath,['--check',path.join(dir,file)],{encoding:'utf8'});assert.equal(r.status,0,`${file}: ${r.stderr}`);}
assert.deepEqual(PROJECTS.map(p=>p.id),['etap','idara','surface','honeycoin','rvysion','bredge']);
for(const p of PROJECTS){for(const field of ['role','diagnosis','design','build','result'])assert.ok(p[field],`${p.id} missing ${field}`);assert.ok(!p.art,'No unused art paths');}
assert.match(PROJECTS.find(p=>p.id==='honeycoin').result,/Rvysion/);
assert.doesNotMatch(PROJECTS.find(p=>p.id==='idara').result,/covers|profit|acquisition cost/i);
assert.match(PROJECTS.find(p=>p.id==='surface').result,/not been measured/);
const required=new Set(['athens-sinopia.jpg','athens-color.jpg',...ART.map(a=>a.file)]);
for(const p of PROJECTS)for(const [file] of p.shots)required.add(`${file}.jpg`);
for(const file of Object.values(SKETCHES))required.add(`${file}-sketch.jpg`);
for(const file of required)assert.ok(fs.statSync(path.join(dir,'public/img',file)).size>1000,`Missing image ${file}`);
const html=read('src/pages/index.astro'),js=read('src/scripts/lab.js'),css=read('public/styles.css');
for(const source of [html,js])for(const match of source.matchAll(/(?:src|href)="(\/(?:img|fonts)\/[^"$]+)"/g))assert.ok(fs.existsSync(path.join(dir,'public',match[1])),match[1]);
for(const match of read('public/fonts.css').matchAll(/url\(([^)]+)\)/g)){assert.ok(!/^https?:/.test(match[1]));assert.ok(fs.statSync(path.join(dir,'public',match[1])).size>1000);}
for(const ending of ['poster-wall','archive','workbench'])assert.match(html,new RegExp(`data-ending-link="${ending}"`));
const markup=projectMarkup(PROJECTS,SKETCHES);
for(const p of PROJECTS){assert.ok(markup.includes(`href="/work/${p.id}/"`));assert.ok(markup.includes(p.role.replace(/&/g,'&amp;')));}
assert.match(html,/<dialog id="case-dialog"/);assert.match(html,/<dialog id="image-dialog"/);assert.match(html,/modern interpretation/);
assert.match(js,/setPointerCapture/);assert.match(js,/pointercancel/);assert.match(js,/ArrowLeft/);assert.match(js,/Escape/);
assert.match(js,/handle\.focus\(\{preventScroll:true\}\)/);assert.match(js,/raisePaper\(element\)/);assert.match(js,/style\.zIndex/);
assert.match(js,/setupChalk/);assert.match(js,/visitor-note/);assert.match(html,/paint-complete/);assert.match(html,/paint-reset/);
assert.match(css,/html\.keyboard-mode\{scroll-behavior:auto\}/);assert.match(css,/prefers-reduced-motion/);assert.match(css,/\[hidden\]\{display:none!important\}/);
assert.match(read('src/scripts/motion.js'),/ScrollTrigger/);assert.match(js,/import\('\.\/solid\.js'\)/);assert.match(read('src/scripts/solid.js'),/renderer\.dispose\(\)/);
for(const [bw,bh,w,h] of [[350,830,165,350],[1200,760,295,450],[320,850,148,280]])for(const angle of [-6,0,6])for(const [x,y] of [[-300,-300],[10000,10000],[100,100]]){
 const p=boundPaper(x,y,w,h,bw,bh,angle),rad=angle*Math.PI/180;
 const dx=(Math.abs(w*Math.cos(rad))+Math.abs(h*Math.sin(rad))-w)/2,dy=(Math.abs(h*Math.cos(rad))+Math.abs(w*Math.sin(rad))-h)/2;
 assert.ok(p.x-dx>=-.001&&p.x+w+dx<=bw+.001,'Rotated horizontal bounds');assert.ok(p.y-dy>=-.001&&p.y+h+dy<=bh+.001,'Rotated vertical bounds');
}
assert.doesNotMatch(html,/\[your email\]|mailto:|first order covers/);
const dist=path.join(dir,'dist');
if(fs.existsSync(path.join(dist,'index.html'))){
 const built=[path.join(dist,'index.html'),...PROJECTS.map(p=>path.join(dist,'work',p.id,'index.html'))];
 for(const file of built){const page=fs.readFileSync(file,'utf8');assert.match(page,/noindex,nofollow/);assert.match(page,/linkedin\.com\/in\/chuka1/);for(const m of page.matchAll(/(?:src|href)="(\/(?:img|fonts|_astro)\/[^"?#]+)"/g))assert.ok(fs.existsSync(path.join(dist,m[1])),`Built asset missing ${m[1]}`);}
 for(const p of PROJECTS){const page=fs.readFileSync(path.join(dist,'work',p.id,'index.html'),'utf8');assert.ok(page.includes(p.name));for(const stage of ['Diagnosis','Design','Build','Result'])assert.ok(page.includes(stage));}
 console.log('PASS: 7 built HTML routes, all case stages, local built asset references and noindex metadata.');
}
console.log(`PASS: ${scripts.length} scripts parsed; 6 complete source-qualified cases; ${required.size} local images; local licensed fonts; 27 rotated drag-bound scenarios; grabbed-paper focus/stacking; painting, drawing, note, dialogs, keyboard and reduced motion controls.`);
