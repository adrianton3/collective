(() => {
	'use strict'

	function makeChunks (resolution) {
		const matrix = []

		for (let i = 0; i < resolution; i++) {
			const line = []

			for (let j = 0; j < resolution; j++) {
				const chunk = []

				line.push(chunk)
			}

			matrix.push(line)
		}

		return matrix
	}

	function applyOnArea (
		{ chunks, halfWidth, chunkSize },
		sx, sy, ex, ey,
		fun
	) {
		const scx = Math.floor((sx + halfWidth) / chunkSize)
		const scy = Math.floor((sy + halfWidth) / chunkSize)

		const ecx = Math.floor((ex + halfWidth) / chunkSize)
		const ecy = Math.floor((ey + halfWidth) / chunkSize)

		for (let i = scx; i <= ecx; i++) {
			for (let j = scy; j <= ecy; j++) {
				fun(chunks[i][j])
			}
		}
	}

	function add (space, items) {
		for (let i = 0; i < items.length; i++) {
			const item = items[i]

			applyOnArea(
				space,
				item.location.x - item.radius,
				item.location.y - item.radius,
				item.location.x + item.radius,
				item.location.y + item.radius,
				(chunk) => {
					chunk.push(item)
				},
			)
		}
	}

	function make ({ resolution, halfWidth }) {
		const chunks = makeChunks(resolution)

		return {
			chunks,
			halfWidth,
			chunkSize: (halfWidth * 2) / resolution,
		}
	}

	const getOverlapping = (() => {
		// for some reason chrome backs off with "optimised too many times"
		// this horrible hack seems to fix it
		const collected = []
		const marked = []
		let that

		function collect (chunk) {
			for (let i = 0; i < chunk.length; i++) {
				const item = chunk[i]

				if (!item._mark) {
					item._mark = true
					marked.push(item)

					const dist = item.location.distance(that.location)

					if (
						dist < that.radius + item.radius &&
						that !== item
					) {
						collected.push(item)
					}
				}
			}
		}

		return (space, _that) => {
			that = _that

			collected.length = 0
			marked.length = 0

			applyOnArea(
				space,
				that.location.x - that.radius,
				that.location.y - that.radius,
				that.location.x + that.radius,
				that.location.y + that.radius,
				collect,
			)

			for (let i = 0; i < marked.length; i++) {
				const item = marked[i]
				item._mark = false
			}

			return collected
		}
	})()

	window.ba = window.ba || {}
	Object.assign(window.ba, {
		Space: {
			make,
			add,
			getOverlapping,
		},
	})
})()