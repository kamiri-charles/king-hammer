export default class BoxExplosion {
	position: { x: number; y: number };
	shrapnel: BoxShrapnel[];
	shrapnel_count: number;

	constructor({ position = { x: 0, y: 0 } } = {}) {
		this.position = position;
		this.shrapnel_count = 10;

		this.shrapnel = [];

		this.init();
	}

	init() {
		for (let i = 0; i < this.shrapnel_count; i++) {
			let idx = Math.floor(Math.random() * 4 + 1);
            
			this.shrapnel.push(
				new BoxShrapnel({
					position: { x: this.position.x, y: this.position.y },
					image_src: `assets/spritesheets/box/BoxPieces${idx}.png`,
				})
			);
		}

        
	}

	render(context: CanvasRenderingContext2D) {
		context.beginPath();
		context.fillStyle = "rgba(0, 0, 0, 0.5)";
		context.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2);
		context.fill();
		context.closePath();

		this.shrapnel.forEach((s) => s.render(context));
	}
}

class BoxShrapnel {
	image_src: string;
	shrapnel_img: HTMLImageElement;
	position: { x: number; y: number };

	constructor({
		position = { x: 0, y: 0 },
		image_src = "assets/spritesheets/box/BoxPieces1.png",
	} = {}) {
		this.position = position;
		this.image_src = image_src;
		this.shrapnel_img = new Image();
		this.shrapnel_img.src = image_src;
	}

    update() {
		// Add shrapnel movement
		

    }

	render(context: CanvasRenderingContext2D) {
        this.update();
        context.save();
		context.drawImage(this.shrapnel_img, this.position.x, this.position.y);
        context.restore();
	}
}
