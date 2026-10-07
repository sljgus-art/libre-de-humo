const CACHE_NAME = "libre-de-humo-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];

// Instalación
self.addEventListener("install", (event) => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );

    self.skipWaiting();
});

// Activación
self.addEventListener("activate", (event) => {

    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );

    self.clients.claim();
});

// Cache First
self.addEventListener("fetch", (event) => {

    event.respondWith(

        caches.match(event.request)
            .then(response => {

                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .then(networkResponse => {

                        if (
                            event.request.method === "GET" &&
                            event.request.url.startsWith(self.location.origin)
                        ) {

                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(
                                        event.request,
                                        networkResponse.clone()
                                    );
                                });
                        }

                        return networkResponse;
                    });

            })
            .catch(() => {

                if (event.request.mode === "navigate") {
                    return caches.match("./index.html");
                }

            })

    );

});
