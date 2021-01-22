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
    DISAPPEAR: 5,
    ELECTRIC_ATTACK: 6,
    FIRE_ATTACK: 7,
    PHIRE_ATTACK: 8
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

/**
 * @readonly
 * @enum {number}
 */
const MiniBatState = {
    INACTIVE: 1,
    FLY_AWAY: 2,
    FLY_TO: 3
};

class MiniBat {
    /**
     * 
     * @type Playnewton.GPU_Sprite
     */
    sprite;

    /**
     * @type Playnewton.PPU_Body
     */
    body;

    /**
     * @type number
     */
    srcX;

    /**
     * @type number
     */
    srcY;

    /**
     * @type number
     */
    destX;

    /**
     * @type number
     */
    destY;

    /**
     * @type MiniBatState
     */
    state = MiniBatState.INACTIVE;

    static flySpeed = 4;

    constructor() {
        this.sprite = Playnewton.GPU.CreateSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Fampire.animations.miniBatFly);
        Playnewton.GPU.SetSpriteZ(this.sprite, Z_ORDER.ENEMIES);

        this.body = Playnewton.PPU.CreateBody();
        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 32, 23);
        Playnewton.PPU.SetBodyCollideWorldBounds(this.body, false);
        Playnewton.PPU.SetBodyVelocityBounds(this.body, -10, 10, -20, 10);
        Playnewton.PPU.SetBodyAffectedByGravity(this.body, false);
        Playnewton.PPU.SetBodyCollisionMask(this.body, 0);
    }

    StartFly(srcX, srcY, destX, destY) {
        this.srcX = srcX + Math.random() * 16 - 8;
        this.srcY = srcY + Math.random() * 16 - 8;
        this.destX = destX + Math.random() * 16 - 8;
        this.destY = destY + Math.random() * 16 - 8;
        this.state = MiniBatState.FLY_AWAY;
        this.stopFlyAwayTime = Playnewton.CLOCK.now + MiniBat.FLY_AWAY_DURATION;
        Playnewton.PPU.SetBodyPosition(this.body, srcX, srcY);
        let angle = Math.random() * 2 * Math.PI;
        Playnewton.PPU.SetBodyVelocity(this.body, Math.cos(angle) * MiniBat.flySpeed, Math.sin(angle) * MiniBat.flySpeed);
        Playnewton.PPU.EnableBody(this.body);
        Playnewton.GPU.EnableSprite(this.sprite);
    }

    StopFly() {
        Playnewton.PPU.DisableBody(this.body);
        this.state = MiniBatState.INACTIVE;
    }

    UpdateBody() {
        switch (this.state) {
            case MiniBatState.FLY_AWAY:
                this._UpdateBodyFlyAway();
                break;
            case MiniBatState.FLY_TO:
                this._UpdateBodyFlyTo();
                break;
        }
    }

    UpdateSprite() {
        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, this.body.position.y);
    }

    /**
     * @type boolean
     */
    get inactive() {
        return this.state === MiniBatState.INACTIVE;
    }

    _UpdateBodyFlyAway() {
        let dx = this.srcX - this.body.centerX;
        let dy = this.srcY - this.body.centerY;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance > 100) {
            this.state = MiniBatState.FLY_TO;
        }
    }

    _UpdateBodyFlyTo() {
        let dx = this.destX - this.body.centerX;
        let dy = this.destY - this.body.centerY;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance < 8) {
            this.StopFly();
        }
        let s = MiniBat.flySpeed / distance;
        dx *= s;
        dy *= s;
        Playnewton.PPU.SetBodyVelocity(this.body, dx, dy);
    }
}

export default class Fampire extends Enemy {

    /**
     * 
     * @type Playnewton.GPU_Sprite
     */
    sprite;

    /**
     * @type Playnewton.PPU_Body
     */
    body;

    /**
     *  @type number
     */
    static flySpeed = 4;

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
    electricAttackPosition;

    /**
     * @type Playnewton.PPU_Point
     */
    fireAttackPosition;

