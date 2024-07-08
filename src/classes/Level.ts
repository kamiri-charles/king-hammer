import { game_variables } from "../config/settings";
import { levels } from "../config/levels";
import { parse2D } from "../config/utils";
import GameObject from "../primitives/GameObject";
import BoxExplosion from "../effects/BoxExplosion";
import Block from "../primitives/Block";
import Door from "../objects/Door";
import Box from "../objects/Box";
import Player from "./Player";

export default class Level {
	level_number: number;
	background: HTMLImageElement;
	collision_blocks_data2D: any;
	collision_blocks: Block[];
	objects: GameObject[];
	effects: BoxExplosion[];
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
		this.effects = [];

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
		levels[this.level_number].objects_data.forEach((obj) => {
			if (obj.type == "box") {
				this.objects.push(
					new Box({ position: { x: obj.x, y: obj.y - obj.height } })
				);
			}

			if (obj.type == "door") {
				this.objects.push(
					new Door({ position: { x: obj.x, y: obj.y - obj.height } })
				);
			}
		});



		// Player init
		this.player.position = levels[this.level_number].player_position;
		this.player.collision_blocks = this.collision_blocks;
		this.player.boxes = this.objects.filter(
			(obj): obj is Box => obj.type === "box"
		);


		
	}

	async load(context: CanvasRenderingContext2D) {
		await this.backgroundLoaded; // Wait for the background image to load

		context.save();
		context.scale(this.player.camera.scale, this.player.camera.scale);
		context.translate(
			-this.player.camera.position.x,
			-this.player.camera.position.y
		);

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
		this.objects.forEach((obj) => obj.render(context));

		// If a box has been destroyed, create an explosion effect and remove the box
		this.objects.forEach((obj) => {
			if (obj.type == 'box' && obj.marked_for_deletion) {
				this.effects.push(new BoxExplosion({ position: obj.position, collision_blocks: this.collision_blocks }));
			}

			if (obj.marked_for_deletion) {
				this.objects = this.objects.filter(o => o != obj);
			}
		});

		// Render effects
		this.effects.forEach((effect) => effect.render(context));
		this.effects = this.effects.filter((e) => !e.marked_for_deletion);

		// Render player
		this.player.render(context);
		
		context.restore();
	}
}
