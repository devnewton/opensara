import Enemy from "./enemy.js"
import Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";
import Sara from "./sara.js";

/**
 * @readonly
 * @enum {number}
 */
const VultureState = {
    IDLE: 1,
    FLY: 2,
    ATTACK: 3,
    DYING: 4
};

/**
 * @readonly
 * @enum {number}
 */
const VultureDirection = {
    LEFT: 1,
    RIGHT: 2
};

/**
 * 
 * @type VultureAnimations
 */
class VultureAnimations {
    /**
     * @type GPU_SpriteAnimation
     */
    idle;
    /**
     * @type GPU_SpriteAnimation
     */
    fly;
    /**
     * @type GPU_SpriteAnimation
     */
    dying;
}

export default class Vulture extends Enemy {

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
    flySpeed = 2;

    /**
     *  @type VultureState
     */
    state;

    /**
     * @type VultureDirection
     */
    direction = VultureDirection.LEFT;
    
    framesBeforeAttack = 0;

    /**
     * @type number
     */
    health = 2;

    get dead() {
        return this.health <= 0;
    }

    /**
     * @type VultureAnimations[]
     */
    static animations = [];

    static async Preload() {
        let vultureBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/vulture.png");

        let spriteset = Playnewton.GPU.CreateSpriteset(vultureBitmap, [
            {name: "idle-left0", x: 2, y: 45, w: 37, h: 54},
            {name: "idle-left1", x: 41, y: 45, w: 37, h: 54},
            {name: "idle-right0", x: 119, y: 45, w: 37, h: 54},
            {name: "idle-right1", x: 80, y: 43, w: 37, h: 54},
            {name: "fly-left0", x: 2, y: 1, w: 60, h: 42},
            {name: "fly-left1", x: 66, y: 1, w: 60, h: 42},
            {name: "fly-left2", x: 130, y: 1, w: 60, h: 42},
            {name: "fly-left3", x: 194, y: 1, w: 60, h: 42},
            {name: "fly-right0", x: 2, y: 101, w: 60, h: 42},
            {name: "fly-right1", x: 66, y: 101, w: 60, h: 42},
            {name: "fly-right2", x: 130, y: 101, w: 60, h: 42},
            {name: "fly-right3", x: 194, y: 101, w: 60, h: 42},
            {name: "attack-left0", x: 2, y: 145, w: 60, h: 42},
            {name: "attack-left1", x: 63, y: 145, w: 60, h: 42},
            {name: "attack-left2", x: 125, y: 145, w: 60, h: 42},
            {name: "attack-left3", x: 187, y: 145, w: 60, h: 42},
            {name: "attack-right0", x: 2, y: 189, w: 60, h: 42},
            {name: "attack-right1", x: 63, y: 189, w: 60, h: 42},
            {name: "attack-right2", x: 125, y: 189, w: 60, h: 42},
            {name: "attack-right3", x: 187, y: 189, w: 60, h: 42},
            {name: "dying-left0", x: 160, y: 73, w: 57, h: 27},
            {name: "dying-right0", x: 160, y: 45, w: 57, h: 27}
        ]);

        Vulture.animations[VultureDirection.LEFT] = new VultureAnimations();
        Vulture.animations[VultureDirection.RIGHT] = new VultureAnimations();

        Vulture.animations[VultureDirection.LEFT].idle = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "idle-left0", delay: 5000},
            {name: "idle-left1", delay: 200}
        ]);

        Vulture.animations[VultureDirection.RIGHT].idle = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "idle-right0", delay: 5000},
            {name: "idle-right1", delay: 200}
        ]);

        Vulture.animations[VultureDirection.LEFT].fly = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "fly-left0", delay: 100},
            {name: "fly-left1", delay: 100},
            {name: "fly-left2", delay: 100},
            {name: "fly-left3", delay: 100}
        ]);

        Vulture.animations[VultureDirection.RIGHT].fly = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "fly-right0", delay: 100},
            {name: "fly-right1", delay: 100},
            {name: "fly-right2", delay: 100},
            {name: "fly-right3", delay: 100}
        ]);
        
        Vulture.animations[VultureDirection.LEFT].attack = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "attack-left0", delay: 100},
            {name: "attack-left1", delay: 100},
            {name: "attack-left2", delay: 100},
            {name: "attack-left3", delay: 100}
        ]);

        Vulture.animations[VultureDirection.RIGHT].attack = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "attack-right0", delay: 100},
            {name: "attack-right1", delay: 100},
            {name: "attack-right2", delay: 100},
            {name: "attack-right3", delay: 100}
        ]);

        Vulture.animations[VultureDirection.LEFT].dying =
                Playnewton.GPU.CreateAnimation(spriteset, [
                    {name: "dying-left0", delay: 1000}
                ]);

        Vulture.animations[VultureDirection.RIGHT].dying =
                Playnewton.GPU.CreateAnimation(spriteset, [
                    {name: "dying-right0", delay: 1000}
                ]);
    }

    constructor(x, y) {
        super();
        this.sprite = Playnewton.GPU.GetAvailableSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Vulture.animations[this.direction].idle);
        Playnewton.GPU.SetSpriteZ(this.sprite, Z_ORDER.ENEMIES);
        Playnewton.GPU.EnableSprite(this.sprite);

        this.body = Playnewton.PPU.GetAvailableBody();
        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 37, 54);
        Playnewton.PPU.SetBodyPosition(this.body, x, y - 54);
        Playnewton.PPU.SetBodyCollideWorldBounds(this.body, false);
        Playnewton.PPU.SetBodyVelocityBounds(this.body, -10, 10, -20, 10);
        Playnewton.PPU.SetBodyAffectedByGravity(this.body, false);
        Playnewton.PPU.SetBodyCollisionMask(this.body, 0);

        Playnewton.PPU.EnableBody(this.body);

        this.state = VultureState.IDLE;
    }

    UpdateBody() {
        if (this.state === VultureState.DYING) {
            return;
        }
        switch (this.state) {
            case VultureState.IDLE:
                break;
            case VultureState.FLY:
                break;
            case VultureState.DYING:
                break;
        }
    }

    UpdateSprite() {
        switch (this.state) {
            case VultureState.IDLE:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Vulture.animations[this.direction].idle);
                break;
            case VultureState.FLY:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Vulture.animations[this.direction].fly);
                break;
            case VultureState.ATTACK:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Vulture.animations[this.direction].attack, Playnewton.ENUMS.GPU_AnimationMode.ONCE);
                if(this.sprite.animationStopped) {
                    this.framesBeforeAttack = 10;
                    this.state = VultureState.FLY;
                }
                break;
            case VultureState.DYING:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Vulture.animations[this.direction].dying);
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
            case VultureState.IDLE:
                if (this.IsSaraNear(sara)) {
                    this.state = VultureState.FLY;
                    Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 64, 42);
                }
                break;
            case VultureState.FLY:
                let dx = sara.body.centerX - this.body.centerX;
                let dy = sara.body.centerY - this.body.centerY;
                let distance = Math.sqrt(dx ** 2 + dy ** 2);
                this.direction = dx < 0 ? VultureDirection.LEFT : VultureDirection.RIGHT;
                if(distance < 128) {
                    if(Math.abs(dy) > 8) {
                        dx = 0;
                    } else if(Math.abs(dx) < 32) {
                        --this.framesBeforeAttack;
                        if(this.framesBeforeAttack <= 0) {
                            this.state = VultureState.ATTACK;
                        }
                        Playnewton.PPU.SetBodyVelocity(this.body, 0, 0);
                        return;
                    }
                }
                let s = this.flySpeed / distance;
                dx *= s;
                dy *= s;
                Playnewton.PPU.SetBodyVelocity(this.body, dx, dy);
                break;
            case VultureState.DYING:
                if(!Playnewton.PPU.CheckIfBodyIsInWorldBound(this.body)) {
                    Playnewton.PPU.DisableBody(this.body);
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
        let dy = Math.abs(this.body.centerY - sara.body.centerY);
        return dx < (this.body.width * 4) && dy > 0 && dy < (this.body.height * 4);
    }

    Hurt() {
        this.health = Math.max(this.health - 1, 0);
        if (this.dead) {
            this.state = VultureState.DYING;
            Playnewton.PPU.SetBodyAffectedByGravity(this.body, true);
        } else {
            Playnewton.GPU.MakeSpriteBlink(this.sprite, 1000);
        }
    }

    get stompable() {
        return this.state !== VultureState.DYING && !Playnewton.GPU.IsSpriteBlinking(this.sprite);
    }
}