import { gsap } from 'gsap';
import { boundedPoint } from './board-math.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const board = document.querySelector('[data-play-board]');
const prints = [...document.querySelectorAll('[data-loose-print]')];
const status = document.querySelector('[data-play-status]');
let activeDrag = null;
let z = 3;

function dimensions(item) {
  // Bounding boxes include rotation so every visible corner stays on the table.
  const box = item.getBoundingClientRect();
  return { width:box.width, height:box.height };
}
function place(item, x, y, animate = false) {
  const d = dimensions(item);
  const target = boundedPoint(x,y,board.clientWidth,board.clientHeight,d.width,d.height);
  gsap.killTweensOf(item);
  if (animate && !reduced.matches) gsap.to(item,{left:target.x,top:target.y,duration:.45,ease:'power3.out'});
  else { item.style.left = `${target.x}px`; item.style.top = `${target.y}px`; }
  return target;
}
function arrange(animate = false) {
  const mobile = board.clientWidth < 600;
  const positions = mobile ? [[63,44],[70,67],[27,66]] : [[71,29],[74,72],[49,80]];
  prints.forEach((item,i) => {
    item.style.setProperty('--angle', `${item.dataset.angle}deg`);
    item.style.zIndex = `${3+i}`;
    place(item, board.clientWidth*positions[i][0]/100, board.clientHeight*positions[i][1]/100, animate);
  });
}
prints.forEach(item => {
  const handle = item.querySelector('[data-print-handle]');
  handle.addEventListener('pointerdown', event => {
    if (event.button !== 0 || activeDrag) return;
    gsap.killTweensOf(item);
    const box = item.getBoundingClientRect();
    const table = board.getBoundingClientRect();
    activeDrag = {item,handle,pointer:event.pointerId,startX:event.clientX,startY:event.clientY,x:box.left+box.width/2-table.left,y:box.top+box.height/2-table.top,lastX:event.clientX,lastY:event.clientY,lastTime:performance.now(),vx:0,vy:0};
    item.style.zIndex = `${++z}`;
    item.classList.add('is-moving');
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  handle.addEventListener('pointermove', event => {
    const drag = activeDrag;
    if (!drag || drag.item!==item || event.pointerId!==drag.pointer) return;
    const now = performance.now(), dt = Math.max(8, now-drag.lastTime);
    drag.vx = (event.clientX-drag.lastX)/dt;
    drag.vy = (event.clientY-drag.lastY)/dt;
    drag.lastX=event.clientX; drag.lastY=event.clientY; drag.lastTime=now;
    place(item,drag.x+event.clientX-drag.startX,drag.y+event.clientY-drag.startY);
  });
  function endDrag(event) {
    const drag = activeDrag;
    if (!drag || drag.item!==item || event.pointerId!==drag.pointer) return;
    item.classList.remove('is-moving');
    if (event.type==='pointerup' && !reduced.matches && performance.now()-drag.lastTime<80) {
      place(item,parseFloat(item.style.left)+Math.max(-90,Math.min(90,drag.vx*70)),parseFloat(item.style.top)+Math.max(-90,Math.min(90,drag.vy*70)),true);
    }
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    activeDrag=null;
  }
  handle.addEventListener('pointerup',endDrag);
  handle.addEventListener('pointercancel',endDrag);
  handle.addEventListener('lostpointercapture', () => {if(activeDrag?.item===item){item.classList.remove('is-moving');activeDrag=null;}});
  handle.addEventListener('keydown', event => {
    const moves={ArrowLeft:[-16,0],ArrowRight:[16,0],ArrowUp:[0,-16],ArrowDown:[0,16]};
    if (event.key==='Home') {event.preventDefault();arrange(false);status.textContent='The prints are back in their starting positions.';return;}
    if (event.key==='Escape' && activeDrag?.item===item) {event.preventDefault();const drag=activeDrag;place(item,drag.x,drag.y);handle.releasePointerCapture(drag.pointer);activeDrag=null;return;}
    if (!moves[event.key]) return;
    event.preventDefault();
    item.style.zIndex=`${++z}`;
    const [x,y]=moves[event.key],step=event.shiftKey?3:1;
    const p=place(item,parseFloat(item.style.left)+x*step,parseFloat(item.style.top)+y*step);
    status.textContent=`Print moved to ${Math.round(p.x/board.clientWidth*100)} percent across, ${Math.round(p.y/board.clientHeight*100)} percent down.`;
  });
});
document.querySelector('[data-arrange]').addEventListener('click', event => {
  if(activeDrag){activeDrag.item.classList.remove('is-moving');activeDrag.handle.releasePointerCapture(activeDrag.pointer);activeDrag=null;}
  arrange(event.detail>0);
  status.textContent='The table is arranged again.';
});
arrange();
let previousWidth=board.clientWidth;
new ResizeObserver(() => {
  if(Math.abs(board.clientWidth-previousWidth)>2){previousWidth=board.clientWidth;arrange();}
}).observe(board);

const pad=document.querySelector('.drawing-pad');
const drawing=document.querySelector('[data-drawing-canvas]');
const chalk=drawing.getContext('2d');
const drawButton=document.querySelector('[data-draw]');
let drawingOn=false,stroke=null;
function sizeDrawing(){
  const old=document.createElement('canvas');old.width=drawing.width;old.height=drawing.height;old.getContext('2d').drawImage(drawing,0,0);
  const ratio=Math.min(devicePixelRatio||1,2),box=drawing.getBoundingClientRect();
  drawing.width=Math.max(1,Math.round(box.width*ratio));drawing.height=Math.max(1,Math.round(box.height*ratio));
  chalk.drawImage(old,0,0,drawing.width,drawing.height);chalk.setTransform(ratio,0,0,ratio,0,0);chalk.strokeStyle='#c2d3bb';chalk.lineWidth=2;chalk.lineCap='round';chalk.lineJoin='round';
}
new ResizeObserver(sizeDrawing).observe(drawing);
drawButton.addEventListener('click',()=>{drawingOn=!drawingOn;drawButton.setAttribute('aria-pressed',`${drawingOn}`);drawButton.textContent=drawingOn?'Put down the chalk':'Pick up the chalk';pad.classList.toggle('is-drawing',drawingOn);});
drawing.addEventListener('pointerdown',event=>{if(!drawingOn||event.button!==0)return;const b=drawing.getBoundingClientRect();stroke={id:event.pointerId,x:event.clientX-b.left,y:event.clientY-b.top};drawing.setPointerCapture(event.pointerId);event.preventDefault();});
drawing.addEventListener('pointermove',event=>{if(!stroke||stroke.id!==event.pointerId)return;const b=drawing.getBoundingClientRect(),x=event.clientX-b.left,y=event.clientY-b.top;chalk.beginPath();chalk.moveTo(stroke.x,stroke.y);chalk.lineTo(x,y);chalk.stroke();stroke.x=x;stroke.y=y;pad.classList.add('has-lines');});
function endStroke(event){if(stroke?.id===event.pointerId){if(drawing.hasPointerCapture(event.pointerId))drawing.releasePointerCapture(event.pointerId);stroke=null;}}
drawing.addEventListener('pointerup',endStroke);drawing.addEventListener('pointercancel',endStroke);
document.querySelector('[data-draw-line]').addEventListener('click',()=>{const b=drawing.getBoundingClientRect();chalk.beginPath();chalk.moveTo(b.width*.15,b.height*.66);chalk.bezierCurveTo(b.width*.3,b.height*.15,b.width*.6,b.height*.82,b.width*.85,b.height*.33);chalk.stroke();pad.classList.add('has-lines');status.textContent='A chalk line has been drawn.';});
document.querySelector('[data-clear-drawing]').addEventListener('click',()=>{chalk.save();chalk.setTransform(1,0,0,1,0,0);chalk.clearRect(0,0,drawing.width,drawing.height);chalk.restore();pad.classList.remove('has-lines');status.textContent='The chalk sketch is cleared.';});

const scene=document.querySelector('[data-solid-scene]');
let fallbackTurn=0;
scene.querySelector('[data-turn]').addEventListener('click',()=>{fallbackTurn+=12;scene.querySelector('.solid-fallback').style.transform=`rotate(${fallbackTurn}deg)`;});
const solidObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){solidObserver.disconnect();import('./solid.js').then(({initSolid})=>{initSolid(scene,reduced);}).catch(()=>{scene.querySelector('[data-solid-hint]').textContent='A geometric print from 1509.';});}},{rootMargin:'160px'});
solidObserver.observe(scene);
