import * as Playnewton from "../playnewton.js"

export default class Announcement {

    /**
     * @type Playnewton.GPU_Label
     */
    label;

    /**
     * text
     */
    text;

    dx = 0;

    constructor(text) {
        this.text = text;
        this.label = Playnewton.GPU.HUD.CreateLabel();
    }

    async Start() {
        Playnewton.GPU.HUD.SetLabelPosition(this.label, Playnewton.GPU.screenWidth / 2, Playnewton.GPU.screenHeight / 2);
        Playnewton.GPU.HUD.EnableLabel(this.label);
        this.dx = 0;
        try {
            await Playnewton.GPU.HUD.StartLabelTypewriterEffect(this.label, this.text, 100);
            await Playnewton.CLOCK.Delay(600 * 2000);
            this.dx = 4;
        } catch (e) {
            if( !(e instanceof Playnewton.CLOCK_SkipException) ) {
                throw e;
            }
        }        
    }

    Update() {
        if(this.label.enabled) {
            Playnewton.GPU.HUD.SetLabelPosition(this.label, this.label.x + this.dx, this.label.y);
            if(this.label.x > Playnewton.GPU.screenWidth) {
                Playnewton.GPU.HUD.DisableLabel(this.label);
            }
        }
    }

}