import "./style.css";
import { game_variables } from "./config/settings";
import Game from "./game";


document.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("canvas") as HTMLCanvasElement;
	const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	canvas.width = game_variables.GAME_WIDTH;
	canvas.height = game_variables.GAME_HEIGHT;

	const game = new Game();

	game.run(ctx);

	
	

	// Function to draw the main menu
	/* const drawMainMenu = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(mainMenu, 0, 0);

		// Draw each menu option as a box with text
		menu_data.forEach((option) => {
			ctx.fillStyle = "rgba(0, 0, 0, 0)";
			ctx.fillRect(option.x, option.y, 200, 50);
			ctx.fillStyle = "black";
		});
	}; */

	// Load and draw the main menu background image
	/* const mainMenu = new Image();
	mainMenu.src = "assets/backgrounds/MainMenu.png";
	mainMenu.onload = () => {
		drawMainMenu();

		// Add a mouse event listener to the canvas
		canvas.addEventListener("mousemove", (event) => {
			const x = event.offsetX;
			const y = event.offsetY;

			// Redraw the main menu before drawing hover effects
			drawMainMenu();

			// Check if the mouse is over any option and draw a semi-transparent box over it
			menu_data.forEach((option) => {
				if (
					x >= option.x &&
					x <= option.x + 200 &&
					y >= option.y &&
					y <= option.y + 50
				) {
					ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
					ctx.fillRect(option.x, option.y + 10, 200, 50);
				}
			});
		});

		// Click event listener
		canvas.addEventListener("click", (event) => {
			const x = event.offsetX;
			const y = event.offsetY;

			// Check if the mouse is over any option and start the game if it is
			menu_data.forEach((option) => {
				if (
					x >= option.x &&
					x <= option.x + 200 &&
					y >= option.y &&
					y <= option.y + 50
				) {
					if (option.name == "New Game") {
						game.run(ctx);
					}
				}
			});
		});
	}; */
});
