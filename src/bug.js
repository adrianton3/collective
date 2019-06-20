(() => {
	'use strict'

	const {
		Vec2,
	} = window.ba

	function Bug (collective, location, target) {
		this.collective = collective
		this.location = location.clone()
		this.target = target.clone()
		this.velocity = new Vec2(0., 0.)
		this.weight = 1.
		this.sprite = null
		this.state = 'active'
		this.friend = null

		this.frameIndex = 0
		this.frameFraction = 0.
	}

	Bug.prototype.radius = 24.
	Bug.prototype.stepMax = 2.

	Bug.prototype.setTarget = function (target) {
		this.target.copy(target)
	}

	Bug.prototype.applyOverlapping = function (overlapping) {
		overlapping.forEach((fixed) => {
			const distanceActual = this.location.distance(fixed.location)
			const distanceMin = this.radius + fixed.radius
			if (distanceActual < distanceMin) {
				const exit = this.location.clone().sub(fixed.location).normalize().scale(distanceMin * this.weight * .025)
				this.velocity.add(exit)
			}
		})
	}

	Bug.prototype.applyTarget = function () {
		const delta = this.target.clone().sub(this.location)

		if (delta.length() <= this.stepMax) {
			this.velocity.add(delta.scale(.5))
		} else {
			this.velocity.add(delta.normalize().scale(this.stepMax))
		}
	}

	Bug.prototype.applyFriend = function () {
		const delta = this.friend.location.clone().sub(this.location)
		const length = delta.length()
		delta.normalize().scale(length - (this.radius + this.friend.radius + 2.))

		if (delta.length() <= this.stepMax) {
			this.velocity.add(delta.scale(.5))
		} else {
			this.velocity.add(delta.normalize().scale(this.stepMax))
		}
	}

	Bug.prototype.advance = function (deltaTime) {
		this.location.add(this.velocity)
		this.velocity.scale(.1)

		this.frameFraction += this.velocity.length() * .9
		this.frameFraction = this.frameFraction % 2.
		this.frameIndex = Math.floor(this.frameFraction)
	}

	Bug.prototype.getStretch = function () {
		return this.location.distance(this.target)
	}

	Bug.prototype.free = function () {
		this.collective.free(this)
	}

	Bug.prototype.draw = function (draw, images) {
		if (this.velocity.length() < .001) {
			draw.image(images[`d-s`], this.location.x, this.location.y)
			return
		}

		const speed = this.velocity.length() > .21 ? 'f' : 'h'
		
		if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
			if (this.velocity.x > 0.) {
				draw.image(images[`r-${this.frameIndex}${speed}`], this.location.x, this.location.y)
			} else {
				draw.image(images[`l-${this.frameIndex}${speed}`], this.location.x, this.location.y)
			}
		} else {
			if (this.velocity.y > 0.) {
				draw.image(images[`d-${this.frameIndex}${speed}`], this.location.x, this.location.y)
			} else {
				draw.image(images[`u-${this.frameIndex}${speed}`], this.location.x, this.location.y)
			}
		}
	}

	window.ba = window.ba || {}
	Object.assign(window.ba, {
		Bug,
	})
})()