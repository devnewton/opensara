import * as Playnewton from "../playnewton.js"

/**
 * Fadeout done callback
 *
 * @callback doneCallback
 */

export default class Fadeout {

    /**
     * @type Array<number>
     */
    layers;

    brightnessPercentage = 100;

    /**
     * @type doneCallback
     */
    doneCallback;

    /**
     * @param {number} duration Fade out duration in milliseconds 
     * @param {Array<number>} layers 
     * @param {doneCallback}
     */
    constructor(duration, layers, doneCallback = undefined) {
        this.layers = layers;
        this.doneCallback = doneCallback;
    }

    Update() {
        --this.brightnessPercentage;
        if(this.brightnessPercentage >= 0) {
            for(let l of this.layers) {
                let layer = Playnewton.GPU.GetLayer(l);
                layer.filter = `brightness(${this.brightnessPercentage}%)`;
            }
        } else {
            this.Done();
        }
    }

    Done() {
        if(this.doneCallback) {
            this.doneCallback();
            this.doneCallback = undefined;
        }
    }

}