    /**
     * @type Playnewton.PPU_Point
     */
    phireAttackPosition;

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
     * @type Array<MiniBat>
     */
    miniBats = [];

    /**
     * @type Array<Bullet>
     */
    electricBullets = [];

    nextElectricBulletTime = 0;

    /**
     * @type Array<Bullet>
     */
    fireBullets = [];

    nextFireBulletTime = 0;

    /**
     * @type Array<Bullet>
     */
    phireBullets = [];

    nextPhireBulletTime = 0;

    nextAttackTime = 0;

    static ELECTRIC_ATTACK_DURATION = 20000;
    static DELAY_BETWEEN_TWO_ELECTRIC_BULLETS = 1000;
    static MAX_ELECTRIC_BULLETS = 10;

    static PHIRE_ATTACK_DURATION = 10000;
    static DELAY_BETWEEN_TWO_PHIRE_BULLETS = 1000;
    static MAX_PHIRE_BULLETS = 6;
    static PHIRE_BULLET_SPEED = 8;

    static FIRE_ATTACK_DURATION = 15000;
    static DELAY_BETWEEN_TWO_FIRE_BULLETS = 500;
    static MAX_FIRE_BULLETS = 20;
    static FIRE_BULLET_SPEED = 8;

    /**
     * @type FampireState
     */
    reappearState;

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
            { name: "fireAttack1", x: 410, y: 226, w: 32, h: 32 },
            { name: "fireAttack2", x: 444, y: 226, w: 32, h: 32 },
            { name: "fireAttack3", x: 478, y: 226, w: 32, h: 32 },
            { name: "miniBatFly0", x: 130, y: 195, w: 32, h: 23 },
            { name: "miniBatFly1", x: 130, y: 220, w: 32, h: 23 },
            { name: "miniBatFly2", x: 130, y: 245, w: 32, h: 23 },
            { name: "miniBatFly3", x: 130, y: 270, w: 32, h: 23 },
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

