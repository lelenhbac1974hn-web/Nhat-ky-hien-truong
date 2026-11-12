/* Đóng và mở gói ZIP không nén (đủ cho ảnh JPEG và JSON). */
const T=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc=u=>{let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=T[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
const enc=new TextEncoder(),dec=new TextDecoder();
/* files: [{name, data: Uint8Array}] */
export function pack(files){const parts=[],cd=[];let off=0;
  for(const f of files){const n=enc.encode(f.name),c=crc(f.data),h=new DataView(new ArrayBuffer(30));
    h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint32(14,c,true);h.setUint32(18,f.data.length,true);h.setUint32(22,f.data.length,true);h.setUint16(26,n.length,true);
    parts.push(new Uint8Array(h.buffer),n,f.data);
    const d=new DataView(new ArrayBuffer(46));d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x0800,true);d.setUint32(16,c,true);d.setUint32(20,f.data.length,true);d.setUint32(24,f.data.length,true);d.setUint16(28,n.length,true);d.setUint32(42,off,true);
    cd.push(new Uint8Array(d.buffer),n);off+=30+n.length+f.data.length}
  const size=cd.reduce((a,x)=>a+x.length,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,size,true);e.setUint32(16,off,true);
  return new Blob([...parts,...cd,new Uint8Array(e.buffer)],{type:'application/zip'})}
export function unpack(buf){const v=new DataView(buf),u=new Uint8Array(buf),out={};let i=buf.byteLength-22;
  while(i>=0&&v.getUint32(i,true)!==0x06054b50)i--;if(i<0)throw new Error('Tệp không phải gói sao lưu');
  let p=v.getUint32(i+16,true);const n=v.getUint16(i+10,true);
  for(let k=0;k<n;k++){if(v.getUint32(p,true)!==0x02014b50)throw new Error('Gói sao lưu hỏng');
    if(v.getUint16(p+10,true)!==0)throw new Error('Gói sao lưu dùng kiểu nén không hỗ trợ');
    const size=v.getUint32(p+24,true),nl=v.getUint16(p+28,true),xl=v.getUint16(p+30,true),cl=v.getUint16(p+32,true),lo=v.getUint32(p+42,true),name=dec.decode(u.subarray(p+46,p+46+nl));
    const ds=lo+30+v.getUint16(lo+26,true)+v.getUint16(lo+28,true),data=u.slice(ds,ds+size);
    if(crc(data)!==v.getUint32(p+16,true))throw new Error('Gói sao lưu bị lỗi ở tệp '+name);
    out[name]=data;p+=46+nl+xl+cl}
  return out}
export const text=u=>dec.decode(u),bytes=s=>enc.encode(s);
