(()=>{
const data=window.TANG_PHOTOS.items.filter(x=>x.watermark===false).map(x=>({...x,src:x.file})),grid=document.querySelector('#grid'),cave=document.querySelector('#cave'),search=document.querySelector('#search');let era='全部';
const caveName=x=>x.caveLabel.replace(' · ',''),names=[...new Set(data.map(caveName))].sort((a,b)=>a.localeCompare(b,'zh-CN',{numeric:true}));
names.forEach(name=>{const option=document.createElement('option');option.value=option.textContent=name;cave.append(option)});
data.forEach(x=>{
 const card=document.createElement('article');card.className='photo-card';card.dataset.id=x.id;
 const link=document.createElement('a');link.href='index.html?work='+encodeURIComponent(x.id);link.setAttribute('aria-label',`${x.era} ${x.cave} ${x.title}，进入数字壁画展台`);
 const frame=document.createElement('div');frame.className='photo-frame';
 const img=document.createElement('img');img.alt=x.cave+' '+x.title+'，来源：'+(x.attribution||x.sourceLabel);img.loading='lazy';img.decoding='async';frame.append(img);
 const info=document.createElement('div');info.className='photo-info';
 const top=document.createElement('div');top.className='card-top';
 const title=document.createElement('h2');title.textContent=x.title;
 const tag=document.createElement('span');tag.className='era-tag';tag.textContent=x.era;top.append(title,tag);
 const loc=document.createElement('p');loc.className='location';loc.textContent=x.cave;
 info.append(top,loc);link.append(frame,info);
 const bottom=document.createElement('div');bottom.className='card-bottom source-row';
 const quality=document.createElement('span');quality.textContent='壁画实拍';
 const source=document.createElement('a');source.href=x.source;source.target='_blank';source.rel='noopener';source.textContent=x.sourceLabel+' ↗';source.title=x.attribution||x.sourceLabel;
 bottom.append(quality,source);card.append(link,bottom);grid.append(card);window.MuralImages.bind(img,x,false);
});
function filter(){const term=search.value.trim().toLowerCase();let count=0;[...grid.children].forEach((card,i)=>{const x=data[i],visible=(era==='全部'||x.era===era)&&(cave.value==='全部'||caveName(x)===cave.value)&&(!term||(x.title+x.cave+x.era).toLowerCase().includes(term));card.hidden=!visible;if(visible)count++});document.querySelector('#count').textContent=count+' 幅壁画';document.querySelector('#empty').hidden=count>0}
const restoration=window.createMuralRestoration({exhibits:data,button:document.querySelector('#pRestore'),setHint:text=>document.querySelector('#photoStatus').textContent=text,onChange:()=>{
 data.forEach((x,i)=>{const card=grid.children[i],enabled=restoration.enabled;window.MuralImages.bind(card.querySelector('img'),x,enabled,{onOriginal:()=>{card.querySelector('.card-bottom span').textContent='原图预览 · 修复图暂未载入'}});card.querySelector('img').alt=x.cave+' '+x.title+(enabled?' · AI修复示意':'，来源：'+(x.attribution||x.sourceLabel));card.querySelector('.card-bottom span').textContent=enabled?'AI修复示意':'壁画实拍';card.querySelector('a').href='index.html?work='+encodeURIComponent(x.id)+(enabled?'&restored=1':'')});
 document.querySelector('#photoStatus').textContent=restoration.enabled?'AI修复示意 · 可切回原始壁画':'点击照片进入主展台 · 每张附原始文章出处';
 document.querySelectorAll('header a').forEach(link=>link.href='index.html'+(restoration.enabled?'?restored=1':''));
}});
document.querySelector('.collection strong').textContent=data.length;
document.querySelectorAll('[data-era]').forEach(button=>button.onclick=()=>{era=button.dataset.era;document.querySelectorAll('[data-era]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filter()});cave.onchange=filter;search.oninput=filter;filter();
if(new URLSearchParams(location.search).get('restored')==='1')document.querySelector('#pRestore').click();
})();
