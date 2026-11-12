/* Các màn hình nền chung: Hôm nay, Hồ sơ, Kho ảnh, Camera, Dự án. */
import * as db from './db.js';import * as photos from './photos.js';import * as zip from './zip.js';
import {S,createProject,saveProject,saveSettings,watchGps,gpsText,load} from './state.js';
import {$,esc,icon,toast,sheet,closeSheet,confirmSheet,saveFile,dayKey,fDate,fTime,fSize,p2} from './ui.js';
export const KIND={coc:['Nghiệm thu cọc','g'],khac:['Nghiệm thu','g'],hang:['Nhận hàng','a'],ngay:['Báo cáo ngày','b'],anh:['Báo cáo ảnh','n']};
const WD=['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const top=(small,h1,extra='')=>`<div class="top"><small>${esc(small)}</small><h1>${esc(h1)}</h1>${extra}</div>`;
const needProject=()=>`<div class="body"><div class="card"><b>Chưa có dự án</b><p class="mut">Tạo dự án trước khi chụp ảnh và lập hồ sơ.</p><a class="btn" href="#project">Tạo dự án</a></div></div>`;
const records=()=>S.project?db.ofProject('records',S.project.id).then(a=>a.reverse()):Promise.resolve([]);

/* ---------- Hôm nay ---------- */
export async function today(V){const d=new Date();
  if(!S.project){V.innerHTML=top(WD[d.getDay()]+' '+fDate(d),'Việc hôm nay')+needProject();return}
  watchGps();const recs=await records(),drafts=recs.filter(r=>r.status==='nhap'),hasDaily=recs.some(r=>r.kind==='ngay'&&r.day===dayKey());
  const place=S.project.place||'Chưa ghi địa danh';
  V.innerHTML=top(`${WD[d.getDay()]} ${p2(d.getDate())}/${p2(d.getMonth()+1)} · ${S.project.name}`,'Việc hôm nay',`<a class="lnk" href="#project">${esc(place)} · <span id="gpsLine">${esc(gpsText(S.gps))}</span></a>`)+`<div class="body">
   <div class="sec">Đang làm dở</div>${drafts.length?drafts.slice(0,6).map(taskRow).join(''):'<p class="mut">Không có hồ sơ nào đang làm dở.</p>'}
   ${hasDaily?'':`<div class="sec">Cần lập</div><div class="task"><i style="background:var(--b)"></i><div><span class="tag b">Báo cáo ngày</span><b>Báo cáo ${p2(d.getDate())}/${p2(d.getMonth()+1)}</b><span>Chưa lập</span></div></div>`}
   <div class="sec">Lập mới</div><div class="grid2">${[['coc','Nghiệm thu cọc'],['khac','Nghiệm thu khác'],['hang','Nhận hàng'],['ngay','Báo cáo ngày'],['anh','Báo cáo ảnh']].map(([k,t],i)=>`<button class="btn o" data-new="${k}" ${i===4?'style="grid-column:1/-1"':''}>${t}</button>`).join('')}</div></div>`;
  V.querySelectorAll('[data-new]').forEach(b=>b.onclick=()=>toast('“'+b.textContent+'” thuộc khối sau, chưa có trong bản nền chung này'));
  const g=()=>{const e=$('#gpsLine');if(e)e.textContent=gpsText(S.gps)};addEventListener('ap-gps',g,{once:true})}
const taskRow=r=>{const[k,c]=KIND[r.kind]||['Hồ sơ','n'];return`<a class="task" href="#records"><i style="background:var(--${c})"></i><div><span class="tag ${c}">${k}</span><b>${esc(r.title||'Chưa đặt tên')}</b><span>${esc(r.note||'Nháp')} · ${fDate(r.updatedAt)}</span></div></a>`};

/* ---------- Hồ sơ ---------- */
export async function recordsView(V){if(!S.project){V.innerHTML=top('','Hồ sơ')+needProject();return}
  const recs=await records();let f='all';
  V.innerHTML=top(S.project.name,'Hồ sơ')+`<div class="body"><div class="chips" id="rf">${[['all','Tất cả'],['nhap','Nháp'],['phathanh','Đã phát hành'],['rac','Thùng rác']].map(([k,t])=>`<button class="chip" data-f="${k}">${t}</button>`).join('')}</div><div id="rl"></div></div>`;
  const draw=()=>{V.querySelectorAll('#rf .chip').forEach(b=>b.classList.toggle('on',b.dataset.f===f));const l=recs.filter(r=>f==='all'?r.status!=='rac':r.status===f);
    $('#rl').innerHTML=l.length?`<div class="grp">${l.map(r=>{const[k,c]=KIND[r.kind]||['Hồ sơ','n'];return`<div class="row"><span class="tag ${c}">${k}</span><b>${esc(r.title||'Chưa đặt tên')}<br><span>${fDate(r.updatedAt)} · ${r.status==='phathanh'?'đã khóa':r.status==='rac'?'trong thùng rác':'nháp'}</span></b><span>${r.version?'PDF v'+r.version:'—'}</span></div>`}).join('')}</div>`:'<p class="mut">Chưa có hồ sơ nào trong mục này.</p>'};
  V.querySelectorAll('#rf .chip').forEach(b=>b.onclick=()=>{f=b.dataset.f;draw()});draw()}

/* ---------- Kho ảnh ---------- */
export async function photosView(V){if(!S.project){V.innerHTML=top('','Kho ảnh')+needProject();return}
  const all=await photos.list();let f='all';
  V.innerHTML=top(S.project.name,'Kho ảnh')+`<div class="body"><div class="chips" id="pf">${[['all','Tất cả'],['camera','Chụp trong app'],['import','Nhập từ máy'],['free','Chưa dùng']].map(([k,t])=>`<button class="chip" data-f="${k}">${t}</button>`).join('')}</div>
   <div class="row2"><button class="btn o" id="pImport">Thêm từ máy</button><span class="mut" id="pCount"></span></div><input type="file" id="pFile" accept="image/*" multiple hidden><div id="pl"></div></div>`;
  const draw=()=>{V.querySelectorAll('#pf .chip').forEach(b=>b.classList.toggle('on',b.dataset.f===f));
    const l=all.filter(p=>f==='all'||(f==='free'?!p.links.length:p.source===f));$('#pCount').textContent=l.length+' ảnh';let day='',h='';
    for(const p of l){const k=dayKey(p.takenAt);if(k!==day){if(day)h+='</div>';day=k;h+=`<div class="sec">${k===dayKey()?'Hôm nay · ':''}${fDate(p.takenAt)}</div><div class="grid3">`}
      h+=`<button class="ph" data-id="${p.id}" aria-label="Ảnh ${fTime(p.takenAt)} ${esc(p.caption)}"><img alt="" data-thumb="${p.id}"><span>${fTime(p.takenAt)}${p.links[0]?' · '+esc(p.links[0].label||''):''}</span></button>`}
    $('#pl').innerHTML=l.length?h+'</div>':'<p class="mut">Chưa có ảnh. Bấm nút chụp ở giữa thanh dưới, hoặc “Thêm từ máy”.</p>';
    $('#pl').querySelectorAll('img[data-thumb]').forEach(im=>photos.url(im.dataset.thumb).then(u=>{if(u)im.src=u}));
    $('#pl').querySelectorAll('.ph').forEach(b=>b.onclick=()=>photoDetail(b.dataset.id,()=>photosView(V)))};
  V.querySelectorAll('#pf .chip').forEach(b=>b.onclick=()=>{f=b.dataset.f;draw()});
  $('#pImport').onclick=()=>$('#pFile').click();
  $('#pFile').onchange=async e=>{const fs=[...e.target.files];e.target.value='';let n=0;for(const file of fs){toast(`Đang lưu ảnh ${n+1}/${fs.length}…`,60000);try{await photos.add(file,{source:'import'});n++}catch(er){toast(er.message);break}}
    if(n)toast('Đã lưu '+n+' ảnh vào kho');photosView(V)};
  draw()}
async function photoDetail(id,after){const p=await photos.get(id);if(!p)return;const u=await photos.url(id,'photo');
  const s=sheet(`<img class="big" src="${u}" alt="Ảnh đã chọn"><dl class="kv"><dt>Thời gian</dt><dd>${fTime(p.takenAt)} · ${fDate(p.takenAt)}${p.source==='import'?' (theo tệp ảnh)':''}</dd><dt>Vị trí</dt><dd>${esc(p.place||'—')}${p.gps?' · '+esc(gpsText(p.gps)):' · không có GPS'}</dd><dt>Người chụp</dt><dd>${esc(p.reporter||'—')}</dd><dt>Kích thước</dt><dd>${p.w}×${p.h} · ${fSize(p.bytes)}</dd><dt>Mã kiểm tra</dt><dd class="mono">${esc((p.sha256||'—').slice(0,16))}</dd><dt>Đang dùng trong</dt><dd>${p.links.length?p.links.map(l=>esc(l.label||l.recordId)).join(', '):'Chưa dùng'}</dd></dl>
   <label class="fld">Ghi chú ảnh<input id="pdCap" value="${esc(p.caption)}"></label><button class="btn" id="pdSave">Lưu ghi chú</button><button class="btn o" id="pdGet">Tải ảnh về máy</button><button class="btn o danger-o" id="pdDel">Xóa ảnh</button>`);
  $('#pdSave',s).onclick=async()=>{p.caption=$('#pdCap',s).value.trim();await photos.save(p);closeSheet();toast('Đã lưu ghi chú');after()};
  $('#pdGet',s).onclick=async()=>saveFile(`Anh_${dayKey(p.takenAt)}_${fTime(p.takenAt).replace(':','')}_${id.slice(-5)}.jpg`,await photos.blob(id));
  $('#pdDel',s).onclick=async()=>{if(p.links.length){toast('Ảnh đang dùng trong hồ sơ, không xóa được');return}if(await confirmSheet({title:'Xóa ảnh này?',text:'Ảnh gốc bị xóa hẳn khỏi máy, không khôi phục được.',ok:'Xóa ảnh',danger:true})){await photos.remove(id);toast('Đã xóa ảnh');after()}}}

/* ---------- Camera ---------- */
let stream=null;
export function stopCamera(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}}
export async function camera(V,ctx={}){if(!S.project){V.innerHTML=needProject();return}
  watchGps();const back=ctx.back||'#photos';
  V.innerHTML=`<div class="cam"><video id="cv" playsinline autoplay muted></video><div class="cam-top"><a class="cam-x" href="${back}" aria-label="Đóng camera">${icon('x',22)}</a><span class="tag ${ctx.link?'g':'n'}">${esc(ctx.link?ctx.link.label:'Ảnh hiện trường')}</span></div>
   <div class="cam-msg" id="cmsg" hidden></div><div class="cam-info" id="cinfo"></div>
   <div class="cam-dock"><label class="btn o" for="cFile">Chọn từ máy</label><button id="cShot" class="shutter" aria-label="Chụp"></button><span class="mut" id="cN">0 ảnh</span></div><input type="file" id="cFile" accept="image/*" capture="environment" hidden></div>`;
  const info=()=>{const e=$('#cinfo');if(e)e.innerHTML=`${fDate(Date.now())} · ${fTime(Date.now())}<br>${esc(S.project.place||'Chưa ghi địa danh')} · ${esc(gpsText(S.gps))}`};info();const tick=setInterval(()=>$('#cinfo')?info():clearInterval(tick),5000);
  let n=0;const done=async src=>{try{await photos.add(src,{source:'camera',link:ctx.link});n++;$('#cN').textContent=n+' ảnh';toast('Đã lưu ảnh vào kho',1200)}catch(e){toast(e.message)}};
  $('#cShot').onclick=()=>{const v=$('#cv');if(!stream||!v.videoWidth){$('#cFile').click();return}done(v)};
  $('#cFile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(f)await done(f)};
  try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:2560},height:{ideal:1920}},audio:false});const v=$('#cv');if(v)v.srcObject=stream;else stopCamera()}
  catch(e){const m=$('#cmsg');if(m){m.hidden=false;m.textContent=e&&e.name==='NotAllowedError'?'Chưa cấp quyền camera. Bấm nút tròn để chụp bằng máy ảnh của điện thoại, hoặc “Chọn từ máy”.':'Không mở được camera trong trình duyệt. Bấm nút tròn để chụp bằng máy ảnh của điện thoại, hoặc “Chọn từ máy”.'}}}

