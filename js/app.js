/* Khởi động và điều hướng. Mỗi màn hình là một hàm nhận phần tử #view. */
import {load,S} from './state.js';import * as views from './views.js';import {$,icon,toast,strip} from './ui.js';
window.AP_VERSION='2.0.0-nen3';
const ROUTES={today:views.today,records:views.recordsView,photos:views.photosView,project:views.project,camera:views.camera,'project-new':views.projectNew,'project-info':views.projectInfo,'project-me':views.projectMe,backup:views.backupPage,'photo-edit':views.photoEdit};
const TAB_OF={'project-new':'project','project-info':'project','project-me':'project',backup:'project','photo-edit':'photos'};
const TABS=[{key:'today',href:'#today',ic:'home',label:'Hôm nay'},{key:'records',href:'#records',ic:'doc',label:'Hồ sơ'},{key:'camera',href:'#camera',ic:'cam',label:'Chụp ảnh',accent:1},{key:'photos',href:'#photos',ic:'img',label:'Kho ảnh'},{key:'project',href:'#project',ic:'prj',label:'Dự án'}];
function nav(route){$('#nav').innerHTML=strip(TABS,route)}
async function render(){const [route,arg]=(location.hash||'#today').slice(1).split('/');const fn=ROUTES[route]||ROUTES.today;
  if(route!=='camera')views.stopCamera();document.body.classList.toggle('full',route==='camera');document.body.classList.remove('sub');nav(TAB_OF[route]||route);const V=$('#view');V.scrollTop=0;window.scrollTo(0,0);
  try{await fn(V,arg)}catch(e){console.error(e);V.innerHTML=`<div class="body"><div class="card"><b>Có lỗi khi mở màn hình này</b><p class="mut">${String(e.message||e)}</p></div></div>`}}
addEventListener('hashchange',render);
(async()=>{try{await load()}catch(e){toast('Không mở được kho dữ liệu: '+e.message,6000)}
  if(!S.project&&!location.hash)location.hash='#project-new';await render();
  if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{});
  if('serviceWorker' in navigator&&(location.protocol==='https:'||['127.0.0.1','localhost'].includes(location.hostname)))navigator.serviceWorker.register('sw.js').catch(()=>{});
  window.AP_READY=true})();
