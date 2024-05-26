import Player from "./Player";
import { game_variables } from "../config/settings";

export default class Camera {
    player: Player;
    position: { x: number; y: number; };
    width: number;
    height: number;
    scale: number;
    view_horizon: number;

    constructor(player: Player) {
        this.player = player;
        this.position = player.position;
        this.scale = 2;
        this.width = game_variables.GAME_WIDTH / this.scale;
        this.height = game_variables.GAME_HEIGHT / this.scale;
        this.view_horizon = 200;
    }

    update() {
        if (this.player.position.x + this.player.width + this.view_horizon > this.position.x + this.width) {
            let offset = (this.player.position.x + this.player.width + this.view_horizon) - (this.position.x + this.width);
            this.position.x += offset;
        }

        if (this.player.position.x < this.position.x + this.view_horizon) {
            let offset = this.player.position.x - (this.position.x + this.view_horizon);
            this.position.x += offset; 
        }

        if (this.player.position.y + this.player.height > this.position.y + this.height) {
            let offset = (this.player.position.y + this.player.height) - (this.position.y + this.height);
            this.position.y += offset + 500;
        }

        if (this.player.position.y < this.position.y) {
            let offset = this.player.position.y - this.position.y;
            this.position.y += offset;
        }

        
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = 'rgba(0, 0, 255, 0.5)';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
