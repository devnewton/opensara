import Playnewton from "../playnewton.js"
import Collectible from "./collectible.js"

/**
 * @readonly
 * @enum {number}
 */
const HeartState = {
    IDLE: 1,
    PURSUE: 2
};

const PURSUE_START_DISTANCE = 64;
const PURSUE_DONE_DISTANCE = 16;
const PURSUE_SPEED = 8;
        
/**
 * 
 * @type SaraAnimations
 */
class HeatAnimations {
    /**
     * @type GPU_SpriteAnimation
     */
    idle;
}

export default class Heart {
    /**
     * 
     * @type GPU_Sprite
     */
    sprite;

    /**
     * 
     * @type GPU_Sprite
     */
    pursued;

    /**
     *  @type SaraState
     */
    state = HeartState.IDLE;

    static animations = new HeatAnimations();

    static async Preload() {
        let bitmap = Collectible.bitmap;

        let spriteset = Playnewton.GPU.CreateSpriteset(bitmap, [
            {name: "heart1", x: 0, y: 0, w: 32, h: 32},
            {name: "heart2", x: 32, y: 0, w: 32, h: 32},
            {name: "heart3", x: 64, y: 0, w: 32, h: 32},
            {name: "heart4", x: 96, y: 0, w: 32, h: 32},
            {name: "heart5", x: 128, y: 0, w: 32, h: 32},
            {name: "heart6", x: 160, y: 0, w: 32, h: 32},
            {name: "heart7", x: 192, y: 0, w: 32, h: 32}

        ]);

        Heart.animations.idle = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "heart1", delay: 100},
            {name: "heart2", delay: 100},
            {name: "heart3", delay: 100},
            {name: "heart4", delay: 100},
            {name: "heart5", delay: 100},
            {name: "heart6", delay: 100},
            {name: "heart7", delay: 100}
        ]);
    }

    constructor() {
        this.sprite = Playnewton.GPU.GetAvailableSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Heart.animations.idle);
        Playnewton.GPU.SetSpritePosition(this.sprite, 200, 200);
        Playnewton.GPU.SetSpriteZ(this.sprite, 14);
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
        if (this.state == HeartState.PURSUE || distance < PURSUE_START_DISTANCE) {
            this.state = HeartState.PURSUE;
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