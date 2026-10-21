// Decorative light is separate from the authentic mural and its colour sampler.
window.createFeitianEffects = function ({ view, img, state, setHint }) {
  const canvas = document.createElement('canvas');
  canvas.className = 'feitian-particles';
  canvas.setAttribute('aria-hidden', 'true');
  view.append(canvas);
  const ctx = canvas.getContext('2d');
  const toggle = document.querySelector('#mMotion');
  const ribbonTool = document.querySelector('[data-tool="ribbon"]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const palette = ['#d9b879', '#8eb19a', '#c07852'];
  // Normalized, manually traced ribbon details in the seven source photographs.
  const paths = [
    [[[.73,.07],[.69,.04],[.65,.07],[.69,.1],[.6,.13],[.5,.13],[.4,.07],[.33,.04],[.29,.07],[.31,.16],[.32,.24],[.4,.26],[.46,.22],[.48,.24],[.47,.28]], [[.63,.5],[.5,.54],[.39,.55],[.27,.51],[.21,.42],[.17,.4],[.13,.42],[.13,.49],[.2,.6],[.33,.67],[.46,.69],[.55,.66]]],
    [[[.15,.24],[.22,.28],[.2,.37],[.16,.44],[.2,.54],[.29,.59],[.42,.64],[.5,.65]], [[.91,.4],[.86,.42],[.85,.5],[.89,.54],[.87,.6],[.8,.66],[.73,.74],[.7,.83]]],
    [[[.23,.12],[.32,.14],[.39,.18],[.44,.16],[.49,.19]], [[.55,.87],[.61,.84],[.67,.85],[.72,.8],[.77,.78]]],
    [[[.09,.32],[.06,.46],[.04,.63],[.03,.72],[.06,.75],[.1,.7],[.14,.59],[.2,.46],[.3,.4],[.41,.39]], [[.65,.27],[.73,.25],[.82,.31],[.88,.43],[.94,.48],[.97,.55],[.96,.63]]],
    [[[.12,.06],[.23,.05],[.33,.02],[.37,.05],[.3,.15],[.16,.24],[.09,.35],[.11,.45],[.23,.42],[.33,.34]], [[.63,.22],[.66,.34],[.71,.4],[.69,.48],[.6,.51],[.5,.6],[.43,.67]]],
    [[[.5,.27],[.45,.26],[.42,.3],[.43,.36],[.48,.44],[.5,.53],[.48,.67],[.46,.77],[.42,.82],[.35,.83]], [[.66,.2],[.65,.29],[.6,.37],[.59,.5],[.57,.64],[.54,.77]]],
    [[[.2,.15],[.18,.18],[.17,.23],[.2,.25],[.24,.21],[.28,.17],[.35,.17]], [[.55,.16],[.61,.17],[.66,.2],[.69,.25],[.72,.27]]]
  ];
  let width = 1, height = 1, dust = [], petals = [], reveal = [];
  let enabled = !reduced.matches, userChoice = false, frame = 0, last = 0;
  let pointer = { x: -1000, y: -1000 }, down = null, speed = 0;
  let current = 3, lines = [], activeLine = -1, flowStart = 0, revealStart = 0;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const random = (a, b) => a + Math.random() * (b - a);
  const ease = t => 1 - Math.pow(1 - t, 3);

  function smooth(points) {
    const out = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[Math.max(0, i - 1)], b = points[i], c = points[i + 1], d = points[Math.min(points.length - 1, i + 2)];
      for (let j = 0; j < 20; j++) {
        const t = j / 20, t2 = t*t, t3 = t2*t;
        out.push([0, 1].map(k => .5 * (2*b[k] + (-a[k]+c[k])*t + (2*a[k]-5*b[k]+4*c[k]-d[k])*t2 + (-a[k]+3*b[k]-3*c[k]+d[k])*t3)));
      }
    }
    out.push(points[points.length - 1]);
    // Arc-length resampling keeps light moving at a steady speed along bends.
    const lengths = [0];
    for (let i=1;i<out.length;i++) lengths[i]=lengths[i-1]+Math.hypot(out[i][0]-out[i-1][0],out[i][1]-out[i-1][1]);
    const result=[];let j=1;
    for(let i=0;i<=240;i++) {
      const target=lengths.at(-1)*i/240;
      while(j<out.length-1&&lengths[j]<target)j++;
      const f=(target-lengths[j-1])/(lengths[j]-lengths[j-1]||1);
      result.push(out[j].map((v,k)=>out[j-1][k]+(v-out[j-1][k])*f));
    }
    return result;
  }
  function imagePoint(p, s) {
    return [width/2+s.tx+(p[0]-.5)*s.baseW*s.scale, height/2+s.ty+(p[1]-.5)*s.baseH*s.scale];
  }
  function at(line, t, s) {
    const n=clamp(t,0,1)*(line.length-1), i=Math.floor(n), j=Math.min(i+1,line.length-1), f=n-i;
    return imagePoint(line[i].map((v,k)=>v+(line[j][k]-v)*f),s);
  }
  function resize() {
    const r=view.getBoundingClientRect(); width=view.clientWidth; height=view.clientHeight;
    const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    dust=Array.from({length:clamp(Math.round(width*height/8500),45,115)},()=>({u:Math.random(),v:Math.random(),ox:0,oy:0,vx:0,vy:0,r:random(.5,1.5),phase:random(0,6.28)}));
    // A size change must not leave an image hidden mid-transition.
    finishReveal();
  }
  function finishReveal() { reveal=[];revealStart=0;img.style.opacity=''; }
  function stop() { cancelAnimationFrame(frame);frame=0;last=0;ctx.clearRect(0,0,width,height);finishReveal();petals=[];activeLine=-1; }
  function start() { if(enabled&&!document.hidden&&!frame)frame=requestAnimationFrame(draw); }
  function sync() {
    toggle.setAttribute('aria-pressed',String(enabled));
    toggle.innerHTML=`<span>${enabled?'✧':'○'}</span> 动效${enabled?'开启':'关闭'}`;
    canvas.hidden=!enabled; view.dataset.motion=enabled?'on':'off';
    if(enabled)start();else stop();
  }
  toggle.onclick=()=>{userChoice=true;enabled=!enabled;sync();setHint(enabled?'指尖生风 · 点击「衣带流光」循线触发，轻点画外散花':'动效已关闭 · 可静看原图、拖动与缩放')};
  reduced.addEventListener('change',()=>{if(!userChoice){enabled=!reduced.matches;sync()}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start()});

  function nearest(x,y,s) {
    let distance=Infinity, index=-1;
    lines.forEach((line,i)=>line.forEach((p,j)=>{if(j%3)return;const v=imagePoint(p,s),d=Math.hypot(x-v[0],y-v[1]);if(d<distance){distance=d;index=i}}));
    return {distance,index};
  }
  function activate(index) {
    if(!enabled){enabled=true;userChoice=true;sync()}
    activeLine=index;flowStart=performance.now();speed=0;
    setHint('衣带流光 · 沿飘带移动更快，流光也会加速');
  }
  ribbonTool.addEventListener('click',()=>{
    if(!enabled){enabled=true;userChoice=true;sync()}
    activate(0);
    setHint('点击金色飘带引线，让流光循衣而行 · 方向键与滚轮仍可漫游');
  });
  view.addEventListener('pointermove',e=>{
    const r=view.getBoundingClientRect(),x=e.clientX-r.left-view.clientLeft,y=e.clientY-r.top-view.clientTop;
    if(pointer.x>-900)speed=Math.min(2.2,speed+Math.hypot(x-pointer.x,y-pointer.y)*.003);
    pointer={x,y};
  });
  view.addEventListener('pointerleave',()=>{pointer={x:-1000,y:-1000}});
  view.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;down={x:e.clientX,y:e.clientY,id:e.pointerId,multi:!e.isPrimary}});
  view.addEventListener('pointercancel',()=>down=null);
  view.addEventListener('pointerup',e=>{
    const press=down;down=null;
    if(!enabled||!press||press.multi||press.id!==e.pointerId||Math.hypot(e.clientX-press.x,e.clientY-press.y)>6||e.target.closest('button'))return;
    const s=state();if(s.tool==='pick'||s.tool==='loupe')return;
    const r=view.getBoundingClientRect(),x=e.clientX-r.left-view.clientLeft,y=e.clientY-r.top-view.clientTop;
    const hit=nearest(x,y,s);
    if(hit.distance<24){activate(hit.index);return}
    const a=imagePoint([0,0],s), b=imagePoint([1,1],s);
    if(x<a[0]||x>b[0]||y<a[1]||y>b[1])scatter(x,y);
  });
  function scatter(x,y) {
    for(let i=0;i<22;i++){
      const angle=random(0,Math.PI*2),v=random(25,95);
      petals.push({x,y,vx:Math.cos(angle)*v,vy:Math.sin(angle)*v-20,age:0,life:random(1.3,2.4),angle,spin:random(-2,2),r:random(2,5),color:palette[i%3]});
    }
    petals=petals.slice(-110);
  }
  function glow(x,y,r,color,alpha) {
    ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  }
  function draw(now) {
    frame=0;if(!enabled||document.hidden)return;
    const dt=Math.min((now-(last||now-16))/1000,.04);last=now;const s=state();
    ctx.clearRect(0,0,width,height);ctx.globalCompositeOperation='source-over';
    const a=imagePoint([0,0],s), b=imagePoint([1,1],s);
    // Clip ambient dust out of the mural, preserving faces and brushwork.
    ctx.save();ctx.beginPath();ctx.rect(0,0,width,height);ctx.rect(a[0],a[1],b[0]-a[0],b[1]-a[1]);ctx.clip('evenodd');
    dust.forEach(p=>{
      const homeX=p.u*width+Math.sin(now*.00014+p.phase)*12,homeY=((p.v*height-now*.006)%height+height)%height;
      const dx=homeX+p.ox-pointer.x,dy=homeY+p.oy-pointer.y,d=Math.hypot(dx,dy);
      if(d<125&&d>1){const f=(1-d/125)*100;p.vx+=dx/d*f*dt;p.vy+=dy/d*f*dt}
      p.vx+=(-p.ox*1.9-p.vx*2.5)*dt;p.vy+=(-p.oy*1.9-p.vy*2.5)*dt;p.ox+=p.vx*dt;p.oy+=p.vy*dt;
      glow(homeX+p.ox,homeY+p.oy,p.r,'#d9b879',.23+.2*Math.sin(now*.001+p.phase)**2);
    });ctx.restore();
    const guide=s.tool==='ribbon';
    if(guide){
      lines.forEach((line,i)=>{
        ctx.beginPath();line.forEach((p,j)=>{const v=imagePoint(p,s);j?ctx.lineTo(...v):ctx.moveTo(...v)});
        ctx.globalAlpha=.65;ctx.strokeStyle='#f6d695';ctx.lineWidth=1.25;ctx.setLineDash([3,8]);ctx.stroke();ctx.setLineDash([]);
        const v=at(line,.08,s);ctx.globalAlpha=.8;ctx.strokeStyle='#e7c184';ctx.beginPath();ctx.arc(...v,7+Math.sin(now*.003)*1.5,0,Math.PI*2);ctx.stroke();
      });
    }
    speed*=Math.exp(-dt*2);
    if(activeLine>=0){
      const elapsed=(now-flowStart)/1000;
      if(elapsed>8)activeLine=-1;
      else {
        const line=lines[activeLine],fade=Math.min(elapsed*3,1,8-elapsed);
        // A small train of light follows the photograph's ribbon, without filling its surface.
        flowPhase+=(.15+speed*.17)*dt;
        ctx.globalCompositeOperation='lighter';
        for(let head=0;head<3;head++)for(let j=0;j<34;j++){
          const t=((flowPhase+head/3-j*.003)%1+1)%1,v=at(line,t,s),alpha=(1-j/34)*fade*.8;
          glow(v[0],v[1],j===0?3:1.7,palette[head],alpha);
          if(j%6===0)glow(v[0]+Math.sin(j*2+now*.002)*4,v[1]+Math.cos(j+now*.002)*4,.8,'#e8d3a1',alpha*.7);
        }
        ctx.globalCompositeOperation='source-over';
      }
    }
    petals=petals.filter(p=>p.age<p.life);
    petals.forEach(p=>{
      p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-dt*.8);p.vy+=10*dt;p.angle+=p.spin*dt;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.globalAlpha=Math.sin(Math.PI*clamp(p.age/p.life,0,1))*.8;ctx.fillStyle=p.color;
      ctx.beginPath();ctx.moveTo(0,-p.r);ctx.bezierCurveTo(p.r,0,p.r,p.r,0,p.r*1.6);ctx.bezierCurveTo(-p.r,p.r,-p.r,0,0,-p.r);ctx.fill();ctx.restore();
    });
    if(revealStart){
      const t=clamp((now-revealStart)/1050,0,1),f=ease(t);
      img.style.opacity=String(clamp((t-.25)/.45,0,1));
      reveal.forEach(p=>{
        const target=imagePoint([p.u,p.v],s),x=target[0]+p.dx*(1-f),y=target[1]+p.dy*(1-f);
        glow(x,y,p.r*(1-t*.4),p.color,(1-t)*.9);
      });
      if(t>=1)finishReveal();
    }
    ctx.globalAlpha=1;frame=requestAnimationFrame(draw);
  }
  let flowPhase=0;
  new ResizeObserver(resize).observe(view);
  resize();sync();
  return {
    prepare(index){current=index;lines=paths[current].map(smooth);activeLine=-1;finishReveal();petals=[];},
    reveal(){
      if(!enabled||document.hidden||!img.naturalWidth)return;
      const sample=document.createElement('canvas'),w=48,h=Math.max(12,Math.round(48*img.naturalHeight/img.naturalWidth));
      sample.width=w;sample.height=h;const c=sample.getContext('2d',{willReadFrequently:true});
      try {
        c.drawImage(img,0,0,w,h);const pixels=c.getImageData(0,0,w,h).data;reveal=[];
        const step=Math.max(1,Math.ceil(w*h/1600));
        for(let i=0;i<w*h;i+=step){
          const j=i*4;if(pixels[j+3]<100)continue;
          const a=random(0,Math.PI*2),d=random(35,180);
          reveal.push({u:(i%w+.5)/w,v:(Math.floor(i/w)+.5)/h,dx:Math.cos(a)*d,dy:Math.sin(a)*d,r:random(1.1,2.6),color:`rgb(${pixels[j]},${pixels[j+1]},${pixels[j+2]})`});
        }
        revealStart=performance.now();img.style.opacity='0';start();
      } catch { finishReveal(); }
    }
  };
};
