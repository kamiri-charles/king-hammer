export default class Sprite {
	position: { x: number; y: number; };
	width: number;
	height: number;
	image_src: string;
	image: HTMLImageElement;
	current_frame: number;
	frame_rate: number;
	frame_buffer: number;
	frame_counter: number;
	loop: boolean;
	anim_complete: boolean;
	dir_state: string;

	constructor({
		position = { x: 0, y: 0 },
		width = 58,
		height = 58,
		image_src = "",
	} = {}) {
		this.position = position;
		this.width = width;
		this.height = height;
		this.image_src = image_src;

		this.image = new Image();
		this.image.src = image_src;
		this.current_frame = 0;
		this.frame_rate = 11;
		this.frame_buffer = 2;
		this.frame_counter = 0;
		this.loop = true;
		this.anim_complete = false;

		this.dir_state = "right";
	}

	update(x: number, y: number) {
		this.position.x = x;
		this.position.y = y;
		this.frame_counter++;

		if (this.current_frame >= this.frame_rate - 1) {
			if (this.loop) this.current_frame = 0;
			else this.anim_complete = true;
		} else {
			if (this.frame_counter % this.frame_buffer == 0) {
				this.current_frame++;
			}
		}
	}

	draw(context: CanvasRenderingContext2D) {
		let l_offset = 0;
		const cropbox = {
			position: { x: this.current_frame * this.width + l_offset, y: 0 },
			width: this.width,
			height: this.height,
		};

		context.drawImage(
			this.image,
			cropbox.position.x,
			cropbox.position.y,
			cropbox.width,
			cropbox.height,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
	}
}
