// One gallery-wide view mode. The originals stay available with the same button.
window.createMuralRestoration = function ({exhibits,button,onChange,setHint}) {
  const cache=new Map(),sources=new Map();let enabled=false,busy=false,current=null,readyCount=0;
  function load(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Image unavailable'));image.src=src})}
  function pixels(image){const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;c.getContext('2d').drawImage(image,0,0);return c.toDataURL('image/png')}
  async function prepare(x){
    if(cache.has(x.src))return cache.get(x.src);
    const task=(async()=>{
      const url='assets/restored/'+x.src.split('/').at(-1).replace(/\.[^.]+$/,'.png')+'?v=20261023-restore28';
      const restored=await load(url);
      if(!x.src.endsWith('/yulin-15-flute.png'))return url;
      const original=await load(x.src);
      // Preserve the approved original foot in every tool, including particle sampling.
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${restored.naturalWidth}" height="${restored.naturalHeight}" viewBox="0 0 750 873"><defs><filter id="footTone" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0.09 0 1 0 0 0.07 0 0 1 0 0.055 0 0 0 1 0"/></filter><filter id="footEdge"><feGaussianBlur stdDeviation="3"/></filter><mask id="footMask" maskUnits="userSpaceOnUse" x="0" y="0" width="750" height="873"><path d="M72 737 Q99 738 124 727 Q146 709 164 707 Q184 709 199 724 L223 746 Q181 745 151 757 L116 778 Q102 789 87 776 Q74 765 72 751Z" fill="white" filter="url(#footEdge)"/></mask></defs><image width="750" height="873" preserveAspectRatio="none" href="${pixels(restored)}"/><image width="750" height="873" href="${pixels(original)}" filter="url(#footTone)" mask="url(#footMask)"/></svg>`;
      const composed='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
      await load(composed);return composed;
    })();
    cache.set(x.src,task);
    try{return await task}catch(error){cache.delete(x.src);throw error}
  }
  function sync(){button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-busy',String(busy));button.disabled=busy;button.innerHTML=busy?'✧ 载入 '+readyCount+'/'+exhibits.length:enabled?'✦ AI修复 · 开启':'✧ AI修复';button.title=enabled?'点击恢复全部原始壁画':'切换全部'+exhibits.length+'幅壁画的AI修复示意'}
  button.onclick=async()=>{
    if(busy)return;
    if(enabled){enabled=false;sync();onChange();return}
    busy=true;readyCount=0;sync();
    try{
      const ready=await Promise.all(exhibits.map(async x=>{const src=await prepare(x);readyCount++;sync();return src}));
      ready.forEach((src,i)=>sources.set(exhibits[i].src,src));
      enabled=true;onChange();
    }catch{setHint('修复图暂未载入完成，请再次点击重试')}
    finally{busy=false;sync()}
  };
  sync();
  return {get enabled(){return enabled},select(x){current=x;sync()},isRestored:x=>enabled&&sources.has(x.src),source:x=>enabled?(sources.get(x.src)||x.src):x.src};
};
