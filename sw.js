/**
 * Service worker implementation
 */
const staticCacheName = 'project-portfolio-v1';

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCacheName)
		.then(function(cache) {
			return cache.addAll([
				'./index.html',
                './css/main.css',
                './css/responsive.css',
                './sw_register.js',
                './images/comtel-large.png',
                './images/comtel-small.png',
                './images/extreme-large.jpg',
                './images/extreme-small.jpg',
                './images/hashedin.png',
                './images/profile.jpg',
                './images/s.png'
			]);
        })
        .catch(error => console.error(error))
	);
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys()
		.then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName.startsWith('project-portfolio-') &&
						   cacheName != staticCacheName;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			);
        })
        .catch(error => console.error(error))
	);
})

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
		.then(function(response) {
			return response || fetch(event.request);
        })
        .catch(error => console.error(error))
	);
});
