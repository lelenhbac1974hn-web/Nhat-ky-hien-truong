/* Kho dữ liệu duy nhất của ứng dụng (IndexedDB "anphu_nkht").
   meta      : cài đặt chung (khóa → giá trị)
   projects  : dự án {id,name,...}
   records   : mọi hồ sơ (nghiệm thu, nhận hàng, báo cáo ngày, báo cáo ảnh) {id,projectId,kind,status,...}
   photos    : thông tin ảnh {id,projectId,takenAt,...}
   blobs     : nội dung tệp: "photo:<id>", "thumb:<id>", "pdf:<issueId>"
   catalogs  : dữ liệu dự án (cấu kiện, quy trình, BOQ...) {projectId,name,rows}
   issues    : bản phát hành đã khóa {id,recordId,version,sha256,...} */
const NAME='anphu_nkht',VERSION=1;let opening=null;
export function open(){
  return opening||(opening=new Promise((res,rej)=>{
    const r=indexedDB.open(NAME,VERSION);
    r.onupgradeneeded=()=>{const d=r.result;
      d.createObjectStore('meta');
      d.createObjectStore('projects',{keyPath:'id'});
      d.createObjectStore('records',{keyPath:'id'}).createIndex('byProject',['projectId','updatedAt']);
      d.createObjectStore('photos',{keyPath:'id'}).createIndex('byProject',['projectId','takenAt']);
      d.createObjectStore('blobs');
      d.createObjectStore('catalogs',{keyPath:['projectId','name']});
      d.createObjectStore('issues',{keyPath:'id'}).createIndex('byRecord','recordId');
    };
    r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);r.onblocked=()=>rej(new Error('Đóng các tab khác của ứng dụng rồi mở lại'));
  }));
}
export async function tx(stores,mode,fn){
  const d=await open(),names=[].concat(stores);
  return new Promise((res,rej)=>{
    const t=d.transaction(names,mode);let out;
    try{out=fn(...names.map(n=>t.objectStore(n)))}catch(e){try{t.abort()}catch(_){}rej(e);return}
    t.oncomplete=()=>res(out instanceof IDBRequest?out.result:out);
    t.onerror=t.onabort=()=>rej(t.error||new Error('Không ghi được dữ liệu'));
  });
}
export const get=(s,k)=>tx(s,'readonly',o=>o.get(k));
export const put=(s,v,k)=>tx(s,'readwrite',o=>k===undefined?o.put(v):o.put(v,k));
export const del=(s,k)=>tx(s,'readwrite',o=>o.delete(k));
export const all=s=>tx(s,'readonly',o=>o.getAll());
export const ofProject=(s,pid)=>tx(s,'readonly',o=>o.index('byProject').getAll(IDBKeyRange.bound([pid,0],[pid,Number.MAX_SAFE_INTEGER])));
export const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
export async function wipe(){const d=await open();d.close();opening=null;
  return new Promise((res,rej)=>{const r=indexedDB.deleteDatabase(NAME);r.onsuccess=()=>res();r.onerror=()=>rej(r.error);r.onblocked=()=>rej(new Error('Đóng các tab khác của ứng dụng rồi thử lại'))})}
export async function usage(){try{const e=await navigator.storage.estimate();return{used:e.usage||0,quota:e.quota||0,persisted:await navigator.storage.persisted()}}catch(_){return null}}
