import * as Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";
import Collectible from "./collectible.js"

/**
 * @readonly
 * @enum {number}
 */
const FlowerState = {
    IDLE: 1,
    PURSUE: 2
};

const PURSUE_START_DISTANCE = 64;
const PURSUE_DONE_DISTANCE = 8;
const PURSUE_SPEED = 2;

class FlowerAnimations {
    /**
     * @type GPU_SpriteAnimation
     */
    idle;
}

export default class Flower {
    /**
     * 
     * @type GPU_Sprite
     */
    sprite;

    /**
     *  @type SaraState
     */
    state = FlowerState.IDLE;

    /**
     * @type FlowerAnimations
     */
    static animations;

    static async Load() {

        let spriteset = Playnewton.GPU.CreateSpriteset(Collectible.bitmap, [
            {name: "flower1", x: 8, y: 97, w: 16, h: 30},
        ]);

        Flower.animations = new FlowerAnimations();

        Flower.animations.idle = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "flower1", delay: 100}
        ]);
    }

    static Unload() {
        Flower.animations = null;
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.sprite = Playnewton.GPU.CreateSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Flower.animations.idle);
        Playnewton.GPU.SetSpritePosition(this.sprite, x + 16, y - 32);
        Playnewton.GPU.SetSpriteZ(this.sprite, Z_ORDER.COLLECTIBLES);
        Playnewton.GPU.EnableSprite(this.sprite);
    }

    /**
     * @param {GPU_Sprite} sprite
     */
    Pursue(sprite) {
        let dx = sprite.centerX - this.sprite.centerX;
        let dy = sprite.centerY - this.sprite.centerY;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance < PURSUE_DONE_DISTANCE) {
            return true;
        }
        if (this.state == FlowerState.PURSUE || distance < PURSUE_START_DISTANCE) {
            this.state = FlowerState.PURSUE;
            let speed = PURSUE_SPEED / distance;
            dx *= speed;
            dy *= speed;
            this.sprite.centerX += dx;
            this.sprite.centerY += dy;
        }
        return false;
    }

    Free() {
        Playnewton.GPU.DisableSprite(this.sprite);
    }
}