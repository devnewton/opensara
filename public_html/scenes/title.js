import Scene from "./scene.js"
import Playnewton from "../playnewton.js"
import Level from "./level.js"

export default class Title extends Scene {

    async InitTitle() {
        let titleBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/title.png");

        let titleSprite = Playnewton.GPU.GetAvailableSprite();
        Playnewton.GPU.SetSpritePicture(titleSprite, Playnewton.GPU.CreatePicture(titleBitmap));
        Playnewton.GPU.SetSpritePosition(titleSprite, 216, 32);
        Playnewton.GPU.EnableSprite(titleSprite);
    }

    async InitHUD() {
        let hud = Playnewton.GPU.GetHUD();

        let startLabel = hud.GetAvailableLabel();
        hud.SetLabelPosition(startLabel, 512, 288);
        hud.SetLabelText(startLabel, "Press ⌨️F1 or 🎮start");
        hud.SetLabelAlign(startLabel, "center");
        hud.EnableLabel(startLabel);

        Playnewton.GPU.EnableHUD(hud, true);
    }

    async Start() {
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
            this.nextScene = new Level();
            this.nextScene.Start();
        }
    }
}
