/* Các màn hình nền chung: Hôm nay, Hồ sơ, Kho ảnh, Camera, Dự án. */
import * as db from './db.js';import * as photos from './photos.js';import * as zip from './zip.js';
import {S,createProject,saveProject,saveSettings,watchGps,gpsText,load} from './state.js';
import {bi,$,esc,icon,toast,sheet,closeSheet,confirmSheet,saveFile,dayKey,fDate,fTime,fSize,p2,subPage,field,menuRow,menuGrid} from './ui.js';
export const KIND={coc:['Nghiệm thu cọc','g'],khac:['Nghiệm thu','g'],hang:['Nhận hàng','a'],ngay:['Báo cáo ngày','b'],anh:['Báo cáo ảnh','n']};
const WD=['Chủ nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const top=(small,h1,extra='')=>`<div class="top"><small>${esc(small)}</small><h1>${esc(h1)}</h1>${extra}</div>`;
const needProject=()=>`<div class="body"><div class="card"><b>Chưa có dự án</b><p class="mut">Tạo dự án trước khi chụp ảnh và lập hồ sơ.</p><a class="btn" href="#project-new">${bi('plus','Tạo dự án')}</a></div></div>`;
const records=()=>S.project?db.ofProject('records',S.project.id).then(a=>a.reverse()):Promise.resolve([]);

/* ---------- Hôm nay ---------- */
export async function today(V){const d=new Date();
  if(!S.project){V.innerHTML=top(WD[d.getDay()]+' '+fDate(d),'Việc hôm nay')+needProject();return}
  watchGps();const recs=await records(),drafts=recs.filter(r=>r.status==='nhap'),hasDaily=recs.some(r=>r.kind==='ngay'&&r.day===dayKey());
  const place=S.project.place||'Chưa ghi địa danh';
  V.innerHTML=top(`${WD[d.getDay()]} ${p2(d.getDate())}/${p2(d.getMonth()+1)} · ${S.project.name}`,'Việc hôm nay',`<a class="lnk" href="#project-info">${esc(place)} · <span id="gpsLine">${esc(gpsText(S.gps))}</span></a>`)+`<div class="body">
   <div class="sec">Đang làm dở</div>${drafts.length?drafts.slice(0,6).map(taskRow).join(''):'<p class="mut">Không có hồ sơ nào đang làm dở.</p>'}
   ${hasDaily?'':`<div class="sec">Cần lập</div><div class="task"><i style="background:var(--b)"></i><div><span class="tag b">Báo cáo ngày</span><b>Báo cáo ${p2(d.getDate())}/${p2(d.getMonth()+1)}</b><span>Chưa lập</span></div></div>`}
   <div class="sec">Lập mới</div>${menuGrid([{label:'Nghiệm thu cọc',sub:'Khối 2',ic:'pile',tone:'g',off:1},{label:'Nghiệm thu công việc khác',sub:'Khối 2',ic:'work',tone:'g',off:1},{label:'Nhận hàng',sub:'Khối 3',ic:'truck',tone:'a',off:1},{label:'Báo cáo ngày',sub:'Khối 4',ic:'cal',tone:'b',off:1},{label:'Báo cáo ảnh',sub:'Khối 5',ic:'album',tone:'b',off:1}])}</div>`;
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
   <div class="list-actions"><span class="mut" id="pCount" style="flex:1"></span><button class="btn o sm" id="pImport">${bi('folder','Thêm từ máy')}</button></div><input type="file" id="pFile" accept="image/*" multiple hidden><div id="pl"></div></div>`;
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
  const s=sheet(`<img class="big" src="${u}" alt="Ảnh đã chọn"><dl class="kv"><dt>Thời gian</dt><dd>${fTime(p.takenAt)} · ${fDate(p.takenAt)}${p.source==='import'?' (theo tệp ảnh)':''}</dd><dt>Vị trí</dt><dd>${esc(p.place||'—')}${p.gps?' · '+esc(gpsText(p.gps)):' · không có GPS'}</dd><dt>Người chụp</dt><dd>${esc(p.reporter||'—')}</dd><dt>Ghi chú</dt><dd>${esc(p.caption||'—')}</dd><dt>Kích thước</dt><dd>${p.w}×${p.h} · ${fSize(p.bytes)}</dd><dt>Mã kiểm tra</dt><dd class="mono">${esc((p.sha256||'—').slice(0,16))}</dd><dt>Đang dùng trong</dt><dd>${p.links.length?p.links.map(l=>esc(l.label||l.recordId)).join(', '):'Chưa dùng'}</dd></dl>
   <div class="grid2"><a class="btn o" href="#photo-edit/${id}" id="pdEdit">${bi('edit','Sửa ghi chú')}</a><button class="btn o" id="pdGet">${bi('down','Tải về máy')}</button></div><button class="btn danger" id="pdDel">${bi('trash','Xóa ảnh')}</button>`);
  $('#pdEdit',s).onclick=()=>closeSheet();
  $('#pdGet',s).onclick=async()=>saveFile(`Anh_${dayKey(p.takenAt)}_${fTime(p.takenAt).replace(':','')}_${id.slice(-5)}.jpg`,await photos.blob(id));
  $('#pdDel',s).onclick=async()=>{if(p.links.length){toast('Ảnh đang dùng trong hồ sơ, không xóa được');return}if(await confirmSheet({title:'Xóa ảnh này?',text:'Ảnh gốc bị xóa hẳn khỏi máy, không khôi phục được.',ok:'Xóa ảnh',danger:true})){await photos.remove(id);toast('Đã xóa ảnh');after()}}}
export async function photoEdit(V,id){const p=await photos.get(id);if(!p){location.hash='#photos';return}const u=await photos.url(id);
  subPage(V,{back:'#photos',title:'Sửa ghi chú ảnh',sub:fTime(p.takenAt)+' · '+fDate(p.takenAt),body:`<img src="${u}" alt="" style="width:100%;max-height:36vh;object-fit:contain;background:#16202A;border-radius:10px"><div class="form">${field('Ghi chú ảnh','fCap',p.caption,{area:true,ph:'VD: Hạ ống vách cọc C1'})}</div>`,
   actions:`<a class="btn o" href="#photos">${bi('x','Hủy')}</a><button class="btn" id="fOk">${bi('check','Lưu')}</button>`});
  $('#fOk').onclick=async()=>{p.caption=$('#fCap').value.trim();await photos.save(p);toast('Đã lưu ghi chú');location.hash='#photos'}}

/* ---------- Camera ---------- */
let stream=null;
export function stopCamera(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}}
export async function camera(V,ctx={}){if(!S.project){V.innerHTML=needProject();return}
  watchGps();const back=ctx.back||'#photos';
  V.innerHTML=`<div class="cam"><video id="cv" playsinline autoplay muted></video><div class="cam-top"><a class="cam-x" href="${back}" aria-label="Đóng camera">${icon('x',22)}</a><span class="tag ${ctx.link?'g':'n'}">${esc(ctx.link?ctx.link.label:'Ảnh hiện trường')}</span></div>
   <div class="cam-msg" id="cmsg" hidden></div><div class="cam-info" id="cinfo"></div>
   <div class="cam-dock"><label class="btn o" for="cFile">${bi('folder','Chọn từ máy')}</label><button id="cShot" class="shutter" aria-label="Chụp"></button><span class="mut" id="cN">0 ảnh</span></div><input type="file" id="cFile" accept="image/*" capture="environment" hidden></div>`;
  const info=()=>{const e=$('#cinfo');if(e)e.innerHTML=`${fDate(Date.now())} · ${fTime(Date.now())}<br>${esc(S.project.place||'Chưa ghi địa danh')} · ${esc(gpsText(S.gps))}`};info();const tick=setInterval(()=>$('#cinfo')?info():clearInterval(tick),5000);
  let n=0;const done=async src=>{try{await photos.add(src,{source:'camera',link:ctx.link});n++;$('#cN').textContent=n+' ảnh';toast('Đã lưu ảnh vào kho',1200)}catch(e){toast(e.message)}};
  $('#cShot').onclick=()=>{const v=$('#cv');if(!stream||!v.videoWidth){$('#cFile').click();return}done(v)};
  $('#cFile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(f)await done(f)};
  try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:2560},height:{ideal:1920}},audio:false});const v=$('#cv');if(v)v.srcObject=stream;else stopCamera()}
  catch(e){const m=$('#cmsg');if(m){m.hidden=false;m.textContent=e&&e.name==='NotAllowedError'?'Chưa cấp quyền camera. Bấm nút tròn để chụp bằng máy ảnh của điện thoại, hoặc “Chọn từ máy”.':'Không mở được camera trong trình duyệt. Bấm nút tròn để chụp bằng máy ảnh của điện thoại, hoặc “Chọn từ máy”.'}}}

/* ---------- Dự án: chỉ là danh sách; mỗi mục mở trang nhập riêng ---------- */
const slugName=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').replace(/[^A-Za-z0-9]+/g,'-');
export async function project(V){
  if(!S.project){V.innerHTML=top('Thiết lập lần đầu','Chưa có dự án')+`<div class="body">${menuGrid([{href:'#project-new',label:'Tạo dự án mới',ic:'plus',tone:'n'},{href:'#backup',label:'Khôi phục từ gói sao lưu',ic:'restore',tone:'p'}])}</div>`;return}
  const p=S.project,last=await db.get('meta','lastBackupAt');
  V.innerHTML=top('Dự án đang dùng',p.name)+`<div class="body">
   <div class="sec">Thiết lập</div>${menuGrid([{href:'#project-info',label:'Thông tin dự án',sub:p.place||'',ic:'info',tone:'n'},{href:'#project-me',label:'Người lập, đơn vị',sub:S.settings.reporter||'Chưa ghi',ic:'user',tone:'n'},{href:'#backup',label:'Sao lưu, khôi phục',sub:last?'Gần nhất '+fDate(last):'Chưa sao lưu',ic:'save',tone:'p'}])}
   <div class="sec">Dữ liệu dự án</div>${menuGrid([['Cấu kiện nghiệm thu','layers','g'],['Quy trình nghiệm thu','flow','g'],['BOQ, nhân công, thiết bị','table','b'],['Vật tư, vật liệu','box','a'],['Hợp đồng mua hàng','contract','a']].map(([t,i,c])=>({label:t,sub:'Khối sau',ic:i,tone:c,off:1})))}
   <p class="mut center">Nhật ký hiện trường An Phú · phiên bản ${esc(window.AP_VERSION)}</p></div>`}
export function projectNew(V){
  subPage(V,{back:'#project',title:'Tạo dự án',body:`<div class="form">${field('Tên dự án','fName','',{ph:'VD: Đường ra đảo Hòn Khoai'})}${field('Gói thầu','fPkg')}${field('Địa danh công trường','fPlace','',{ph:'VD: Đất Mũi, Cà Mau',hint:'In lên ảnh và hồ sơ'})}${field('Người lập hồ sơ','fRep',S.settings.reporter)}</div>`,
   actions:`<a class="btn o" href="#project">${bi('x','Hủy')}</a><button class="btn" id="fOk">${bi('check','Tạo dự án')}</button>`});
  $('#fOk').onclick=async()=>{const name=$('#fName').value.trim();if(!name){toast('Nhập tên dự án');$('#fName').focus();return}
    await saveSettings({reporter:$('#fRep').value.trim()});await createProject({name,pkg:$('#fPkg').value.trim(),place:$('#fPlace').value.trim()});toast('Đã tạo dự án');location.hash='#today'}}
export function projectInfo(V){if(!S.project){location.hash='#project';return}const p=S.project;
  subPage(V,{back:'#project',title:'Thông tin dự án',body:`<div class="form">${field('Tên dự án','fName',p.name)}${field('Gói thầu','fPkg',p.pkg)}${field('Địa danh công trường','fPlace',p.place,{hint:'In lên ảnh và hồ sơ'})}</div>`,
   actions:`<a class="btn o" href="#project">${bi('x','Hủy')}</a><button class="btn" id="fOk">${bi('check','Lưu')}</button>`});
  $('#fOk').onclick=async()=>{const name=$('#fName').value.trim();if(!name){toast('Tên dự án không được trống');return}await saveProject({name,pkg:$('#fPkg').value.trim(),place:$('#fPlace').value.trim()});toast('Đã lưu');location.hash='#project'}}
export function projectMe(V){
  subPage(V,{back:'#project',title:'Người lập, đơn vị',body:`<div class="form">${field('Người lập hồ sơ','fRep',S.settings.reporter,{hint:'Ghi vào mỗi ảnh chụp và hồ sơ'})}${field('Đơn vị','fCo',S.settings.company)}</div>`,
   actions:`<a class="btn o" href="#project">${bi('x','Hủy')}</a><button class="btn" id="fOk">${bi('check','Lưu')}</button>`});
  $('#fOk').onclick=async()=>{await saveSettings({reporter:$('#fRep').value.trim(),company:$('#fCo').value.trim()});toast('Đã lưu');location.hash='#project'}}
export async function backupPage(V){const back=S.project?'#project':'#project',u=await db.usage(),nPh=(await photos.list()).length,nRec=(await records()).length,last=await db.get('meta','lastBackupAt');
  subPage(V,{back,title:'Sao lưu và khôi phục',body:`<div class="card"><p>${nPh} ảnh · ${nRec} hồ sơ${u?' · đã dùng '+fSize(u.used):''}</p><p class="${u&&u.persisted?'ok':'warn'}">${u&&u.persisted?'Trình duyệt đã cam kết không tự xóa dữ liệu của ứng dụng.':'Trình duyệt chưa cam kết giữ dữ liệu. Hãy sao lưu thường xuyên.'}</p><p class="mut">${last?'Sao lưu gần nhất: '+fTime(last)+' · '+fDate(last):'Chưa sao lưu lần nào.'}</p></div>
   <div class="grp">${S.project?`<button class="row" id="bkOut" style="width:100%;border:0;text-align:left;font:inherit;cursor:pointer"><b>Sao lưu toàn bộ (.zip)</b><span class="chev">›</span></button>`:''}<button class="row" id="bkIn" style="width:100%;border:0;text-align:left;font:inherit;cursor:pointer"><b>Khôi phục từ gói sao lưu</b><span class="chev">›</span></button></div><input type="file" id="bkFile" accept=".zip" hidden>
   ${S.project?`<div class="sec">Vùng nguy hiểm</div><div class="grp"><button class="row" id="wipe" style="width:100%;border:0;text-align:left;font:inherit;cursor:pointer;color:var(--r)"><b>Xóa toàn bộ dữ liệu trên máy</b></button></div>`:''}`});
  if($('#bkOut'))$('#bkOut').onclick=async()=>{toast('Đang đóng gói sao lưu…',60000);try{const b=await backup();await db.put('meta',Date.now(),'lastBackupAt');await saveFile(`SaoLuu_${slugName(S.project.name)}_${dayKey()}.zip`,b);backupPage(V)}catch(e){toast('Chưa sao lưu được: '+e.message)}};
  if($('#wipe'))$('#wipe').onclick=async()=>{if(!await confirmSheet({title:'Xóa toàn bộ dữ liệu?',text:'Dự án, ảnh và hồ sơ trên máy này bị xóa hẳn. Hãy sao lưu trước.',ok:'Xóa toàn bộ',danger:true,typed:'XOA'}))return;stopCamera();try{await db.wipe();location.hash='#project';location.reload()}catch(e){toast(e.message)}};
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
