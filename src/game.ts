import Level from "./classes/Level";

export default class Game {
	level_number: number;
	level: Level;
	started: boolean

	constructor({level_number = 1} = {}) {
		this.level_number = level_number;
		this.level = new Level({ level_number: level_number });

		this.started = false;

	}

	init() {}

	run(context: CanvasRenderingContext2D) {
		
		
		// Main loop
		const loop = () => {
			this.level.load(context);

			//console.log('running');
			
			requestAnimationFrame(loop);
		}

		loop();

	}
}
