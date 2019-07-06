(() => {
	'use strict'

	const {
		Vec2,
		Collective,
		loadImages,
		renderer,
	} = window.ba


	function setupCamera (canvas, renderer) {
		let scale = 1.

		canvas.addEventListener('wheel', (event) => {
			scale = Math.max(.25, Math.min(1.5, scale - event.deltaY * .0005))
			renderer.setScale(scale)
		})
	}

	function setup ({ images }) {
		const canvas = document.getElementById('can')

		renderer.init(canvas)

		setupCamera(canvas, renderer)

		const collective = new Collective(new Vec2(-256., -256.), new Vec2(256., 256.))

		canvas.addEventListener('mousemove', (event) => {
			collective.setAvoider(
				new Vec2(event.offsetX, event.offsetY).sub(
					new Vec2(canvas.width, canvas.height).scale(.5)
				)
			)
		})

		{
			const circle = new ba.Circle(collective, new Vec2(0., 0.), 150., .7)
			setInterval(() => {
				circle.setRotation(performance.now() * .0003)
			}, 30)
		}

		// {
		// 	const grid = new ba.Grid(collective, new Vec2(0., 0.), new Vec2(100., 0.), new Vec2(0., 100.))

		// 	let state = true
		// 	setInterval(() => {
		// 		if (state) {
		// 			grid.setEnds(new Vec2(0., 0.), new Vec2(250., -150.), new Vec2(0., 200.))
		// 		} else {
		// 			grid.setEnds(new Vec2(0., 0.), new Vec2(150., 150.), new Vec2(0., 100.))
		// 		}

		// 		state = !state
		// 	}, 1000)
		// }

		// {
		// 	const grid = new ba.Grid(collective, new Vec2(-250., -250.), new Vec2(500., 0.), new Vec2(0., 500.))
		//
		// 	setTimeout(() => {
		// 			grid.free()
		// 	}, 10000)
		// }

		;[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].forEach((char) => {
			const button = document.createElement('button')
			button.textContent = char
			button.addEventListener('click', () => {
				const cookie = new ba.Cookie(collective, new Vec2(150., 0.), ba.Cookie.patterns[char])
				setTimeout(() => { cookie.setLocation(new Vec2(-150., 0.)) }, 3000)
				setTimeout(() => { cookie.free() }, 6000)
			})

			document.body.appendChild(button)
		})

		return { collective, images }
	}

	function loop ({ collective, images }) {
		let timePrevious = performance.now()

		function step (timeNow) {
			collective.advance((timeNow - timePrevious) * .001)
			timePrevious = timeNow

			renderer.draw(collective.bugs, collective.freeBugs)
			requestAnimationFrame(step)
		}

		requestAnimationFrame(step)
	}

	loadImages().then((images) => {
		loop(setup({ images }))
	})
})()