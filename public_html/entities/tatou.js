import Enemy from "./enemy.js"
import * as Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";
import Sara from "./sara.js";

/**
 * @readonly
 * @enum {number}
 */
const TatouState = {
    WALK: 1,
    ROLL: 2,
    SURPRISED: 3,
    DYING: 4
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
    walkSpeed = 1;

    /**
     *  @type number
     */
    rollSpeed = 4;

    /**
     *  @type TatouState
     */
    state;

    /**
     * @type TatouDirection
     */
    direction = TatouDirection.LEFT;

    /**
     * @type number
     */
    stateStartTime;

    /**
     * 
     * @returns {number}
     */
    get stateElapsedTime() {
        return Playnewton.CLOCK.now - this.stateStartTime;
    }

    /**
     * @type number
     */
    health = 2;

    get dead() {
        return this.health <= 0;
    }

    /**
     * @type TatouAnimations[]
     */
    static animations = [];

    static async Preload() {
        let tatouBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/tatou.png");

        let spriteset = Playnewton.GPU.CreateSpriteset(tatouBitmap, [
            {name: "walk-left0", x: 0, y: 0, w: 64, h: 32},
            {name: "walk-left1", x: 64, y: 0, w: 64, h: 32},
            {name: "walk-left2", x: 128, y: 0, w: 64, h: 32},
            {name: "surprised-left0", x: 0, y: 32, w: 64, h: 32},
            {name: "roll-left0", x: 64, y: 32, w: 32, h: 32},
            {name: "roll-left1", x: 96, y: 32, w: 32, h: 32},
            {name: "roll-left2", x: 128, y: 32, w: 32, h: 32},
            {name: "roll-left3", x: 160, y: 32, w: 32, h: 32},
            {name: "dying-left0", x: 192, y: 0, w: 64, h: 32},
            {name: "dying-left1", x: 192, y: 32, w: 64, h: 32},

            {name: "walk-right0", x: 0, y: 64, w: 64, h: 32},
            {name: "walk-right1", x: 64, y: 64, w: 64, h: 32},
            {name: "walk-right2", x: 128, y: 64, w: 64, h: 32},
            {name: "surprised-right0", x: 0, y: 96, w: 64, h: 32},
            {name: "roll-right0", x: 64, y: 96, w: 32, h: 32},
            {name: "roll-right1", x: 96, y: 96, w: 32, h: 32},
            {name: "roll-right2", x: 128, y: 96, w: 32, h: 32},
            {name: "roll-right3", x: 160, y: 96, w: 32, h: 32},
            {name: "dying-right0", x: 192, y: 64, w: 64, h: 32},
            {name: "dying-right1", x: 192, y: 96, w: 64, h: 32}

        ]);

        Tatou.animations[TatouDirection.LEFT] = new TatouAnimations();
        Tatou.animations[TatouDirection.RIGHT] = new TatouAnimations();

        Tatou.animations[TatouDirection.LEFT].stand = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "walk-left0", delay: 100}
        ]);

        Tatou.animations[TatouDirection.RIGHT].stand = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "walk-right0", delay: 100}
        ]);

        Tatou.animations[TatouDirection.LEFT].walk = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "walk-left0", delay: 100},
            {name: "walk-left1", delay: 100},
            {name: "walk-left2", delay: 100}
        ]);

        Tatou.animations[TatouDirection.RIGHT].walk = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "walk-right0", delay: 100},
            {name: "walk-right1", delay: 100},
            {name: "walk-right2", delay: 100}
        ]);

        Tatou.animations[TatouDirection.LEFT].surprised = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "surprised-left0", delay: 1000},
        ]);

        Tatou.animations[TatouDirection.RIGHT].surprised = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "surprised-right0", delay: 1000},
        ]);

        Tatou.animations[TatouDirection.LEFT].roll = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "roll-left0", delay: 100},
            {name: "roll-left1", delay: 100},
            {name: "roll-left2", delay: 100},
            {name: "roll-left3", delay: 100}
        ]);

        Tatou.animations[TatouDirection.RIGHT].roll = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "roll-right0", delay: 100},
            {name: "roll-right1", delay: 100},
            {name: "roll-right2", delay: 100},
            {name: "roll-right3", delay: 100}
        ]);

        Tatou.animations[TatouDirection.LEFT].dying =
                Playnewton.GPU.CreateAnimation(spriteset, [
                    {name: "dying-left0", delay: 1000},
                    {name: "dying-left1", delay: 1000},
                ]);

        Tatou.animations[TatouDirection.RIGHT].dying =
                Playnewton.GPU.CreateAnimation(spriteset, [
                    {name: "dying-right0", delay: 1000},
                    {name: "dying-right1", delay: 1000},
                ]);
    }

    constructor(x, y) {
        super();
        this.sprite = Playnewton.GPU.CreateSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[TatouDirection.LEFT].stand);
        Playnewton.GPU.SetSpriteZ(this.sprite, Z_ORDER.ENEMIES);
        Playnewton.GPU.EnableSprite(this.sprite);

        this.body = Playnewton.PPU.CreateBody();
        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 64, 32);
        Playnewton.PPU.SetBodyPosition(this.body, x, y - 32);
        Playnewton.PPU.SetBodyCollideWorldBounds(this.body, true);
        Playnewton.PPU.SetBodyVelocityBounds(this.body, -10, 10, -20, 10);
        Playnewton.PPU.EnableBody(this.body);

        this.ChangeState(TatouState.WALK);
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
        const WalkBackAndForth = () => {
            if ((this.body.right >= Playnewton.PPU.world.bounds.right || this.body.touches.right) && this.direction === TatouDirection.RIGHT) {
                this.direction = TatouDirection.LEFT;
            } else if ((this.body.left <= Playnewton.PPU.world.bounds.left || this.body.touches.left) && this.direction === TatouDirection.LEFT) {
                this.direction = TatouDirection.RIGHT;
            }
            let speed = this.state === TatouState.ROLL ? this.rollSpeed : this.walkSpeed;
            if (this.direction === TatouDirection.LEFT) {
                velocityX -= speed;
            } else {
                velocityX += speed;
            }
        }

        switch (this.state) {
            case TatouState.WALK:
                WalkBackAndForth();
                break;
            case TatouState.SURPRISED:
                break;
            case TatouState.ROLL:
                WalkBackAndForth();
                if (this.stateElapsedTime >= 5000) {
                    this.ChangeState(TatouState.WALK);
                    Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 64, 32);
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
            case TatouState.SURPRISED:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[this.direction].surprised);
                break;
            case TatouState.ROLL:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[this.direction].roll);
                break;
            case TatouState.DYING:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Tatou.animations[this.direction].dying, Playnewton.GPU_AnimationMode.ONCE);
                break;
        }
        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, this.body.position.y);
    }

    /**
     * 
     * @param {Sara} sara 
     */
    Pursue(sara) {
        switch (this.state) {
            case TatouState.WALK:
                if (this.IsSaraNear(sara)) {
                    this.ChangeState(TatouState.SURPRISED);
                    Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 64, 32);
                }
                break;
            case TatouState.SURPRISED:
                if (this.stateElapsedTime > 500) {
                    if (this.IsSaraNear(sara)) {
                        this.ChangeState(TatouState.ROLL);
                        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 32, 32);
                    } else {
                        this.ChangeState(TatouState.WALK);
                        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 64, 32);
                    }
                }
                break;
            case TatouState.ROLL:
                if (Playnewton.PPU.CheckIfBodyRunIntoOther(this.body, sara.body)) {
                    sara.HurtByEnemy();
                }
                break;
        }
    }

    /**
     *
     * @param {Sara} sara 
     */
    IsSaraNear(sara) {
        let dx = Math.abs(this.body.centerX - sara.body.centerX);
        let dy = this.body.centerY - sara.body.centerY;
        return dx < (this.body.width * 2) && dy > 0 && dy < this.body.height;
    }

    /**
     * 
     * @param {TatouState} s 
     */
    ChangeState(s) {
        this.state = s;
        this.stateStartTime = Playnewton.CLOCK.now;
    }

    Hurt() {
        this.health = Math.max(this.health - 1, 0);
        if (this.dead) {
            this.ChangeState(TatouState.DYING);
            Playnewton.PPU.DisableBody(this.body);
        } else {
            Playnewton.GPU.MakeSpriteBlink(this.sprite, 1000);
        }
    }
    
    get stompable() {
        return this.state === TatouState.WALK && !Playnewton.GPU.IsSpriteBlinking(this.sprite);
    }
}