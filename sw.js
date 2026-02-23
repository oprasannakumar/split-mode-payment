const CACHE_NAME = 'monthly-expences-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle Share Target POST
  if (
    event.request.method === 'POST' &&
    url.pathname.endsWith('/index.html')
  ) {
    event.respondWith(handleShare(event));
  }
});

async function handleShare(event) {
  const formData = await event.request.formData();
  const file = formData.get('receipt');

  if (file) {
    const buffer = await file.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);

    const client = await self.clients.get(event.resultingClientId);
    if (client) {
      client.postMessage({
        type: 'SHARED_IMAGE',
        image: `data:${file.type};base64,${base64}`
      });
    }
  }

  return Response.redirect('./index.html', 303);
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}