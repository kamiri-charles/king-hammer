import Player from "./Player";
import Block from "../primitives/Block";
import { parse2D } from "../config/utils";
import { game_variables } from "../config/settings";
import { levels } from "../config/levels";
import Box from "../objects/Box";
import GameObject from "../primitives/GameObject";

export default class Level {
	level_number: number;
	background: HTMLImageElement;
	collision_blocks_data2D: any;
	collision_blocks: Block[];
	objects: GameObject[];
	player: Player;
	backgroundLoaded: Promise<void>;

	constructor({ level_number = 1 } = {}) {
		this.level_number = level_number;
		this.background = new Image();
		this.background.src = `assets/backgrounds/BackgroundLevel${level_number}.png`;

	
		this.backgroundLoaded = new Promise<void>((resolve, reject) => {
			this.background.onload = () => resolve();
			this.background.onerror = () =>
				reject(new Error("Failed to load background image"));
		});
		

		this.collision_blocks_data2D = parse2D(
			levels[level_number].collision_blocks
		);
		this.collision_blocks = [];
		this.objects = [];

		this.player = new Player();

		this.init();

	}

	init() {
		// Generate collision blocks
		if (this.collision_blocks_data2D.length > 0) {
			this.collision_blocks_data2D.forEach((row: any[], y: number) => {
				row.forEach((symbol, x) => {
					if (symbol !== 0) {
						this.collision_blocks.push(
							new Block({
								position: {
									x: x * game_variables.BLOCK_SIZE,
									y: y * game_variables.BLOCK_SIZE,
								},
							})
						);
					}
				});
			});
		}

		// Generate game objects
		levels[this.level_number].objects_data.forEach(obj => {
			if (obj.type == 'box') {
				this.objects.push(new Box({position: {x: obj.x, y: (obj.y - obj.height)}}));
			}
		})		

		// Player init
		this.player.position = levels[this.level_number].player_position;
		this.player.collision_blocks = this.collision_blocks;
	}

	async load(context: CanvasRenderingContext2D) {
		await this.backgroundLoaded; // Wait for the background image to load


		context.save();
		context.scale(this.player.camera.scale, this.player.camera.scale);
		context.translate(-this.player.camera.position.x, -this.player.camera.position.y);

		// Render background
		context.drawImage(
			this.background,
			0,
			0,
			game_variables.GAME_WIDTH,
			game_variables.GAME_HEIGHT,
			0,
			0,
			game_variables.GAME_WIDTH,
			game_variables.GAME_HEIGHT
		);

		// Render objects
		this.objects.forEach(obj => obj.render(context));

		// Render player
		this.player.render(context);
		context.restore();
	}
}
