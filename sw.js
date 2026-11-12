/* Lưu đệm toàn bộ tệp ứng dụng để chạy khi mất mạng. Đổi số phiên bản là thay bộ đệm. */
const CACHE='anphu-nkht-2.0.0-nen3',FILES=['./','index.html','css/app.css','js/app.js','js/db.js','js/ui.js','js/state.js','js/photos.js','js/zip.js','js/views.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('anphu-nkht-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request)))});
