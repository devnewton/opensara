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
    SURPRISED: 3,
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

    /**
     * 
     * @returns {number}
     */
    get stateElapsedTime() {
        return performance.now() - this.stateStartTime;
    }

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
            {name: "dying-left0", x: 2, y: 145, w: 57, h: 27},
            {name: "dying-right0", x: 62, y: 145, w: 57, h: 27}
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
                if(distance > 64) {
                    let s = this.flySpeed / distance;
                    dx *= s;
                    dy *= s;
                    this.direction = dx < 0 ? VultureDirection.LEFT : VultureDirection.RIGHT;
                    Playnewton.PPU.SetBodyVelocity(this.body, dx, dy);
                } else {
                    Playnewton.PPU.SetBodyVelocity(this.body, 0, 0);
                }
                break;
            case VultureState.DYING:
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
            Playnewton.PPU.DisableBody(this.body);
        } else {
            Playnewton.GPU.MakeSpriteBlink(this.sprite, 1000);
        }
    }

    get stompable() {
        return this.state !== VultureState.DYING && !Playnewton.GPU.IsSpriteBlinking(this.sprite);
    }
}