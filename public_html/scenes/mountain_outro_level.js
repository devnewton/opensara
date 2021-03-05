import Scene from "./scene.js"
import * as Playnewton from "../playnewton.js"
import Sara from "../entities/sara.js"
import Collectible from "../entities/collectible.js"
import Flower from "../entities/flower.js"
import Z_ORDER from "../utils/z_order.js"
import Fadeout from "../entities/fadeout.js"
import HueRotate from "../entities/huerotate.js"
import Witch from "../entities/witch.js"
import { IngameMapKeyboardEventToPadButton } from "../utils/keyboard_mappings.js"
import { Dialog } from "../entities/dialog.js"

export default class MountainOutroLevel extends Scene {

    /**
     * @type Sara
     */
    sara;

    /**
     * @type Witch
     */
    witch;

    /**
     * @type Flower[]
     */
    flowers = [];

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
     * @type HueRotate
     */
    hueRotate;

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

    async InitCollectibles(map) {
        Playnewton.DRIVE.ForeachTmxMapObject(
            (object, objectgroup, x, y) => {
                switch (object.type) {
                    case "sara":
                        if (!this.sara) {
                            this.sara = new Sara(x, y);
                        }
                        break;
                    case "flower":
                        let flower = new Flower(x, y);
                        this.flowers.push(flower);
                        break;
                    case "witch":
                        if (!this.witch) {
                            this.witch = new Witch(x, y);
                        }
                        break;
                }
            },
            map);

    }

    async InitMountainOutroLevels() {
        let map = await Playnewton.DRIVE.LoadTmxMap(this.mapPath);

        Playnewton.PPU.SetWorldBounds(0, 0, 1024, 576);
        Playnewton.PPU.SetWorldGravity(0, 1);

        Playnewton.DRIVE.ConvertTmxMapToGPUSprites(Playnewton.GPU, map, 0, 0, Z_ORDER.BACKGROUND);
        Playnewton.DRIVE.ConvertTmxMapToPPUBodies(Playnewton.PPU, map, 0, 0);

        await this.InitCollectibles(map);
    }

    async Start() {
        await super.Start();

        Playnewton.CTRL.MapKeyboardEventToPadButton = IngameMapKeyboardEventToPadButton;

        this.progress = 0;
        this.hueRotate = null;
        this.fadeout = null;

        for (let z = Z_ORDER.MIN; z <= Z_ORDER.MAX; ++z) {
            let layer = Playnewton.GPU.GetLayer(z);
            Playnewton.GPU.EnableLayer(layer);
        }
        this.progress = 20;

        await Sara.Load();
        this.progress = 50;

        await Witch.Load();
        this.properties = 60;

        await Collectible.Load();
        this.properties = 70;

        await Flower.Load();
        this.properties = 80;

        await this.InitMountainOutroLevels();
        this.progress = 90;

        this.InitLabels();
        this.progress = 100;
    }

    Stop() {
        super.Stop();
        Sara.Unload();
        Witch.Unload();
        Collectible.Unload();
        Flower.Unload();
    }

    InitLabels() {
        let skipLabel = Playnewton.GPU.HUD.CreateLabel();
        Playnewton.GPU.HUD.SetLabelFont(skipLabel, "bold 12px monospace");
        Playnewton.GPU.HUD.SetLabelAlign(skipLabel, "right");
        Playnewton.GPU.HUD.SetLabelPosition(skipLabel, 1024, 564);
        Playnewton.GPU.HUD.SetLabelColor(skipLabel, "#eeeeee");
        Playnewton.GPU.HUD.SetLabelText(skipLabel, "Skip with ⌨️enter or 🎮start");
        Playnewton.GPU.HUD.EnableLabel(skipLabel);

        this.dialogLabel = Playnewton.GPU.HUD.CreateLabel();
        Playnewton.GPU.HUD.SetLabelFont(this.dialogLabel, "bold 32px monospace");
        Playnewton.GPU.HUD.SetLabelAlign(this.dialogLabel, "left");
        Playnewton.GPU.HUD.SetLabelPosition(this.dialogLabel, 32, 532);
        Playnewton.GPU.HUD.SetLabelText(this.dialogLabel, "");
        Playnewton.GPU.HUD.EnableLabel(this.dialogLabel);
    }

    UpdateBodies() {
        this.sara.UpdateBody();
        this.witch.UpdateBody();
    }

    UpdateSprites() {
        this.sara.UpdateSprite();
        this.witch.UpdateSprite();

        this.witch.Pursue(this.sara);

        this.flowers = this.flowers.filter((flower) => {
            if (flower.Pursue(this.sara.sprite)) {
                flower.Free();
                return false;
            } else {
                return true;
            }
        });

        this.dialog.Update(this.dialogLabel);
        if(this.dialog.done) {
            this.witch.flee();
        }

        if (this.flowers.length === 0 && !this.hueRotate) {
            let layers = [];
            for (let i = Z_ORDER.MIN; i <= Z_ORDER.MAX; ++i) {
                layers.push(i);
            }
            this.hueRotate = new HueRotate(layers, () => {
                    this.witch.fly();
                    this.dialog.Start([
                        { color: "#e0befb", text: "[Witch] Sara ! You found the flower !" },
                        { color: "#8fffff", text: "[Sara] Am I cured ?" },
                        { color: "#e0befb", text: "[Witch] Yes ! No need for a prince charming !" },
                        { color: "#8fffff", text: "[Sara] You can invoke a prince charming ?" },
                        { color: "#e0befb", text: "[Witch] No, but I can disappear." },
                        { color: "#8fffff", text: "[Sara] By running away ?" },
                        { color: "#e0befb", text: "[Witch] Oh you know the trick..." },
                        { color: "#ffffff", text: "THE END", speed: 200, align: "center", x: 512, y: 532, delay: 10000 }
                    ]);
                });
        }

        let pad = Playnewton.CTRL.GetMasterPad();
        if (pad.TestStartAndResetIfPressed()) {
            this.fadeoutToNextLevel();
        }

        if (this.hueRotate) {
            this.hueRotate.Update();
        }

        if (this.fadeout) {
            this.fadeout.Update();
        }
    }

    fadeoutToNextLevel() {
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
}
