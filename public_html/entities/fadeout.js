import Playnewton from "../playnewton.js"

/**
 * Fadeout done callback
 *
 * @callback doneCallback
 */

export default class Fadeout {

    /**
     * @type number
     */
    intervalId;

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

        this.intervalId = setInterval(() => this.Update(), duration / 100);
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
        } else {
            //TODO move this code elsewhere
            let gameoverLabel = Playnewton.GPU.HUD.GetAvailableLabel();
            Playnewton.GPU.HUD.SetLabelFont(gameoverLabel, "bold 48px monospace");
            Playnewton.GPU.HUD.SetLabelColor(gameoverLabel, "#ff0000");
            Playnewton.GPU.HUD.SetLabelAlign(gameoverLabel, "center");
            Playnewton.GPU.HUD.SetLabelPosition(gameoverLabel, 512, 288);
            Playnewton.GPU.HUD.SetLabelText(gameoverLabel, "Game over");
            Playnewton.GPU.HUD.EnableLabel(gameoverLabel);
        }
        clearInterval(this.intervalId);
    }

}