        Fampire.animations.miniBatFly = Playnewton.GPU.CreateAnimation(spriteset, [
            { name: "miniBatFly0", delay: 100 },
            { name: "miniBatFly1", delay: 100 },
            { name: "miniBatFly2", delay: 100 },
            { name: "miniBatFly3", delay: 100 }
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

        for (let i = 0; i < Fampire.MAX_ELECTRIC_BULLETS; ++i) {
            let bullet = new Bullet(Fampire.animations.electricAttack);
            this.electricBullets.push(bullet);
        }

        for (let i = 0; i < Fampire.MAX_FIRE_BULLETS; ++i) {
            let bullet = new Bullet(Fampire.animations.fireAttack);
            bullet.growSpeed = 1;
            this.fireBullets.push(bullet);
        }

        for (let i = 0; i < Fampire.MAX_PHIRE_BULLETS; ++i) {
            let bullet = new Bullet(Fampire.animations.phireAttack);
            this.phireBullets.push(bullet);
        }

        for (let i = 0; i < 10; ++i) {
            let miniBat = new MiniBat();
            this.miniBats.push(miniBat);
        }
    }

    UpdateBody() {
        switch (this.state) {
            case FampireState.DISAPPEAR:
                this._UpdateBodyDisappear();
                break;
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
            case FampireState.FIRE_ATTACK:
                if(this.body.right > Playnewton.PPU.world.bounds.right) {
                    Playnewton.PPU.SetBodyVelocity(this.body, -Fampire.flySpeed, 0);   
                } else if(this.body.left < Playnewton.PPU.world.bounds.left) {
                    Playnewton.PPU.SetBodyVelocity(this.body, Fampire.flySpeed, 0); 
                }
                this._ChooseNextAttack();
                break;
            case FampireState.ELECTRIC_ATTACK:
            case FampireState.PHIRE_ATTACK:
                this._ChooseNextAttack();
                break;
        }

        this.electricBullets.forEach(bullet => bullet.UpdateBody());
        this.phireBullets.forEach(bullet => bullet.UpdateBody());
        this.fireBullets.forEach(bullet => bullet.UpdateBody());
    }

    _UpdateBodyDisappear() {
        if (this.miniBats.every((miniBat) => miniBat.inactive)) {
            this.miniBats.forEach((miniBat) => {
                Playnewton.GPU.DisableSprite(miniBat.sprite);
            });
            Playnewton.PPU.EnableBody(this.body);
            Playnewton.GPU.EnableSprite(this.sprite);
            this._ChangeState(this.reappearState);
        } else {
            this.miniBats.forEach((miniBat) => miniBat.UpdateBody());
        }
    }

    _ElectricAttack() {
        if (Playnewton.CLOCK.now > this.nextElectricBulletTime) {
            this.nextElectricBulletTime = Playnewton.CLOCK.now + Fampire.DELAY_BETWEEN_TWO_ELECTRIC_BULLETS;
            let bullet = this.electricBullets.find((bullet) => bullet.canBeFired);
            if (bullet) {
                let angle = Math.random() * Math.PI;
                bullet.fire(this.body.centerX, this.body.centerY, Math.cos(angle), Math.sin(angle));
            }
        }
    }

    /**
     * @param {Sara} sara 
     */
    _FireAttack() {
        if (Playnewton.CLOCK.now > this.nextFireBulletTime) {
            this.nextFireBulletTime = Playnewton.CLOCK.now + Fampire.DELAY_BETWEEN_TWO_FIRE_BULLETS;
            let bullet = this.fireBullets.find((bullet) => bullet.canBeFired);
            if (bullet) {
                bullet.fire(this.body.centerX, this.body.centerY, 0, Fampire.FIRE_BULLET_SPEED);
            }
        }
    }

    /**
     * @param {Sara} sara 
     */
    _PhireAttack(sara) {
        if (Playnewton.CLOCK.now > this.nextPhireBulletTime) {
            this.nextPhireBulletTime = Playnewton.CLOCK.now + Fampire.DELAY_BETWEEN_TWO_PHIRE_BULLETS;
            let bullet = this.phireBullets.find((bullet) => bullet.canBeFired);
            if (bullet) {
                bullet.fireAt(this.body.centerX, this.body.centerY, sara.body.centerX, sara.body.centerY, Fampire.PHIRE_BULLET_SPEED);
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
            let s = Fampire.flySpeed / distance;
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
            case FampireState.DISAPPEAR:
                this.miniBats.forEach((miniBat) => miniBat.UpdateSprite());
                break;
            case FampireState.ELECTRIC_ATTACK:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Fampire.animations.fly);
                break;
            case FampireState.FIRE_ATTACK:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Fampire.animations.batFly);
                break;
            case FampireState.PHIRE_ATTACK:
                Playnewton.GPU.SetSpriteAnimation(this.sprite, Fampire.animations.stand);
                break;
        }
        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, this.body.position.y);

