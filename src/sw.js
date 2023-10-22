/**
 * Service workers are meant to provide a scriptable network proxy 
 * between your web app and the network. That is to say - if the user
 * has no connection to the server (the processor) the service worker
 * will have cached the last version of the app (images, css, js, etc).
 * https://chromium.googlesource.com/chromium/src/+/master/content/browser/service_worker/README.md
 * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
 * https://www.w3.org/TR/service-workers/
*/
const CACHE_NAME = 'v1';
const toCache = [
  './index.html',
  './offline.html',
  './manifest.json',
  './assets/vite.png',
  './assets/favicon.ico',
  './styles/app.css',
  './styles/offline.css',
  './app.js',
  './libs/765941770a51521ed042.worker.js',
  './libs/cr-com-lib.js',
  './libs/index.js',
  './libs/eruda.js'
];

/** 
 * Install the service worker and open the cache. 
 * 
 * Note #1: The service worker only caches what has been served at the 
 * time of install. If further files (css, html, js, images, etc.) are 
 * intended to be served at a later time this method should be modified 
 * to cache those files as well in a dynamic manner. In larger apps it is 
 * common to use a build tool to generate a list of files to cache at build 
 * time, since the file names are generally hashed.
 * 
 * Note #2: The service worker will not allow installation if the server
 * is not running on HTTPS with a trusted certificate. Localhost/127.0.0.1
 * and file:// are exceptions. However with file:// CORS will need to be
 * dealt with.
*/
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all(
        toCache.map(function(url) {
          return fetch(url).then(function(response) {
            if (!response.ok) {
              throw new Error('Network response was not ok: ' + url);
            }
            console.log('Cached: ' + url);
            return cache.put(url, response.clone());
          }).catch(function(error) {
            console.error('Failed to cache:', url, error.message);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Attempting to fetch: ' + event.request.url);
  event.respondWith(
    fetch(event.request).catch(() => {
      console.log("Event request: " + event.request.url);
      return caches.match(event.request);
    })
  );
});