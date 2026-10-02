import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=file=>fs.readFileSync(path.join(dir,file),'utf8');
for(const file of ['projects.js','board-math.js','lab.js'])new vm.Script(read(file),{filename:file});
const context=vm.createContext({});vm.runInContext(read('projects.js')+'\n'+read('board-math.js'),context);
const projects=JSON.parse(vm.runInContext('JSON.stringify(PROJECTS)',context));
const art=JSON.parse(vm.runInContext('JSON.stringify(ART)',context));
const sketches=JSON.parse(vm.runInContext('JSON.stringify(SKETCHES)',context));
assert.deepEqual(projects.map(p=>p.id),['etap','idara','surface','honeycoin','rvysion','bredge']);
for(const p of projects){for(const field of ['role','diagnosis','design','build','result'])assert.ok(p[field],`${p.id} missing ${field}`);assert.ok(!p.art,'No unused art paths');}
assert.match(projects.find(p=>p.id==='honeycoin').result,/Rvysion/);
assert.doesNotMatch(projects.find(p=>p.id==='idara').result,/covers|profit|acquisition cost/i);
assert.match(projects.find(p=>p.id==='surface').result,/not been measured/);
const required=new Set(['athens-sinopia.jpg','athens-color.jpg',...art.map(a=>a.file)]);
for(const p of projects)for(const [file] of p.shots)required.add(`${file}.jpg`);
for(const file of Object.values(sketches))required.add(`${file}-sketch.jpg`);
for(const file of required)assert.ok(fs.statSync(path.join(dir,'img',file)).size>1000,`Missing image ${file}`);
for(const source of [read('index.html'),read('lab.js')])for(const match of source.matchAll(/(?:src|href)="((?:img|fonts)\/[^"$]+)"/g))assert.ok(fs.existsSync(path.join(dir,match[1])),match[1]);
for(const match of read('fonts.css').matchAll(/url\(([^)]+)\)/g)){assert.ok(!/^https?:/.test(match[1]));assert.ok(fs.statSync(path.join(dir,match[1])).size>1000);}
const html=read('index.html'),js=read('lab.js'),css=read('styles.css');
for(const ending of ['poster-wall','archive','workbench'])assert.match(html,new RegExp(`data-ending-link="${ending}"`));
assert.match(html,/<dialog id="case-dialog"/);assert.match(html,/<dialog id="image-dialog"/);
assert.match(html,/modern interpretation/);assert.match(js,/Read case/);assert.match(js,/p\.role/);
assert.match(js,/setPointerCapture/);assert.match(js,/pointercancel/);assert.match(js,/ArrowLeft/);assert.match(js,/Escape/);
assert.match(js,/setupChalk/);assert.match(js,/visitor-note/);assert.match(html,/paint-complete/);assert.match(html,/paint-reset/);
assert.match(css,/html\.keyboard-mode\{scroll-behavior:auto\}/);assert.match(css,/prefers-reduced-motion/);assert.match(css,/touch-action:pan-y/);
const bound=vm.runInContext('boundPaper',context);
for(const [boardWidth,boardHeight,width,height] of [[350,830,165,350],[1200,760,295,450],[320,850,148,280]])for(const angle of [-6,0,6])for(const [x,y] of [[-300,-300],[10000,10000],[100,100]]){
 const p=bound(x,y,width,height,boardWidth,boardHeight,angle);const rad=angle*Math.PI/180;
 const dx=(Math.abs(width*Math.cos(rad))+Math.abs(height*Math.sin(rad))-width)/2;
 const dy=(Math.abs(height*Math.cos(rad))+Math.abs(width*Math.sin(rad))-height)/2;
 assert.ok(p.x-dx>=-0.001 && p.x+width+dx<=boardWidth+.001,'Rotated horizontal bounds');
 assert.ok(p.y-dy>=-0.001 && p.y+height+dy<=boardHeight+.001,'Rotated vertical bounds');
}
assert.doesNotMatch(html,/\[your email\]|mailto:|first order covers/);
console.log(`PASS: 3 scripts parsed; 6 complete cases; ${required.size} local images; local licensed fonts; 27 rotated drag-bound checks; explicit painting, chalk, dialogs, keyboard and motion controls.`);
