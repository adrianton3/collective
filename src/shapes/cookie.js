(() => {
	'use strict'

	const {
		Vec2,
		Bug,
		shapeProto,
	} = window.ba

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
		'Q': [
			'.xxx.',
			'x...x',
			'x...x',
			'x.x.x',
			'.xxxx',
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
		Cookie,
	})
})()