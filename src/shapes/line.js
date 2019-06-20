(() => {
	'use strict'

	const {
		Vec2,
		Bug,
		shapeProto,
	} = window.ba

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

	window.ba = window.ba || {}
	Object.assign(window.ba, {
		Line,
	})
})()