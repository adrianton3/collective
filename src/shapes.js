(() => {
	'use strict'

	const {
		Vec2,
		Bug,
	} = window.ba


	const shapeProto = {
		free () {
			this.bugs.forEach((bug) => { bug.free() })
		},
	}



	function Point (collective, location) {
		this.bugs = [collective.allocate(location)]
	}

	Object.assign(Point.prototype, shapeProto)

	Point.prototype.setLocation = function (location) {
		this.bugs[0].setTarget(location)
	}



	function Line (collective, from, to) {
		this.bugs = []

		this.from = from.clone()
		this.to = to.clone()

		const count = Math.max(
			Math.floor(from.distance(to) / (Bug.prototype.radius * 2.)) - 1,
			1
		)

		for (let i = 0; i <= count; i++) {
			this.bugs.push(collective.allocate(from.lerp(to, i / count)))
		}
	}

	Object.assign(Line.prototype, shapeProto)

	Line.prototype.setLocation = function (location) {
		const halfDelta = this.from.clone().sub(this.to).lerp(.5)

		this.from.copy(location.clone().sub(halfDelta))
		this.to.copy(location.clone().add(halfDelta))

		this.updateBugs()
	}

	Line.prototype.setEnds = function (from, to) {
		this.from.copy(from)
		this.to.copy(to)

		this.updateBugs()
	}

	Line.prototype.updateBugs = function () {
		for (let i = 0; i < this.bugs.length; i++) {
			this.bugs[i].setTarget(this.from.lerp(this.to, i / (this.bugs.length - 1)))
		}
	}



	function Circle (collective, location, radius) {
		this.location = location
		this.radius = radius
		this.rotation = 0

		const count = radius * 2. * Math.PI / Bug.prototype.radius

		this.bugs = []

		for (let i = 0; i < count; i++) {
			const location = location.clone().add(new Vec2(
				Math.cos(i * Math.PI * 2. / count),
				Math.sin(i * Math.PI * 2. / count),
			).scale(radius))

			this.bugs.push(collective.allocate(location))
		}
	}

	Object.assign(Circle.prototype, shapeProto)

	Circle.prototype.setLocation = function (location) {
		this.location.copy(location)

		this.updateBugs()
	}

	Circle.prototype.setRotation = function (rotation) {
		this.rotation = rotation

		this.updateBugs()
	}

	Circle.prototype.updateBugs = function () {
		for (let i = 0; i < this.bugs.length; i++) {
			const location = this.location.clone().add(new Vec2(
				Math.cos(i * Math.PI * 2. / this.bugs.length + this.rotation),
				Math.sin(i * Math.PI * 2. / this.bugs.length + this.rotation),
			).scale(this.radius))

			this.bugs[i].setTarget(location)
		}
	}



	function Cookie (collective, location, pattern) {
		this.height = pattern.length
		this.width = pattern[0].length

		this.location = location.clone()

		this.bugs = []
		this.map = new WeakMap

		const half = new Vec2(this.width, this.height).scale(.5).sub(new Vec2(.5, .5))

		for (let y = 0; y < this.height; y++) {
			const line = pattern[y]

			for (let x = 0; x < this.width; x++) {
				const char = line[x]

				if (char === 'x') {
					const location = this.location.clone().add(
						new Vec2(x, y).sub(half).scale(Bug.prototype.radius * 2.1)
					)

					const bug = collective.allocate(location)

					this.bugs.push(bug)
					this.map.set(bug, { x, y })
				}
			}
		}
	}

	Object.assign(Cookie.prototype, shapeProto)

	Cookie.prototype.setLocation = function (location) {
		this.location.copy(location)

		this.updateBugs()
	}

	Cookie.prototype.updateBugs = function () {
		const half = new Vec2(this.width, this.height).scale(.5).sub(new Vec2(.5, .5))

		this.bugs.forEach((bug) => {
			const { x, y } = this.map.get(bug)

			bug.setTarget(this.location.clone().add(
				new Vec2(x, y).sub(half).scale(Bug.prototype.radius * 2.1)
			))
		})
	}

	Cookie.patterns = {
		'A': [
			'.xxx.',
			'x...x',
			'xxxxx',
			'x...x',
			'x...x',
		],
		'B': [
			'xxxx.',
			'x...x',
			'xxxx.',
			'x...x',
			'xxxx.',
		],
		'C': [
			'.xxxx',
			'x....',
			'x....',
			'x....',
			'.xxxx',
		],
		'D': [
			'xxxx.',
			'x...x',
			'x...x',
			'x...x',
			'xxxx.',
		],
		'E': [
			'xxxxx',
			'x....',
			'xxx..',
			'x....',
			'xxxxx',
		],
		'F': [
			'xxxxx',
			'x....',
			'xxx..',
			'x....',
			'x....',
		],
		'G': [
			'.xxxx',
			'x....',
			'x..xx',
			'x...x',
			'.xxxx',
		],
		'H': [
			'x...x',
			'x...x',
			'xxxxx',
			'x...x',
			'x...x',
		],
		'I': [
			'.xxx.',
			'..x..',
			'..x..',
			'..x..',
			'.xxx.',
		],
		'J': [
			'...x.',
			'...x.',
			'...x.',
			'x..x.',
			'.xx..',
		],
		'K': [
			'x...x',
			'x..x.',
			'xxx..',
			'x..x.',
			'x...x',
		],
		'L': [
			'.x...',
			'.x...',
			'.x...',
			'.x...',
			'.xxxx',
		],
		'M': [
			'x...x',
			'xx.xx',
			'x.x.x',
			'x...x',
			'x...x',
		],
		'N': [
			'x...x',
			'xx..x',
			'x.x.x',
			'x..xx',
			'x...x',
		],
		'O': [
			'.xxx.',
			'x...x',
			'x...x',
			'x...x',
			'.xxx.',
		],
		'P': [
			'xxxx.',
			'x...x',
			'xxxx.',
			'x....',
			'x....',
		],
		'R': [
			'xxxx.',
			'x...x',
			'xxxx.',
			'x...x',
			'x...x',
		],
		'S': [
			'.xxx.',
			'x....',
			'.xxx.',
			'....x',
			'.xxx.',
		],
		'T': [
			'xxxxx',
			'..x..',
			'..x..',
			'..x..',
			'..x..',
		],
		'U': [
			'x...x',
			'x...x',
			'x...x',
			'x...x',
			'.xxx.',
		],
		'V': [
			'x...x',
			'x...x',
			'.x.x.',
			'.x.x.',
			'..x..',
		],
		'W': [
			'x...x',
			'x...x',
			'x.x.x',
			'xx.xx',
			'x...x',
		],
		'X': [
			'x...x',
			'.x.x.',
			'..x..',
			'.x.x.',
			'x...x',
		],
		'Y': [
			'x...x',
			'.x.x.',
			'..x..',
			'..x..',
			'..x..',
		],
		'Z': [
			'xxxxx',
			'...x.',
			'..x..',
			'.x...',
			'xxxxx',
		],
	}


	window.ba = window.ba || {}
	Object.assign(window.ba, {
		Point,
		Line,
		Circle,
		Cookie,
	})
})()