import Player from "./Player";
import { game_variables } from "../config/settings";

export default class Controller {
	player: Player;
	up: boolean;
	down: boolean;
	left: boolean;
	right: boolean;

	constructor(player: Player) {
		this.player = player;
		this.up = false;
		this.down = false;
		this.left = false;
		this.right = false;

		this.init();
	}

	init() {
		document.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "w":
					if (this.player.jumps < game_variables.MAX_JUMPS) {
						this.player.velocity.y = -game_variables.JUMP_HEIGHT;
						this.player.jumps++;
					}
					break;

				case "a":
					this.left = true;
					break;

				case "d":
					this.right = true;
					break;

				case "j":
					this.player.attack();					
					break;
			}
		});

		document.addEventListener("keyup", (e) => {
			switch (e.key) {
				case "a":
					this.left = false;
					break;

				case "d":
					this.right = false;
					break;
			}
		});
	}
}
