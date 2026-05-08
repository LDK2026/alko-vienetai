const CACHE_NAME = "alko-vienetai-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/app-icon-192.png",
  "./assets/app-icon-512.png",
  "./assets/beer.svg",
  "./assets/wine.svg",
  "./assets/vodka.svg",
  "./assets/champagne.svg",
  "./assets/cider.svg",
  "./assets/cocktail.svg",
  "./assets/whiskey.svg",
  "./assets/liqueur.svg",
  "./assets/other.svg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
