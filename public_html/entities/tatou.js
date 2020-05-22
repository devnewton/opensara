import Playnewton from "../playnewton.js"

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

export default class Tatou {
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
            { name: "dying-left1", x: 192, y: 32, w: 64, h: 32 }
        ]);

        /**
         * @type TatouAnimations[]
         * @static
         */
        Tatou.animations = [];
        Tatou.animations[TatouDirection.LEFT] = new TatouAnimations();
        Tatou.animations[TatouDirection.RIGHT] = new TatouAnimations();

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
        this.sprite = Playnewton.GPU.GetAvailableSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.standAnimation);
        Playnewton.GPU.SetSpriteZ(this.sprite, 15);
        Playnewton.GPU.EnableSprite(this.sprite);

        this.body = Playnewton.PPU.GetAvailableBody();
        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 32, 48);
        Playnewton.PPU.SetBodyPosition(this.body, 320, 180);
        Playnewton.PPU.SetBodyCollideWorldBounds(this.body, true);
        Playnewton.PPU.SetBodyVelocityBounds(this.body, -10, 10, -20, 10);
        Playnewton.PPU.EnableBody(this.body);
    }

    UpdateBody() {
        if (this.state === TatouState.DYING) {
            return;
        }

        let pad = Playnewton.CTRL.GetPad(0);
        this.isOnGround = false;
        let velocityX = this.body.velocity.x;
        let velocityY = this.body.velocity.y;
        if (this.body.bottom >= Playnewton.PPU.world.bounds.bottom || this.body.touches.bottom) {
            this.isOnGround = true;
            velocityX /= 2;
        }

        if (pad.left) {
            this.direction = TatouDirection.LEFT;
            velocityX -= this.walkSpeed;
        } else if (pad.right) {
            this.direction = TatouDirection.RIGHT;
            velocityX += this.walkSpeed;
        } else {
            velocityX = 0;
        }

        switch (this.state) {
            case TatouState.WALK:
                if (pad.A) {
                    if (this.canJump && this.isOnGround) {
                        velocityY = -this.jumpImpulse;
                        this.canJump = false;
                        this.state = TatouState.ROLL;
                    }
                } else {
                    this.canJump = true;
                }
                break;
            case TatouState.ROLL:
                if (pad.A) {
                    if (this.canJump) {
                        velocityY = -this.jumpImpulse;
                        this.canJump = false;
                        this.state = TatouState.DOUBLE_JUMP;
                    }
                } else {
                    this.canJump = true;
                }
                if (this.isOnGround) {
                    this.state = TatouState.WALK;
                }
                break;
            case TatouState.DOUBLE_JUMP:
                if (this.isOnGround) {
                    this.state = TatouState.WALK;
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
                if (this.body.velocity.y > 5) {
                    Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[this.direction].jumpDescend);
                } else if (this.body.velocity.y < -5) {
                    Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[this.direction].jumpAscend);
                } else {
                    Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[this.direction].jumpFloat);
                }
                break;
            case TatouState.DOUBLE_JUMP:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[this.direction].doubleJump);
                break;
            case TatouState.DYING:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[this.direction].dying, Playnewton.ENUMS.GPU_AnimationMode.ONCE);
                break;
        }
        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, this.body.position.y);
    }

    CollectOneHeart() {
        this.health = Math.min(this.health + 1, this.maxHealth);
    }

    CollectOneKey() {
        ++this.nbKeys;
    }

    HurtByPoison() {
        this.health = Math.max(this.health - 1, 0);
        if (this.dead) {
            this.state = TatouState.DYING;
            Playnewton.PPU.SetBodyImmovable(this.body, true);
            new Fadeout(1000, Array.from({ length: 15 }, (v, i) => i));
        }
    }
}