import Level from "./classes/Level";

export default class Game {
	level_number: number;
	level: Level;

	constructor({level_number = 1} = {}) {
		this.level_number = level_number;
		this.level = new Level({ level_number: level_number });
	}

	init() {}

	run(context: CanvasRenderingContext2D) {
		this.level.load(context);
	}
}
