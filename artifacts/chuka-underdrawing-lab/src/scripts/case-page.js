import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {revealColour} from './motion.js';
gsap.registerPlugin(ScrollTrigger);
const data=JSON.parse(document.getElementById('case-data').textContent);
const $=selector=>document.querySelector(selector);
const dialog=$('#image-dialog');let current=0,opener=null;
const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('keyboard-mode');
function showImage(){const [file,caption]=data.shots[current];$('#lightbox-image').src=`/img/${file}.jpg`;$('#lightbox-image').alt=caption;$('#image-caption').textContent=caption;$('#image-count').textContent=`${current+1} / ${data.shots.length}`;$('#image-prev').hidden=$('#image-next').hidden=data.shots.length<2;}
function shift(step){current=(current+step+data.shots.length)%data.shots.length;showImage();}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.imageIndex!==undefined){current=Number(button.dataset.imageIndex);opener=button;showImage();dialog.showModal();document.body.style.overflow='hidden';$('#image-close').focus({preventScroll:true});}
  if(button.classList.contains('colour-toggle')){const visual=button.closest('.project-visual'),colour=!visual.classList.contains('is-colour');visual.classList.toggle('is-colour',colour);visual.classList.toggle('is-drawing',!colour);revealColour(visual,colour,reduced());button.setAttribute('aria-pressed',String(colour));button.textContent=colour?'Show drawing ↺':'Show colour ↗';}
});
$('#image-close').addEventListener('click',()=>dialog.close());$('#image-prev').addEventListener('click',()=>shift(-1));$('#image-next').addEventListener('click',()=>shift(1));
dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus({preventScroll:true});});
dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();shift(event.key==='ArrowLeft'?-1:1);}});
const media=gsap.matchMedia();media.add('(prefers-reduced-motion:no-preference)',()=>{gsap.utils.toArray('.story-stage').forEach(stage=>gsap.from(stage,{y:18,opacity:.75,duration:.28,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:stage,start:'top 86%',once:true}}));});
document.addEventListener('keydown',event=>{if(event.key==='Tab'||event.key.startsWith('Arrow')){document.documentElement.classList.add('keyboard-mode');media.revert();}});
document.addEventListener('pointerdown',()=>document.documentElement.classList.remove('keyboard-mode'),{passive:true});
