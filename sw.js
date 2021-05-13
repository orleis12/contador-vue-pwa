const CACHE_NAME="v1_cache_contador_app_vue"
const urlsToCache= [
    "./",
    "./img/favicon.png",
    "./img/icon32.png",
    "./img/icon64.png",
    "./img/icon128.png",
    "./img/icon256.png",
    "./img/icon512.png",
    "./img/icon1024.png",
    "https://unpkg.com/vue@next",
    "./js/main.js",
    "./js/mountApp.js",
    "./css/style.css",
    "./css/normalize.css"
];

self.addEventListener("install", e=> { //self es referenciar a sw que estamos escribiendo
    e.waitUntil(  // escucha y ejecutar lo que vamos a cachar
        caches.open(CACHE_NAME).then(  // ejecutar y esperar mientras se instala el sw
            cache => cache.addAll(urlsToCache).then( // agregar todo lo que venga de la urlsToCache
                () => self.skipWaiting()
            ).catch(
                err => console.log(err)
            )
        )
    )
})

self.addEventListener("activate",e => {
    const cacheWhiteList = [CACHE_NAME]

    e.waitUntil(
        caches.keys().then(
            cacheNames => {
                return Promise.all(
                    cacheNames.map(
                        cacheName => {
                            if(cacheWhiteList.indexOf(cacheName)=== -1){
                                return caches.delete(cacheName)
                            }
                        }
                    )
                )
            } 
        ).then(
            ()=> self.clients.claim()
        )
    )
});

self.addEventListener("fetch",e=>{// el encargado de hacer peticiones, descargar todo el cache
    e.respondWith(
        caches.match(e.request).then(
            res => {
                if(res){
                    return res
                }
                return fetch(e.request)
            }
        )
    );
}) ;
