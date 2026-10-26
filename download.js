// Download the full image, keeping the displayed original/restored version.
window.MuralDownloads={
 bind(link,work,restored=false,displayedSource){
  const source=displayedSource||window.MuralImages.entry(work,restored)?.full||work.src||work.file;
  const url=new URL(source,location.href);
  const extension=url.pathname.match(/\.(webp|png|jpe?g)$/i)?.[1].toLowerCase()||'png';
  const title=[work.caveLabel||work.cave,work.name||work.title,restored?'AI修复示意':'原始壁画'].filter(Boolean).join('_').replace(/[<>:"/\\|?*\x00-\x1f]/g,'_');
  link.href=url.href;link.download=title+'.'+extension;
  link.textContent=restored?'↓ 下载修复图':'↓ 下载原图';
  link.setAttribute('aria-label','下载'+title);link.title='保存完整尺寸图片';link.hidden=false;
 }
};
