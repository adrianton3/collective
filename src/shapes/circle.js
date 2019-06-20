(() => {
	'use strict'

	const {
		Vec2,
		Bug,
		shapeProto,
	} = window.ba

	function Circle (collective, center, radius, density = .9) {
		this.location = center
		this.radius = radius
		this.rotation = 0.

		const count = Math.floor(radius * Math.PI * density / Bug.prototype.radius)

		this.bugs = []

		for (let i = 0; i < count; i++) {
			const location = center.clone().add(new Vec2(
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

	window.ba = window.ba || {}
	Object.assign(window.ba, {
		Circle,
	})
})()