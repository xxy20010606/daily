const CACHE = "briefs-v2";

// Network-first strategy: always try to get fresh content
// Only use cache when device is offline
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cache the fresh response for offline use
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => {
        // Offline fallback: return cached version
        return caches.match(e.request);
      })
  );
});

// Clear old caches on activation
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    )
  );
});