        this.electricBullets.forEach(bullet => bullet.UpdateSprite());
        this.phireBullets.forEach(bullet => bullet.UpdateSprite());
        this.fireBullets.forEach(bullet => bullet.UpdateSprite());
    }

    /**
     * 
     * @param {Sara} sara 
     */
    Pursue(sara) {
        switch (this.state) {
            case FampireState.WAIT_SARA_ON_ROOF:
                if (sara.body.top < this.roofWaitPosition.y) {
                    this.state = FampireState.THREATEN_SARA;
                }
                break;
            case FampireState.ELECTRIC_ATTACK:
                this._ElectricAttack();
                break;
            case FampireState.FIRE_ATTACK:
                this._FireAttack();
                break;
            case FampireState.PHIRE_ATTACK:
                this._PhireAttack(sara);
                break;
        }

        this.electricBullets.forEach(bullet => bullet.Pursue(sara));
        this.fireBullets.forEach(bullet => bullet.Pursue(sara));
        this.phireBullets.forEach(bullet => bullet.Pursue(sara));
    }

    IsThreateningSara() {
        return this.state === FampireState.THREATEN_SARA;
    }

    FlyToTowerRoof() {
        if (this.state === FampireState.WELCOME_SARA) {
            this.state = FampireState.FLY_TO_TOWER_ROOF;
        }
    }

    _UpdateBodyThreatenSara() {
        let dx = this.threatenPosition.x - this.body.centerX;
        let dy = this.threatenPosition.y - this.body.bottom;
        let distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance < this.body.height / 2) {
            this._Disappear(FampireState.ELECTRIC_ATTACK);
        } else {
            let s = Fampire.flySpeed / distance;
            dx *= s;
            dy *= s;
            Playnewton.PPU.SetBodyVelocity(this.body, dx, dy);
        }
    }

    /**
     * 
     * @param {FampireState} state 
     */
    _ChangeState(state) {
        this.state = state;
        switch (this.state) {
            case FampireState.ELECTRIC_ATTACK:
                this.nextAttackTime = Playnewton.CLOCK.now + Fampire.ELECTRIC_ATTACK_DURATION;
                Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 115, 80);
                Playnewton.PPU.SetBodyPosition(this.body, this.electricAttackPosition.x - this.body.width / 2, this.electricAttackPosition.y - this.body.height);
                Playnewton.PPU.SetBodyVelocity(this.body, 0, 0);
                break;
            case FampireState.FIRE_ATTACK:
                Playnewton.PPU.SetBodyRectangle(this.body, 10, 15, 23, 30);
                Playnewton.PPU.SetBodyPosition(this.body, this.fireAttackPosition.x - this.body.width / 2, this.fireAttackPosition.y - this.body.height);
                Playnewton.PPU.SetBodyVelocity(this.body, Math.random() > 0.5 ? Fampire.flySpeed : -Fampire.flySpeed, 0);
                this.nextAttackTime = Playnewton.CLOCK.now + Fampire.FIRE_ATTACK_DURATION;
                break;
            case FampireState.PHIRE_ATTACK:
                Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 115, 80);
                Playnewton.PPU.SetBodyPosition(this.body, this.phireAttackPosition.x - this.body.width / 2, this.phireAttackPosition.y - this.body.height);
                Playnewton.PPU.SetBodyVelocity(this.body, 0, 0);
                this.nextAttackTime = Playnewton.CLOCK.now + Fampire.PHIRE_ATTACK_DURATION;
                break;
            default:
                Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 115, 80);
                break;
        }
    }

    _Disappear(nextState) {
        this.reappearState = nextState;
        this._ChangeState(FampireState.DISAPPEAR);
        Playnewton.PPU.DisableBody(this.body);
        Playnewton.GPU.DisableSprite(this.sprite);
        //TODO destination by state
        let nextStatePosition = this._FindReappearPosition(nextState);
        this.miniBats.forEach((miniBat) => miniBat.StartFly(this.body.centerX, this.body.centerY, nextStatePosition.x, nextStatePosition.y - this.body.height / 2));
    }

    /**
     * @param {FampireState} state 
     */
    _FindReappearPosition(state) {
        //TODO mieux
        switch (state) {
            case FampireState.FIRE_ATTACK:
                return this.fireAttackPosition;
            case FampireState.ELECTRIC_ATTACK:
                return this.electricAttackPosition;
            case FampireState.PHIRE_ATTACK:
                return this.phireAttackPosition;
            default:
                return this.roofWaitPosition;
        }
    }

    _ChooseNextAttack() {
        if (Playnewton.CLOCK.now > this.nextAttackTime) {
            switch (this.state) {
                case FampireState.ELECTRIC_ATTACK:
                    this._Disappear(Math.random() > 0.5 ? FampireState.FIRE_ATTACK : FampireState.PHIRE_ATTACK);
                    break;
                case FampireState.FIRE_ATTACK:
                    this._Disappear(Math.random() > 0.5 ? FampireState.PHIRE_ATTACK : FampireState.ELECTRIC_ATTACK);
                    break;
                case FampireState.PHIRE_ATTACK:
                    this._Disappear(Math.random() > 0.5 ? FampireState.FIRE_ATTACK : FampireState.ELECTRIC_ATTACK);
                    break;
            }
        }
    }
}