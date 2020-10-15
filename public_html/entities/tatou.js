import Enemy from "./enemy.js"
import Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";

/**
 * @readonly
 * @enum {number}
 */
const TatouState = {
    WALK: 1,
    ROLL: 2,
    DYING: 3
};

/**
 * @readonly
 * @enum {number}
 */
const TatouDirection = {
    LEFT: 1,
    RIGHT: 2
};

/**
 * 
 * @type TatouAnimations
 */
class TatouAnimations {
    /**
     * @type GPU_SpriteAnimation
     */
    walk;
    /**
     * @type GPU_SpriteAnimation
     */
    surprised;
    /**
     * @type GPU_SpriteAnimation
     */
    roll;
    /**
     * @type GPU_SpriteAnimation
     */
    dying;
}

export default class Tatou extends Enemy {
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
     *  @type number
     */
    walkSpeed = 1

    /**
     *  @type TatouState
     */
    state = TatouState.WALK;

    /**
     * @type TatouDirection
     */
    direction = TatouDirection.LEFT;

    /**
     * @type number
     */
    health = 5;

    get dead() {
        return this.health <= 0;
    }

    static async Preload() {
        let tatouBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/tatou.png");

        let spriteset = Playnewton.GPU.CreateSpriteset(tatouBitmap, [
            { name: "walk-left0", x: 0, y: 0, w: 64, h: 32 },
            { name: "walk-left1", x: 64, y: 0, w: 64, h: 32 },
            { name: "walk-left2", x: 128, y: 0, w: 64, h: 32 },
            { name: "surprised-left0", x: 0, y: 32, w: 64, h: 32 },
            { name: "roll-left0", x: 64, y: 0, w: 32, h: 32 },
            { name: "roll-left1", x: 96, y: 32, w: 32, h: 32 },
            { name: "roll-left2", x: 128, y: 32, w: 64, h: 32 },
            { name: "roll-left3", x: 160, y: 32, w: 64, h: 32 },
            { name: "dying-left0", x: 192, y: 0, w: 64, h: 32 },
            { name: "dying-left1", x: 192, y: 32, w: 64, h: 32 },

            { name: "walk-right0", x: 0, y: 64, w: 64, h: 32 },
            { name: "walk-right1", x: 64, y: 64, w: 64, h: 32 },
            { name: "walk-right2", x: 128, y: 64, w: 64, h: 32 },
            { name: "surprised-right0", x: 0, y: 96, w: 64, h: 32 },
            { name: "roll-right0", x: 64, y: 64, w: 32, h: 32 },
            { name: "roll-right1", x: 96, y: 96, w: 32, h: 32 },
            { name: "roll-right2", x: 128, y: 96, w: 64, h: 32 },
            { name: "roll-right3", x: 160, y: 96, w: 64, h: 32 },
            { name: "dying-right0", x: 192, y: 64, w: 64, h: 32 },
            { name: "dying-right1", x: 192, y: 96, w: 64, h: 32 }

        ]);

        /**
         * @type TatouAnimations[]
         * @static
         */
        Tatou.animations = [];
        Tatou.animations[TatouDirection.LEFT] = new TatouAnimations();
        Tatou.animations[TatouDirection.RIGHT] = new TatouAnimations();

        Tatou.animations[TatouDirection.LEFT].stand = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "walk-left0", delay: 100 }
        ]);

        Tatou.animations[TatouDirection.RIGHT].stand = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "walk-right0", delay: 100 }
        ]);

        Tatou.animations[TatouDirection.LEFT].walk = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "walk-left0", delay: 100 },
            { name: "walk-left1", delay: 100 },
            { name: "walk-left2", delay: 100 }
        ]);

        Tatou.animations[TatouDirection.RIGHT].walk = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "walk-right0", delay: 100 },
            { name: "walk-right1", delay: 100 },
            { name: "walk-right2", delay: 100 }
        ]);

        Tatou.animations[TatouDirection.LEFT].surprised = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "surprised-left0", delay: 1000 },
        ]);

        Tatou.animations[TatouDirection.RIGHT].surprised = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "surprised-right0", delay: 1000 },
        ]);

        Tatou.animations[TatouDirection.LEFT].roll = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "roll-left0", delay: 100 },
            { name: "roll-left1", delay: 100 },
            { name: "roll-left2", delay: 100 },
            { name: "roll-left3", delay: 100 }
        ]);

        Tatou.animations[TatouDirection.RIGHT].roll = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "roll-right0", delay: 100 },
            { name: "roll-right1", delay: 100 },
            { name: "roll-right2", delay: 100 },
            { name: "roll-right3", delay: 100 }
        ]);

        Tatou.animations[TatouDirection.LEFT].dying =
            Playnewton.GPU.CreateAnimation(spriteset, [
                { name: "dying-left0", delay: 1000 },
                { name: "dying-left1", delay: 1000 },
                { name: "dying-left2", delay: 1000 },
                { name: "dying-left3", delay: 1000 }
            ]);

        Tatou.animations[TatouDirection.RIGHT].dying =
            Playnewton.GPU.CreateAnimation(spriteset, [
                { name: "dying-right0", delay: 1000 },
                { name: "dying-right1", delay: 1000 },
                { name: "dying-right2", delay: 1000 },
                { name: "dying-right3", delay: 1000 }
            ]);
    }

    constructor() {
        super();
        this.sprite = Playnewton.GPU.GetAvailableSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[TatouDirection.LEFT].stand);
        Playnewton.GPU.SetSpriteZ(this.sprite, Z_ORDER.ENEMIES);
        Playnewton.GPU.EnableSprite(this.sprite);

        this.body = Playnewton.PPU.GetAvailableBody();
        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 64, 32);
        Playnewton.PPU.SetBodyPosition(this.body, 160, 180);
        Playnewton.PPU.SetBodyCollideWorldBounds(this.body, true);
        Playnewton.PPU.SetBodyVelocityBounds(this.body, -10, 10, -20, 10);
        Playnewton.PPU.EnableBody(this.body);
    }

    UpdateBody() {
        if (this.state === TatouState.DYING) {
            return;
        }
        this.isOnGround = false;
        let velocityX = this.body.velocity.x;
        let velocityY = this.body.velocity.y;
        if (this.body.bottom >= Playnewton.PPU.world.bounds.bottom || this.body.touches.bottom) {
            this.isOnGround = true;
            velocityX /= 2;
        }
        switch(this.state) {
            case TatouState.WALK:
                if((this.body.right >= Playnewton.PPU.world.bounds.right || this.body.touches.right) && this.direction === TatouDirection.RIGHT) {
                    this.direction = TatouDirection.LEFT;
                } else if((this.body.left <= Playnewton.PPU.world.bounds.left || this.body.touches.left)  && this.direction === TatouDirection.LEFT) {
                    this.direction = TatouDirection.RIGHT;
                }
                if(this.direction === TatouDirection.LEFT) {
                    velocityX -= this.walkSpeed;
                } else {
                    velocityX += this.walkSpeed;
                }
                break;
        }
        Playnewton.PPU.SetBodyVelocity(this.body, velocityX, velocityY);
    }

    UpdateSprite() {
        switch (this.state) {
            case TatouState.WALK:
                if (Math.abs(this.body.velocity.x) < Number.EPSILON) {
                    Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[this.direction].stand);
                } else {
                    Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[this.direction].walk);
                }
                break;
            case TatouState.ROLL:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[this.direction].roll);
                break;
            case TatouState.DYING:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[this.direction].dying, Playnewton.ENUMS.GPU_AnimationMode.ONCE);
                break;
        }
        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, this.body.position.y);
    }

    Hurt() {
        this.health = Math.max(this.health - 1, 0);
        if (this.dead) {
            this.state = TatouState.DYING;
            Playnewton.PPU.SetBodyImmovable(this.body, true);
        }
    }
}