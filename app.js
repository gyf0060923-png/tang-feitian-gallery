const soundtrack=document.createElement('audio');
soundtrack.id='mMusic';soundtrack.src='assets/music/wuxia2-guzheng-pipa.mp3';soundtrack.preload='none';soundtrack.loop=true;soundtrack.volume=0;document.body.append(soundtrack);
const soundButton=document.querySelector('#sound');
let musicWanted=false,fadeFrame=0;
function label(){soundButton.setAttribute('aria-pressed',String(musicWanted));soundButton.innerHTML=musicWanted?'<span>Ⅱ</span> 暂停天乐':'<span>♪</span> 听见天乐'}
function fade(target,duration,done){
  cancelAnimationFrame(fadeFrame);const from=soundtrack.volume,start=performance.now();
  function step(now){const t=Math.min(1,(now-start)/duration),ease=t*t*(3-2*t);soundtrack.volume=Math.max(0,Math.min(1,from+(target-from)*ease));if(t<1)fadeFrame=requestAnimationFrame(step);else if(done)done()}
  fadeFrame=requestAnimationFrame(step);
}
soundButton.onclick=async()=>{
  musicWanted=!musicWanted;label();
  if(!musicWanted){soundButton.removeAttribute('aria-busy');fade(0,450,()=>{if(!musicWanted)soundtrack.pause()});return}
  soundButton.setAttribute('aria-busy','true');
  try{await soundtrack.play();if(!musicWanted){soundtrack.pause();return}fade(.22,1100)}
  catch{musicWanted=false;label();soundButton.title='音乐暂未加载完成，请再次点击'}
  finally{soundButton.removeAttribute('aria-busy')}
};
soundtrack.addEventListener('error',()=>{musicWanted=false;label();soundButton.title='音乐暂未加载完成，请再次点击'});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){cancelAnimationFrame(fadeFrame);soundtrack.pause();soundtrack.volume=0}
  else if(musicWanted){soundtrack.play().then(()=>fade(.22,700)).catch(()=>{musicWanted=false;label()})}
});
label();
