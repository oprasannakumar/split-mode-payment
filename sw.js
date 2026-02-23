const CACHE_NAME = 'smart-row-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {

  const url = new URL(event.request.url);

  // 🔥 Intercept ALL POST requests (important)
  if (event.request.method === "POST") {
    event.respondWith(handleShareTarget(event.request));
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('./index.html')));
    return;
  }

  event.respondWith(fetch(event.request));
});

async function handleShareTarget(request) {
  const formData = await request.formData();
  const file = formData.get("receipt");

  if (file) {
    const cache = await caches.open("share-cache");
    await cache.put("shared-image", new Response(file));
  }

  return Response.redirect("./index.html?shared=true", 303);
}