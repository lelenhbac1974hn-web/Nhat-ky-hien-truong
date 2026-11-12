/* Kho ảnh: lưu ảnh gốc một lần, kèm thời gian, GPS, mã kiểm tra; các hồ sơ chỉ tham chiếu mã ảnh. */
import * as db from './db.js';import {S} from './state.js';
const MAX=2048,THUMB=360;
function toCanvas(src,max){const w=src.videoWidth||src.naturalWidth||src.width,h=src.videoHeight||src.naturalHeight||src.height,k=Math.min(1,max/Math.max(w,h)),c=document.createElement('canvas');
  c.width=Math.round(w*k);c.height=Math.round(h*k);const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(src,0,0,c.width,c.height);return c}
const toBlob=(c,q)=>new Promise((res,rej)=>c.toBlob(b=>b?res(b):rej(new Error('Máy không nén được ảnh')),'image/jpeg',q));
async function sha256(blob){try{const h=await crypto.subtle.digest('SHA-256',await blob.arrayBuffer());return[...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(_){return''}}
function decode(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{URL.revokeObjectURL(u);res(im)};im.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('Không đọc được ảnh'))};im.src=u})}
/* source: tệp ảnh, phần tử <video> hoặc <canvas>. ctx: {source:'camera'|'import', link:{recordId,slot,label}, caption, takenAt} */
export async function add(source,ctx={}){
  if(!S.project)throw new Error('Chưa có dự án');
  const src=source instanceof Blob?await decode(source):source,big=toCanvas(src,MAX),small=toCanvas(big,THUMB);
  const blob=await toBlob(big,.86),thumb=await toBlob(small,.78),id=db.uid('ph_'),cam=ctx.source==='camera';
  const photo={id,projectId:S.project.id,takenAt:ctx.takenAt||(cam?Date.now():(source.lastModified||Date.now())),addedAt:Date.now(),source:cam?'camera':'import',
    gps:cam&&S.gps?{...S.gps}:null,place:S.project.place||'',reporter:S.settings.reporter||'',caption:ctx.caption||'',links:ctx.link?[ctx.link]:[],
    w:big.width,h:big.height,bytes:blob.size,sha256:await sha256(blob),fileName:!cam&&source.name?String(source.name).slice(0,80):''};
  await db.tx(['photos','blobs'],'readwrite',(p,b)=>{p.put(photo);b.put(blob,'photo:'+id);b.put(thumb,'thumb:'+id)});
  return photo;
}
export const list=()=>S.project?db.ofProject('photos',S.project.id).then(a=>a.reverse()):Promise.resolve([]);
export const get=id=>db.get('photos',id);
export const save=p=>db.put('photos',p);
export const remove=id=>db.tx(['photos','blobs'],'readwrite',(p,b)=>{p.delete(id);b.delete('photo:'+id);b.delete('thumb:'+id)});
const urls=new Map();
export async function url(id,kind='thumb'){const k=kind+':'+id;if(urls.has(k))return urls.get(k);const b=await db.get('blobs',k);if(!b)return'';const u=URL.createObjectURL(b);urls.set(k,u);return u}
export const blob=id=>db.get('blobs','photo:'+id);
