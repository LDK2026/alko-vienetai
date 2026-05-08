const CACHE_NAME = "alko-vienetai-v2";
const BASE = "/alko-vienetai/";

const ASSETS = [
  BASE,
  BASE + "index.html",
  BASE + "styles.css",
  BASE + "app.js",
  BASE + "manifest.webmanifest",
  BASE + "service-worker.js",
  BASE + "offline.html",

  BASE + "assets/app-icon-192.png",
  BASE + "assets/app-icon-512.png",

  BASE + "assets/beer.svg",
  BASE + "assets/wine.svg",
  BASE + "assets/vodka.svg",
  BASE + "assets/champagne.svg",
  BASE + "assets/cider.svg",
  BASE + "assets/cocktail.svg",
  BASE + "assets/whiskey.svg",
  BASE + "assets/liqueur.svg",
  BASE + "assets/other.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      // atnaujinam cache „online-first“
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, copy);
      });
      return response;
    }).catch(() => {
      return caches.match(event.request)
        .then((cached) => cached || caches.match(BASE + "offline.html"));
    })
  );
});