/* ---------- Dự án ---------- */
export async function project(V){
  if(!S.project){V.innerHTML=top('Thiết lập lần đầu','Tạo dự án')+`<div class="body"><label class="fld">Tên dự án<input id="pjName" placeholder="VD: Đường ra đảo Hòn Khoai"></label><label class="fld">Gói thầu<input id="pjPkg"></label><label class="fld">Địa danh công trường (in lên ảnh và hồ sơ)<input id="pjPlace" placeholder="VD: Đất Mũi, Cà Mau"></label><label class="fld">Người lập hồ sơ<input id="pjRep" value="${esc(S.settings.reporter)}"></label><button class="btn" id="pjOk">Tạo dự án</button>
    <div class="sec">Đã có gói sao lưu?</div><button class="btn o" id="bkIn">Khôi phục từ gói sao lưu</button><input type="file" id="bkFile" accept=".zip" hidden></div>`;
    $('#pjOk').onclick=async()=>{const name=$('#pjName').value.trim();if(!name){toast('Nhập tên dự án');return}await saveSettings({reporter:$('#pjRep').value.trim()});await createProject({name,pkg:$('#pjPkg').value.trim(),place:$('#pjPlace').value.trim()});toast('Đã tạo dự án');location.hash='#today'};
    wireRestore(V);return}
  const p=S.project,u=await db.usage(),nPh=(await photos.list()).length,nRec=(await records()).length,last=await db.get('meta','lastBackupAt');
  V.innerHTML=top('Dự án đang dùng',p.name)+`<div class="body">
   <div class="sec">Thông tin dự án</div><label class="fld">Tên dự án<input id="pjName" value="${esc(p.name)}"></label><label class="fld">Gói thầu<input id="pjPkg" value="${esc(p.pkg)}"></label><label class="fld">Địa danh công trường<input id="pjPlace" value="${esc(p.place)}"></label><label class="fld">Người lập hồ sơ<input id="pjRep" value="${esc(S.settings.reporter)}"></label><label class="fld">Đơn vị<input id="pjCo" value="${esc(S.settings.company)}"></label><button class="btn" id="pjSave">Lưu thông tin</button>
   <div class="sec">Dữ liệu dự án</div><div class="grp">${[['Cấu kiện nghiệm thu','Khối sau'],['Quy trình nghiệm thu','Khối sau'],['BOQ, nhân công, thiết bị','Khối sau'],['Vật tư, vật liệu','Khối sau'],['Hợp đồng mua hàng','Khối sau']].map(([a,b])=>`<div class="row"><b>${a}</b><span>${b}</span></div>`).join('')}</div>
   <div class="sec">Lưu trữ trên máy</div><div class="card"><p>${nPh} ảnh · ${nRec} hồ sơ${u?` · đã dùng ${fSize(u.used)}`:''}</p><p class="${u&&u.persisted?'ok':'warn'}">${u&&u.persisted?'Trình duyệt đã cam kết không tự xóa dữ liệu của ứng dụng.':'Trình duyệt chưa cam kết giữ dữ liệu. Hãy sao lưu thường xuyên.'}</p><p class="mut">${last?'Sao lưu gần nhất: '+fTime(last)+' · '+fDate(last):'Chưa sao lưu lần nào.'}</p>
    <button class="btn" id="bkOut">Sao lưu toàn bộ (.zip)</button><button class="btn o" id="bkIn">Khôi phục từ gói sao lưu</button><input type="file" id="bkFile" accept=".zip" hidden><button class="btn o danger-o" id="wipe">Xóa toàn bộ dữ liệu trên máy</button></div>
   <p class="mut center">Nhật ký hiện trường An Phú · phiên bản ${esc(window.AP_VERSION)}</p></div>`;
  $('#pjSave').onclick=async()=>{const name=$('#pjName').value.trim();if(!name){toast('Tên dự án không được trống');return}await saveProject({name,pkg:$('#pjPkg').value.trim(),place:$('#pjPlace').value.trim()});await saveSettings({reporter:$('#pjRep').value.trim(),company:$('#pjCo').value.trim()});toast('Đã lưu thông tin dự án');project(V)};
  $('#bkOut').onclick=async()=>{toast('Đang đóng gói sao lưu…',60000);try{const b=await backup();await db.put('meta',Date.now(),'lastBackupAt');await saveFile(`SaoLuu_${p.name.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/gi,'d').replace(/[^A-Za-z0-9]+/g,'-')}_${dayKey()}.zip`,b);project(V)}catch(e){toast('Chưa sao lưu được: '+e.message)}};
  $('#wipe').onclick=async()=>{if(!await confirmSheet({title:'Xóa toàn bộ dữ liệu?',text:'Dự án, ảnh và hồ sơ trên máy này bị xóa hẳn. Hãy sao lưu trước.',ok:'Xóa toàn bộ',danger:true,typed:'XOA'}))return;stopCamera();try{await db.wipe();location.hash='#project';location.reload()}catch(e){toast(e.message)}};
  wireRestore(V)}
