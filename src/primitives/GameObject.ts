export default class GameObject {
    position: {x: number, y: number}
    image_src: string;
    obj_image: HTMLImageElement;

    constructor({position = {x: 0, y: 0}, image_src = ''} = {}) {
        this.position = position;
        
        this.image_src = image_src;
		this.obj_image = new Image();
		this.obj_image.src = this.image_src;
    }

    draw(context: CanvasRenderingContext2D) {
        context.drawImage(this.obj_image, this.position.x, this.position.y);
    }

    render(context: CanvasRenderingContext2D) {
        this.draw(context);
    }
}