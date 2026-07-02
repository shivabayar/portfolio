/**
 * Kill-switch service worker.
 *
 * The site is now a single self-contained index.html served from GitHub Pages
 * and no longer uses a service worker. Returning visitors may still have the
 * OLD cache-first worker installed, which would keep serving them stale assets
 * indefinitely. Their browser re-fetches THIS file on navigation, so this
 * version unregisters itself, clears every cache it created, and reloads any
 * open pages onto the fresh site.
 */
self.addEventListener('install', function() {
  // activate immediately instead of waiting for existing SW to be released
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil((async function() {
    // drop all caches (old builds used names like 'project-portfolio-v1.0')
    var keys = await caches.keys();
    await Promise.all(keys.map(function(k) { return caches.delete(k); }));

    // remove this worker so it never runs again
    await self.registration.unregister();

    // reload open clients so they pick up the live network version
    var clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(function(client) {
      if ('navigate' in client) client.navigate(client.url);
    });
  })());
});

// while this worker is still briefly alive, never serve from cache — go to network
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
