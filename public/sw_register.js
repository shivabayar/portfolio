/*
    Service worker registration
*/
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js')
	.then(function() {
		console.log('Yay!! Registration worked!');
	})
	.catch(function() {
		console.error('Oops!! Registration failed!');
	});
}
