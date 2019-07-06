(() => {
	'use strict'

	const {
		Vec2,
		Bug,
		Space,
	} = window.ba

	const startOffset = 40

	function Collective (edgeMin, edgeMax) {
		this.edgeMin = edgeMin.clone()
		this.edgeMax = edgeMax.clone()

		this.beyondMin = edgeMin.clone().sub(new Vec2(startOffset, startOffset))
		this.beyondMax = edgeMax.clone().add(new Vec2(startOffset, startOffset))

		this.bugs = []
		this.freeBugs = []

		this.avoider = new Vec2(0., 0.)

		this.halfDiagonal = Math.hypot(this.edgeMax.x - this.edgeMin.x, this.edgeMax.y - this.edgeMin.y) / 2
	}

	Collective.prototype.setAvoider = function (location) {
		this.avoider.copy(location)
	}

	Collective.prototype.findLocationBeyondEdge = function (location) {
		return location.clone()
			.add(new Vec2((Math.random() -.5) * 50., (Math.random() -.5) * 50.))
			.normalize()
			.scale(this.halfDiagonal)
			.clamp(this.beyondMin, this.beyondMax)
	}

	function sample (array) {
		return array[Math.floor(Math.random() * array.length)]
	}

	Collective.prototype.findActiveBug = function (location) {
		if (this.bugs.length === 0) {
			return null
		}

		const tries = Math.min(this.bugs.length, 10)

		let bug = sample(this.bugs)
		let distanceMin = bug.location.distance(location)

		for (let i = 0; i < tries; i++) {
			const candidate = sample(this.bugs)
			const distanceActual = candidate.location.distance(location)

			if (distanceActual < distanceMin) {
				distanceMin = distanceActual
				bug = candidate
			}
		}

		return bug
	}

	Collective.prototype.findFreeBug = function (location) {
		if (this.freeBugs.length === 0) {
			return null
		}

		const tries = Math.min(this.freeBugs.length, 10)

		let bug = null
		let distanceMin = Math.min(
			location.x - this.beyondMin.x,
			location.y - this.beyondMin.y,
			location.x + this.beyondMax.x,
			location.y + this.beyondMax.y,
		)

		for (let i = 0; i < tries; i++) {
			const candidate = sample(this.freeBugs)
			const distanceActual = candidate.location.distance(location)

			if (distanceActual < distanceMin) {
				distanceMin = distanceActual
				bug = candidate
			}
		}

		return bug
	}

	function removeFirst (array, element) {
		const index = array.indexOf(element)

		if (index > -1) {
			array.splice(index, 1)
		}
	}

	Collective.prototype.allocate = function (location) {
		const maybeBug = this.findFreeBug(location)
		if (maybeBug != null) {
			removeFirst(this.freeBugs, maybeBug)
			this.bugs.push(maybeBug)

			maybeBug.state = 'active'
			maybeBug.weight = .9
			maybeBug.setTarget(location)
			maybeBug.friend = null
			return maybeBug
		}

		const locationNew = this.findLocationBeyondEdge(location)
		locationNew.add(new Vec2(0., Math.random() * 10. - 5.))
		const bugNew = new Bug(this, locationNew, location)
		this.bugs.push(bugNew)
		return bugNew
	}

	Collective.prototype.free = function (bug) {
		bug.state = 'free'
		bug.weight = 1.1
		bug.setTarget(this.findLocationBeyondEdge(bug.location))

		removeFirst(this.bugs, bug)
		this.freeBugs.push(bug)

		// if (Math.random() < .3) {
		// 	bug.friend = this.findActiveBug(bug.location)
		// }
	}

	Collective.prototype.advance = function (deltaTime) {
		const halfWidth = Math.max(
			Math.abs(this.edgeMin.x),
			Math.abs(this.edgeMin.y),
			Math.abs(this.edgeMax.x),
			Math.abs(this.edgeMax.y),
		) + startOffset + Bug.prototype.radius * 4

		const space = Space.make({ resolution: 32, halfWidth })
		Space.add(space, this.bugs)
		Space.add(space, this.freeBugs)

		this.bugs.forEach((bug) => {
			bug.applyOverlapping([{ location: this.avoider, radius: 60. }])
			bug.applyOverlapping(Space.getOverlapping(space, bug))
			bug.applyTarget()
		})

		this.freeBugs.forEach((bug) => {
			bug.applyOverlapping([{ location: this.avoider, radius: 60. }])
			bug.applyOverlapping(Space.getOverlapping(space, bug))

			if (bug.friend === null) {
				bug.applyTarget()
			} else {
				bug.applyFriend()
			}
		})

		this.bugs.forEach((bug) => { bug.advance(deltaTime) })
		this.freeBugs.forEach((bug) => { bug.advance(deltaTime) })

		for (let i = 0; i < this.freeBugs.length; i++) {
			const freeBug = this.freeBugs[i]

			if (
				freeBug.location.x < this.beyondMin.x ||
				freeBug.location.y < this.beyondMin.y ||
				freeBug.location.x > this.beyondMax.x ||
				freeBug.location.y > this.beyondMax.y
			) {
				this.freeBugs[i] = this.freeBugs.pop()
			}
		}
	}

	Collective.prototype.draw = function (draw, images) {
		this.bugs.forEach((bug) => { bug.draw(draw, images) })
		this.freeBugs.forEach((bug) => { bug.draw(draw, images) })
	}

	window.ba = window.ba || {}
	Object.assign(window.ba, {
		Collective,
	})
})()