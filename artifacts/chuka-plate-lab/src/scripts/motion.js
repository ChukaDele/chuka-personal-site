import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const media = gsap.matchMedia();
media.add('(prefers-reduced-motion: no-preference)', () => {
  if (document.querySelector('.hero-name')) {
    gsap.from('.hero-name', { x: -16, duration: .85, ease: 'power3.out' });
    gsap.from('.hero-copy', { y: 16, duration: .85, ease: 'power3.out', delay: .08 });
  }
  document.querySelectorAll('.work-plate').forEach(plate => {
    gsap.from(plate.querySelector('.plate-number'), {
      y: 24, duration: .65, ease: 'power3.out',
      scrollTrigger: { trigger: plate, start: 'top 78%', once: true }
    });
  });
  if (document.querySelector('.practice-intro h2')) {
    gsap.from('.practice-intro h2', { y: 22, duration: .8, ease: 'power3.out', scrollTrigger:{trigger:'.practice',start:'top 70%',once:true} });
  }
});
document.fonts.ready.then(() => ScrollTrigger.refresh());

const chapters = [...document.querySelectorAll('.chapter')];
const links = [...document.querySelectorAll('.chapter-nav a')];
const progress = document.querySelector('[data-reading-progress]');
let frame = 0;
function updateReading() {
  frame = 0;
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 1})`;
  const current = [...chapters].reverse().find(section => section.getBoundingClientRect().top <= innerHeight * .42) || chapters[0];
  links.forEach(link => {
    if (link.getAttribute('href') === `#${current?.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function queueReading() { if (!frame) frame = requestAnimationFrame(updateReading); }
if (chapters.length) {
  addEventListener('scroll', queueReading, { passive:true });
  addEventListener('resize', queueReading, { passive:true });
  updateReading();
}
