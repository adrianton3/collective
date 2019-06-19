(() => {
	'use strict'

	function Vec2 (x, y) {
		this.x = x
		this.y = y
	}

	Vec2.prototype.add = function (other) {
		this.x += other.x
		this.y += other.y

		return this
	}

	Vec2.prototype.sub = function (other) {
		this.x -= other.x
		this.y -= other.y

		return this
	}

	Vec2.prototype.scale = function (s) {
		this.x *= s
		this.y *= s

		return this
	}

	Vec2.prototype.length = function () {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}

	Vec2.prototype.distance = function (other) {
		const deltaX = this.x - other.x
		const deltaY = this.y - other.y
		return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
	}

	Vec2.prototype.normalize = function () {
		if (this.x === 0 && this.y === 0) {
			return this
		}

		const length = Math.sqrt(this.x * this.x + this.y * this.y)
		this.x /= length
		this.y /= length

		return this
	}

	Vec2.prototype.lerp = function (other, fraction) {
		return new Vec2(
			(this.x * fraction + other.x * (1. - fraction)) * .5,
			(this.y * fraction + other.y * (1. - fraction)) * .5,
		)
	}

	Vec2.prototype.copy = function (other) {
		this.x = other.x
		this.y = other.y

		return this
	}

	Vec2.prototype.clone = function () {
		return new Vec2(this.x, this.y)
	}

	window.ba = window.ba || {}
	Object.assign(window.ba, {
		Vec2,
	})
})()