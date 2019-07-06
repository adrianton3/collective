(() => {
	'use strict'

	const {
		Vec2,
		Bug,
		shapeProto,
	} = window.ba

	function Grid (collective, location, a, b, density = .9) {
		this.location = location.clone()
		this.a = a.clone()
		this.b = b.clone()

		const aCount = Math.floor(a.length() * density / Bug.prototype.radius * .5)
		const bCount = Math.floor(b.length() * density / Bug.prototype.radius * .5)

		this.bugs = []
		this.lines = []

		for (let i = 0; i <= aCount; i++) {
			const line = []

			for (let j = 0; j <= bCount; j++) {
				const location = new Vec2(0., 0.).lerp(a, i / aCount)
					.add(new Vec2(0., 0.).lerp(b, j / bCount))
					.add(this.location)

				const bug = collective.allocate(location)

				line.push(bug)
				this.bugs.push(bug)

				console.log(location.x, location.y)
			}
			console.log('---')

			this.lines.push(line)
		}
	}

	Object.assign(Grid.prototype, shapeProto)

	Grid.prototype.setLocation = function (location) {
		this.location.copy(location)

		this.updateBugs()
	}

	Grid.prototype.setEnds = function (location, a, b) {
		this.location.copy(location)
		this.a.copy(a)
		this.b.copy(b)

		this.updateBugs()
	}

	Grid.prototype.updateBugs = function () {
		for (let i = 0; i < this.lines.length; i++) {
			for (let j = 0; j < this.lines[i].length; j++) {
				const location = new Vec2(0., 0.).lerp(this.a, i / (this.lines.length - 1))
					.add(new Vec2(0., 0.).lerp(this.b, j / (this.lines[i].length - 1)))
					.add(this.location)

				this.lines[i][j].setTarget(location)
			}
		}
	}

	window.ba = window.ba || {}
	Object.assign(window.ba, {
		Grid,
	})
})()