import Scene from "./scene.js"
import Playnewton from "../playnewton.js"
import Level from "./level.js"
import MoutainIntroLevel from "./moutain_intro_level.js";
import MoutainOutroLevel from "./moutain_outro_level.js";

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
            let scene = new MoutainOutroLevel("maps/mountain/mountain_outro.tmx", this);
            /*for(let n = 5; n >= 1; --n) {
                let level = new Level(`maps/mountain/mountain_${n}.tmx`, scene);
                scene = level;
            }*/
            this.nextScene = scene;
            //this.nextScene = new MoutainIntroLevel("maps/mountain/mountain_intro.tmx", scene);
            this.nextScene.Start();
        }
    }
}
