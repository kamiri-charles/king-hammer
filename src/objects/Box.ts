import GameObject from "../primitives/GameObject";

export default class Box extends GameObject {
    position: { x: number; y: number; };

    constructor({position = {x: 0, y: 0}} = {}) {
        super({position, image_src: 'assets/spritesheets/box/Idle.png'});
        this.position = position;
    }

    /* draw(context: CanvasRenderingContext2D) {
        context.drawImage(this.obj_image, this.position.x, this.position.y);
    }

    render (context: CanvasRenderingContext2D) {
        this.draw(context);
    } */
}