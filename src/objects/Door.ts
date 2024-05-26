import GameObject from "../primitives/GameObject";

export default class Door extends GameObject {
    position: { x: number; y: number; };

    constructor({position = {x: 0, y: 0}, type='door'} =  {}) {
        super({position, image_src: 'assets/spritesheets/door/Idle.png', type})
        this.position = position;
    }
}