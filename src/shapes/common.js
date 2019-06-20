(() => {
	'use strict'

	const shapeProto = {
		free () {
			this.bugs.forEach((bug) => { bug.free() })
		},
	}

	window.ba = window.ba || {}
	Object.assign(window.ba, {
		shapeProto,
	})
})()