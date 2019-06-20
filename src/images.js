(() => {
	'use strict'

	const imageUrls = {
		'u-s': 'art/u-s.png',
		'u-0f': 'art/u-0f.png',
		'u-1f': 'art/u-1f.png',
		'u-0h': 'art/u-0h.png',
		'u-1h': 'art/u-1h.png',

		'l-s': 'art/l-s.png',
		'l-0f': 'art/l-0f.png',
		'l-1f': 'art/l-1f.png',
		'l-0h': 'art/l-0h.png',
		'l-1h': 'art/l-1h.png',

		'd-s': 'art/d-s.png',
		'd-0f': 'art/d-0f.png',
		'd-1f': 'art/d-1f.png',
		'd-0h': 'art/d-0h.png',
		'd-1h': 'art/d-1h.png',

		'r-s': 'art/r-s.png',
		'r-0f': 'art/r-0f.png',
		'r-1f': 'art/r-1f.png',
		'r-0h': 'art/r-0h.png',
		'r-1h': 'art/r-1h.png',
	}

	function loadImages () {
		return Promise.all(Object.entries(imageUrls).map(([name, url]) =>
			new Promise((resolve, reject) => {
				const image = document.createElement('img')
				image.src = url
				image.addEventListener('load', () => { resolve({ name, image }) })
			})
		)).then((imagesArray) => {
			const images = {}

			imagesArray.forEach(({ name, image }) => {
				images[name] = image
			})

			return images
		})
	}

	window.ba = window.ba || {}
	Object.assign(window.ba, {
		loadImages,
	})
})()