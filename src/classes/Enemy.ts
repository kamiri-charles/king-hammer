import { game_variables } from "../config/settings";
import { player_animations } from "../config/animations";
import Sprite from "../primitives/Sprite";
import Block from "../primitives/Block";
import Controller from "./Controller";
import Box from "../objects/Box";
import Camera from "./Camera";

export default class Enemy {
	position: { x: number; y: number };
	width: number;
	height: number;
	velocity: { x: number; y: number };
	speed: number;
	attacking: boolean;
	jumping: boolean;
	falling: boolean;
	jumps: number;
	sprite: Sprite;
	hitbox: { position: { x: number; y: number }; width: number; height: number };
	collision_blocks: Block[];
	boxes: Box[];
	animations: any;
	state: string;
	controller: Controller;
	current_animation: any;
	camera: Camera;
	hit_radius_scale: number;
	hit_radius: {
		position: { x: number; y: number };
		width: number;
		height: number;
	};

	constructor({
		position = { x: 0, y: 0 },
		state = "idle_right",
		boxes = [],
	} = {}) {
		this.position = position;
		this.width = 78;
		this.height = 58;
		this.velocity = { x: 0, y: 0 };
		this.speed = 4;
		this.attacking = false;
		this.jumping = false;
		this.falling = false;
		this.jumps = 0;

		this.sprite = new Sprite({
			position: { x: this.position.x, y: this.position.y },
			width: this.width,
			height: this.height,
			image_src: "assets/spritesheets/player/IdleRight.png",
		});

		this.hitbox = {
			position: { x: this.position.x, y: this.position.y },
			width: this.width,
			height: this.height,
		};

		this.hit_radius_scale = 2;

		this.hit_radius = {
			position: {
				x: this.position.x + 0.5 * this.width,
				y: this.position.y + 0.5 * this.height,
			},
			width: this.width * this.hit_radius_scale,
			height: this.height,
		};

		this.collision_blocks = [];
		this.boxes = boxes;

		this.animations = player_animations;
		this.init_animations();
		this.state = state;

		this.controller = new Controller(this);
		this.camera = new Camera(this);
	}

	init_animations() {
		for (let key in this.animations) {
			const image = new Image();
			image.src = this.animations[key].image_src;
			this.animations[key].image = image;
		}
	}

	switch_state(state: string) {
		if (this.sprite.image == this.animations[state].image) return;
		this.state = state;

		if (state.includes("right")) {
			this.sprite.current_frame = 0;
		} else {
			this.sprite.current_frame = this.animations[state].frame_rate - 1;
		}
		this.sprite.image = this.animations[state].image;
		this.sprite.frame_rate = this.animations[state].frame_rate;
		this.sprite.frame_buffer = this.animations[state].frame_buffer;
		this.sprite.loop = this.animations[state].loop;
		this.current_animation = this.animations[state];

		if (state.includes("left")) this.sprite.dir_state = "left";
		else this.sprite.dir_state = "right";
	}

	handle_gravity() {
		this.position.y += this.velocity.y;

		if (this.position.y < game_variables.GAME_HEIGHT - this.height) {
			this.velocity.y += game_variables.GRAVITY;
		} else {
			this.velocity.y = 0;
			this.position.y = game_variables.GAME_HEIGHT - this.height;
			this.jumps = 0;
			this.jumping = false;
		}
	}

	handle_movement() {
		this.position.x += this.velocity.x;
		this.update_hitbox();
		this.handle_horizontal_collision();

		if (!this.attacking) {
			if (this.controller.left) {
				this.velocity.x = -this.speed;
				this.switch_state("run_left");
			} else if (this.controller.right) {
				this.velocity.x = this.speed;
				this.switch_state("run_right");
			} else {
				this.velocity.x = 0;

				if (!this.jumping && !this.falling && !this.attacking) {
					if (this.state.includes("left")) this.switch_state("idle_left");
					else this.switch_state("idle_right");
				}
			}
		}

		this.handle_gravity();
		this.update_hitbox();
		this.handle_vertical_collision();
	}

	handle_horizontal_collision() {
		// Collision blocks
		for (let i = 0; i < this.collision_blocks.length; i++) {
			const block: Block = this.collision_blocks[i];

			if (
				this.hitbox.position.x <= block.position.x + block.width &&
				this.hitbox.position.x + this.hitbox.width >= block.position.x &&
				this.hitbox.position.y + this.hitbox.height >= block.position.y &&
				this.hitbox.position.y <= block.position.y + block.height
			) {
				if (this.velocity.x < 0) {
					// Moving to the left
					const offset = this.hitbox.position.x - this.position.x;
					this.position.x = block.position.x + block.width - offset + 0.01;
					break;
				}

				if (this.velocity.x > 0) {
					// Moving to the right
					const offset =
						this.hitbox.position.x - this.position.x + this.hitbox.width;
					this.position.x = block.position.x - offset - 0.01;
					break;
				}
			}
		}

		// Boxes collision
		for (let i = 0; i < this.boxes.length; i++) {
			const box: Box = this.boxes[i];

			if (
				this.hitbox.position.x <= box.position.x + box.width &&
				this.hitbox.position.x + this.hitbox.width >= box.position.x &&
				this.hitbox.position.y + this.hitbox.height >= box.position.y &&
				this.hitbox.position.y <= box.position.y + box.height
			) {
				if (this.velocity.x < 0) {
					// Moving to the left
					const offset = this.hitbox.position.x - this.position.x;
					this.position.x = box.position.x + box.width - offset + 0.01;
					break;
				}

				if (this.velocity.x > 0) {
					// Moving to the right
					const offset =
						this.hitbox.position.x - this.position.x + this.hitbox.width;
					this.position.x = box.position.x - offset - 0.01;
					break;
				}
			}
		}
	}

