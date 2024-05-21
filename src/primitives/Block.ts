import { game_variables } from "../config/settings";

export default class Block {
	position: { x: number; y: number; };
	width: number;
	height: number;

	constructor({ position = { x: 0, y: 0 } } = {}) {
		this.position = position;
		this.width = game_variables.BLOCK_SIZE;
		this.height = game_variables.BLOCK_SIZE;
	}

	draw(context: CanvasRenderingContext2D, { fill='transparent', outline='transparent' } = {}) {
		context.fillStyle = fill;
		context.strokeStyle = outline;
		context.fillRect(this.position.x, this.position.y, this.width, this.height);
		context.strokeRect(
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
	}

	render(context: CanvasRenderingContext2D, { fill = "transparent", outline = "transparent" } = {}) {
		this.draw(context, { fill, outline });
	}
}
