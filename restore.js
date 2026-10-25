// The mode changes immediately; each full image loads independently on selection.
window.createMuralRestoration=function({exhibits,button,onChange}){
 let enabled=false;
 function sync(){button.setAttribute('aria-pressed',String(enabled));button.disabled=false;button.innerHTML=enabled?'✦ AI修复 · 开启':'✧ AI修复';button.title=enabled?'点击恢复全部原始壁画':'切换全部'+exhibits.length+'幅壁画的AI修复示意'}
 button.onclick=()=>{enabled=!enabled;sync();onChange()};sync();
 return {get enabled(){return enabled},select:sync,
  source:x=>window.MuralImages.entry(x,enabled)?.full||x.src,
  isRestored:()=>enabled,
  async resolve(x,options){const wanted=enabled;if(wanted&&!window.MuralImages.entry(x,true))return {...await window.MuralImages.asset(x,false,options),restored:false,restorationError:true};try{return {...await window.MuralImages.asset(x,wanted,options),restored:wanted}}
   catch(error){if(!wanted)throw error;return {...await window.MuralImages.asset(x,false,options),restored:false,restorationError:true}}}
 };
};
