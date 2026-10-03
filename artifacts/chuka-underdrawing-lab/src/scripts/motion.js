import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function revealColour(visual, colour, reduced) {
  const image=visual.querySelector('.shot-colour');if(!image)return;
  gsap.killTweensOf(image);
  gsap.to(image,{clipPath:`circle(${colour?75:0}% at 52% 48%)`,duration:reduced?0:.26,ease:'power3.out',overwrite:true});
}

export function setupMotion() {
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
    if(document.documentElement.classList.contains('reduced-motion')||document.documentElement.classList.contains('keyboard-mode'))return;
    gsap.from('.hero-lead',{y:16,opacity:.6,duration:.28,ease:'power3.out',clearProps:'all'});
    gsap.utils.toArray('.section-heading').forEach(heading=>gsap.from(heading,{y:18,opacity:.7,duration:.28,ease:'power3.out',clearProps:'all',scrollTrigger:{trigger:heading,start:'top 88%',once:true}}));
    gsap.utils.toArray('.metric-ring path').forEach(path=>gsap.from(path,{strokeDashoffset:470,duration:.28,ease:'power2.out',scrollTrigger:{trigger:path.closest('.project-row'),start:'top 78%',once:true}}));
  });
  function neutral(){media.revert();gsap.set('.hero-lead,.section-heading',{clearProps:'all'});gsap.set('.metric-ring path',{clearProps:'strokeDashoffset'});}
  document.addEventListener('keydown',event=>{if(event.key==='Tab'||event.key.startsWith('Arrow'))neutral();});
  document.getElementById('motion-mode')?.addEventListener('change',neutral);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)ScrollTrigger.update();});
}
