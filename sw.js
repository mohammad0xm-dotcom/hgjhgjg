/* Phase 0 benchmark service worker. Uses only its own caches (cardscan-p0-*) so it can never touch V3's caches. */
const V='cardscan-p0-shell-v1',LIB='cardscan-p0-lib',SHELL=['./','index.html','core.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('cardscan-p0-')&&x!==V&&x!==LIB).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const cross=new URL(e.request.url).origin!==location.origin;
 e.respondWith(caches.open(cross?LIB:V).then(c=>c.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{if(res.ok||res.type==='opaque')c.put(e.request,res.clone());return res}))));
});
