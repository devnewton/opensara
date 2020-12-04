import Enemy from "./enemy.js"
import * as Playnewton from "../playnewton.js"
import Z_ORDER from "../utils/z_order.js";
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
    eruptSpeed = 1;

    /**
     *  @type number
     */
    eruptSpeed = 1;

    /**
     *  @type LavaState
     */
    state;

    /**
     * 
     * @param {GPU_Layer} layer 
     */
    constructor(layer) {
        super();
        this.layer = layer;
        this.state = LavaState.IDLE;
    }

    UpdateBody() {
        switch (this.state) {
            case LavaState.IDLE:
                break;
            case LavaState.ERUPT:
                //TODO
        }
    }

    UpdateSprite() {
        //TODO 
    }

    /**
     * 
     * @param {Sara} sara 
     */
    Pursue(sara) {
        //TODO
    }

    Erupt() {
        this.state = LavaState.ERUPT;
    }
}