# CH5 Progressive Web App demo

This project is a minimal demonstration of turning a CH5 WebXPanel into a progressive web app that can be installed on Desktop, iOS, and Android devices to provide a native app experience for a CH5 project.

## Requirements
  * The server that serves the XPanel (Crestron processor or third-party server) must serve the PWA over HTTPS with a valid (not self-signed) certificate. Devices that intend to connect to the XPanel must trust the certificate authority that signed the certificate presented by the server, otherwise browser security will prevent installation of the XPanel as an app.

  * The HTML5 project must include a manifest.json that is referenced by the entry point of the application. The manifest.json is responsible for informing browsers that the application is installable as a PWA as well as providing information about the application such as the underlying URL, display format, icons, name, description, etc.

  * The HTML5 project must contain a service worker. The service worker is a JavaScript file that caches files during PWA installation, and returns those files in the event the application is running without a connection to the server, thus still allowing minimal functionality. This service worker must be registered in the entry point of the application (typically index.html, however frameworks such as React/Angular may have different entry points for scripts).

## Implementation

This section describes the implementation of PWA functionality into the application. 

### The manifest.json
We will first examine the [manifest.json](src/manifest.json), the manifest must contain the following fields:

```javascript
"name": "CH5 PWA Demo", // This is the name as seen by the user in their app list.
"short_name": "CH5 Demo", // Shortened name of the application, should be less than 12 characters.
"start_url": "https://server_ip/ch5-pwa-demo/entry_point.html", // This is the path to the PWA entry point, typically the index.html.
"id": "/ch5-pwa-demo/", // This is the unique identifier for the app. This is typically based on the URL of the app on the server without the entry point.
"display_override": ["window-controls-overlay","standalone"], // This informs the browser how to handle the application installation - if it should be standalone (most apps), in a browser instance, a browser minimal instance, etc. The windows-controls-overlay is for Desktop use, which allows the top bar to be minimized. This overrides the display field if they are different.
"display": "standalone", // Install the app as a standalone application.
"description": "CH5 PWA Demo", // A short description about the application.
"background-color": "#888", // This is not actually required, but is recommended as it will be the background color used when the app opens before the CSS has loaded, if this matches the CSS background color it provides a smoother app launch experience.
"lang": "en", // The language used by the application.
"icons": [ // The icon file(s) used by the application. Must not be an SVG, and must be 144x144px or larger.
  {
    "src": "./assets/vite.png",
    "sizes": "800x800",
    "type": "image/png"
  }
],
"screenshots": [ // This array of screenshots must contain at least one wide (landscape) and one narrow (portrait) screenshot to satisfy installation requirements. The screenshots can be anything, even a logo, but they must exist, and they must match the type, size, and form factor (wide/narrow) specified.
  {
    "src": "./assets/screenshot_narrow.jpg",
    "type": "image/jpeg",
    "sizes": "540x720",
    "form_factor": "narrow"
  },
  {
    "src": "./assets/screenshot_wide.jpg",
    "type": "image/jpeg",
    "sizes": "1024x593",
    "form_factor": "wide"
  }
]
```

### The service worker

Next we will examine the [service worker](src/sw.js) file and the [registration](src/registerSW.js) of the service worker.

The service worker is meant to cache files for offline use and serve them when the app is launched with no connectivity to the server. To do this it requires a list of files to cache at build time, and a cache to cache the files to:

```javascript
// src/sw.js
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
```

When the user attempts to install the PWA the service worker file needs to listen for the install event and provide a way for the service worker to cache all the necessary files:

```javascript
// src/sw.js
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
```

In the event the application is launched but has no connectivity to the server the service worker must listen for the fetch event(s) and return the files that are asked for (which come from the cache list above):

```javascript
// src/sw.js
self.addEventListener('fetch', function(event) {
  console.log('Attempting to fetch: ' + event.request.url);
  event.respondWith(
    fetch(event.request).catch(() => {
      console.log("Event request: " + event.request.url);
      return caches.match(event.request);
    })
  );
});
```

That is the minimum functionality in the service worker that is needed to satisfy browser requirements to allow installation, however the service worker still needs to be registered to the browser. The registration should be done in the entry point of the application, or at least invoked in the entry point and performed before anything else. Note the [registerSW.js](src/registerSW.js) file to see what this process looks like:

```javascript
// src/registerSW.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(function(registration) {
    console.log('Service Worker registered with scope:', registration.scope);
  }).catch(function(error) {
    console.log('Service Worker registration failed:', error);
  });
}
```

### The entry point

In the entry point html of the application, in this case index.html, the manifest needs to be referenced and the service worker need to be registered before any other scripts are referenced:

```html
<link rel="manifest" href="./manifest.json">
<script src="./registerSW.js"></script>
```

The above steps are all that is required on the HTML5 project to turn it into a Progressive Web App that can be installed and run on Desktop, iOS, and Android devices.
