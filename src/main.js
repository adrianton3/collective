(() => {
	'use strict'

	const {
		Vec2,
		Collective,
		loadImages,
	} = window.ba

	function setup ({ images }) {
		Draw.init(document.getElementById('can'))
		Draw.clearColor('hsl(220, 20%, 50%)')

		const collective = new Collective(new Vec2(-256., -256.), new Vec2(256., 256.))

		// const line0 = new ba.Line(collective, new Vec2(100., 200.), new Vec2(200., 100.))
		// const line1 = new ba.Line(collective, new Vec2(-100., -200.), new Vec2(-200., -100.))

		/*
		const cookie0 = new ba.Cookie(collective, new Vec2(100., 0.), ba.Cookie.patterns['A'])
		const cookie1 = new ba.Cookie(collective, new Vec2(0., 100.), ba.Cookie.patterns['C'])

		setInterval(() => {
			// line0.update(
			// 	new Vec2(Math.random() * 400. - 200., Math.random() * 400. - 200.),
			// 	new Vec2(Math.random() * 400. - 200., Math.random() * 400. - 200.),
			// )
			//
			// line1.update(
			// 	new Vec2(Math.random() * 400. - 200., Math.random() * 400. - 200.),
			// 	new Vec2(Math.random() * 400. - 200., Math.random() * 400. - 200.),
			// )

			cookie0.setLocation(new Vec2(Math.random() * 200. - 100., Math.random() * 200. - 100.))
			cookie1.setLocation(new Vec2(Math.random() * 200. - 100., Math.random() * 200. - 100.))
		}, 5000)
		*/

		{
			const circle = new ba.Circle(collective, new Vec2(0., 0.), 150., .7)
			setInterval(() => {
				circle.setRotation(performance.now() * .0003)
			}, 30)
		}

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

			Draw.clear()

			Draw.save()
			Draw.translate(256., 256.)
			collective.draw(Draw, images)
			Draw.restore()

			requestAnimationFrame(step)
		}

		requestAnimationFrame(step)
	}

	loadImages().then((images) => {
		loop(setup({ images }))
	})
})()