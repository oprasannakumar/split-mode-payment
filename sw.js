self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === "POST" && url.pathname === "/") {
    event.respondWith(handleShareTarget(event.request));
  }
});

async function handleShareTarget(request) {
  const formData = await request.formData();
  const file = formData.get("receipt");

  const cache = await caches.open("share-cache");
  await cache.put("shared-image", new Response(file));

  return Response.redirect("/?shared=true", 303);
}