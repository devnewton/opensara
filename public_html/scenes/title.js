import Scene from "./scene.js"
import * as Playnewton from "../playnewton.js"
import MountainLevel from "./mountain_level.js"
import MountainIntroLevel from "./mountain_intro_level.js";
import MountainOutroLevel from "./mountain_outro_level.js";
import { MenuMapKeyboardEventToPadButton } from "../utils/keyboard_mappings.js";
import TowerLevel from "./tower_level.js";

class Adventure {
    /**
     * @type string
     */
    name;

    /**
     * @type Playnewton.GPU_Label
     */
    label;

    constructor(name) {
        this.name = name;
        this.label = Playnewton.GPU.HUD.CreateLabel();
        Playnewton.GPU.HUD.SetLabelPosition(this.label, 512, 288);
        Playnewton.GPU.HUD.SetLabelFont(this.label, "bold 24px monospace");
        Playnewton.GPU.HUD.SetLabelText(this.label, name);
        Playnewton.GPU.HUD.SetLabelAlign(this.label, "right");
        Playnewton.GPU.HUD.EnableLabel(this.label);
    }

    /**
     * 
     * @param {Scene} nextScene 
     * @returns {Scene}
     */
    build(nextScene) {
        return nextScene;
    }
};

class MountainAdventure extends Adventure {

    constructor() {
        super("Mountain");
        Playnewton.GPU.HUD.SetLabelPosition(this.label, 512, 288);
    }

    /**
     * 
     * @param {Scene} nextScene 
     * @returns {Scene}
     */
    build(nextScene) {
        let scene = new MountainOutroLevel("maps/mountain/mountain_outro.tmx", nextScene);
        for (let n = 5; n >= 1; --n) {
            let level = new MountainLevel(`Mountain ${n}-5`, `maps/mountain/mountain_${n}.tmx`, scene);
            scene = level;
        }
        return new MountainIntroLevel("maps/mountain/mountain_intro.tmx", scene);
    }

}

class TowerAdventure extends Adventure {

    constructor() {
        super("Tower");
        Playnewton.GPU.HUD.SetLabelPosition(this.label, 512, 320);
    }

    /**
     * 
     * @param {Scene} nextScene 
     * @returns {Scene}
     */
    build(nextScene) {
        return new TowerLevel("maps/tower/tower_1.tmx", nextScene);
    }

}

export default class Title extends Scene {

    /**
     * @type Array<Adventure>
     */
    adventures;

    /**
     * @type number
     */
    adventureIndex;

    /**
     * @type ImageBitmap
     */
    titleBitmap;

    constructor() {
        super();
        this.pausable = false;
    }

    async InitTitle() {
        this.titleBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/title.png");

        let titleSprite = Playnewton.GPU.CreateSprite();
        Playnewton.GPU.SetSpritePicture(titleSprite, Playnewton.GPU.CreatePicture(this.titleBitmap));
        Playnewton.GPU.SetSpritePosition(titleSprite, 216, 32);
        Playnewton.GPU.EnableSprite(titleSprite);
    }

    InitHUD() {
        let startLabel = Playnewton.GPU.HUD.CreateLabel();
        Playnewton.GPU.HUD.SetLabelPosition(startLabel, 1024, 564);
        Playnewton.GPU.HUD.SetLabelText(startLabel, "Press ⌨️enter or 🎮start");
        Playnewton.GPU.HUD.SetLabelFont(startLabel, "bold 12px monospace");
        Playnewton.GPU.HUD.SetLabelColor(startLabel, "#eeeeee");
        Playnewton.GPU.HUD.SetLabelAlign(startLabel, "right");
        Playnewton.GPU.HUD.EnableLabel(startLabel);

        Playnewton.GPU.EnableHUD(true);
    }

    async Start() {
        await super.Start();

        this.adventures = [];
        this.adventures.push(new MountainAdventure());
        this.adventures.push(new TowerAdventure);

        this.adventureIndex = 0;

        Playnewton.CTRL.MapKeyboardEventToPadButton = MenuMapKeyboardEventToPadButton;

        this.nextScene = this;
        for (let z = 0; z < 1; ++z) {
            let layer = Playnewton.GPU.GetLayer(z);
            Playnewton.GPU.EnableLayer(layer);
        }

        this.progress = 0;

        await this.InitTitle();
        this.progress = 50;

        this.InitHUD();
        this.progress = 100;
    }

    Stop() {
        super.Stop();
        this.titleBitmap.close();
        this.titleBitmap = null;
    }

    UpdateBodies() {
    }

    UpdateSprites() {
        let pad = Playnewton.CTRL.GetMasterPad();
        if (pad.TestStartAndResetIfPressed() && this.nextScene === this) {
            this.Stop();
            this.nextScene = this.adventures[this.adventureIndex].build(this);
            this.nextScene.Start();
        }

        if (pad.TestUpAndResetIfPressed()) {
            --this.adventureIndex;
        }
        if (pad.TestDownAndResetIfPressed()) {
            ++this.adventureIndex;
            pad.downWasNotPressed = false;
        }
        this.adventureIndex = Playnewton.FPU.wrap(0, this.adventureIndex, this.adventures.length - 1);
        this.adventures.forEach((adventure, index) => {
            Playnewton.GPU.HUD.SetLabelText(adventure.label, `${index === this.adventureIndex ? '👉' : ''}${adventure.name}`);
        });
    }
}
