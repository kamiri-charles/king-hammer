import Block from "../primitives/Block";

export default class BoxExplosion {
	position: { x: number; y: number };
	shrapnel: BoxShrapnel[];
	shrapnel_count: number;
	collision_blocks: Block[];
	marked_for_deletion: boolean;

	constructor({ position = { x: 0, y: 0 }, collision_blocks = [] } = {}) {
		this.position = position;
		this.shrapnel_count = 10;
		this.collision_blocks = collision_blocks;

		this.shrapnel = [];

		this.marked_for_deletion = false;

		this.init();
	}

	init() {
		for (let i = 0; i < this.shrapnel_count; i++) {
			let idx = Math.floor(Math.random() * 4 + 1);

			this.shrapnel.push(
				new BoxShrapnel({
					position: { x: this.position.x, y: this.position.y },
					image_src: `assets/spritesheets/box/BoxPieces${idx}.png`,
					collision_blocks: this.collision_blocks,
				})
			);
		}
	}

	update() {
		this.shrapnel = this.shrapnel.filter((s) => !s.marked_for_deletion);

		if (this.shrapnel.length === 0) this.marked_for_deletion = true;
	}

	render(context: CanvasRenderingContext2D) {
		this.update();
		this.shrapnel.forEach((s) => s.render(context));
	}
}

class BoxShrapnel {
	image_src: string;
	shrapnel_img: HTMLImageElement;
	position: { x: number; y: number };
	velocity: { x: number; y: number };
	rotation: number;
	rotation_speed: number;
	opacity: number;
	fade_rate: number;
	collision_blocks: Block[];
	marked_for_deletion: boolean;

	constructor({
		position = { x: 0, y: 0 },
		image_src = "assets/spritesheets/box/BoxPieces1.png",
		collision_blocks = [],
	} = {}) {
		this.position = position;
		this.image_src = image_src;
		this.shrapnel_img = new Image();
		this.shrapnel_img.src = image_src;
		this.velocity = this.randomVelocity();
		this.rotation = Math.random() * 360; // Random initial rotation angle
		this.rotation_speed = (Math.random() - 0.5) * 10; // Random rotation speed between -5 and 5
		this.opacity = 1; // Start fully opaque
		this.fade_rate = 0.01; // Adjust to control how fast the shrapnel fades
		this.collision_blocks = collision_blocks;
		this.marked_for_deletion = false;
	}

	randomVelocity() {
		const speed = Math.random() * 5 + 2; // Random speed between 2 and 7
		const angle = (Math.random() - 1) * Math.PI; // Angle from -π/2 to π/2
		return {
			x: speed * Math.cos(angle),
			y: speed * Math.sin(angle) * 0.5, // Reduce vertical component to make it more horizontal
		};
	}

	update() {
		// Update position with velocity
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		// Apply gravity effect
		this.velocity.y += 0.1; // Adjust gravity as needed

		// Update rotation
		this.rotation += this.rotation_speed;

		// Reduce opacity over time
		this.opacity -= this.fade_rate;
		if (this.opacity < 0) this.opacity = 0;

		// Check for collisions with blocks
		this.collision_blocks.forEach((block) => {
			const collisionSide = this.getCollisionSide(block);
			if (collisionSide) {
				if (collisionSide === "left" || collisionSide === "right") {
					this.velocity.x = 0;
				}
				if (collisionSide === "top") {
					this.velocity.y = 0;
					this.rotation_speed = 0; // Stop rotating on collision
				}
				if (collisionSide === "bottom") {
					this.velocity.y = 0;
				}
			}
		});

		// If faded out, mark for deletion
		if (this.opacity <= 0) this.marked_for_deletion = true;
	}

	getCollisionSide(block: Block) {
		const shrapnelRight = this.position.x + this.shrapnel_img.width / 2;
		const shrapnelLeft = this.position.x - this.shrapnel_img.width / 2;
		const shrapnelTop = this.position.y - this.shrapnel_img.height / 2;
		const shrapnelBottom = this.position.y + this.shrapnel_img.height / 2;

		const blockRight = block.position.x + block.width;
		const blockLeft = block.position.x;
		const blockTop = block.position.y;
		const blockBottom = block.position.y + block.height;

		if (
			shrapnelRight > blockLeft &&
			shrapnelLeft < blockRight &&
			shrapnelBottom > blockTop &&
			shrapnelTop < blockBottom
		) {
			const overlapLeft = shrapnelRight - blockLeft;
			const overlapRight = blockRight - shrapnelLeft;
			const overlapTop = shrapnelBottom - blockTop;
			const overlapBottom = blockBottom - shrapnelTop;

			const minOverlap = Math.min(
				overlapLeft,
				overlapRight,
				overlapTop,
				overlapBottom
			);

			if (minOverlap === overlapLeft) return "left";
			if (minOverlap === overlapRight) return "right";
			if (minOverlap === overlapTop) return "top";
			if (minOverlap === overlapBottom) return "bottom";
		}

		return null;
	}

	render(context: CanvasRenderingContext2D) {
		this.update();
		context.save();
		context.globalAlpha = this.opacity; // Apply opacity
		context.translate(this.position.x, this.position.y);
		context.rotate((this.rotation * Math.PI) / 180);
		context.drawImage(
			this.shrapnel_img,
			-this.shrapnel_img.width / 2,
			-this.shrapnel_img.height / 2
		);
		context.restore();
	}
}
