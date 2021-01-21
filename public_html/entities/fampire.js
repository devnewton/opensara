import Enemy from "./enemy.js"
import * as Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";
import Sara from "./sara.js";
import { Bullet, BulletAnimations } from "./bullet.js";

/**
 * @readonly
 * @enum {number}
 */
const FampireState = {
    WELCOME_SARA: 1,
    FLY_TO_TOWER_ROOF: 2,
    WAIT_SARA_ON_ROOF: 3,
    THREATEN_SARA: 4,
    ELECTRIC_ATTACK: 5
};

/**
 * 
 * @type FampireAnimations
 */
class FampireAnimations {

    /**
     * @type Playnewton.GPU_SpriteAnimation
     */
    stand;

    /**
     * @type Playnewton.GPU_SpriteAnimation
     */
    fly;

    /**
     * @type Playnewton.GPU_SpriteAnimation
     */
    hurted;

    /**
     * @type Playnewton.GPU_SpriteAnimation
     */
    batFly;

    /**
     * @type Playnewton.GPU_SpriteAnimation
     */
    batHurted;

    /**
     * @type Playnewton.GPU_SpriteAnimation
     */
    miniBatFly;

    /**
     * @type BulletAnimations
     */
    electricAttack = new BulletAnimations();

    /**
     * @type BulletAnimations
     */
    phireAttack = new BulletAnimations();

    /**
     * @type BulletAnimations
     */
    fireAttack = new BulletAnimations();
}

export default class Fampire extends Enemy {

    /**
     * 
     * @type GPU_Sprite
     */
    sprite;

    /**
     *  @type number
     */
    flySpeed = 4;

    /**
     *  @type FampireState
     */
    state;

    /**
     * @type Playnewton.PPU_Point
     */
    roofWaitPosition;

    /**
     * @type Playnewton.PPU_Point
     */
    threatenPosition;

    /**
     * @type FampireAnimations
     */
    static animations;

    hoverDy = 0;

    /**
     * @type Array<Bullet>
     */
    electricBullets = [];

    nextElectricBulletTime = 0;

    static DELAY_BETWEEN_TWO_ELECTRIC_BULLETS = 1000;
    static MAX_ELECTRIC_BULLETS = 10;

