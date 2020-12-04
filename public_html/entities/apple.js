import * as Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";
import Collectible from "./collectible.js"

/**
 * @readonly
 * @enum {number}
 */
const AppleState = {
    IDLE: 1,
    PURSUE: 2
};

const PURSUE_START_DISTANCE = 64;
const PURSUE_DONE_DISTANCE = 8;
const PURSUE_SPEED = 2;
        
class AppleAnimations {
    /**
     * @type GPU_SpriteAnimation
     */
    idle;
}

export default class Apple {
    /**
     * 
     * @type GPU_Sprite
     */
    sprite;

    /**
     *  @type SaraState
     */
    state = AppleState.IDLE;

    static animations = new AppleAnimations();

    static async Preload() {
        let bitmap = Collectible.bitmap;

        let spriteset = Playnewton.GPU.CreateSpriteset(bitmap, [
            {name: "apple1", x: 44, y: 106, w: 8, h: 10},
            {name: "apple2", x: 76, y: 106, w: 8, h: 10},
            {name: "apple3", x: 108, y: 106, w: 8, h: 10},
            {name: "apple4", x: 140, y: 106, w: 8, h: 10}
        ]);

        Apple.animations.idle = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "apple1", delay: 100},
            {name: "apple2", delay: 100},
            {name: "apple3", delay: 100},
            {name: "apple4", delay: 100},
            {name: "apple3", delay: 100},
            {name: "apple2", delay: 100}
        ]);
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.sprite = Playnewton.GPU.CreateSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Apple.animations.idle);
        Playnewton.GPU.SetSpritePosition(this.sprite, x + 16, y - 32 + this.sprite.height);
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
        if (this.state == AppleState.PURSUE || distance < PURSUE_START_DISTANCE) {
            this.state = AppleState.PURSUE;
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