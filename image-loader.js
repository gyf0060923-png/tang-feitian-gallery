// One selected full image at a time; small thumbnails load independently.
window.MuralImages=(()=>{
 const pending=new Map(),ready=new Map(),bindings=new WeakMap();
 const entry=(work,restored=false)=>(window.MURAL_ASSETS||{})[work.src||work.file]?.[restored?'restored':'original'];
 const retryURL=(src,n)=>{if(!n)return src;const url=new URL(src,location.href);url.searchParams.set('retry',String(n));return url.href};
 function once(src,{timeout=12000,priority='high'}={}){return new Promise((resolve,reject)=>{
  const image=new Image();let settled=false;image.decoding='async';image.fetchPriority=priority;
  const finish=(error)=>{if(settled)return;settled=true;clearTimeout(timer);image.onload=image.onerror=null;if(error){image.src='';reject(error)}else resolve({src:image.src,image})};
  const timer=setTimeout(()=>finish(new Error('Image request timed out')),timeout);
  image.onload=()=>image.naturalWidth?finish():finish(new Error('Image has no pixels'));
  image.onerror=()=>finish(new Error('Image request failed'));image.src=src;
 })}
 function load(src,options={}){
  if(ready.has(src))return Promise.resolve(ready.get(src));if(pending.has(src))return pending.get(src);
  const attempts=options.attempts||2;
  const task=(async()=>{let error;for(let attempt=0;attempt<attempts;attempt++){
   try{const loaded=await once(retryURL(src,attempt),options);ready.set(src,loaded);if(ready.size>8)ready.delete(ready.keys().next().value);return loaded}
   catch(e){error=e;if(attempt+1<attempts){options.onRetry?.(attempt+1);await new Promise(r=>setTimeout(r,350*(attempt+1)))}}
  }throw error})();pending.set(src,task);task.then(()=>pending.delete(src),()=>pending.delete(src));return task;
 }
 async function asset(work,restored=false,options={}){
  const item=entry(work,restored),primary=item?.full||(work.src||work.file);
  try{return await load(primary,options)}catch(error){if(!item?.fallback||item.fallback===primary)throw error;return load(item.fallback,{...options,attempts:1,timeout:20000})}
 }
 function bind(image,work,restored=false,options={}){
  const item=entry(work,restored),original=entry(work,false),paths=[item?.thumb,item?.fallback,restored?original?.thumb:null,work.src||work.file].filter((x,i,a)=>x&&a.indexOf(x)===i);
  const old=bindings.get(image);if(old)clearTimeout(old.timer);
  const state={path:0,attempt:0,timer:0};bindings.set(image,state);image.dataset.mode=restored?'restored':'original';image.loading='lazy';image.decoding='async';image.fetchPriority='low';
  function setSource(){if(bindings.get(image)!==state)return;image.src=retryURL(paths[state.path],state.attempt)}
  image.onload=()=>{if(bindings.get(image)!==state)return;image.style.visibility='';image.dataset.loaded='true';const originalFallback=restored&&(paths[state.path]===original?.thumb||paths[state.path]===(work.src||work.file));if(originalFallback){image.dataset.mode='original';options.onOriginal?.()}options.onLoad?.()};
  image.onerror=()=>{if(bindings.get(image)!==state)return;if(state.attempt<1){state.attempt++;state.timer=setTimeout(setSource,400);return}if(state.path+1<paths.length){state.path++;state.attempt=0;setSource();return}image.style.visibility='hidden';image.dataset.loaded='false';options.onError?.()};
  setSource();
 }
 return {entry,load,asset,bind};
})();
