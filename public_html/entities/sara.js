import Playnewton from "../playnewton.js"

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
     * @type GPU_SpriteAnimation
     * @static
     */
    walkLeftAnimation;

    /**
     *  @type number
     */
    walkSpeed = 5;

    /**
     *  @type number
     */
    jumpSpeed = 8;
    
    /**
     *  @type number
     */
    jumpAcceleration = 0.5;

    /**
     * @type boolean
     */
    isOnGround = false;

    /**
     * @type number
     */
    maxJumpFrames = 30;

    /**
     * @type number
     */
    currentJumpFrames = 30;

    static async Preload() {
        let saraBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/sara.png");

        let spriteset = Playnewton.GPU.CreateSpriteset(saraBitmap, [
            {name: "stand", x: 1, y: 1, w: 32, h: 48},
            {name: "walk-left0", x: 35, y: 1, w: 32, h: 48},
            {name: "walk-left1", x: 70, y: 1, w: 32, h: 48},
            {name: "walk-left2", x: 104, y: 1, w: 32, h: 48},
            {name: "walk-right0", x: 35, y: 50, w: 32, h: 48},
            {name: "walk-right1", x: 70, y: 50, w: 32, h: 48},
            {name: "walk-right2", x: 104, y: 50, w: 32, h: 48}
        ]);
        Sara.standAnimation = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "stand", delay: 1000}
        ]);
        Sara.walkLeftAnimation = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "walk-left0", delay: 100},
            {name: "walk-left1", delay: 100},
            {name: "walk-left2", delay: 100}
        ]);
        Sara.walkRightAnimation = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "walk-right0", delay: 100},
            {name: "walk-right1", delay: 100},
            {name: "walk-right2", delay: 100}
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
        Playnewton.PPU.EnableBody(this.body);
    }

    UpdateBody() {
        let pad = Playnewton.CTRL.GetPad(0);
        this.body.velocity.x = (pad.left && -this.walkSpeed) || (pad.right && this.walkSpeed) || 0;

        this.isOnGround = false;
        if (this.body.bottom >= Playnewton.PPU.world.bounds.bottom) {
            this.isOnGround = true;
        }

        if (pad.A) {
            if (this.isOnGround) {
                this.currentJumpFrames = 0;
            }
        }

        if (this.currentJumpFrames < this.maxJumpFrames) {
            ++this.currentJumpFrames;
            this.body.velocity.y = -this.jumpSpeed;
        } else {
            this.body.velocity.y = 0;
        }
    }

    UpdateSprite() {
        let pad = Playnewton.CTRL.GetPad(0);
        if (pad.left) {
            Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.walkLeftAnimation);
        } else if (pad.right) {
            Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.walkRightAnimation);
        } else {
            Playnewton.GPU.SetSpriteAnimation(this.sprite, Sara.standAnimation);
        }

        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, this.body.position.y);
    }
}