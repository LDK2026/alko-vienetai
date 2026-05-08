const CACHE_NAME = "alko-vienetai-v3";
const BASE = "/alko-vienetai/";

const ASSETS = [
  BASE,
  BASE + "index.html",
  BASE + "styles.css",
  BASE + "app.js",
  BASE + "manifest.webmanifest",
  BASE + "offline.html",

  BASE + "assets/app-icon-192.png",
  BASE + "assets/app-icon-512.png"
];

// INSTALL → cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVATE → cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH → CACHE FIRST (PWABuilder FRIENDLY)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // cache new files dynamically
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => {
          // offline fallback
          return caches.match(BASE + "offline.html");
        });
    })
  );
});
