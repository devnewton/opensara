import Playnewton from "../playnewton.js"

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
     * @param {number} duration Fade out duration in milliseconds 
     * @param {Array<number>} layers 
     */
    constructor(duration, layers) {
        this.layers = layers;

        this.intervalId = setInterval(() => this.Update(), duration / 100);
    }

    Update() {
        --this.brightnessPercentage;
        if(this.brightnessPercentage >= 0) {
            for(let l of this.layers) {
                let layer = Playnewton.GPU.GetLayer(l);
                layer.filter = `brightness(${this.brightnessPercentage}%)`;
            }
        }else {
            let hud = Playnewton.GPU.GetHUD();
            let gameoverLabel = hud.GetAvailableLabel();
            hud.SetLabelFont(gameoverLabel, "bold 48px monospace");
            hud.SetLabelColor(gameoverLabel, "#ff0000");
            hud.SetLabelAlign(gameoverLabel, "center");
            hud.SetLabelPosition(gameoverLabel, 512, 288);
            hud.SetLabelText(gameoverLabel, "Game over");
            hud.EnableLabel(gameoverLabel);
            clearInterval(this.intervalId);
        }


    }

}