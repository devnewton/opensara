import Playnewton from "../playnewton.js"

        /**
         * @readonly
         * @enum {number}
         */
        const SaraState = {
            WALK: 1,
            JUMP: 2,
            DOUBLE_JUMP: 3
        };

/**
 * @readonly
 * @enum {number}
 */
const SaraDirection = {
    LEFT: 1,
    RIGHT: 2
};

/**
 * 
 * @type SaraAnimations
 */
class SaraAnimations {
    /**
     * @type GPU_SpriteAnimation
     */
    stand;
    /**
     * @type GPU_SpriteAnimation
     */
    walk;
    /**
     * @type GPU_SpriteAnimation
     */
    jumpAscend;
    /**
     * @type GPU_SpriteAnimation
     */
    jumpFloat;
    /**
     * @type GPU_SpriteAnimation
     */
    jumpDescend;
    /**
     * @type GPU_SpriteAnimation
     */
    doubleJump;
}

export default class Sara {
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
    walkSpeed = 2

    /**
     *  @type number
     */
    jumpImpulse = 18;

    /**
     * @type boolean
     */
    isOnGround = false;

    /**
     *  @type SaraState
     */
    state = SaraState.WALK;

    /**
     * @type SaraDirection
     */
    direction = SaraDirection.LEFT;

    /**
     * @type boolean
     */
    canJump = true;

