(() => {
	'use strict'

	const {
		Vec2,
		Bug,
		shapeProto,
	} = window.ba

	function Point (collective, location) {
		this.bugs = [collective.allocate(location)]
	}

	Object.assign(Point.prototype, shapeProto)

	Point.prototype.setLocation = function (location) {
		this.bugs[0].setTarget(location)
	}

	window.ba = window.ba || {}
	Object.assign(window.ba, {
		Point,
	})
})()