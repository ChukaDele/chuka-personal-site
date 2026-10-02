import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const root = dirname(fileURLToPath(import.meta.url));
const read = path => readFileSync(resolve(root,path),'utf8');
const context = vm.createContext({});
vm.runInContext(read('projects.js')+';globalThis.checkedProjects=PROJECTS;globalThis.checkedArtworks=ARTWORKS;',context);
const cases = context.checkedProjects;
const stateContext = vm.createContext({URL});
vm.runInContext(read('draft-state.js')+';globalThis.checkedState=DraftState;',stateContext);
const state = stateContext.checkedState;
const savedMix = {direction:'evening',mix:true,picks:{hero:'study',work:'workshop',method:'evening'},note:'Keep the art whole.'};
const mixURL = new URL(state.urlFor('https://draft.workers.dev/?direction=evening#work',null));
assert.equal(mixURL.searchParams.get('direction'),null,'Saved mix must clear an explicit direction query.');
assert.equal(state.restore(savedMix,mixURL.searchParams.get('direction'),['study','workshop','evening']).mix,true,'A saved mix must survive reload.');
assert.equal(state.restore(savedMix,'workshop',['study','workshop','evening']).mix,false,'An explicit direction link must open that direction.');
assert.equal(state.restore(savedMix,'workshop',['study','workshop','evening']).direction,'workshop');
assert.equal(state.restore({picks:{hero:'invalid'},motion:'bad'},null,['study','workshop','evening']).picks.hero,null,'Invalid persisted direction values must be ignored.');
const expected = ['etap','idara','surface','honeycoin','rvysion','bredge'];
assert.deepEqual(Array.from(cases,project => project.id),expected,'All six projects must remain present and ordered.');
assert.equal(new Set(cases.map(project => project.id)).size,6,'Project IDs must be unique.');
let assetChecks = 0;
for(const project of cases){
  for(const key of ['name','headline','role','diagnosis','design','build','result','sourceNote']) assert.ok(project[key]?.trim(),`${project.id} is missing ${key}.`);
  for(const shot of project.shots){assert.ok(existsSync(resolve(root,'assets/shots',shot[0]+'.jpg')),`Missing ${shot[0]}.jpg`);assetChecks++;}
  if(project.featuredShot) assert.ok(project.shots.some(shot => shot[0]===project.featuredShot),'Featured image must belong to its project.');
  assert.ok(project.hotspot.length===2 && project.hotspot.every(value => value>=0&&value<=100),'Hotspots must stay inside the artwork.');
}
for(const artwork of context.checkedArtworks){assert.ok(existsSync(resolve(root,'assets/art',artwork.file)),`Missing artwork: ${artwork.file}`);assert.ok(artwork.artist&&artwork.title&&artwork.institution,'Artwork needs attribution.');assetChecks++;}
assert.match(cases.find(project=>project.id==='honeycoin').result,/Rvysion/,'HoneyCoin outcome attribution must be retained.');
assert.ok(!/£306|1\.9M|ten-person|10-person|12 roles/.test(cases.map(project=>project.headline+' '+project.metric+' '+project.metricLabel).join(' ')),'Unverified staffing and cost models must not appear in headlines or proof badges.');

function files(directory){return readdirSync(directory).flatMap(name=>{const path=resolve(directory,name);return statSync(path).isDirectory()?files(path):[path];});}
let syntaxChecks=0,referenceChecks=0;
for(const file of files(root)){
  const extension=file.split('.').pop();
  if(extension==='js'){new vm.Script(readFileSync(file,'utf8'),{filename:relative(root,file)});syntaxChecks++;}
  if(extension!=='html')continue;
  const html=readFileSync(file,'utf8');
  assert.match(html,/<meta[^>]+(?:name="robots"|name=robots)[^>]+noindex/i,`${file} must remain noindex.`);
  for(const match of html.matchAll(/<(?:img|script|link)[^>]+(?:src|href)=["']([^"']+)["']/g)){
    const value=match[1];
    if(/^(https?:|data:|#)/.test(value)||value.includes(" + ")||value.includes('${'))continue;
    assert.ok(existsSync(resolve(dirname(file),value)),`Broken static asset in ${relative(root,file)}: ${value}`);referenceChecks++;
  }
  for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(match[1].trim()){new vm.Script(match[1],{filename:relative(root,file)+' inline script'});syntaxChecks++;}}
}
const commissions=read('references/commissions/index.html');
assert.ok(!commissions.includes('id="picker"')&&!commissions.includes('function setFont'),'The supplied Commissions mirror must omit the font picker.');
for(const reference of ['references/commissions/index.html','references/directions-ii/index.html']){
  const html=read(reference);
  assert.ok(!html.includes('"shots/')&&!html.includes("'shots/"),'Dynamic reference galleries must resolve to shared local assets.');
  assert.ok(html.includes('Supplied Claude draft'),'Reference views must identify their source.');
}
assert.match(read('styles.css'),/prefers-reduced-motion/,'Device reduced motion must be respected.');
assert.match(read('playground.js'),/focusReturn/,'Dialogs must restore focus.');
assert.match(read('index.html'),/data-save="hero"[\s\S]*data-save="work"[\s\S]*data-save="method"/,'All three section saves must remain available.');
assert.match(read('worker.mjs'),/X-Deploy-SHA/,'The preview must expose its deployed revision.');
console.log(JSON.stringify({passed:true,cases:6,assetChecks,staticReferenceChecks:referenceChecks,scriptSyntaxChecks:syntaxChecks,scope:'Isolated draft only. Browser behavior and visual QA remain a separate check.'},null,2));
