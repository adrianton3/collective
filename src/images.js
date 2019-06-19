(() => {
	'use strict'

	const imageUrls = {
		'd0': 'art/d0.png',
		'd1': 'art/d1.png',
		'd2': 'art/d2.png',
		'u0': 'art/u0.png',
		'u1': 'art/u1.png',
		'u2': 'art/u2.png',
		'l0': 'art/l0.png',
		'l1': 'art/l1.png',
		'l2': 'art/l2.png',
		'r0': 'art/r0.png',
		'r1': 'art/r1.png',
		'r2': 'art/r2.png',
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