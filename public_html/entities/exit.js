import Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";
import Collectible from "./collectible.js"

/**
 * @readonly
 * @enum {number}
 */
const ExitState = {
    INACTIVE: 1,
    ACTIVE: 2,
    PURSUE: 3
};

const PURSUE_START_DISTANCE = 64;
const PURSUE_DONE_DISTANCE = 16;
const PURSUE_SPEED = 8;

/**
 * 
 * @type ExitAnimations
 */
class ExitAnimations {
    /**
     * @type GPU_SpriteAnimation
     */
    inactive;
    /**
     * @type GPU_SpriteAnimation
     */
    active;
}

export default class Exit {
    /**
     * 
     * @type GPU_Sprite
     */
    sprite;

    /**
     *  @type SaraState
     */
    state = ExitState.INACTIVE;

    /**
     *  @type number
     */
    nbLock = 1;

    static animations = new ExitAnimations();


    static async Preload() {
        let bitmap = Collectible.bitmap;

        let spriteset = Playnewton.GPU.CreateSpriteset(bitmap, [
            { name: "exit1", x: 0, y: 64, w: 32, h: 32 },
            { name: "exit2", x: 32, y: 64, w: 32, h: 32 },
            { name: "exit3", x: 64, y: 64, w: 32, h: 32 },
            { name: "exit4", x: 96, y: 64, w: 32, h: 32 },
            { name: "exit5", x: 128, y: 64, w: 32, h: 32 },
            { name: "exit6", x: 160, y: 64, w: 32, h: 32 },
            { name: "exit7", x: 192, y: 64, w: 32, h: 32 },
            { name: "exit8", x: 224, y: 64, w: 32, h: 32 }

        ]);

        Exit.animations.inactive = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "exit1", delay: 1000 },
        ]);

        Exit.animations.active = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "exit2", delay: 200 },
            { name: "exit3", delay: 200 },
            { name: "exit4", delay: 200 },
            { name: "exit5", delay: 200 },
            { name: "exit6", delay: 200 },
            { name: "exit7", delay: 200 },
            { name: "exit8", delay: 200 },
            { name: "exit7", delay: 200 },
            { name: "exit6", delay: 200 },
            { name: "exit5", delay: 200 },
            { name: "exit4", delay: 200 },
            { name: "exit3", delay: 200 },
            { name: "exit2", delay: 200 },
        ]);
    }

    constructor() {
        this.sprite = Playnewton.GPU.CreateSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Exit.animations.inactive);
        Playnewton.GPU.SetSpritePosition(this.sprite, 200, 200);
        Playnewton.GPU.SetSpriteZ(this.sprite, Z_ORDER.DOORS);
        Playnewton.GPU.EnableSprite(this.sprite);
    }

    /**
     * @param {GPU_Sprite} sprite
     */
    Pursue(sprite) {
        if (this.state == ExitState.INACTIVE) {
            return false;
        }
        let dx = sprite.centerX - this.sprite.centerX;
        let dy = sprite.centerY - this.sprite.centerY;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance < PURSUE_DONE_DISTANCE) {
            return true;
        }
        if (this.state == ExitState.PURSUE || distance < PURSUE_START_DISTANCE) {
            this.state = ExitState.PURSUE;
            let speed = PURSUE_SPEED / distance;
            dx *= speed;
            dy *= speed;
            this.sprite.centerX += dx;
            this.sprite.centerY += dy;
        }
        return false;
    }

    OpenOneLock() {
        if (this.nbLock > 0) {
            --this.nbLock;
            if (this.nbLock === 0) {
                this.state = ExitState.ACTIVE;
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Exit.animations.active);
            }
            return true;
        } else {
            return false;
        }
    }

    Free() {
        Playnewton.GPU.DisableSprite(this.sprite);
    }
}