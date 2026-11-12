/* Máy chủ thử cục bộ: node serve.cjs rồi mở http://127.0.0.1:4173/ */
const http=require('node:http'),fs=require('node:fs/promises'),path=require('node:path');
const T={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webmanifest':'application/manifest+json'};
http.createServer(async(q,r)=>{const p=q.url.split('?')[0],f=p==='/'?'index.html':p.slice(1);
  if(!/^[A-Za-z0-9][A-Za-z0-9._\/-]*$/.test(f)||f.includes('..')){r.writeHead(404).end();return}
  try{const d=await fs.readFile(path.join(__dirname,f));r.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'}).end(d)}catch(e){r.writeHead(404).end()}
}).listen(4173,'127.0.0.1',()=>console.log('http://127.0.0.1:4173/'));
