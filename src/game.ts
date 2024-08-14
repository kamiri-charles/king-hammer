import Level from "./classes/Level";

export default class Game {
	level_number: number;
	level: Level;
	started: boolean;
	paused: boolean;

	constructor({level_number = 1} = {}) {
		this.level_number = level_number;
		this.level = new Level({ level_number: level_number });

		this.started = false;
		this.paused = false;

	}

	init() {}

	run(context: CanvasRenderingContext2D) {

		// Add event listener for pause
		document.addEventListener("keydown", (e) => {
			// Escape key
			if (e.key === "Escape") {
				this.paused = !this.paused;
			}
		});
		
		
		// Main loop
		const loop = () => {
			this.level.load(context);

			if (this.paused) {
				console.log("Paused");
				
			}
			
			requestAnimationFrame(loop);
		}

		loop();

	}
}
