import Playnewton from "../playnewton.js"

        /**
         * @readonly
         * @enum {number}
         */
        const HeartState = {
            IDLE: 1
        };

/**
 * 
 * @type SaraAnimations
 */
class HeatAnimations {
    /**
     * @type GPU_SpriteAnimation
     */
    idle;
}

export default class Heart {
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
     *  @type SaraState
     */
    state = HeartState.IDLE;

    static async Preload() {
        let bitmap = await Playnewton.DRIVE.LoadBitmap("sprites/collectibles.png");

        let spriteset = Playnewton.GPU.CreateSpriteset(bitmap, [
            {name: "heart1", x: 0, y: 0, w: 32, h: 32},
            {name: "heart2", x: 32, y: 0, w: 32, h: 32},
            {name: "heart3", x: 64, y: 0, w: 32, h: 32},
            {name: "heart4", x: 96, y: 0, w: 32, h: 32},
            {name: "heart5", x: 128, y: 0, w: 32, h: 32},
            {name: "heart6", x: 160, y: 0, w: 32, h: 32},
            {name: "heart7", x: 192, y: 0, w: 32, h: 32}

        ]);

        Heart.animations = new HeatAnimations();

        Heart.animations.idle = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "heart1", delay: 100},
            {name: "heart2", delay: 100},
            {name: "heart3", delay: 100},
            {name: "heart4", delay: 100},
            {name: "heart5", delay: 100},
            {name: "heart6", delay: 100},
            {name: "heart7", delay: 100}
        ]);
    }

    constructor() {
        this.sprite = Playnewton.GPU.GetAvailableSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sprite, Heart.animations.idle);
        Playnewton.GPU.SetSpriteZ(this.sprite, 15);
        Playnewton.GPU.EnableSprite(this.sprite);

        this.body = Playnewton.PPU.GetAvailableBody();
        Playnewton.PPU.SetBodyRectangle(this.body, 0, 0, 32, 32);
        Playnewton.PPU.SetBodyPosition(this.body, 200, 200);
        Playnewton.PPU.SetBodyImmovable(this.body, true);
        Playnewton.PPU.EnableBody(this.body);
    }

    UpdateBody() {
    }

    UpdateSprite() {
        Playnewton.GPU.SetSpritePosition(this.sprite, this.body.position.x, this.body.position.y);
    }
}