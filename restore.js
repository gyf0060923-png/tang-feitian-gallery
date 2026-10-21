// These are clearly labelled AI-generated visualizations derived from the credited originals.
window.setupMuralRestoration = function ({shell,getExhibit}) {
  const dialog=document.createElement('dialog');dialog.id='restoreDialog';
  dialog.setAttribute('aria-labelledby','restoreTitle');
  dialog.innerHTML=`<div class="restore-shell"><div class="restore-head"><div><span class="restore-eyebrow">DIGITAL RESTORATION / AI VISUALIZATION</span><h2 id="restoreTitle">AI修复 · 壁画对照</h2></div><button class="restore-close" aria-label="关闭AI修复对照">×</button></div><div class="restore-stage" style="--split:50%"><img class="restore-before" alt="敦煌研究院原始壁画"><img class="restore-after" alt="AI修复示意，仅供视觉体验"><span class="restore-tag restore-tag-before">原始壁画</span><span class="restore-tag restore-tag-after">AI修复示意</span><div class="restore-divider"><span>‹ ›</span></div><p class="restore-loading">正在载入修复示意图…</p></div><div class="restore-slider-row"><span>原始壁画</span><input type="range" min="0" max="100" value="50" aria-label="移动原图与AI修复示意图的对照分界线"><span>AI修复示意</span></div><div class="restore-foot"><p>AI推测补绘，仅供视觉体验；原始壁画保持不变。</p><a target="_blank" rel="noopener">原图来源 · 敦煌研究院 ↗</a></div></div>`;
  shell.append(dialog);
  const button=document.querySelector('#mRestore'),before=dialog.querySelector('.restore-before'),after=dialog.querySelector('.restore-after'),stage=dialog.querySelector('.restore-stage'),range=dialog.querySelector('input'),loading=dialog.querySelector('.restore-loading');
  function split(value){const v=Math.min(100,Math.max(0,Number(value)));stage.style.setProperty('--split',v+'%');range.value=String(v)}
  function fromPointer(e){const r=stage.getBoundingClientRect();split((e.clientX-r.left)/r.width*100)}
  range.addEventListener('input',()=>split(range.value));
  stage.addEventListener('pointerdown',e=>{if(!stage.classList.contains('ready'))return;stage.setPointerCapture(e.pointerId);fromPointer(e)});
  stage.addEventListener('pointermove',e=>{if(stage.hasPointerCapture(e.pointerId))fromPointer(e)});
  button.onclick=()=>{
    const x=getExhibit();dialog.querySelector('#restoreTitle').textContent='AI修复 · '+x.name;
    before.src=x.src;before.alt=x.cave+' '+x.name+'，敦煌研究院原图';
    stage.classList.remove('ready');loading.hidden=false;loading.textContent='正在载入修复示意图…';
    split(50);after.src='assets/restored/'+x.src.split('/').at(-1).replace(/\.[^.]+$/,'.png');
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
