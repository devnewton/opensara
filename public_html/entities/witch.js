import Enemy from "./enemy.js"
import * as Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";
import Sara from "./sara.js";

/**
 * @readonly
 * @enum {number}
 */
const WitchState = {
    IDLE: 1,
    FLY: 2,
    FLEE: 3
};

/**
 * @readonly
 * @enum {number}
 */
const WitchDirection = {
    LEFT: 1,
    RIGHT: 2
};

/**
 * 
 * @type WitchAnimations
 */
class WitchAnimations {
    fly;
}

export default class Witch extends Enemy {

    /**
     * 
     * @type GPU_Sprite
     */
    sprite;

    /**
     *  @type number
     */
    flySpeed = 2;

    /**
     *  @type WitchState
     */
    state;

    /**
     * @type WitchDirection
     */
    direction = WitchDirection.LEFT;

    /**
     * @type WitchAnimations[]
     */
    static animations = [];

    hoverDy = 0;

    static async Preload() {
        let witchBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/witch.png");

        let spriteset = Playnewton.GPU.CreateSpriteset(witchBitmap, [
            {name: "fly-left0", x: 2, y: 2, w: 55 , h: 46},
            {name: "fly-right0", x: 2, y: 50, w: 55, h: 46}
        ]);

        Witch.animations[WitchDirection.LEFT] = new WitchAnimations();
        Witch.animations[WitchDirection.RIGHT] = new WitchAnimations();

        Witch.animations[WitchDirection.LEFT].fly = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "fly-left0", delay: 100}
        ]);

        Witch.animations[WitchDirection.RIGHT].fly = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "fly-right0", delay: 100}
        ]);
    }

    constructor(x, y) {
        super();
        this.sprite = Playnewton.GPU.CreateSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Witch.animations[this.direction].fly);
        Playnewton.GPU.SetSpriteZ(this.sprite, Z_ORDER.ENEMIES);
        Playnewton.GPU.EnableSprite(this.sprite);

        this.body = Playnewton.PPU.CreateBody();
        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 55, 46);
        Playnewton.PPU.SetBodyPosition(this.body, x, y - 46);
        Playnewton.PPU.SetBodyCollideWorldBounds(this.body, false);
        Playnewton.PPU.SetBodyVelocityBounds(this.body, -10, 10, -20, 10);
        Playnewton.PPU.SetBodyAffectedByGravity(this.body, false);
        Playnewton.PPU.SetBodyCollisionMask(this.body, 0);

        Playnewton.PPU.EnableBody(this.body);

        this.state = WitchState.IDLE;
    }

    UpdateBody() {
        switch (this.state) {
            case WitchState.FLEE:
                if(Playnewton.PPU.CheckIfBodyIsInWorldBound(this.body)) {
                    Playnewton.PPU.SetBodyVelocity(this.body, -this.flySpeed, 0);
                } else {
                    Playnewton.PPU.DisableBody(this.body);
                    Playnewton.GPU.DisableSprite(this.sprite);
                }
                break
        }
    }

    UpdateSprite() {
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Witch.animations[this.direction].fly);
        let y = this.body.position.y + Math.sin(performance.now() / 300) * 4;
        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, y);    
    }

    /**
     * 
     * @param {Sara} sara 
     */
    Pursue(sara) {
        switch (this.state) {
            case WitchState.IDLE:
                break;
            case WitchState.FLY:
                let dx = sara.body.centerX - this.body.centerX;
                let dy = sara.body.centerY - this.body.centerY;
                let distance = Math.sqrt(dx ** 2 + dy ** 2);
                this.direction = dx < 0 ? WitchDirection.LEFT : WitchDirection.RIGHT;
                if(distance < 128) {
                    if(Math.abs(dy) > 8) {
                        dx = 0;
                    } else if(Math.abs(dx) < 128) {
                        Playnewton.PPU.SetBodyVelocity(this.body, 0, 0);
                        return;
                    }
                }
                let s = this.flySpeed / distance;
                dx *= s;
                dy *= s;
                Playnewton.PPU.SetBodyVelocity(this.body, dx, dy);
                break;
            case WitchState.FLEE:
                break;
        }
    }

    fly() {
        this.state = WitchState.FLY;
    }

    flee() {
        this.direction = WitchDirection.LEFT;
        this.state = WitchState.FLEE;
    }
}