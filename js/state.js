/* Trạng thái chung: dự án đang dùng, cài đặt, vị trí GPS gần nhất. */
import * as db from './db.js';
export const S={project:null,settings:{reporter:'',company:'Công ty Cổ phần Xây dựng Hạ tầng An Phú'},gps:null};
export async function load(){
  S.settings={...S.settings,...(await db.get('meta','settings')||{})};
  const id=await db.get('meta','activeProjectId');S.project=id?await db.get('projects',id)||null:null;
}
export async function saveSettings(patch){Object.assign(S.settings,patch);await db.put('meta',S.settings,'settings')}
export async function createProject(data){const p={id:db.uid('prj_'),createdAt:Date.now(),place:'',pkg:'',...data};await db.put('projects',p);await db.put('meta',p.id,'activeProjectId');S.project=p;return p}
export async function saveProject(patch){Object.assign(S.project,patch,{updatedAt:Date.now()});await db.put('projects',S.project)}
let watching=false;
export function watchGps(){if(watching||!navigator.geolocation)return;watching=true;
  navigator.geolocation.watchPosition(p=>{S.gps={lat:p.coords.latitude,lng:p.coords.longitude,acc:Math.round(p.coords.accuracy||0),at:Date.now()};dispatchEvent(new Event('ap-gps'))},()=>{},{enableHighAccuracy:true,maximumAge:20000,timeout:20000})}
export const gpsText=g=>g?`${g.lat.toFixed(5)}, ${g.lng.toFixed(5)} · ±${g.acc} m`:'Chưa có vị trí';
