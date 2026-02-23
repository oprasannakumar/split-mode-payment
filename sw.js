const CACHE_NAME = 'monthly-expences-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  clients.claim();
});

// Handle Share Target
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // If request is coming from share target
  if (
    event.request.method === 'POST' &&
    url.pathname.endsWith('/index.html')
  ) {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        const file = formData.get('receipt');

        const client = await self.clients.get(event.resultingClientId);

        if (file && client) {
          const reader = new FileReader();
          reader.onload = () => {
            client.postMessage({
              type: 'SHARED_IMAGE',
              image: reader.result
            });
          };
          reader.readAsDataURL(file);
        }

        return Response.redirect('./index.html');
      })()
    );
  }
});