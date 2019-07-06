(() => {
	'use strict'

	let renderer
	let stage, bugContainer
	let sprites = []

	function init (canvas) {
		const { width, height } = canvas

		renderer = new PIXI.Renderer({
			width,
			height,
			view: canvas,
			backgroundColor: 0x123456,
		})

		stage = new PIXI.Container()

		bugContainer = new PIXI.ParticleContainer(100, {
			scale: false,
			position: true,
			rotation: false,
			uvs: true,
			alpha: false,
		})

		stage.position.x = width / 2
		stage.position.y = height / 2

		stage.addChild(bugContainer)
	}

	function makeSheet () {
		const spriteSize = 48

		const entries = []

		for (let i = 0; i < 4; i++) {
			entries.push({
				stop: new PIXI.Rectangle(0, spriteSize * i, spriteSize, spriteSize),
				half: [
					new PIXI.Rectangle(spriteSize * 1, spriteSize * i, spriteSize, spriteSize),
					new PIXI.Rectangle(spriteSize * 2, spriteSize * i, spriteSize, spriteSize),
				],
				full: [
					new PIXI.Rectangle(spriteSize * 3, spriteSize * i, spriteSize, spriteSize),
					new PIXI.Rectangle(spriteSize * 4, spriteSize * i, spriteSize, spriteSize),
				],
			})
		}

		return entries
	}

	const sheet = makeSheet()

	function copyPosition (sprite, bug) {
		sprite.position.x = bug.location.x
		sprite.position.y = bug.location.y

		const frame = (() => {
			const velocityLength = bug.velocity.length()

			if (velocityLength < .001) {
				return sheet[0].stop
			}

			const directionIndex = (() => {
				if (Math.abs(bug.velocity.x) > Math.abs(bug.velocity.y)) {
					return bug.velocity.x > 0. ? 2 : 1
				} else {
					return bug.velocity.y > 0. ? 0 : 3
				}
			})()

			return velocityLength < .21
				? sheet[directionIndex].half[bug.frameIndex]
				: sheet[directionIndex].half[bug.frameIndex]
		})()

		sprite.texture.frame.copyFrom(frame)

		sprite.texture.updateUvs()
	}

	const baseTexture = PIXI.BaseTexture.from('./art/sheet.png')

	function addSprite () {
		const texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 48, 48))
		const sprite = new PIXI.Sprite(texture)

		sprite.anchor.set(.5, .5)
		// copyPosition(sprite, bug)

		bugContainer.addChild(sprite)
		sprites.push(sprite)
	}

	function draw (bugsActive, bugsFree) {
		for (let i = sprites.length; i < bugsActive.length + bugsFree.length; i++) {
			addSprite()
		}

		for (let i = bugsActive.length + bugsFree.length; i < sprites.length; i++) {
			const sprite = sprites.pop()
			bugContainer.removeChild(sprite)
		}


		let index = 0
		for (let i = 0; i < bugsActive.length; i++) {
			copyPosition(sprites[index], bugsActive[i])
			index++
		}

		for (let i = 0; i < bugsFree.length; i++) {
			copyPosition(sprites[index], bugsFree[i])
			index++
		}


		renderer.render(stage)
	}

	function setScale (scale) {
		stage.scale.x = scale
		stage.scale.y = scale
	}

	window.ba = window.ba || {}
	Object.assign(ba, {
		renderer: {
			init,
			draw,
			setScale,
		},
	})
})()