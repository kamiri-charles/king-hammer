import GameObject from "../primitives/GameObject";

export default class Box extends GameObject {
    position: { x: number; y: number; };
    hp: number;

    constructor({position = {x: 0, y: 0}, type = 'box'} = {}) {
        super({position, image_src: 'assets/spritesheets/box/Idle.png', type});
        this.position = position;
        this.hp = 10;
    }
}