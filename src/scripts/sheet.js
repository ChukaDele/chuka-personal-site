import { WebGLRenderer, Scene, OrthographicCamera, ShaderMaterial, DoubleSide, Mesh, PlaneGeometry } from 'three';
// the sheet of primed canvas that rolls up the screen between pages. loaded on its own, after the page is usable
export function make(canvas) {
  let renderer;
  // no WebGL (or a blocked GPU): say nothing and let the flat sheet do the job
  const probe = document.createElement('canvas'); if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return null;
  try { renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true }); } catch (e) { return null; }
  const scene = new Scene(), cam = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -5, 5);
  const u = { uEdge: { value: 0 }, uLift: { value: 0 }, uR: { value: 0.05 }, uAspect: { value: 1.6 } };
  const mat = new ShaderMaterial({ uniforms: u, side: DoubleSide,
    vertexShader: `uniform float uEdge,uLift,uR; varying float vShade; varying vec2 vUv; varying float vRoll;
      void main(){ vUv=uv; vec3 p=position; vShade=1.0; vRoll=0.0;
        if(uv.y>uEdge){ float a=(uv.y-uEdge)/uR; float r=uR*(1.0-0.012*a); p.y=uEdge+r*sin(a)-0.5; p.z=r*(1.0-cos(a)); vShade=0.58+0.42*cos(a); vRoll=1.0; }
        p.y+=uLift; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0); }`,
    fragmentShader: `uniform float uEdge,uAspect; varying float vShade; varying vec2 vUv; varying float vRoll;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(h(i),h(i+vec2(1.0,0.0)),f.x),mix(h(i+vec2(0.0,1.0)),h(i+vec2(1.0,1.0)),f.x),f.y);}
      float fbm(vec2 p){float a=0.5,s=0.0;for(int i=0;i<4;i++){s+=a*vn(p);p=p*2.03+11.7;a*=0.5;}return s;}
      void main(){ vec2 q=vec2(vUv.x*uAspect,vUv.y);
        vec3 c=vec3(0.905,0.86,0.77);
        c-=0.016*sin(q.x*560.0)*sin(q.y*560.0);                       // the weave of a primed canvas
        c-=h(floor(vUv*vec2(900.0,700.0)))*0.028;                     // fibres
        float n=fbm(q*3.4); float ridge=abs(n-0.5)*2.0;
        c*=1.0-0.07*smoothstep(0.05,0.0,ridge);                       // creases where the sheet was folded and flattened
        c+=clamp((fbm(q*2.4+0.05)-fbm(q*2.4))*1.6,-0.035,0.035);        // light catching the rumples
        c*=0.95+0.1*fbm(q*1.5+7.0);                                    // uneven age
        vec2 e=abs(vUv-0.5)*2.0; c*=1.0-0.2*pow(max(e.x,e.y),5.0);    // darker toward the edges
        if(!gl_FrontFacing) c*=0.86; c*=vShade; c*=1.0-0.3*smoothstep(uEdge-0.09,uEdge,vUv.y)*(1.0-vRoll); gl_FragColor=vec4(c,1.0); }` });
  scene.add(new Mesh(new PlaneGeometry(1, 1, 1, 160), mat));
  const fit = () => { renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.setSize(innerWidth, innerHeight, false); u.uAspect.value = innerWidth / innerHeight; };
  return { u, fit, draw: () => renderer.render(scene, cam) };
}