    static async Load() {
        let bitmap = await Playnewton.DRIVE.LoadBitmap("sprites/fampire.png");

        let spriteset = Playnewton.GPU.CreateSpriteset(bitmap, [
            { name: "stand0", x: 2, y: 412, w: 126, h: 79 },
            { name: "fly0", x: 2, y: 2, w: 126, h: 79 },
            { name: "fly1", x: 2, y: 84, w: 126, h: 79 },
            { name: "fly2", x: 2, y: 166, w: 126, h: 79 },
            { name: "fly3", x: 2, y: 248, w: 126, h: 79 },
            { name: "hurted0", x: 2, y: 330, w: 126, h: 79 },
            { name: "hurted1", x: 2, y: 412, w: 126, h: 79 },
            { name: "batFly0", x: 130, y: 2, w: 61, h: 46 },
            { name: "batFly1", x: 130, y: 50, w: 61, h: 46 },
            { name: "batFly2", x: 130, y: 98, w: 61, h: 46 },
            { name: "batFly3", x: 130, y: 146, w: 61, h: 46 },
            { name: "batHurted0", x: 130, y: 98, w: 61, h: 46 },
            { name: "batHurted1", x: 192, y: 2, w: 61, h: 46 },
            { name: "electricAttack0", x: 262, y: 2, w: 48, h: 48 },
            { name: "electricAttack1", x: 312, y: 2, w: 48, h: 48 },
            { name: "electricAttack2", x: 362, y: 2, w: 48, h: 48 },
            { name: "electricAttack3", x: 412, y: 2, w: 48, h: 48 },
            { name: "electricAttack4", x: 462, y: 2, w: 48, h: 48 },
            { name: "electricAttack5", x: 262, y: 52, w: 48, h: 48 },
            { name: "electricAttack6", x: 312, y: 52, w: 48, h: 48 },
            { name: "electricAttack7", x: 362, y: 52, w: 48, h: 48 },
            { name: "electricAttack8", x: 412, y: 52, w: 48, h: 48 },
            { name: "electricAttack9", x: 462, y: 52, w: 48, h: 48 },
            { name: "electricAttack10", x: 262, y: 102, w: 48, h: 48 },
            { name: "phireAttack0", x: 262, y: 152, w: 60, h: 60 },
            { name: "phireAttack1", x: 324, y: 152, w: 60, h: 60 },
            { name: "phireAttack2", x: 386, y: 152, w: 60, h: 60 },
            { name: "phireAttack3", x: 448, y: 152, w: 60, h: 60 },
            { name: "fireAttack0", x: 376, y: 226, w: 32, h: 32 },
            { name: "fireAttack1", x: 410, y: 152, w: 32, h: 32 },
            { name: "fireAttack2", x: 444, y: 152, w: 32, h: 32 },
            { name: "fireAttack3", x: 478, y: 152, w: 32, h: 32 }
        ]);

        Fampire.animations = new FampireAnimations();

        Fampire.animations.stand = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "stand0", delay: 1000 }
        ]);

        Fampire.animations.fly = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "fly0", delay: 100 },
            { name: "fly1", delay: 100 },
            { name: "fly2", delay: 100 },
            { name: "fly3", delay: 100 }
        ]);

        Fampire.animations.batFly = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "batFly0", delay: 100 },
            { name: "batFly1", delay: 100 },
            { name: "batFly2", delay: 100 },
            { name: "batFly3", delay: 100 }
        ]);

        Fampire.animations.hurted = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "hurted0", delay: 100 },
            { name: "hurted1", delay: 100 },
            { name: "hurted2", delay: 100 },
            { name: "hurted3", delay: 100 }
        ]);

        Fampire.animations.electricAttack.grow = Fampire.animations.electricAttack.fly = Fampire.animations.electricAttack.explode = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "electricAttack0", delay: 100 },
            { name: "electricAttack1", delay: 100 },
            { name: "electricAttack2", delay: 100 },
            { name: "electricAttack3", delay: 100 },
            { name: "electricAttack4", delay: 100 },
            { name: "electricAttack5", delay: 100 },
            { name: "electricAttack6", delay: 100 },
            { name: "electricAttack7", delay: 100 },
            { name: "electricAttack8", delay: 100 },
            { name: "electricAttack9", delay: 100 },
            { name: "electricAttack10", delay: 100 }
        ]);

        Fampire.animations.phireAttack.grow = Fampire.animations.phireAttack.fly = Fampire.animations.phireAttack.explode = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "phireAttack0", delay: 100 },
            { name: "phireAttack1", delay: 100 },
            { name: "phireAttack2", delay: 100 },
            { name: "phireAttack3", delay: 100 }
        ]);

        Fampire.animations.fireAttack.grow = Fampire.animations.fireAttack.fly = Fampire.animations.fireAttack.explode = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "fireAttack0", delay: 100 },
            { name: "fireAttack1", delay: 100 },
            { name: "fireAttack2", delay: 100 },
            { name: "fireAttack3", delay: 100 }
        ]);
    }

    static Unload() {
        Fampire.animations = null;
    }

    constructor(x, y) {
        super();
        this.sprite = Playnewton.GPU.CreateSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Fampire.animations.stand);
        Playnewton.GPU.SetSpriteZ(this.sprite, Z_ORDER.ENEMIES);
        Playnewton.GPU.EnableSprite(this.sprite);

        this.body = Playnewton.PPU.CreateBody();
        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 115, 80);
        Playnewton.PPU.SetBodyPosition(this.body, x, y - this.body.height);
        Playnewton.PPU.SetBodyCollideWorldBounds(this.body, false);
        Playnewton.PPU.SetBodyVelocityBounds(this.body, -10, 10, -20, 10);
        Playnewton.PPU.SetBodyAffectedByGravity(this.body, false);
        Playnewton.PPU.SetBodyCollisionMask(this.body, 0);

        Playnewton.PPU.EnableBody(this.body);

        this.state = FampireState.WELCOME_SARA;

        for(let i = 0; i<Fampire.MAX_ELECTRIC_BULLETS; ++i) {
            let bullet = new Bullet(Fampire.animations.electricAttack);
            this.electricBullets.push(bullet);
            Playnewton.PPU.SetBodyRectangle(bullet, 8, 8, 32, 32)
        }
    }

    UpdateBody() {
        switch (this.state) {
            case FampireState.WELCOME_SARA:
                break;
            case FampireState.FLY_TO_TOWER_ROOF:
                this._UpdateBodyFlyToTowerRoof();
                break;
            case FampireState.WAIT_SARA_ON_ROOF:
                Playnewton.PPU.SetBodyPosition(this.body, this.roofWaitPosition.x - this.body.width / 2, this.roofWaitPosition.y - this.body.height);
                Playnewton.PPU.SetBodyVelocity(this.body, 0, 0);
                break;
            case FampireState.THREATEN_SARA:
                this._UpdateBodyThreatenSara();
                break;
            case FampireState.ELECTRIC_ATTACK:
                this._ElectricAttack();
                break;
        }

        this.electricBullets.forEach(bullet => bullet.UpdateBody());
    }

    _ElectricAttack() {
        Playnewton.PPU.SetBodyPosition(this.body, this.threatenPosition.x - this.body.width / 2, this.threatenPosition.y - this.body.height);
        Playnewton.PPU.SetBodyVelocity(this.body, 0, 0);

        if(Playnewton.CLOCK.now > this.nextElectricBulletTime) {
            this.nextElectricBulletTime = Playnewton.CLOCK.now + Fampire.DELAY_BETWEEN_TWO_ELECTRIC_BULLETS;
            let bullet = this.electricBullets.find((bullet) => bullet.canBeFired);
            if(bullet) {
                let angle = Math.random() * Math.PI;
                bullet.fire(this.body.centerX, this.body.centerY, Math.cos(angle), Math.sin(angle));
            }
        }
    }

    _UpdateBodyFlyToTowerRoof() {
        let dx = this.roofWaitPosition.x - this.body.centerX;
        let dy = this.roofWaitPosition.y - this.body.bottom;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance < this.body.height / 2) {
            this.state = FampireState.WAIT_SARA_ON_ROOF;
        } else {
            let s = this.flySpeed / distance;
            dx *= s;
            dy *= s;
            Playnewton.PPU.SetBodyVelocity(this.body, dx, dy);
        }
    }

    UpdateSprite() {
        switch (this.state) {
            case FampireState.WELCOME_SARA:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Fampire.animations.stand);
                break;
            case FampireState.FLY_TO_TOWER_ROOF:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Fampire.animations.fly);
                break;
            case FampireState.WAIT_SARA_ON_ROOF:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Fampire.animations.stand);
                break;
            case FampireState.THREATEN_SARA:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Fampire.animations.fly);
                break;
            case FampireState.ELECTRIC_ATTACK:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Fampire.animations.fly);
                break;
        }
        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, this.body.position.y);

        this.electricBullets.forEach(bullet => bullet.UpdateSprite());
    }

    /**
     * 
     * @param {Sara} sara 
     */
    Pursue(sara) {
        if(this.state === FampireState.WAIT_SARA_ON_ROOF && sara.body.top < this.roofWaitPosition.y) {
            this.state = FampireState.THREATEN_SARA;
        }

        this.electricBullets.forEach(bullet => bullet.Pursue(sara));
    }

    IsThreateningSara() {
        return this.state === FampireState.THREATEN_SARA;
    }

    FlyToTowerRoof() {
        if(this.state === FampireState.WELCOME_SARA) {
            this.state = FampireState.FLY_TO_TOWER_ROOF;
        }
    }

    _UpdateBodyThreatenSara() {
        let dx = this.threatenPosition.x - this.body.centerX;
        let dy = this.threatenPosition.y - this.body.bottom;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance < this.body.height / 2) {
            this.state = FampireState.ELECTRIC_ATTACK;
        } else {
            let s = this.flySpeed / distance;
            dx *= s;
            dy *= s;
            Playnewton.PPU.SetBodyVelocity(this.body, dx, dy);
        }
    }
}