import Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";
import Fadeout from "./fadeout.js";

/**
 * @readonly
 * @enum {number}
 */
const SaraState = {
    WALK: 1,
    JUMP: 2,
    DOUBLE_JUMP: 3,
    STOMP: 4,
    BOUNCE: 5,
    DYING: 6,
    WAIT: 7
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
    /**
     * @type GPU_SpriteAnimation
     */
    dying;
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
     *  @type number
     */
    jumpImpulseFrames = 10;

        /**
     *  @type number
     */
    jumpImpulseFrameCounter = 0;

    
    /**
     *  @type number
     */
    bounceImpulse = 9;

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
    
    /**
     * @type boolean
     */
    canStomp = false;

    /**
     * @type number
     */
    health = 5;

    /**
     * @type number
     */
    maxHealth = 10;

    /**
     * @type number
     */
    nbKeys = 0;

    get dead() {
        return this.health <= 0;
    }

    /**
     * @type SaraAnimations[]
     */
    static animations = [];

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
            {name: "doublejump-right3", x: 204, y: 150, w: 32, h: 48},
            {name: "stomp-left0", x: 136, y: 1, w: 32, h: 48},
            {name: "stomp-left1", x: 170, y: 1, w: 32, h: 48},
            {name: "stomp-right0", x: 136, y: 50, w: 32, h: 48},
            {name: "stomp-right1", x: 170, y: 50, w: 32, h: 48},
            {name: "dying0", x: 1, y: 1, w: 32, h: 48},
            {name: "dying1", x: 35, y: 200, w: 32, h: 48},
            {name: "dying2", x: 70, y: 200, w: 32, h: 48},
            {name: "dying3", x: 104, y: 200, w: 32, h: 48}
        ]);

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

        Sara.animations[SaraDirection.LEFT].stomp = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "stomp-left0", delay: 100},
            {name: "stomp-left1", delay: 100}
        ]);

        Sara.animations[SaraDirection.RIGHT].stomp = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "stomp-right0", delay: 100},
            {name: "stomp-right1", delay: 100}
        ]);

        Sara.animations[SaraDirection.LEFT].dying =
                Sara.animations[SaraDirection.RIGHT].dying = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "dying0", delay: 1000},
            {name: "dying1", delay: 1000},
            {name: "dying2", delay: 1000},
            {name: "dying3", delay: 1000}
        ]);
    }

    constructor(x, y) {
        this.sprite = Playnewton.GPU.CreateSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.animations[SaraDirection.LEFT].stand);
        Playnewton.GPU.SetSpriteZ(this.sprite, Z_ORDER.SARA);
        Playnewton.GPU.EnableSprite(this.sprite);

        this.body = Playnewton.PPU.CreateBody();
        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 32, 48);
        Playnewton.PPU.SetBodyPosition(this.body, x, y - 48);
        Playnewton.PPU.SetBodyCollideWorldBounds(this.body, true);
        Playnewton.PPU.SetBodyVelocityBounds(this.body, -8, 8, -11, 8);
        Playnewton.PPU.EnableBody(this.body);
    }

    UpdateBody() {
        if (this.state === SaraState.DYING) {
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

        if(this.state !== SaraState.WAIT) {
            if (pad.left) {
                this.direction = SaraDirection.LEFT;
                velocityX -= this.walkSpeed;
            } else if (pad.right) {
                this.direction = SaraDirection.RIGHT;
                velocityX += this.walkSpeed;
            } else {
                velocityX = 0;
            }
        }

        switch (this.state) {
            case SaraState.WAIT:
                break;
            case SaraState.WALK:
                if (pad.A) {
                    if (this.canJump && this.isOnGround) {
                        this.jumpImpulseFrameCounter = this.jumpImpulseFrames;
                        velocityY = -this.jumpImpulse;
                        this.canJump = false;
                        this.state = SaraState.JUMP;
                    }
                } else {
                    this.canJump = true;
                }
                
                if (pad.down) {
                    if (this.canStomp && !this.isOnGround) {
                        this.state = SaraState.STOMP;
                        this.canJump = false;
                    }
                } else if(this.body.isGoingDown) {
                    this.canStomp = true;
                }
                break;
            case SaraState.JUMP:
                if (pad.A) {
                    if (this.canJump) {
                        this.canJump = false;
                        this.jumpImpulseFrameCounter = this.jumpImpulseFrames;
                        velocityY = -this.jumpImpulse;
                        this.state = SaraState.DOUBLE_JUMP;
                    }
                } else {
                    this.canJump = true;
                }
                if (this.isOnGround) {
                    this.state = SaraState.WALK;
                } else if (pad.down) {
                    if (this.canStomp) {
                        this.state = SaraState.STOMP;
                        this.canJump = false;
                    }
                } else {
                    this.canStomp = true;
                    --this.jumpImpulseFrameCounter;
                    if(this.jumpImpulseFrameCounter > 0) {
                        velocityY = -this.jumpImpulse;
                    }
                }
                break;
            case SaraState.DOUBLE_JUMP:
                if (this.isOnGround) {
                    this.state = SaraState.WALK;
                } else if (pad.down) {
                    if (this.canStomp) {
                        this.state = SaraState.STOMP;
                        this.canJump = false;
                    }
                } else {
                    this.canStomp = true;
                    --this.jumpImpulseFrameCounter;
                    if(this.jumpImpulseFrameCounter > 0) {
                        velocityY = -this.jumpImpulse;
                    }
                }
                break;
            case SaraState.STOMP:
                if (this.isOnGround) {
                    this.state = SaraState.WALK;
                }
                break;
            case SaraState.BOUNCE:
                velocityY = -this.bounceImpulse;
                this.state = SaraState.JUMP;
                break;
        }
        Playnewton.PPU.SetBodyVelocity(this.body, velocityX, velocityY);
    }

    UpdateSprite() {
        switch (this.state) {
            case SaraState.WAIT:
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
            case SaraState.STOMP:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.animations[this.direction].stomp);
                break;
            case SaraState.DYING:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.animations[this.direction].dying, Playnewton.ENUMS.GPU_AnimationMode.ONCE);
                break;
        }
        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, this.body.position.y);
    }

    CollectOneHeart() {
        if(!this.dead) {
            this.health = Math.min(this.health + 1, this.maxHealth);
        }
    }

    CollectOneKey() {
        if(!this.dead) {
            ++this.nbKeys;
        }
    }

    HurtByPoison() {
        this.Hurt();
    }
    
    HurtByEnemy() {
        this.Hurt();
        //TODO add hurted animation / movement?
    }
    
    Hurt() {
        if(this.dead || Playnewton.GPU.IsSpriteBlinking(this.sprite)) {
            return;
        }
        Playnewton.GPU.MakeSpriteBlink(this.sprite, 1000);
        this.health = Math.max(this.health - 1, 0);
        if (this.dead) {
            this.state = SaraState.DYING;
            Playnewton.PPU.SetBodyImmovable(this.body, true);
        }
    }
    
    Wait() {
        this.state = SaraState.WAIT;
    }

    StopWaiting() {
        this.state = SaraState.WALK;
    }

    /**
     * @param {Enemy} enemy 
     */
    Stomp(enemy) {
        if (this.state === SaraState.STOMP 
                && enemy.stompable
                && Playnewton.PPU.CheckIfBodyStompOther(this.body, enemy.body)
                ) {
            this.state = SaraState.BOUNCE;
            enemy.Hurt();
        }
    }  
}
