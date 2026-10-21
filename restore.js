// These are clearly labelled AI-generated visualizations derived from the credited originals.
window.setupMuralRestoration = function ({shell,getExhibit}) {
  const dialog=document.createElement('dialog');dialog.id='restoreDialog';
  dialog.setAttribute('aria-labelledby','restoreTitle');
  dialog.innerHTML=`<div class="restore-shell"><div class="restore-head"><div><span class="restore-eyebrow">DIGITAL RESTORATION / AI VISUALIZATION</span><h2 id="restoreTitle">AI修复 · 壁画对照</h2></div><button class="restore-close" aria-label="关闭AI修复对照">×</button></div><div class="restore-stage" style="--split:50%"><img class="restore-before" alt="敦煌研究院原始壁画"><div class="restore-after"><img class="restore-generated" alt="AI修复示意，仅供视觉体验"><svg class="restore-source-foot" viewBox="0 0 750 873" preserveAspectRatio="xMidYMid meet" role="img" aria-label="保留原壁画足部细节"><defs><filter id="footTone" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0.09 0 1 0 0 0.07 0 0 1 0 0.055 0 0 0 1 0"/></filter><filter id="footEdge"><feGaussianBlur stdDeviation="3"/></filter><mask id="footSourceMask" maskUnits="userSpaceOnUse" x="0" y="0" width="750" height="873"><path d="M72 737 Q99 738 124 727 Q146 709 164 707 Q184 709 199 724 L223 746 Q181 745 151 757 L116 778 Q102 789 87 776 Q74 765 72 751Z" fill="white" filter="url(#footEdge)"/></mask></defs><image width="750" height="873" filter="url(#footTone)" mask="url(#footSourceMask)"/></svg></div><span class="restore-tag restore-tag-before">原始壁画</span><span class="restore-tag restore-tag-after">AI修复示意</span><div class="restore-divider"><span>‹ ›</span></div><p class="restore-loading">正在载入修复示意图…</p></div><div class="restore-slider-row"><span>原始壁画</span><input type="range" min="0" max="100" value="50" aria-label="移动原图与AI修复示意图的对照分界线"><span>AI修复示意</span></div><div class="restore-foot"><p>AI推测补绘，仅供视觉体验；原始壁画保持不变。</p><a target="_blank" rel="noopener">原图来源 · 敦煌研究院 ↗</a></div></div>`;
  shell.append(dialog);
  const button=document.querySelector('#mRestore'),before=dialog.querySelector('.restore-before'),after=dialog.querySelector('.restore-generated'),stage=dialog.querySelector('.restore-stage'),range=dialog.querySelector('input'),loading=dialog.querySelector('.restore-loading');
  const sourceFoot=dialog.querySelector('.restore-source-foot');
  function split(value){const v=Math.min(100,Math.max(0,Number(value)));stage.style.setProperty('--split',v+'%');range.value=String(v)}
  function fromPointer(e){const r=stage.getBoundingClientRect();split((e.clientX-r.left)/r.width*100)}
  range.addEventListener('input',()=>split(range.value));
  stage.addEventListener('pointerdown',e=>{if(!stage.classList.contains('ready'))return;stage.setPointerCapture(e.pointerId);fromPointer(e)});
  stage.addEventListener('pointermove',e=>{if(stage.hasPointerCapture(e.pointerId))fromPointer(e)});
  button.onclick=()=>{
    const x=getExhibit();dialog.querySelector('#restoreTitle').textContent='AI修复 · '+x.name;
    const keepFoot=x.src.endsWith('/yulin-15-flute.png');
    sourceFoot.style.display=keepFoot?'block':'none';
    if(keepFoot)sourceFoot.querySelector('image').setAttribute('href',x.src);
    dialog.querySelector('.restore-foot p').textContent=keepFoot?'AI推测补绘，仅供视觉体验；足部保留原壁画细节。':'AI推测补绘，仅供视觉体验；原始壁画保持不变。';
    before.src=x.src;before.alt=x.cave+' '+x.name+'，敦煌研究院原图';
    stage.classList.remove('ready');loading.hidden=false;loading.textContent='正在载入修复示意图…';
    split(50);after.src='assets/restored/'+x.src.split('/').at(-1).replace(/\.[^.]+$/,'.png')+'?v=20261021-sourcefoot19';
    after.alt=x.name+' · AI修复示意（生成补绘，非原始壁画）';
    dialog.querySelector('.restore-foot a').href=x.link;
    button.setAttribute('aria-pressed','true');dialog.showModal();
  };
  after.onload=()=>{stage.classList.add('ready');loading.hidden=true};
  after.onerror=()=>{loading.hidden=false;loading.textContent='修复示意图暂未载入，请关闭后重试'};
  dialog.querySelector('.restore-close').onclick=()=>dialog.close();
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
  dialog.addEventListener('close',()=>button.setAttribute('aria-pressed','false'));
};
