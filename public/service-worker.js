const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "/index.html",
  "/css/styles.css",
  "/manifest.json",
  "/js/index.js",
  "/",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/js/idb.js",
];

// install service worker
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// activate service worker
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeepList = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeepList.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeepList.indeOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

// fetch request
self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.respondWith(
    cache.match(e.request).then(function (request) {
      if (request) {
        console.log("responding with cache: " + e.request.url);
      } else {
        console.log("file is not cached, fetching: " + e.request.url);
        return fetch(e.request);
      }
    })
  );
});
