import cv2, numpy as np, sys
from PIL import Image
rng=np.random.default_rng(7)
S=720
def build(path, box, face, out, frames=36, cell=360, K=1):
    im=Image.open(path).convert('RGB').crop(box).resize((S,S),Image.LANCZOS)
    arr=np.array(im); g=cv2.cvtColor(arr,cv2.COLOR_RGB2GRAY)
    fx,fy,fr=face[0]*S,face[1]*S,face[2]*S
    yy,xx=np.mgrid[0:S,0:S].astype(np.float32)
    # cut the sitter from the backdrop
    m=np.full((S,S),cv2.GC_PR_BGD,np.uint8)
    body=((xx-fx)/(fr*1.15))**2+((yy-fy)/(fr*1.45))**2<1; m[body]=cv2.GC_PR_FGD
    core=((xx-fx)/(fr*0.6))**2+((yy-fy)/(fr*0.8))**2<1; m[core]=cv2.GC_FGD
    m[(yy>fy+fr*1.5)&(np.abs(xx-fx)<fr*1.6)]=cv2.GC_PR_FGD
    m[:int(max(0,fy-fr*1.9))]=cv2.GC_BGD; m[:,:6]=cv2.GC_BGD; m[:,-6:]=cv2.GC_BGD
    cv2.grabCut(cv2.cvtColor(arr,cv2.COLOR_RGB2BGR),m,None,np.zeros((1,65)),np.zeros((1,65)),6,cv2.GC_INIT_WITH_MASK)
    subj=cv2.GaussianBlur(((m==cv2.GC_FGD)|(m==cv2.GC_PR_FGD)).astype(np.float32),(0,0),5)
    L=cv2.GaussianBlur(g.astype(np.float32)/255,(0,0),1.3)
    inside=L[core]; lo,hi_=np.percentile(inside,4),np.percentile(inside,98.5)
    L=np.clip((L-lo)/(hi_-lo),0,1)**0.9
    r=np.sqrt(((xx-fx)/(fr*1.9))**2+((yy-(fy+fr*0.45))/(fr*2.3))**2)
    edgef=np.clip(np.minimum(np.minimum(xx,S-xx),np.minimum(yy,S-yy))/90,0,1)
    vig=np.clip(1.2-r,0,1)**1.2*subj*edgef
    cv2.imwrite(out+'-mask.png',(np.dstack([L,L,L])*vig[...,None]*255).astype(np.uint8))
    b=cv2.GaussianBlur(L,(0,0),3.2); gx=cv2.Sobel(b,cv2.CV_32F,1,0,ksize=3); gy=cv2.Sobel(b,cv2.CV_32F,0,1,ksize=3)
    mag=np.sqrt(gx*gx+gy*gy); e=np.clip(mag/np.percentile(mag,96),0,1)
    tang=np.arctan2(gy,gx)+np.pi/2
    def field(th0):
        v=e[...,None]*np.dstack([np.cos(2*tang),np.sin(2*tang)])+(1-e[...,None])*0.55*np.array([np.cos(2*th0),np.sin(2*th0)],np.float32)
        v=cv2.GaussianBlur(v,(0,0),4); return 0.5*np.arctan2(v[...,1],v[...,0])
    strokes=[]
    def lay(density, th0, n, col, wid, steps):
        F=field(th0); pts=rng.random((n,2))*S
        acc=rng.random(n)<density[pts[:,1].astype(int),pts[:,0].astype(int)]
        for (x,y) in pts[acc]:
            ln=int(rng.integers(steps[0],steps[1])); a=[]; 
            for sgn in (-1,1):
                px,py=x,y; seg=[]
                for _ in range(ln//2):
                    ix,iy=int(px),int(py)
                    if not(0<=ix<S and 0<=iy<S): break
                    th=F[iy,ix]+rng.normal(0,0.05); px+=sgn*3.2*np.cos(th); py+=sgn*3.2*np.sin(th); seg.append((px,py))
                a.append(seg)
            pl=a[0][::-1]+[(x,y)]+a[1]
            if len(pl)>3: strokes.append((np.array(pl,np.float32),col,wid))
    # engraver's hatching: straight parallel lines that break where the tone falls away, so the likeness comes from the photograph itself
    def hatch(th, gap, test, col, off=0.0):
        c,sn=np.cos(th),np.sin(th); R=S*0.75
        for k in np.arange(-R,R,gap):
            o=k+off+rng.normal(0,0.5); bias=rng.normal(0,0.05); run=[]
            for u in np.arange(-R,R,3.0):
                x=S/2+u*c-o*sn; y=S/2+u*sn+o*c
                ok=0<=x<S-1 and 0<=y<S-1 and test(L[int(y),int(x)]+bias+rng.normal(0,0.025))*vig[int(y),int(x)]>0.5
                if ok: run.append((x+rng.normal(0,0.25),y+rng.normal(0,0.25)))
                else:
                    if len(run)>=3: strokes.append((np.array(run,np.float32),col,1))
                    run=[]
            if len(run)>=3: strokes.append((np.array(run,np.float32),col,1))
    hatch(np.deg2rad(-52),3.4,lambda v: 1.0 if v>0.36 else 0.0,0)
    hatch(np.deg2rad(28),3.8,lambda v: 1.0 if v>0.56 else 0.0,0)
    hatch(np.deg2rad(-8),4.2,lambda v: 1.0 if v>0.78 else 0.0,0)
    hatch(np.deg2rad(-52),4.0,lambda v: 1.0 if v<0.1 else 0.0,1,1.8)
    hatch(np.deg2rad(-52),5.0,lambda v: 1.0 if 0.2<v<=0.36 else 0.0,1,0.9)
    # contours, traced from the photograph: eyes, glasses, mouth, jaw
    can=cv2.Canny((cv2.GaussianBlur(L,(0,0),2.2)*255).astype(np.uint8),24,64)
    can[vig<0.25]=0
    cs,_=cv2.findContours(can,cv2.RETR_LIST,cv2.CHAIN_APPROX_NONE)
    for c_ in cs:
        if len(c_)<28: continue
        p=c_[:len(c_)//2+1,0,:].astype(np.float32)[::3]
        if len(p)>3: strokes.append((p+rng.normal(0,0.3,p.shape).astype(np.float32),0,1))
    print(out,len(strokes),'strokes')
    head=np.clip((fy+fr*1.25-yy)/(fr*0.9),0,1)                      # 1 on the head, 0 at the shoulders
    bump=np.exp(-(((xx-fx)/(fr*0.62))**2+((yy-fy)/(fr*0.8))**2))    # the front of the face travels furthest
    strip=Image.new('RGBA',(cell*frames,cell),(0,0,0,0))
    cols=[(239,233,221),(240,171,136)]
    for f in range(frames):
        t=f/frames; s=np.sin(2*np.pi*t); s2=np.sin(2*np.pi*t+0.9)
        dX=(8.5*s*bump+3.0*s*head).astype(np.float32); dY=(2.2*s2*bump+1.2*s2*head).astype(np.float32)
        ang=np.deg2rad(1.1)*s2
        jit=np.random.default_rng(100+f//3)
        masks=[np.zeros((S,S),np.uint8),np.zeros((S,S),np.uint8)]
        for pl,col,wid in strokes:
            ix=np.clip(pl[:,0].astype(int),0,S-1); iy=np.clip(pl[:,1].astype(int),0,S-1)
            h=head[iy,ix]; x=pl[:,0]+dX[iy,ix]; y=pl[:,1]+dY[iy,ix]
            px,py=fx,fy+fr*1.3; rx=x-px; ry=y-py
            x=px+rx*np.cos(ang*h)-ry*np.sin(ang*h); y=py+rx*np.sin(ang*h)+ry*np.cos(ang*h)
            o=jit.normal(0,0.55,2)
            q=np.stack([x+o[0],y+o[1]],1)
            cv2.polylines(masks[col],[np.round(q*8).astype(np.int32)],False,255,wid,cv2.LINE_AA,3)
        a=np.maximum(masks[0],masks[1]).astype(np.float32)/255; w0=masks[0].astype(np.float32)/255; w1=masks[1].astype(np.float32)/255; tot=np.maximum(w0+w1,1e-4)
        rgb=(w0[...,None]*np.array(cols[0])+w1[...,None]*np.array(cols[1]))/tot[...,None]
        fr_=np.dstack([rgb,np.clip(a,0,1)**0.8*255]).astype(np.uint8)
        im2=Image.fromarray(fr_,'RGBA').resize((cell,cell),Image.LANCZOS); strip.paste(im2,(f*cell,0))
    strip.save(out+'.webp','WEBP',quality=72,method=6)
    # preview on the page colour: four frames
    pv=Image.new('RGB',(cell*4,cell),(27,25,23))
    for k,f in enumerate([0,frames//4,frames//2,3*frames//4] if frames>=8 else [0]): c=strip.crop((f*cell,0,(f+1)*cell,cell)); pv.paste(c,(k*cell,0),c)
    pv.save(out+'-pv.png')
    import os; print(os.path.getsize(out+'.webp')//1024,'KB')
R='/home/claude/chukadele/chuka-personal-site/public/'
which=sys.argv[1]
FR=int(sys.argv[2]) if len(sys.argv)>2 else 36
if which=='front': build(R+'images/portraits/chuka-about.webp',(338,290,1118,1070),(0.5,0.46,0.26),'drawn-front',FR,300)
if which=='glasses': build(R+'press/chuka-dele-oyeleru-headshot.jpg',(201,376,1101,1276),(0.5,0.52,0.33),'drawn-glasses',FR)
if which=='profile': build('ph/image.jpg',(900,1300,4300,4700),(0.42,0.44,0.2),'drawn-profile',FR)