	handle_vertical_collision() {
		// Collision blocks
		for (let i = 0; i < this.collision_blocks.length; i++) {
			const block: Block = this.collision_blocks[i];

			if (
				this.hitbox.position.x <= block.position.x + block.width &&
				this.hitbox.position.x + this.hitbox.width >= block.position.x &&
				this.hitbox.position.y + this.hitbox.height >= block.position.y &&
				this.hitbox.position.y <= block.position.y + block.height
			) {
				if (this.velocity.y < 0) {
					// Moving upwards
					this.velocity.y = 0;
					const offset = this.hitbox.position.y - this.position.y;
					this.position.y = block.position.y + block.height - offset + 0.01;
					this.jumping = false;
					break;
				}

				if (this.velocity.y > 0) {
					// Moving downwards
					this.velocity.y = 0;
					const offset =
						this.hitbox.position.y - this.position.y + this.hitbox.height;
					this.jumps = 0;
					this.position.y = block.position.y - offset - 0.01;
					this.jumping = false;
					this.falling = false;
					break;
				}
			}
		}

		// Boxes
		for (let i = 0; i < this.boxes.length; i++) {
			const box: Box = this.boxes[i];

			if (
				this.hitbox.position.x <= box.position.x + box.width &&
				this.hitbox.position.x + this.hitbox.width >= box.position.x &&
				this.hitbox.position.y + this.hitbox.height >= box.position.y &&
				this.hitbox.position.y <= box.position.y + box.height
			) {
				if (this.velocity.y < 0) {
					// Moving upwards
					this.velocity.y = 0;
					const offset = this.hitbox.position.y - this.position.y;
					this.position.y = box.position.y + box.height - offset + 0.01;
					this.jumping = false;
					break;
				}

				if (this.velocity.y > 0) {
					// Moving downwards
					this.velocity.y = 0;
					const offset =
						this.hitbox.position.y - this.position.y + this.hitbox.height;
					this.jumps = 0;
					this.position.y = box.position.y - offset - 0.01;
					this.jumping = false;
					this.falling = false;
					break;
				}
			}
		}
	}

	handle_object_interaction() {
		for (let i = 0; i < this.boxes.length; i++) {
			const box: Box = this.boxes[i];

			if (this.attacking) {
				// Check if box is in the hit radius
				if (
					this.hit_radius.position.x <= box.position.x + box.width &&
					this.hit_radius.position.x + this.hit_radius.width >=
						box.position.x &&
					this.hit_radius.position.y + this.hit_radius.height >=
						box.position.y &&
					this.hit_radius.position.y <= box.position.y + box.height
				) {
					box.hp -= 1;
					if (box.hp <= 0) box.marked_for_deletion = true;
				}
			}
		}

		this.boxes = this.boxes.filter((box) => !box.marked_for_deletion);
	}

	attack() {
		if (!this.attacking && !this.jumping) this.attacking = true;
	}

	update_hitbox() {
		this.hitbox = {
			position: { x: this.position.x + 15, y: this.position.y + 15 },
			width: 30,
			height: 30,
		};
	}

	update_hit_radius() {
		this.hit_radius = {
			position: {
				x: this.position.x - 7.5,
				y: this.position.y,
			},
			width: this.width,
			height: this.height,
		};
	}

	update() {
		this.handle_movement();

		if (this.state.includes("left")) {
			this.sprite.update(this.position.x - 15, this.position.y);
		} else {
			this.sprite.update(this.position.x, this.position.y);
		}

		if (this.velocity.y < 0) {
			this.jumping = true;
			if (this.state.includes("left")) this.switch_state("jump_left");
			else this.switch_state("jump_right");
		}

		if (this.velocity.y > 1) {
			this.falling = true;
			if (this.state.includes("left")) this.switch_state("fall_left");
			else this.switch_state("fall_right");
		}

		if (this.attacking) {
			if (this.state.includes("left")) this.switch_state("attack_left");
			else this.switch_state("attack_right");

			if (this.sprite.anim_complete) {
				this.attacking = false;
				this.sprite.anim_complete = false;
			}
		}

		this.update_hit_radius();
		this.handle_object_interaction();
	}

	draw_hitbox(
		context: CanvasRenderingContext2D,
		{ fill = "rgba(255, 0, 0, 0.5)" } = {}
	) {
		context.fillStyle = fill;
		context.fillRect(
			this.hitbox.position.x,
			this.hitbox.position.y,
			this.hitbox.width,
			this.hitbox.height
		);
	}

	draw_hit_radius(context: CanvasRenderingContext2D) {
		context.fillStyle = "rgba(0, 0, 0, 0.5)";
		context.fillRect(
			this.hit_radius.position.x,
			this.hit_radius.position.y,
			this.hit_radius.width,
			this.hit_radius.height
		);
	}

	draw(
		context: CanvasRenderingContext2D,
		{ fill = "transparent", outline = "transparent" }
	) {
		context.fillStyle = fill;
		context.strokeStyle = outline;
		context.fillRect(this.position.x, this.position.y, this.width, this.height);
		context.strokeRect(
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);

		this.sprite.draw(context);
		//this.draw_hitbox(context);
		//this.draw_hit_radius(context);
	}

	render(
		context: CanvasRenderingContext2D,
		{ fill = "transparent", outline = "transparent" } = {}
	) {
		this.update();
		this.draw(context, { fill, outline });
		this.camera.update();
	}
}
