import Scene from "./scene.js"
import * as Playnewton from "../playnewton.js"
import Sara from "../entities/sara.js"
import Fampire from "../entities/fampire.js"
import Enemy from "../entities/enemy.js"
import Z_ORDER from "../utils/z_order.js"
import Fadeout from "../entities/fadeout.js"
import Lava from "../entities/lava.js"
import { IngameMapKeyboardEventToPadButton } from "../utils/keyboard_mappings.js"
import { Dialog } from "../entities/dialog.js"

export default class TowerLevel extends Scene {

    /**
     * @type Sara
     */
    sara;

    /**
     * @type Fampire
     */
    fampire;

    /**
     * @type Lava
     */
    lava;

    /**
     * @type Playnewton.GPU_Bar
     */
    healthBar;

    /**
     * @type string
     */
    mapPath;

    /**
     * @type Scene
     */
    nextSceneOnExit;

    /**
     * @type Fadeout
     */
    fadeout;

    /**
     * @type Playnewton.GPU_Label
     */
    skipLabel;

    /**
     * @type Playnewton.GPU_Label
     */
    dialogLabel;

    /**
     * @type boolean
     */
    threatenDialogStarted;

    dialog = new Dialog();

    constructor(mapPath, nextSceneOnExit) {
        super();
        this.mapPath = mapPath;
        this.nextSceneOnExit = nextSceneOnExit;
        this.pausable = false;
    }

    async InitMap() {
        let map = await Playnewton.DRIVE.LoadTmxMap(this.mapPath);

        Playnewton.PPU.SetWorldBounds(0, 0, 32 * 32, 152 * 32);
        Playnewton.PPU.SetWorldGravity(0, 1);

        Playnewton.DRIVE.ConvertTmxMapToGPUSprites(Playnewton.GPU, map, 0, 0, Z_ORDER.BACKGROUND);
        Playnewton.DRIVE.ConvertTmxMapToPPUBodies(Playnewton.PPU, map, 0, 0);

        await this.InitMapObjects(map);
    }

    /**
     * 
     * @param {Playnewton.TMX_Map} map 
     */
    async InitMapObjects(map) {
        Playnewton.DRIVE.ForeachTmxMapObject(
            (object, objectgroup, x, y) => {
                switch (object.type) {
                    case "sara":
                        if (!this.sara) {
                            this.sara = new Sara(x, y);
                            this.sara.Wait();
                        }
                        break;
                    case "lava":
                        if (!this.lava) {
                            this.lava = new Lava(Playnewton.GPU.GetLayer(objectgroup.z), object.y + objectgroup.y, object.y + object.height + objectgroup.y);
                        }
                        break;
                    case "fampire":
                        if(!this.fampire) {
                            this.fampire = new Fampire(x, y);
                            let roofWaitPosition = Playnewton.DRIVE.FindOneObject(map, "fampire_roof_wait_position");
                            this.fampire.roofWaitPosition = new Playnewton.PPU_Point(roofWaitPosition.x, roofWaitPosition.y );
                            let threatenPosition = Playnewton.DRIVE.FindOneObject(map, "fampire_threaten_position");
                            this.fampire.threatenPosition = new Playnewton.PPU_Point(threatenPosition.x, threatenPosition.y );
                        }
                        break;
                    default:
                        break;
                }
            },
            map);

    }


    InitHUD() {
        this.healthBar = Playnewton.GPU.HUD.CreateBar();
        Playnewton.GPU.HUD.SetBarPosition(this.healthBar, 10, 10);
        Playnewton.GPU.HUD.SetBarSize(this.healthBar, this.sara.maxHealth);
        Playnewton.GPU.HUD.SetBarLevel(this.healthBar, this.sara.health);
        Playnewton.GPU.HUD.EnableBar(this.healthBar, true);

        Playnewton.GPU.EnableHUD(true);
    }

    async Start() {
        this.pausable = false;
        this.threatenDialogStarted = false;

        await super.Start();

        Playnewton.CTRL.MapKeyboardEventToPadButton = IngameMapKeyboardEventToPadButton;

        this.progress = 0;

        for (let z = Z_ORDER.MIN; z <= Z_ORDER.MAX; ++z) {
            let layer = Playnewton.GPU.GetLayer(z);
            Playnewton.GPU.EnableLayer(layer);
        }
        this.progress = 20;

        await Sara.Load();
        this.progress = 40;

        await Fampire.Load();
        this.progress = 50;

        await this.InitMap();
        this.progress = 80;

        this.InitHUD();
        this.progress = 100;

        this.IntroDialog();
    }

