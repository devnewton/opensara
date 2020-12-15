import * as Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";
import Collectible from "./collectible.js"

/**
 * @readonly
 * @enum {number}
 */
const KeyState = {
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
class KeyAnimations {
    /**
     * @type GPU_SpriteAnimation
     */
    idle;
}

export default class Key {
    /**
     * 
     * @type GPU_Sprite
     */
    sprite;

    /**
     *  @type SaraState
     */
    state = KeyState.IDLE;

    /**
     * @type KeyAnimations
     */
    static animations;

    static async Load() {
        let bitmap = Collectible.bitmap;

        let spriteset = Playnewton.GPU.CreateSpriteset(bitmap, [
            {name: "key1", x: 0, y: 32, w: 32, h: 32},
            {name: "key2", x: 32, y: 32, w: 32, h: 32},
            {name: "key3", x: 64, y: 32, w: 32, h: 32},
            {name: "key4", x: 96, y: 32, w: 32, h: 32},
            {name: "key5", x: 128, y: 32, w: 32, h: 32},
            {name: "key6", x: 160, y: 32, w: 32, h: 32},
            {name: "key7", x: 192, y: 32, w: 32, h: 32},
            {name: "key8", x: 224, y: 32, w: 32, h: 32}

        ]);

        Key.animations = new KeyAnimations();

        Key.animations.idle = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "key1", delay: 5000},
            {name: "key2", delay: 100},
            {name: "key3", delay: 100},
            {name: "key4", delay: 100},
            {name: "key5", delay: 100},
            {name: "key6", delay: 100},
            {name: "key7", delay: 100},
            {name: "key8", delay: 100}
        ]);
    }

    static Unload() {
        Key.animations = null;
    }

    constructor() {
        this.sprite = Playnewton.GPU.CreateSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Key.animations.idle);
        Playnewton.GPU.SetSpritePosition(this.sprite, 200, 200);
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
        if (this.state == KeyState.PURSUE || distance < PURSUE_START_DISTANCE) {
            this.state = KeyState.PURSUE;
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