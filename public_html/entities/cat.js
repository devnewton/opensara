import Enemy from "./enemy.js"
import Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";
import Sara from "./sara.js";

/**
 * @readonly
 * @enum {number}
 */
const CatState = {
    IDLE: 1,
    ATTACK: 2,
    HURT: 3,
    DEAD: 4
};

/**
 * 
 * @type CatAnimations
 */
class CatAnimations {
    /**
     * @type GPU_SpriteAnimation
     */
    idle;
    /**
     * @type GPU_SpriteAnimation
     */
    attack;
    /**
     * @type GPU_SpriteAnimation
     */
    hurt;
    /**
     * @type GPU_SpriteAnimation
     */
    dying;
}

export default class Cat extends Enemy {

    /**
     * 
     * @type GPU_Sprite
     */
    sprite;

    /**
     * 
     * @type PPU_Body
     */
    body;

    /**
     *  @type CatState
     */
    state;

    /**
     * @type number
     */
    health = 3;

    get dead() {
        return this.health <= 0;
    }

    static async Preload() {
        let catBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/cat.png");

        let spriteset = Playnewton.GPU.CreateSpriteset(catBitmap, [
            { name: "idle00", x: 1, y: 1, w: 30, h: 59 },
            { name: "attack00", x: 1, y: 1, w: 30, h: 59 },
            { name: "attack01", x: 31, y: 1, w: 30, h: 59 },
            { name: "attack02", x: 61, y: 1, w: 30, h: 59 },
            { name: "attack03", x: 91, y: 1, w: 30, h: 59 },
            { name: "attack04", x: 121, y: 1, w: 30, h: 59 },
            { name: "attack05", x: 151, y: 1, w: 30, h: 59 },
            { name: "attack06", x: 181, y: 1, w: 30, h: 59 },
            { name: "attack07", x: 211, y: 1, w: 30, h: 59 },
            { name: "attack08", x: 211, y: 1, w: 30, h: 59 },
            { name: "attack09", x: 1, y: 60, w: 30, h: 59 },
            { name: "attack10", x: 31, y: 60, w: 30, h: 59 },
            { name: "hurt00", x: 61, y: 60, w: 30, h: 59 },
            { name: "hurt01", x: 91, y: 60, w: 30, h: 59 },
            { name: "hurt02", x: 121, y: 60, w: 30, h: 59 },
            { name: "hurt03", x: 151, y: 60, w: 30, h: 59 },
            { name: "hurt04", x: 181, y: 60, w: 30, h: 59 },
            { name: "hurt05", x: 211, y: 60, w: 30, h: 59 },
            { name: "hurt06", x: 1, y: 119, w: 30, h: 59 },
            { name: "die00", x: 31, y: 119, w: 30, h: 59 },
            { name: "die01", x: 61, y: 119, w: 30, h: 59 },
            { name: "die02", x: 91, y: 119, w: 30, h: 59 },
            { name: "die03", x: 121, y: 119, w: 30, h: 59 }
        ]);

        /**
         * @type CatAnimations[]
         * @static
         */
        Cat.animations = new CatAnimations();

        Cat.animations.idle = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "idle00", delay: 100 }
        ]);

        Cat.animations.attack = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "attack00", delay: 100 },
            { name: "attack01", delay: 100 },
            { name: "attack02", delay: 100 },
            { name: "attack03", delay: 100 },
            { name: "attack04", delay: 100 },
            { name: "attack05", delay: 100 },
            { name: "attack06", delay: 100 },
            { name: "attack07", delay: 100 },
            { name: "attack08", delay: 100 }
        ]);

        Cat.animations.hurt = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "hurt00", delay: 100 },
            { name: "hurt01", delay: 100 },
            { name: "hurt02", delay: 100 },
            { name: "hurt03", delay: 100 },
            { name: "hurt04", delay: 100 },
            { name: "hurt05", delay: 100 },
            { name: "hurt06", delay: 100 }
        ]);

        Cat.animations.die = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "die00", delay: 500 },
            { name: "die01", delay: 500 },
            { name: "die02", delay: 500 },
            { name: "die03", delay: 500 }
        ]);
    }

    constructor(x, y) {
        super();
        this.sprite = Playnewton.GPU.GetAvailableSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Cat.animations.idle);
        Playnewton.GPU.SetSpriteZ(this.sprite, Z_ORDER.ENEMIES);
        Playnewton.GPU.EnableSprite(this.sprite);

        this.body = Playnewton.PPU.GetAvailableBody();
        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 30, 59);
        Playnewton.PPU.SetBodyPosition(this.body, x, y - 59);
        Playnewton.PPU.SetBodyImmovable(this.body, true);
        Playnewton.PPU.EnableBody(this.body);

        this.state = CatState.IDLE;
    }

    UpdateSprite() {
        switch (this.state) {
            case CatState.IDLE:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Cat.animations.idle);
                break;
            case CatState.HURT:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Cat.animations.hurt, Playnewton.ENUMS.GPU_AnimationMode.ONCE);
                if(this.sprite.animationStopped) {
                    this.state = CatState.IDLE;
                }
                break;
            case CatState.DEAD:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Cat.animations.die, Playnewton.ENUMS.GPU_AnimationMode.ONCE);
                break;
        }
        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, this.body.position.y);
    }

    get stompable() {
        return this.state === CatState.IDLE;
    }

    /**
     * 
     * @param {Sara} sara 
     */
    Pursue(sara) {
        switch (this.state) {
            case CatState.IDLE:
                //TODO
                break;
        }
    }

    Hurt() {
        if (this.state === CatState.IDLE) {
            this.state = CatState.HURT;
            this.health = Math.max(this.health - 1, 0);
            if (this.dead) {
                this.state = CatState.DEAD;
                Playnewton.PPU.SetBodyImmovable(this.body, true);
            }
        }
    }
}