function wireRestore(V){$('#bkIn').onclick=()=>$('#bkFile').click();
  $('#bkFile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;
    if(S.project&&!await confirmSheet({title:'Khôi phục từ gói sao lưu?',text:'Dữ liệu trong gói được thêm vào máy. Mục trùng mã sẽ lấy theo bản trong gói.',ok:'Khôi phục'}))return;
    try{toast('Đang khôi phục…',60000);const r=await restore(await f.arrayBuffer());await load();toast(`Đã khôi phục ${r.photos} ảnh, ${r.records} hồ sơ`);location.hash='#today';dispatchEvent(new HashChangeEvent('hashchange'))}catch(er){toast('Chưa khôi phục được: '+er.message,5000)}}}
export async function backup(){const data={format:'ANPHU-NKHT-SAOLUU-1',app:window.AP_VERSION,at:Date.now(),meta:{settings:S.settings,activeProjectId:S.project&&S.project.id},projects:await db.all('projects'),records:await db.all('records'),photos:await db.all('photos'),catalogs:await db.all('catalogs'),issues:await db.all('issues')};
  const files=[{name:'du-lieu.json',data:zip.bytes(JSON.stringify(data))}];
  for(const p of data.photos){const b=await db.get('blobs','photo:'+p.id),t=await db.get('blobs','thumb:'+p.id);if(b)files.push({name:'anh/'+p.id+'.jpg',data:new Uint8Array(await b.arrayBuffer())});if(t)files.push({name:'anh-nho/'+p.id+'.jpg',data:new Uint8Array(await t.arrayBuffer())})}
  for(const i of data.issues){const b=await db.get('blobs','pdf:'+i.id);if(b)files.push({name:'pdf/'+i.id+'.pdf',data:new Uint8Array(await b.arrayBuffer())})}
  return zip.pack(files)}
