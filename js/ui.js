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
 prj:'<path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/>',back:'<path d="m15 18-6-6 6-6"/>',x:'<path d="M18 6 6 18M6 6l12 12"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',check:'<path d="M20 6 9 17l-5-5"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 down:'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',up:'<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>',trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
 pile:'<path d="M8 3h8M9 3v15l3 3 3-3V3M9 8h6M9 13h6"/>',work:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m8 12 3 3 5-6"/>',truck:'<path d="M1 6h13v10H1zM14 10h4l3 3v3h-7"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
 cal:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M7 13h4M7 17h7"/>',album:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',flow:'<rect x="3" y="3" width="7" height="6" rx="1"/><rect x="14" y="15" width="7" height="6" rx="1"/><path d="M6.5 9v4a2 2 0 0 0 2 2H14"/>',
 table:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>',box:'<path d="m12 2 9 5v10l-9 5-9-5V7z"/><path d="m3 7 9 5 9-5M12 12v10"/>',
 contract:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 17c2-3 3 1 5-1"/>',save:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
 restore:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'};
/* Nội dung nút: luôn có biểu tượng + chữ. */
export const bi=(ic,label)=>`${icon(ic,18)}<span>${esc(label)}</span>`;
export const icon=(n,s=24)=>`<svg aria-hidden="true" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;
let toastTimer;
/* Thông báo nổi: nền trắng, có biểu tượng; tự chọn loại theo nội dung (Đã… = xong, Đang… = đang chạy, còn lại = lưu ý). */
export function toast(msg,ms=2800){const t=$('#toast');const k=/^Đã /.test(msg)?'ok':/^Đang /.test(msg)?'run':'warn';
  t.className='k-'+k;t.innerHTML=icon(k==='ok'?'check':k==='run'?'restore':'info',18)+`<span>${esc(msg)}</span>`;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.hidden=true,ms)}
/* Hộp thoại đáy màn hình. Trả về phần tử; đóng bằng closeSheet(). */
export function sheet(html){closeSheet();$('#toast').hidden=true;const w=document.createElement('div');w.id='sheet';w.className='sheet-wrap';w.innerHTML=`<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  w.addEventListener('click',e=>{if(e.target===w)closeSheet()});document.body.appendChild(w);const f=w.querySelector('button,input,textarea');if(f)f.focus();return w.firstElementChild}
export function closeSheet(){const s=$('#sheet');if(s)s.remove()}
/* Hỏi xác nhận; typed: bắt gõ đúng một cụm chữ mới cho tiếp tục. */
export function confirmSheet({title,text,ok,danger,typed}){return new Promise(res=>{
  const s=sheet(`<b class="sheet-title">${esc(title)}</b><p class="mut">${esc(text)}</p>${typed?`<label class="fld">Gõ “${esc(typed)}” để xác nhận<input id="cfTyped" autocomplete="off"></label>`:''}<div class="sheet-acts"><button class="btn o" id="cfNo">${bi('x','Thôi')}</button><button class="btn ${danger?'danger':''}" id="cfOk">${bi(danger?'trash':'check',ok)}</button></div>`);
  $('#cfOk',s).onclick=()=>{if(typed&&$('#cfTyped',s).value.trim()!==typed){toast('Chưa gõ đúng cụm xác nhận');return}closeSheet();res(true)};$('#cfNo',s).onclick=()=>{closeSheet();res(false)}})}
export async function saveFile(name,blob){
  /* Khi chạy dạng trang Claude: tải về qua kênh của trang. */
  try{const dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;
    if(dl){try{await dl.save({filename:name,data:blob});toast('Đã lưu '+name);return true}catch(e){if(e&&e.code!=='declined')toast('Chưa tải được tệp ('+((e&&e.code)||'lỗi')+')');return false}}}catch(_){}
  const f=new File([blob],name,{type:blob.type||'application/octet-stream'});
  try{if(navigator.canShare&&navigator.canShare({files:[f]})&&/Android|iPhone|iPad/.test(navigator.userAgent)){await navigator.share({files:[f],title:name});return true}}catch(e){if(e&&e.name==='AbortError')return false}
  const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);toast('Đã lưu '+name);return true}

/* ----- Khung trang nhập: đầu trang có quay lại, thân là biểu mẫu, chân là thanh thao tác ----- */
export function subPage(V,{back,title,sub='',body,actions=''}){document.body.classList.add('sub');
  V.innerHTML=`<div class="hdr"><a href="${back}" aria-label="Quay lại">${icon('back')}</a><div><b>${esc(title)}</b>${sub?`<small>${esc(sub)}</small>`:''}</div></div><div class="body" style="padding-top:14px">${body}</div>${actions?`<div class="actbar"><div>${actions}</div></div>`:''}`}
