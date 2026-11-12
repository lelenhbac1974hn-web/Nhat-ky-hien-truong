/* Tiện ích giao diện dùng chung: dựng phần tử, biểu tượng, thông báo, hộp thoại. */
export const $=(s,r=document)=>r.querySelector(s);
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const p2=n=>String(n).padStart(2,'0');
export const dayKey=(t=Date.now())=>{const d=new Date(t);return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())};
export const fDate=t=>{const d=new Date(t);return p2(d.getDate())+'/'+p2(d.getMonth()+1)+'/'+d.getFullYear()};
export const fTime=t=>{const d=new Date(t);return p2(d.getHours())+':'+p2(d.getMinutes())};
export const fSize=b=>b<1048576?Math.round(b/1024)+' KB':(b/1048576).toFixed(1).replace('.',',')+' MB';
const P={home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
 cam:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',img:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
 prj:'<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/>',back:'<path d="m15 18-6-6 6-6"/>',x:'<path d="M18 6 6 18M6 6l12 12"/>'};
export const icon=(n,s=24)=>`<svg aria-hidden="true" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;
let toastTimer;
export function toast(msg,ms=2800){const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,ms)}
/* Hộp thoại đáy màn hình. Trả về phần tử; đóng bằng closeSheet(). */
export function sheet(html){closeSheet();const w=document.createElement('div');w.id='sheet';w.className='sheet-wrap';w.innerHTML=`<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  w.addEventListener('click',e=>{if(e.target===w)closeSheet()});document.body.appendChild(w);const f=w.querySelector('button,input,textarea');if(f)f.focus();return w.firstElementChild}
export function closeSheet(){const s=$('#sheet');if(s)s.remove()}
/* Hỏi xác nhận; typed: bắt gõ đúng một cụm chữ mới cho tiếp tục. */
export function confirmSheet({title,text,ok,danger,typed}){return new Promise(res=>{
  const s=sheet(`<b class="sheet-title">${esc(title)}</b><p class="mut">${esc(text)}</p>${typed?`<label class="fld">Gõ “${esc(typed)}” để xác nhận<input id="cfTyped" autocomplete="off"></label>`:''}<button class="btn ${danger?'danger':''}" id="cfOk">${esc(ok)}</button><button class="btn o" id="cfNo">Thôi</button>`);
  $('#cfOk',s).onclick=()=>{if(typed&&$('#cfTyped',s).value.trim()!==typed){toast('Chưa gõ đúng cụm xác nhận');return}closeSheet();res(true)};$('#cfNo',s).onclick=()=>{closeSheet();res(false)}})}
export async function saveFile(name,blob){
  /* Khi chạy dạng trang Claude: tải về qua kênh của trang. */
  try{const dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;
    if(dl){try{await dl.save({filename:name,data:blob});toast('Đã lưu '+name);return true}catch(e){if(e&&e.code!=='declined')toast('Chưa tải được tệp ('+((e&&e.code)||'lỗi')+')');return false}}}catch(_){}
  const f=new File([blob],name,{type:blob.type||'application/octet-stream'});
  try{if(navigator.canShare&&navigator.canShare({files:[f]})&&/Android|iPhone|iPad/.test(navigator.userAgent)){await navigator.share({files:[f],title:name});return true}}catch(e){if(e&&e.name==='AbortError')return false}
  const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);toast('Đã lưu '+name);return true}