export async function restore(buf){const z=zip.unpack(buf);if(!z['du-lieu.json'])throw new Error('Gói không có tệp du-lieu.json');const d=JSON.parse(zip.text(z['du-lieu.json']));
  if(d.format!=='ANPHU-NKHT-SAOLUU-1')throw new Error('Gói sao lưu không đúng định dạng của ứng dụng này');
  const jpg=u=>new Blob([u],{type:'image/jpeg'});
  await db.tx(['projects','records','photos','catalogs','issues','blobs','meta'],'readwrite',(pj,rc,ph,ct,is,bl,mt)=>{
    d.projects.forEach(x=>pj.put(x));d.records.forEach(x=>rc.put(x));d.catalogs.forEach(x=>ct.put(x));d.issues.forEach(x=>is.put(x));
    d.photos.forEach(x=>{ph.put(x);if(z['anh/'+x.id+'.jpg'])bl.put(jpg(z['anh/'+x.id+'.jpg']),'photo:'+x.id);if(z['anh-nho/'+x.id+'.jpg'])bl.put(jpg(z['anh-nho/'+x.id+'.jpg']),'thumb:'+x.id)});
    d.issues.forEach(x=>{if(z['pdf/'+x.id+'.pdf'])bl.put(new Blob([z['pdf/'+x.id+'.pdf']],{type:'application/pdf'}),'pdf:'+x.id)});
    if(d.meta&&d.meta.settings)mt.put(d.meta.settings,'settings');if(d.meta&&d.meta.activeProjectId)mt.put(d.meta.activeProjectId,'activeProjectId')});
  return{photos:d.photos.length,records:d.records.length}}
