import * as Playnewton from "../playnewton.js"
import { Dialog } from "./dialog.js";

export default class Announcement {

    /**
     * @type string
     */
    text;

    /**
     * @type Playnewton.GPU_Label
     */
    label;

    dialog = new Dialog();

    constructor(text) {
        this.text = text;
        this.label = Playnewton.GPU.HUD.CreateLabel();
    }

    Start() {
        Playnewton.GPU.HUD.SetLabelPosition(this.label, Playnewton.GPU.screenWidth / 2, Playnewton.GPU.screenHeight / 2);
        Playnewton.GPU.HUD.EnableLabel(this.label);
        Playnewton.GPU.HUD.SetLabelText(this.label, "");
        this.dx = 0;
        this.dialog.Start([{text: this.text}]);       
    }

    Update() {
        if(this.label.enabled) {
            this.dialog.Update(this.label);
            let dx = (this.dialog.done && 4) || 0;
            Playnewton.GPU.HUD.SetLabelPosition(this.label, this.label.x + dx, this.label.y);
            if(this.label.x > Playnewton.GPU.screenWidth) {
                Playnewton.GPU.HUD.DisableLabel(this.label);
            }
        }
    }
}