import * as THREE from 'three';
import { gsap } from 'gsap';

export function initSolid(host,reduced) {
  const mount=host.querySelector('[data-solid-mount]');
  let renderer;
  try {renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});} catch {host.querySelector('[data-solid-hint]').textContent='A geometric print from 1509.';return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  mount.append(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(0,0,7.6);
  const geometry=new THREE.IcosahedronGeometry(1.55,0);
  const paper=document.createElement('canvas');paper.width=paper.height=512;
  const ctx=paper.getContext('2d');ctx.fillStyle='#a7c4b5';ctx.fillRect(0,0,512,512);
  ctx.strokeStyle='rgba(40,72,58,.18)';ctx.lineWidth=.8;
  for(let i=-512;i<1024;i+=7){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i-240,512);ctx.stroke();}
  ctx.strokeStyle='rgba(34,68,54,.08)';
  for(let i=-512;i<1024;i+=12){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+390,512);ctx.stroke();}
  const texture=new THREE.CanvasTexture(paper);texture.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.MeshStandardMaterial({map:texture,roughness:.95,metalness:.02,flatShading:true});
  const solid=new THREE.Group();solid.add(new THREE.Mesh(geometry,material));
  const edges=new THREE.EdgesGeometry(geometry),edgeMaterial=new THREE.LineBasicMaterial({color:0xe4e5c7,transparent:true,opacity:.72});solid.add(new THREE.LineSegments(edges,edgeMaterial));
  solid.rotation.set(.26,.36,-.16);scene.add(solid);
  scene.add(new THREE.AmbientLight(0xfff7df,1.7));
  const light=new THREE.DirectionalLight(0xfff4dd,3);light.position.set(-3,4,5);scene.add(light);
  const back=new THREE.DirectionalLight(0x7daca5,.9);back.position.set(4,-2,-1);scene.add(back);
  const render=()=>renderer.render(scene,camera);
  const size=()=>{const b=mount.getBoundingClientRect();if(!b.width||!b.height)return;renderer.setSize(b.width,b.height,false);camera.aspect=b.width/b.height;camera.updateProjectionMatrix();render();};
  const observer=new ResizeObserver(size);observer.observe(mount);size();host.dataset.ready='true';
  host.querySelector('[data-turn]').addEventListener('click',event=>{
    gsap.killTweensOf(solid.rotation);
    if(reduced.matches||event.detail===0){solid.rotation.y+=Math.PI/3;render();}
    else gsap.to(solid.rotation,{y:solid.rotation.y+Math.PI/3,duration:.55,ease:'power3.out',onUpdate:render});
  });
  let drag=null;
  const canvas=renderer.domElement;
  canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;gsap.killTweensOf(solid.rotation);drag={id:event.pointerId,x:event.clientX,y:event.clientY,rx:solid.rotation.x,ry:solid.rotation.y};canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{if(drag?.id!==event.pointerId)return;solid.rotation.y=drag.ry+(event.clientX-drag.x)*.012;solid.rotation.x=drag.rx+(event.clientY-drag.y)*.008;render();});
  const release=event=>{if(drag?.id===event.pointerId){if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);drag=null;}};
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  const stopMotion=()=>{gsap.killTweensOf(solid.rotation);render();};reduced.addEventListener('change',stopMotion);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();host.removeAttribute('data-ready');host.querySelector('[data-solid-hint]').textContent='A geometric print from 1509.';stopMotion();});
  addEventListener('pagehide',()=>{observer.disconnect();gsap.killTweensOf(solid.rotation);reduced.removeEventListener('change',stopMotion);geometry.dispose();edges.dispose();texture.dispose();material.dispose();edgeMaterial.dispose();renderer.dispose();},{once:true});
  return {render};
}
