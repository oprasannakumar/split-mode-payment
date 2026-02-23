const CACHE_NAME = 'smart-row-v2';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png'
];


// 🔹 INSTALL
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});


// 🔹 ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});


// 🔹 FETCH
self.addEventListener('fetch', (event) => {

  const url = new URL(event.request.url);

  // ✅ Allow Google Script calls normally
  if (url.href.includes('script.google.com')) {
    return;
  }

  // ✅ HANDLE SHARE TARGET (image shared from Android)
  if (event.request.method === "POST") {
    event.respondWith(handleShareTarget(event.request));
    return;
  }

  // ✅ Navigation fallback (fixes 404 when installed)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // ✅ Normal caching
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});


// 🔹 SHARE HANDLER
async function handleShareTarget(request) {

  const formData = await request.formData();
  const file = formData.get("receipt");

  const cache = await caches.open("share-cache");
  await cache.put("shared-image", new Response(file));

  return Response.redirect("./index.html?shared=true", 303);
}