    Stop() {
        super.Stop();
        Sara.Unload();
        Fampire.Unload();
    }

    IntroDialog() {
        this.pausable = false;
        this.skipLabel = Playnewton.GPU.HUD.CreateLabel();
        Playnewton.GPU.HUD.SetLabelFont(this.skipLabel, "bold 12px monospace");
        Playnewton.GPU.HUD.SetLabelAlign(this.skipLabel, "right");
        Playnewton.GPU.HUD.SetLabelPosition(this.skipLabel, 1024, 564);
        Playnewton.GPU.HUD.SetLabelColor(this.skipLabel, "#eeeeee");
        Playnewton.GPU.HUD.SetLabelText(this.skipLabel, "Skip with ⌨️enter or 🎮start");
        Playnewton.GPU.HUD.EnableLabel(this.skipLabel);

        this.dialogLabel = Playnewton.GPU.HUD.CreateLabel();
        Playnewton.GPU.HUD.SetLabelFont(this.dialogLabel, "bold 32px monospace");
        Playnewton.GPU.HUD.SetLabelAlign(this.dialogLabel, "left");
        Playnewton.GPU.HUD.SetLabelPosition(this.dialogLabel, 8, 550);
        Playnewton.GPU.HUD.EnableLabel(this.dialogLabel);

        this.dialog.Start([
            { color: "#8fffff", text: "[Sara] Hello ? It's raining outside..." },
            { color: "#8fffff", text: "[Sara] Can I stay here for the night ?" },
            { color: "#e0befb", text: "[Drakul] Please do, the lava will warm up your body." },
            { color: "#8fffff", text: "[Sara] What lava ?" },
        ]);
    }

    UpdateBodies() {

        if (this.sara.dead && !this.fadeout) {
            let layers = [];
            for (let i = Z_ORDER.MIN; i <= Z_ORDER.MAX; ++i) {
                if (i !== Z_ORDER.SARA) {
                    layers.push(i);
                }
            }
            this.fadeout = new Fadeout(1000, layers, () => {
                let gameoverLabel = Playnewton.GPU.HUD.CreateLabel();
                Playnewton.GPU.HUD.SetLabelFont(gameoverLabel, "bold 48px monospace");
                Playnewton.GPU.HUD.SetLabelColor(gameoverLabel, "#ff0000");
                Playnewton.GPU.HUD.SetLabelAlign(gameoverLabel, "center");
                Playnewton.GPU.HUD.SetLabelPosition(gameoverLabel, 512, 288);
                Playnewton.GPU.HUD.SetLabelText(gameoverLabel, "Game over");
                Playnewton.GPU.HUD.EnableLabel(gameoverLabel);

                Playnewton.GPU.HUD.DisableBar(this.healthBar);
            });
        }
        this.lava.UpdateBody();
        this.lava.Pursue(this.sara);
        this.sara.UpdateBody();
        this.fampire.UpdateBody();

        this.sara.Stomp(this.fampire);
        this.fampire.Pursue(this.sara);

        if(this.fampire.IsThreateningSara() && !this.threatenDialogStarted) {
            this.threatenDialogStarted = true;
            this.dialog.Start([
                { color: "#8fffff", text: "[Sara] What a horrible night to have a curse." },
                { color: "#e0befb", text: "[Drakul] And so the shiver of the night has arrived !" },
            ]);
            Playnewton.GPU.HUD.EnableLabel(this.dialogLabel);
        }

        let pad = Playnewton.CTRL.GetMasterPad();
        if (pad.TestStartAndResetIfPressed()) {
            this.dialog.Skip();
        }

        this.dialog.Update(this.dialogLabel);
        if(this.dialog.done) {
            Playnewton.GPU.HUD.DisableLabel(this.dialogLabel);
            Playnewton.GPU.HUD.DisableLabel(this.skipLabel);
            this.sara.StopWaiting();
            this.lava.Erupt();
            this.fampire.FlyToTowerRoof();
            this.pausable = true;
        }
    }

    UpdateSprites() {
        this.lava.UpdateSprite();
        this.sara.UpdateSprite();
        this.fampire.UpdateSprite();

        let scrollY = -this.sara.sprite.y + 288;
        scrollY = Math.max(scrollY, -152 * 32 + 576);
        Playnewton.GPU.SetScroll(0, scrollY);

        Playnewton.GPU.HUD.SetBarLevel(this.healthBar, this.sara.health);

        if (this.fadeout) {
            this.fadeout.Update();
        }
    }
}
