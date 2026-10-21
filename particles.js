// Real photographs remain intact between changes. Matched source-colour grains bridge two works.
window.createFeitianEffects = function ({view,img,state,setHint}) {
  const canvas=document.createElement('canvas');canvas.className='feitian-particles';canvas.setAttribute('aria-hidden','true');view.append(canvas);
  const ctx=canvas.getContext('2d'),toggle=document.querySelector('#mMotion'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let width=1,height=1,dust=[],enabled=!reduced.matches,chosen=false,frame=0,last=0;
  let initialized=false,token=0,scene=null,pointer={x:-1000,y:-1000};
  const random=(a,b)=>a+Math.random()*(b-a),clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const gaussian=()=>Math.sqrt(-2*Math.log(Math.max(.00001,Math.random())))*Math.cos(Math.PI*2*Math.random());
  const ease=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
  const mix=(a,b,t)=>a+(b-a)*t;
  function point(u,v,s){return[width/2+s.tx+(u-.5)*s.baseW*s.scale,height/2+s.ty+(v-.5)*s.baseH*s.scale]}
  function finish(commit=false){
    const old=scene;scene=null;if(commit&&old&&!old.committed)old.commit();
    img.style.opacity='';view.classList.remove('changing');
  }
  function resize(){
    finish(true);width=view.clientWidth;height=view.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    const n=clamp(Math.round(width*height/4200),90,200);
    dust=Array.from({length:n},()=>({u:Math.random(),v:Math.random(),ox:0,oy:0,vx:0,vy:0,r:random(.35,.95),phase:random(0,6.28)}));
  }
  function start(){if(enabled&&!document.hidden&&!frame)frame=requestAnimationFrame(draw)}
  function stop(){cancelAnimationFrame(frame);frame=0;last=0;finish(true);ctx.clearRect(0,0,width,height)}
  function sync(){toggle.setAttribute('aria-pressed',String(enabled));toggle.innerHTML=`<span>${enabled?'✧':'○'}</span> 动效${enabled?'开启':'关闭'}`;canvas.hidden=!enabled;view.dataset.motion=enabled?'on':'off';if(enabled)start();else stop()}
  toggle.onclick=()=>{chosen=true;enabled=!enabled;sync();setHint(enabled?'原图静赏 · 切换时前画散开、后画凝聚':'动效已关闭 · 拖动与缩放细赏原图')};
  reduced.addEventListener('change',()=>{if(!chosen){enabled=!reduced.matches;sync()}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});
  view.addEventListener('pointermove',e=>{const r=view.getBoundingClientRect();pointer={x:e.clientX-r.left-view.clientLeft,y:e.clientY-r.top-view.clientTop}});
  view.addEventListener('pointerleave',()=>pointer={x:-1000,y:-1000});
  function dot(x,y,r,color,alpha){ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
  function draw(now){
    frame=0;if(!enabled||document.hidden)return;
    const dt=Math.min((now-(last||now-16))/1000,.04);last=now;const s=state();ctx.clearRect(0,0,width,height);
    const a=point(0,0,s),b=point(1,1,s);
    ctx.save();ctx.beginPath();ctx.rect(0,0,width,height);ctx.rect(a[0],a[1],b[0]-a[0],b[1]-a[1]);ctx.clip('evenodd');
    dust.forEach(p=>{
      const x=p.u*width+Math.sin(now*.0002+p.phase)*16,y=((p.v*height-now*.009)%height+height)%height;
      const dx=x+p.ox-pointer.x,dy=y+p.oy-pointer.y,d=Math.hypot(dx,dy);
      if(d<140&&d>1){const f=(1-d/140)*250;p.vx+=dx/d*f*dt;p.vy+=dy/d*f*dt}
      p.vx+=(-p.ox*1.9-p.vx*2.5)*dt;p.vy+=(-p.oy*1.9-p.vy*2.5)*dt;p.ox+=p.vx*dt;p.oy+=p.vy*dt;
      dot(x+p.ox,y+p.oy,p.r,'#d5c19c',.34+.28*Math.sin(now*.001+p.phase)**2);
    });ctx.restore();
    if(scene){
      const current=scene,t=clamp((now-current.start)/1000);
      if(t>=.58&&!current.committed){current.committed=true;current.commit();img.style.opacity='0'}
      const reveal=ease((t-.9)/.1),disappear=ease(t/.15),colour=ease((t-.58)/.32);
      img.style.opacity=String(current.committed?reveal:1-disappear);
      const opacity=ease(t/.12)*(1-reveal);
      // Rotation ends before gathering begins; the dispersed volume holds its angle.
      const turn=ease(t/.55),angle=Math.PI*turn,cs=Math.cos(angle),sn=Math.sin(angle);
      const tilt=.22*turn,ct=Math.cos(tilt),st=Math.sin(tilt),focal=Math.max(width,height)*1.45;
      current.points.forEach(p=>{
        const spread=1-Math.pow(1-clamp((t-p.delay)/.55),3);
        const gather=ease((t-.6-p.delay)/.34);
        // Every grain departs its own source pixel along an independent outward path.
        // No common radius, spherical destination, or bounded cloud silhouette.
        const dx=p.sx+p.vx*spread,dy=p.sy+p.vy*spread,dz=p.vz*spread;
        const rx=dx*cs+dz*sn,rz=-dx*sn+dz*cs;
        const ry=dy*ct-rz*st,depth=dy*st+rz*ct,perspective=focal/(focal-clamp(depth,-focal*.6,focal*.6));
        const vx=width/2+rx*perspective,vy=height/2+ry*perspective;
        const x=mix(vx,p.bx,gather),y=mix(vy,p.by,gather);
        const color=colour<.001?p.old:colour>.999?p.next:`rgb(${Math.round(mix(p.c0[0],p.c1[0],colour))},${Math.round(mix(p.c0[1],p.c1[1],colour))},${Math.round(mix(p.c0[2],p.c1[2],colour))})`;
        const volume=spread*(1-gather),size=1+(perspective-1)*volume;
        dot(x,y,p.r*size,color,opacity*(.92+Math.min(.06,depth/focal*.25)*volume));
      });
      if(t>=1)finish(true);
    }
    ctx.globalAlpha=1;frame=requestAnimationFrame(draw);
  }
  function sample(image,cols,rows){const c=document.createElement('canvas');c.width=cols;c.height=rows;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(image,0,0,cols,rows);return g.getImageData(0,0,cols,rows).data}
  function animate(next,commit){
    try{
      const cols=150,rows=120,c0=sample(img,cols,rows),c1=sample(next,cols,rows),old=state();
      const k=Math.min((width-80)/next.naturalWidth,(height-65)/next.naturalHeight),nw=next.naturalWidth*k,nh=next.naturalHeight*k,points=[];
      for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
        const u=(x+random(.2,.8))/cols,v=(y+random(.2,.8))/rows,i=(y*cols+x)*4;
        const a=point(u,v,old),bx=width/2+(u-.5)*nw,by=height/2+(v-.5)*nh;
        const first=[c0[i],c0[i+1],c0[i+2]],second=[c1[i],c1[i+1],c1[i+2]];
        const sx=a[0]-width/2,sy=a[1]-height/2;
        const vx=(u-.5)*width*random(.45,1.25)+gaussian()*width*.15;
        const vy=(v-.5)*height*random(.45,1.25)+gaussian()*height*.17;
        const vz=gaussian()*Math.max(width,height)*.27;
        points.push({bx,by,sx,sy,vx,vy,vz,delay:random(0,.018),r:random(.45,1.05),c0:first,c1:second,old:`rgb(${first})`,next:`rgb(${second})`});
      }
      scene={points,commit,committed:false,start:performance.now()};view.classList.add('changing');start();
    }catch{commit();finish()}
  }
  new ResizeObserver(resize).observe(view);resize();sync();
  return {
    change(index,commit,src){
      const id=++token;finish();
      if(!initialized||index===state().active||!enabled||document.hidden){initialized=true;commit();return}
      const next=new Image();next.onload=()=>{if(id!==token)return;if(!enabled||document.hidden){commit();return}animate(next,commit)};
      next.onerror=()=>{if(id===token)setHint('壁画暂未加载完成，可再次选择作品')};next.src=src;
    },
    imageLoaded(){if(scene)img.style.opacity='0'}
  };
};