export const field=(label,id,value='',o={})=>`<label class="fld">${esc(label)}${o.area?`<textarea id="${id}" ${o.ph?`placeholder="${esc(o.ph)}"`:''}>${esc(value)}</textarea>`:`<input id="${id}" value="${esc(value)}" ${o.ph?`placeholder="${esc(o.ph)}"`:''} ${o.type?`type="${o.type}"`:''} autocomplete="off">`}${o.hint?`<small>${esc(o.hint)}</small>`:''}</label>`;
/* Menu dạng lưới ô (theo kiểu menu app cũ của anh Bắc): ô trắng, biểu tượng trong khối màu nhạt, chữ dưới.
   it: {href,label,sub,ic,tone:'g'|'a'|'b'|'p'|'n',off} */
export const menuGrid=items=>`<div class="mgrid">${items.map(it=>{const inner=`${it.off?'<em class="soon">Sắp có</em>':''}<span class="mic t-${it.tone||'n'}">${icon(it.ic||'doc',26)}</span><b>${esc(it.label)}</b>`;
  return it.off?`<div class="mtile off" aria-disabled="true">${inner}</div>`:`<a class="mtile" href="${it.href}">${inner}</a>`}).join('')}</div>`;
/* Dải phím (thanh dưới, dải tab đầu trang, dải bước của hồ sơ): luôn đủ 5 ô bằng nhau, phím hòa vào dải,
   phím đang dùng sáng lên (khối nền nhạt sau biểu tượng + chữ đậm). it: {key,href,ic,label,accent,off,dot} */
export const strip=(items,active)=>{const a=items.slice(0,5);while(a.length<5)a.push(null);
  return a.map(it=>{if(!it)return'<span class="sk"></span>';const on=it.key===active;
    const inner=`<span class="ind${it.accent?' acc':''}">${icon(it.ic,22)}${it.dot?`<i class="dot ${it.dot}"></i>`:''}</span><span class="lb">${esc(it.label)}</span>`;
    return it.off?`<span class="sk off">${inner}</span>`:`<a class="sk${on?' on':''}" href="${it.href}"${on?' aria-current="page"':''}>${inner}</a>`}).join('')};
/* ===== Khuôn dải bước (QUY TẮC ĐÃ KHÓA 12/11/2026 – áp cho mọi tài liệu nhiều bước) =====
   - Luôn hiện 5 ô hình mũi tên chỉ chiều quy trình; tên ngắn trên ô, tên đầy đủ ở tiêu đề tài liệu bên dưới.
   - Bước ngoài 5 ô dồn về hai đầu thành chồng mỏng có số bước ẩn; vuốt dải để lướt (dừng đúng mép ô), chạm chồng để lùi/tiến 1 ô.
   - Vuốt chỉ để lướt, chạm ô mới mở bước; ô đang mở đưa vào giữa.
   - Màu: đã khóa xanh lá có ✓, đang làm vàng, chưa làm xám, ô đang mở xanh dương nhạt sẫm hơn.
   - Khóa bước xong tự mở bước kế tiếp.
   steps: [{short,full,state:'done'|'run'|'todo'}] ; cur: chỉ số bước đang mở. */
export const stepStrip=(steps,cur)=>`<div class="sstrip"><div class="edge l"><span></span></div><div class="sc">${steps.map((s,i)=>`<div class="ar ${s.state}${i===cur?' on':''}" data-i="${i}" role="button" tabindex="0" aria-label="Bước ${i+1} ${esc(s.full)}"><b>${s.state==='done'&&i!==cur?'✓ ':''}B${i+1}</b><span>${esc(s.short)}</span></div>`).join('')}</div><div class="edge r"><span></span></div></div>`;
export function wireStepStrip(root,n,cur,onPick){const sc=root.querySelector('.sc'),eL=root.querySelector('.edge.l'),eR=root.querySelector('.edge.r');
  const iw=()=>{const a=sc.querySelector('.ar');return a?a.getBoundingClientRect().width-4:1};
  const edges=()=>{const L=Math.max(0,Math.round(sc.scrollLeft/iw())),R=Math.max(0,n-L-5);eL.classList.toggle('no',!L);eL.firstChild.textContent=L||'';eR.classList.toggle('no',!R);eR.firstChild.textContent=R||''};
  sc.addEventListener('scroll',edges,{passive:true});eL.onclick=()=>sc.scrollBy({left:-iw(),behavior:'smooth'});eR.onclick=()=>sc.scrollBy({left:iw(),behavior:'smooth'});
  sc.querySelectorAll('.ar').forEach(a=>{a.onclick=()=>onPick(+a.dataset.i);a.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onPick(+a.dataset.i)}}});
  sc.scrollLeft=Math.max(0,Math.min(cur-2,n-5))*iw();edges()}
export const rowIc=(ic,tone='n')=>ic?`<span class="ric t-${tone}">${icon(ic,18)}</span>`:'';
export const menuRow=(href,label,right='',o={})=>o.off?`<div class="row off">${rowIc(o.ic,o.tone)}<b>${esc(label)}</b><span>${esc(right)}</span></div>`:`<a class="row" href="${href}">${rowIc(o.ic,o.tone)}<b>${esc(label)}</b><span>${esc(right)}</span><span class="chev" aria-hidden="true">›</span></a>`;
