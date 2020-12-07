import Enemy from "./enemy.js"
import * as Playnewton from "../playnewton.js"
import Sara from "./sara.js";

/**
 * @readonly
 * @enum {number}
 */
const LavaState = {
    IDLE: 1,
    ERUPT: 2
};

export default class Lava extends Enemy {

    /**
     *  @type GPU_Layer
     */
    layer;

    /**
     *  @type number
     */
    static eruptSpeed = 1;

    /**
     *  @type LavaState
     */
    state;

    /**
     * @type number
     */
    y;

    /**
     * @type number
     */
    top;


    /**
     * @type number
     */
    scrollY = 0;

    hurtingSara = false;

    /**
     * 
     * @param {Playnewton.GPU_Layer} layer 
     * @param {number} top 
     * @param {number} bottom
     */
    constructor(layer, top, bottom) {
        super();
        this.y = bottom;
        this.top = top;
        this.layer = layer;
        this.state = LavaState.IDLE;
    }

    UpdateBody() {
        switch (this.state) {
            case LavaState.IDLE:
                break;
            case LavaState.ERUPT:
                if(!this.hurtingSara && this.y > this.top) {
                    this.y -= Lava.eruptSpeed;
                    this.scrollY -= Lava.eruptSpeed;
                }
        }
    }

    UpdateSprite() {
        Playnewton.GPU.SetLayerScroll(this.layer, 0, this.scrollY);
    }

    /**
     * 
     * @param {Sara} sara 
     */
    Pursue(sara) {
        let maxY = this.y + Math.sin(Playnewton.GPU.fpsLimiter.now / 300) * 8;
        if(!sara.dead && sara.body.bottom > maxY) {
            sara.body.bottom = maxY;
            this.hurtingSara = true;
            sara.HurtByLava();
        } else {
            this.hurtingSara = false;
        }
    }

    Erupt() {
        this.state = LavaState.ERUPT;
    }
}