import * as Playnewton from "../playnewton.js"

export class DialogLineDescription {
    /**
     * @type String
     */
    text;

    /**
     * @type string
     */
    color;

    /**
     * Speed in millisecond per chararcter
     * @type number
     */
    speed;

    /**
     * Delay before showing next line
     * @type number
     */
    delay;

    /**
     * @type number
     */
    x;

    /**
     * @type number
     */
    y;

    /**
     * @type string
     */
    align;
}

class DialogLine {
    /**
     * @type String
     */
    text;

    /**
     * @type string
     */
    color;

    /**
     * Speed in millisecond per chararcter
     * @type number
     */
    speed;

    /**
     * Delay before showing next line
     * @type number
     */
    delay;

    /**
     * @type string
     */
    align;

    /**
     * @type number
     */
    x;

    /**
     * @type number
     */
    y;

    /**
     * @type DOMHighResTimeStamp
     */
    startTime;

    /**
     * @type DOMHighResTimeStamp
     */
    endTime;

    /**
     * @type string
     */
    get currentText() {
        let text = this.text;
        let nbCharacter = (Playnewton.CLOCK.now - this.startTime) / this.speed;
        if (nbCharacter <= 0) {
            return;
        }
        if (nbCharacter < text.length) {
            text = text.slice(0, nbCharacter);
        }
        return text;
    }
}

export class Dialog {

    /**
     * @type boolean
     */
    skipped ;

    /**
     * @type Array<DialogLine>
     */
    lines = [];

    /**
     * @param {Array<DialogLineDescription>} lines
     */
    Start(lines) {
        this.skipped = false;
        let startTime = Playnewton.CLOCK.now;
        this.lines = lines.map(desc => {
            let line = new DialogLine();
            line.text = desc.text;
            line.color = desc.color || "#ffffff";
            line.delay = desc.delay || 2000;
            line.speed = desc.speed || 50;
            line.align = desc.align || "left";
            line.x = desc.x;
            line.y = desc.y;
            line.startTime = startTime;
            line.endTime = startTime + line.text.length * line.speed + line.delay;
            startTime = line.endTime;
            return line;
        });
    }

    Skip() {
        this.skipped = true;
    }

    /**
     * @param {Playnewton.GPU_Label} label 
     */
    Update(label) {
        let line = this.currentLine;
        if (line) {
            Playnewton.GPU.HUD.SetLabelAlign(label, line.align);
            Playnewton.GPU.HUD.SetLabelColor(label, line.color);
            Playnewton.GPU.HUD.SetLabelPosition(label, Number.isFinite(line.x) ? line.x : label.x, Number.isFinite(line.y) ? line.y : label.y);
            Playnewton.GPU.HUD.SetLabelText(label, line.currentText);
        } else {
            Playnewton.GPU.HUD.SetLabelText(label, "");
        }
    }

    /**
     * @type boolean
     */
    get done() {
        if(this.skipped) {
            return true;
        }
        if (this.lines.length > 0) {
            return this.lines[this.lines.length - 1].endTime < Playnewton.CLOCK.now;
        } else {
            return false;
        }
    }

    /**
     * 
     * @param {DOMHighResTimeStamp} now 
     * @returns GPU_DialogLine
     */
    get currentLine() {
        if (!this.skipped) {
            for (let i = this.lines.length - 1; i >= 0; --i) {
                let line = this.lines[i];
                if (Playnewton.CLOCK.now >= line.startTime) {
                    return line;
                }
            }
        }
        return null;
    }
}