    static async Preload() {
        let saraBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/sara.png");

        let spriteset = Playnewton.GPU.CreateSpriteset(saraBitmap, [
            {name: "stand-left", x: 1, y: 1, w: 32, h: 48},
            {name: "stand-right", x: 1, y: 50, w: 32, h: 48},
            {name: "walk-left0", x: 35, y: 1, w: 32, h: 48},
            {name: "walk-left1", x: 70, y: 1, w: 32, h: 48},
            {name: "walk-left2", x: 104, y: 1, w: 32, h: 48},
            {name: "walk-right0", x: 35, y: 50, w: 32, h: 48},
            {name: "walk-right1", x: 70, y: 50, w: 32, h: 48},
            {name: "walk-right2", x: 104, y: 50, w: 32, h: 48},
            {name: "jump-descend-left", x: 1, y: 100, w: 32, h: 48},
            {name: "jump-float-left", x: 35, y: 100, w: 32, h: 48},
            {name: "jump-ascend-left", x: 70, y: 100, w: 32, h: 48},
            {name: "jump-ascend-right", x: 1, y: 150, w: 32, h: 48},
            {name: "jump-float-right", x: 35, y: 150, w: 32, h: 48},
            {name: "jump-descend-right", x: 70, y: 150, w: 32, h: 48},
            {name: "doublejump-left0", x: 102, y: 100, w: 32, h: 48},
            {name: "doublejump-left1", x: 136, y: 100, w: 32, h: 48},
            {name: "doublejump-left2", x: 170, y: 100, w: 32, h: 48},
            {name: "doublejump-left3", x: 204, y: 100, w: 32, h: 48},
            {name: "doublejump-right0", x: 102, y: 150, w: 32, h: 48},
            {name: "doublejump-right1", x: 136, y: 150, w: 32, h: 48},
            {name: "doublejump-right2", x: 170, y: 150, w: 32, h: 48},
            {name: "doublejump-right3", x: 204, y: 150, w: 32, h: 48}
        ]);

        /**
         * @type SaraAnimations[]
         * @static
         */
        Sara.animations = [];
        Sara.animations[SaraDirection.LEFT] = new SaraAnimations();
        Sara.animations[SaraDirection.RIGHT] = new SaraAnimations();

        Sara.animations[SaraDirection.LEFT].stand = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "stand-left", delay: 1000}
        ]);

        Sara.animations[SaraDirection.RIGHT].stand = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "stand-right", delay: 1000}
        ]);

        Sara.animations[SaraDirection.LEFT].walk = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "walk-left0", delay: 100},
            {name: "walk-left1", delay: 100},
            {name: "walk-left2", delay: 100}
        ]);

        Sara.animations[SaraDirection.RIGHT].walk = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "walk-right0", delay: 100},
            {name: "walk-right1", delay: 100},
            {name: "walk-right2", delay: 100}
        ]);

        Sara.animations[SaraDirection.LEFT].jumpAscend = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "jump-ascend-left", delay: 1000}
        ]);

        Sara.animations[SaraDirection.LEFT].jumpFloat = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "jump-float-left", delay: 1000}
        ]);

        Sara.animations[SaraDirection.LEFT].jumpDescend = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "jump-descend-left", delay: 1000}
        ]);

        Sara.animations[SaraDirection.RIGHT].jumpAscend = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "jump-ascend-right", delay: 1000}
        ]);

        Sara.animations[SaraDirection.RIGHT].jumpFloat = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "jump-float-right", delay: 1000}
        ]);

        Sara.animations[SaraDirection.RIGHT].jumpDescend = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "jump-descend-right", delay: 1000}
        ]);

        Sara.animations[SaraDirection.LEFT].doubleJump = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "doublejump-left0", delay: 100},
            {name: "doublejump-left1", delay: 100},
            {name: "doublejump-left2", delay: 100}
        ]);

        Sara.animations[SaraDirection.RIGHT].doubleJump = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "doublejump-right0", delay: 100},
            {name: "doublejump-right1", delay: 100},
            {name: "doublejump-right2", delay: 100}
        ]);
    }

    constructor() {
        this.sprite = Playnewton.GPU.GetAvailableSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.standAnimation);
        Playnewton.GPU.SetSpriteZ(this.sprite, 15);
        Playnewton.GPU.EnableSprite(this.sprite);

        this.body = Playnewton.PPU.GetAvailableBody();
        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 32, 48);
        Playnewton.PPU.SetBodyPosition(this.body, 320, 180);
        Playnewton.PPU.SetBodyCollideWorldBounds(this.body, true);
        Playnewton.PPU.SetBodyMaxVelocity(this.body, 10, 20);
        Playnewton.PPU.EnableBody(this.body);
    }

    UpdateBody() {
        let pad = Playnewton.CTRL.GetPad(0);
        this.isOnGround = false;
        let velocityX = this.body.velocity.x;
        let velocityY = this.body.velocity.y;
        if (this.body.bottom >= Playnewton.PPU.world.bounds.bottom || this.body.touches.bottom) {
            this.isOnGround = true;
            velocityX = 0;
        }

        if (pad.left) {
            this.direction = SaraDirection.LEFT;
            velocityX -= this.walkSpeed;
        } else if (pad.right) {
            this.direction = SaraDirection.RIGHT;
            velocityX += this.walkSpeed;
        } else {
            velocityX = 0;
        }

        switch (this.state) {
            case SaraState.WALK:
                if (pad.A) {
                    if (this.canJump && this.isOnGround) {
                        velocityY = -this.jumpImpulse;
                        this.canJump = false;
                        this.state = SaraState.JUMP;
                    }
                } else {
                    this.canJump = true;
                }
                break;
            case SaraState.JUMP:
                if (pad.A) {
                    if (this.canJump) {
                        velocityY = -this.jumpImpulse;
                        this.canJump = false;
                        this.state = SaraState.DOUBLE_JUMP;
                    }
                } else {
                    this.canJump = true;
                }
                if (this.isOnGround) {
                    this.state = SaraState.WALK;
                }
                break;
            case SaraState.DOUBLE_JUMP:
                if (this.isOnGround) {
                    this.state = SaraState.WALK;
                }
                break;
        }
        Playnewton.PPU.SetBodyVelocity(this.body, velocityX, velocityY);
    }

    UpdateSprite() {
        switch (this.state) {
            case SaraState.WALK:
                if (Math.abs(this.body.velocity.x) < Number.EPSILON) {
                    Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.animations[this.direction].stand);
                } else {
                    Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.animations[this.direction].walk);
                }
                break;
            case SaraState.JUMP:
                if (this.body.velocity.y > 5) {
                    Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.animations[this.direction].jumpDescend);
                } else if (this.body.velocity.y < -5) {
                    Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.animations[this.direction].jumpAscend);
                } else {
                    Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.animations[this.direction].jumpFloat);
                }
                break;
            case SaraState.DOUBLE_JUMP:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.animations[this.direction].doubleJump);
                break;
        }

        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, this.body.position.y);
    }
    
    CollectOneHeart() {
        //TODO
    }
}