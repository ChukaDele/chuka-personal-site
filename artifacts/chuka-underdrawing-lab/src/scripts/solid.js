import * as THREE from 'three';
import {gsap} from 'gsap';

/* Lazy, optional and rendered only when a visitor changes the study. */
export function mountSolid(stage, reduced) {
  if(!stage?.isConnected||!stage.closest('dialog')?.open)return;
  stage.innerHTML='<div class="solid-canvas" tabindex="0" role="img" aria-label="A modern geometric study. Drag to turn it, or use the arrow buttons."></div><div class="solid-tools"><button type="button" class="small-button" data-turn="-1">← Turn left</button><button type="button" class="small-button" data-turn="1">Turn right →</button><button type="button" class="text-button" data-solid-reset>Reset ↺</button></div><p class="solid-caption">Drag to turn. Arrow keys also turn the shape. Escape resets it.</p>';
  const holder=stage.querySelector('.solid-canvas');
  let renderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{stage.innerHTML='<p class="source-note">The printed geometric study is available above.</p>';return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));holder.append(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,5.5);
  const geometry=new THREE.IcosahedronGeometry(1.25,0);
  const surface=new THREE.MeshBasicMaterial({color:0x8b9b86,transparent:true,opacity:.12,side:THREE.DoubleSide});
  const edges=new THREE.EdgesGeometry(geometry),lineMaterial=new THREE.LineBasicMaterial({color:0xa23f2a});
  const group=new THREE.Group();group.add(new THREE.Mesh(geometry,surface));group.add(new THREE.LineSegments(edges,lineMaterial));group.rotation.set(.25,.4,.08);scene.add(group);
  let active=null,disposed=false;
  function draw(){if(!disposed)renderer.render(scene,camera);}
  function resize(){const width=holder.clientWidth,height=holder.clientHeight;renderer.setSize(width,height);camera.aspect=width/Math.max(1,height);camera.updateProjectionMatrix();draw();}
  const observer=new ResizeObserver(resize);observer.observe(holder);resize();
  function turn(dx,dy=0){gsap.killTweensOf(group.rotation);gsap.to(group.rotation,{y:group.rotation.y+dx,x:group.rotation.x+dy,duration:reduced()?0:.22,ease:'power2.out',onUpdate:draw});}
  function reset(){gsap.killTweensOf(group.rotation);group.rotation.set(.25,.4,.08);draw();}
  stage.querySelectorAll('[data-turn]').forEach(button=>button.addEventListener('click',()=>turn(Number(button.dataset.turn)*.4)));
  stage.querySelector('[data-solid-reset]').addEventListener('click',reset);
  holder.addEventListener('keydown',event=>{const steps={ArrowLeft:[-.3,0],ArrowRight:[.3,0],ArrowUp:[0,-.3],ArrowDown:[0,.3]};if(steps[event.key]){event.preventDefault();turn(...steps[event.key]);}if(event.key==='Escape'){event.preventDefault();event.stopPropagation();reset();}});
  holder.addEventListener('pointerdown',event=>{if(event.button!==0)return;active={id:event.pointerId,x:event.clientX,y:event.clientY};holder.setPointerCapture(event.pointerId);});
  holder.addEventListener('pointermove',event=>{if(active?.id!==event.pointerId)return;gsap.killTweensOf(group.rotation);group.rotation.y+=(event.clientX-active.x)*.012;group.rotation.x+=(event.clientY-active.y)*.012;active.x=event.clientX;active.y=event.clientY;draw();});
  function end(){active=null;}holder.addEventListener('pointerup',end);holder.addEventListener('pointercancel',end);holder.addEventListener('lostpointercapture',end);
  function dispose(){if(disposed)return;disposed=true;gsap.killTweensOf(group.rotation);observer.disconnect();geometry.dispose();edges.dispose();surface.dispose();lineMaterial.dispose();renderer.dispose();renderer.forceContextLoss();}
  stage.closest('dialog').addEventListener('close',dispose,{once:true});
  renderer.domElement.addEventListener('webglcontextlost',()=>{if(!disposed){dispose();stage.innerHTML='<p class="source-note">The printed geometric study is available above.</p>';}});
}
