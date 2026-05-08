const CACHE = "alko-vienetai-v1";

const BASE = "/alko-vienetai/";

const ASSETS = [
  BASE,
  BASE + "index.html",
  BASE + "styles.css",
  BASE + "app.js",
  BASE + "manifest.webmanifest",

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

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
