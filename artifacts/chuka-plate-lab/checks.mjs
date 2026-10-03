import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { projects } from './src/data/projects.js';
import { boundedPoint } from './src/scripts/board-math.js';

// Rotated prints stay on the board after mouse, touch, keyboard and fling moves.
for (const [width,height,itemWidth,itemHeight] of [[1280,760,330,360],[346,960,220,260],[720,700,190,150]]) {
  for (const [x,y] of [[-1000,-1000],[width*2,height*2],[width/2,height/2]]) {
    const p=boundedPoint(x,y,width,height,itemWidth,itemHeight);
    assert(p.x-itemWidth/2>=14 && p.x+itemWidth/2<=width-14);
    assert(p.y-itemHeight/2>=14 && p.y+itemHeight/2<=height-14);
  }
}
assert.equal(projects.length,6);
assert(!projects.find(p=>p.id==='idara').result.includes('covers'));
assert(projects.find(p=>p.id==='honeycoin').metricShort.includes('Rvysion'));
const pages=['index.html','404.html',...projects.map(p=>`work/${p.id}/index.html`)];
for (const page of pages) {
  const html=await readFile(join('dist',page),'utf8');
  assert(html.includes('noindex, nofollow'),`${page}: noindex missing`);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${page}: needs one primary heading`);
  assert(html.includes('Skip to content'),`${page}: skip link missing`);
  const paths=[...html.matchAll(/(?:src|href)="(\/(?:art|shots|fonts|_astro)\/[^"?#]+)"/g)].map(m=>m[1]);
  for(const path of paths)assert((await stat(join('dist',path))).isFile(),`${page}: missing ${path}`);
}
const home=await readFile('dist/index.html','utf8');
for(const p of projects){assert(home.includes(`/work/${p.id}/`));assert(home.includes(p.role.replaceAll('&','&amp;')) || home.includes(p.role));}
assert(home.includes('data-draw-line') && home.includes('data-arrange') && home.includes('data-turn'));
const css=await readFile('src/styles.css','utf8');assert(!/filter\s*:|mix-blend-mode\s*:/.test(css),'Natural imagery must remain untreated');
const assets=await readdir('dist/_astro');
const js=await Promise.all(assets.filter(f=>f.endsWith('.js')).map(async f=>[f,(await stat(join('dist/_astro',f))).size]));
console.log(JSON.stringify({status:'PASS',staticPages:pages.length,projectRoutes:projects.length,boardBounds:'desktop, tablet, phone',imageTreatment:'natural',javascriptBytes:Object.fromEntries(js)},null,2));
