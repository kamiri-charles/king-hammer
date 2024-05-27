import './style.css';
import { game_variables } from "./config/settings";
import Game from "./game";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = game_variables.GAME_WIDTH;
  canvas.height = game_variables.GAME_HEIGHT;
  


	const game = new Game();

	


	const animate = () => {
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		game.run(ctx);

		requestAnimationFrame(animate);

	};

	animate();
});
