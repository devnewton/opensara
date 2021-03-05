import Scene from "./scene.js"
import * as Playnewton from "../playnewton.js"
import Sara from "../entities/sara.js"
import Fampire from "../entities/fampire.js"
import Z_ORDER from "../utils/z_order.js"
import Fadeout from "../entities/fadeout.js"
import Lava from "../entities/lava.js"
import { IngameMapKeyboardEventToPadButton } from "../utils/keyboard_mappings.js"
import { Dialog } from "../entities/dialog.js"

/**
 * Enum for level state
 * @readonly
 * @enum {number}
 */
const TowerLevelState = {
    INTRO: 1,
    LAVA: 2,
    FAMPIRE_FIGHT: 3,
    FAMPIRE_DEAD: 4,
    END: 5
};

export default class TowerLevel extends Scene {

    /**
     * @type TowerLevelState
     */
    state;

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
                        if (!this.fampire) {
                            this.fampire = new Fampire(x, y);
                            let findFampirePosition = (name) => {
                                let pos = Playnewton.DRIVE.FindOneObject(map, name);
                                return new Playnewton.PPU_Point(pos.x, pos.y);
                            }
                            this.fampire.roofWaitPosition = findFampirePosition("fampire_roof_wait_position");
                            this.fampire.threatenPosition = findFampirePosition("fampire_threaten_position");
                            this.fampire.electricAttackPosition = findFampirePosition("fampire_electric_attack_position");
                            this.fampire.fireAttackPosition = findFampirePosition("fampire_fire_attack_position");
                            this.fampire.phireAttackPosition = findFampirePosition("fampire_phire_attack_position");
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
        this.state = TowerLevelState.INTRO;

        this.fadeout = null;

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
            { color: "#8fffff", text: "[Sara] What lava ?" }
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

        let pad = Playnewton.CTRL.GetMasterPad();
        if (pad.TestStartAndResetIfPressed()) {
            this.dialog.Skip();
        }

        this.dialog.Update(this.dialogLabel);
        switch (this.state) {
            case TowerLevelState.INTRO:
                if (this.dialog.done) {
                    Playnewton.GPU.HUD.DisableLabel(this.dialogLabel);
                    Playnewton.GPU.HUD.DisableLabel(this.skipLabel);
                    this.sara.StopWaiting();
                    this.lava.Erupt();
                    this.fampire.FlyToTowerRoof();
                    this.pausable = true;
                    this.state = TowerLevelState.LAVA;
                }
                break;
            case TowerLevelState.LAVA:
                if (this.fampire.IsThreateningSara()) {
                    //adjust world bounds for faster bullet culling
                    Playnewton.PPU.SetWorldBounds(0, 0, 32 * 32, 48 * 32);
                    this.threatenDialogStarted = true;
                    this.dialog.Start([
                        { color: "#e0befb", text: "[Drakul] I will have your blood for dinner, Sara !" }
                    ]);
                    Playnewton.GPU.HUD.EnableLabel(this.dialogLabel);
                    this.state = TowerLevelState.FAMPIRE_FIGHT;
                }
                break;
            case TowerLevelState.FAMPIRE_FIGHT:
                if (this.fampire.dead) {
                    this.dialog.Start([
                        { color: "#e0befb", text: "[Drakul] Noooooooooooooooooo !", speed: 200 },
                        { color: "#8fffff", text: "[Sara] You will need some nurse now, fampire !" },
                        { color: "#e0befb", text: "[Drakul] What a horrible night to have a nurse.", delay: 5000 },
                        { color: "#ffffff", text: "THE END", speed: 200, align: "center", x: 512, y: 532, delay: 10000 }
                    ]);
                    this.pausable = false;
                    Playnewton.GPU.HUD.EnableLabel(this.skipLabel);
                    Playnewton.GPU.HUD.EnableLabel(this.dialogLabel);
                    this.state = TowerLevelState.FAMPIRE_DEAD;
                }
                break;
            case TowerLevelState.FAMPIRE_DEAD:
                if (this.dialog.done) {
                    this.state = TowerLevelState.END;
                    this.fadeoutToNextScene();
                }
                break;
        }
    }

    fadeoutToNextScene() {
        if (!this.fadeout) {
            let layers = [];
            for (let i = Z_ORDER.MIN; i <= Z_ORDER.MAX; ++i) {
                layers.push(i);
            }
            this.fadeout = new Fadeout(1000, layers, () => {
                this.Stop();
                this.nextScene = this.nextSceneOnExit;
                this.nextSceneOnExit.Start();
            });
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
