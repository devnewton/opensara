import Scene from "./scene.js"
import * as Playnewton from "../playnewton.js"
import MountainLevel from "./mountain_level.js"
import MountainIntroLevel from "./mountain_intro_level.js";
import MountainOutroLevel from "./mountain_outro_level.js";
import TowerLevel from "./tower_level.js";

export default class Title extends Scene {

    async InitTitle() {
        let titleBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/title.png");

        let titleSprite = Playnewton.GPU.CreateSprite();
        Playnewton.GPU.SetSpritePicture(titleSprite, Playnewton.GPU.CreatePicture(titleBitmap));
        Playnewton.GPU.SetSpritePosition(titleSprite, 216, 32);
        Playnewton.GPU.EnableSprite(titleSprite);
    }

    async InitHUD() {
        let startLabel = Playnewton.GPU.HUD.CreateLabel();
        Playnewton.GPU.HUD.SetLabelPosition(startLabel, 512, 288);
        Playnewton.GPU.HUD.SetLabelText(startLabel, "Press ⌨️F1 or 🎮start");
        Playnewton.GPU.HUD.SetLabelAlign(startLabel, "center");
        Playnewton.GPU.HUD.EnableLabel(startLabel);

        Playnewton.GPU.EnableHUD(true);
    }

    async Start() {
        await super.Start();
        this.nextScene = this;
        for (let z = 0; z < 1; ++z) {
            let layer = Playnewton.GPU.GetLayer(z);
            Playnewton.GPU.EnableLayer(layer);
        }

        this.progress = 0;

        await this.InitTitle();
        this.progress = 50;

        await this.InitHUD();
        this.progress = 100;
    }

    UpdateBodies() {
    }

    UpdateSprites() {
        let pad = Playnewton.CTRL.GetPad(0);
        if(pad.start && this.nextScene === this) {
            this.Stop();
            this.nextScene = new TowerLevel("maps/tower/tower_1.tmx", this);
            /*let scene = new MountainOutroLevel("maps/mountain/mountain_outro.tmx", this);
            for(let n = 5; n >= 1; --n) {
                let level = new MountainLevel(`maps/mountain/mountain_${n}.tmx`, scene);
                scene = level;
            }
            this.nextScene = new MountainIntroLevel("maps/mountain/mountain_intro.tmx", scene);*/
            this.nextScene.Start();
        }
    }
}
