import Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";
import Enemy from "./enemy.js";

/**
 * @readonly
 * @enum {number}
 */
export const BulletState = {
    GROW: 1,
    FLY: 2,
    EXPLODE: 3,
    EXPLODED: 4
};

export class BulletAnimations {
    /**
     * @type GPU_SpriteAnimation
     */
    grow;

    /**
     * @type GPU_SpriteAnimation
     */
    fly;

    /**
     * @type GPU_SpriteAnimation
     */
    explode;
}

export class Bullet extends Enemy{
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
     * @type number
     */
    vx;

    /**
     * @type number
     */
    vy;

    /**
     * @type number
     */
    scale = 0;

    /**
     * @type BulletAnimations
     */
    animations

    /**
     * 
     * @param {BulletAnimations} animations 
     */
    constructor(animations) {
        super();
        this.animations = animations;
        
        this.sprite = Playnewton.GPU.GetAvailableSprite();
        Playnewton.GPU.SetSpriteZ(this.sprite, Z_ORDER.BULLETS);
        Playnewton.GPU.EnableSprite(this.sprite);

        this.body = Playnewton.PPU.GetAvailableBody();
        Playnewton.PPU.SetBodyAffectedByGravity(this.body, false);
        Playnewton.PPU.EnableBody(this.body);

        this.state = BulletState.EXPLODED;
    }

    get canBeFired() {
        return this.state === BulletState.EXPLODED;
    }

    fire(x, y, vx, vy) {
        Playnewton.PPU.SetBodyPosition(this.body, x, y);
        //TODO Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, this.initialSize, this.initialSize);
        this.size = this.initialSize;
        this.vx = vx;
        this.vy = vy;
        this.state = BulletState.GROW;
        this.scale = 0;
        Playnewton.GPU.SetSpriteVisible(this.sprite, true);
        Playnewton.GPU.SetSpriteRotozoom(this.sprite, 0);
        Playnewton.PPU.SetBodyVelocityBounds(this.body, 0, 0, 0, 0);
    }

    UpdateBody() {
        switch(this.state) {
            case BulletState.GROW:
                this.scale += 0.01;
                if(this.scale >= 1) {
                    this.scale = 1;
                    this.state = BulletState.FLY;
                    Playnewton.PPU.SetBodyVelocityBounds(this.body, -10, 10, -10, 10);
                }
                break;
            case BulletState.FLY:
                Playnewton.PPU.SetBodyVelocity(this.body, this.vx, this.vy);
                break;
            case BulletState.EXPLODE:
                break;
            case BulletState.EXPLODED:
                break;
        }
        if(!Playnewton.PPU.CheckIfBodyIsInWorldBound(this.body)) {
            Playnewton.GPU.SetSpriteVisible(this.sprite, false);
            Playnewton.PPU.SetBodyVelocityBounds(this.body, 0, 0, 0, 0);
            this.state = BulletState.EXPLODED;
        }
    }

    UpdateSprite() {
        switch (this.state) {
            case BulletState.GROW:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, this.animations.grow);
                Playnewton.GPU.SetSpriteRotozoom(this.sprite, this.scale);
                break;
            case BulletState.FLY:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, this.animations.fly);
                break;
            case BulletState.EXPLODE:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, this.animations.explode);
                if(this.sprite.animationStopped) {
                    Playnewton.GPU.SetSpriteVisible(this.sprite, false);
                    this.state = BulletState.EXPLODED;
                }
                break;
            case BulletState.EXPLODED:
                break;
        }
        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, this.body.position.y);
    }

}
