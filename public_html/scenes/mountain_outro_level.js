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

    skipOutroController = new Playnewton.CLOCK_SkipController();

    constructor(mapPath, nextSceneOnExit) {
        super();
        this.mapPath = mapPath;
        this.nextSceneOnExit = nextSceneOnExit;
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

        this.InitSkipLabel();
        this.progress = 100;
    }

    Stop() {
        super.Stop();
        Sara.Unload();
        Witch.Unload();
        Collectible.Unload();
        Flower.Unload();
    }

    InitSkipLabel() {
        let label = Playnewton.GPU.HUD.CreateLabel()
        Playnewton.GPU.HUD.SetLabelFont(label, "bold 12px monospace")
        Playnewton.GPU.HUD.SetLabelAlign(label, "right")
        Playnewton.GPU.HUD.SetLabelPosition(label, 1024, 564)
        Playnewton.GPU.HUD.SetLabelColor(label, "#eeeeee")
        Playnewton.GPU.HUD.SetLabelText(label, "Skip with ⌨️enter or 🎮start")
        Playnewton.GPU.HUD.EnableLabel(label)
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
        if (this.flowers.length === 0 && !this.hueRotate) {
            let layers = [];
            for (let i = Z_ORDER.MIN; i <= Z_ORDER.MAX; ++i) {
                layers.push(i);
            }
            this.hueRotate = new HueRotate(layers, async () => {
                try {
                    this.witch.fly();
                    let label = Playnewton.GPU.HUD.CreateLabel();
                    Playnewton.GPU.HUD.SetLabelFont(label, "bold 32px monospace");

                    Playnewton.GPU.HUD.SetLabelAlign(label, "left");
                    Playnewton.GPU.HUD.SetLabelPosition(label, 32, 532);
                    Playnewton.GPU.HUD.EnableLabel(label);

                    Playnewton.GPU.HUD.SetLabelColor(label, "#e0befb");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Witch] Sara ! You found the flower !", 50, this.skipOutroController.signal);
                    await Playnewton.CLOCK.delay(2000, this.skipOutroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#8fffff");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Sara] Am I cured ?", 50, this.skipOutroController.signal);
                    await Playnewton.CLOCK.delay(2000, this.skipOutroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#e0befb");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Witch] Yes ! No need for a prince charming !", 50, this.skipOutroController.signal);
                    await Playnewton.CLOCK.delay(2000, this.skipOutroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#8fffff");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Sara] You can invoke a prince charming ?", 50, this.skipOutroController.signal);
                    await Playnewton.CLOCK.delay(2000, this.skipOutroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#e0befb");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Witch] No, but I can disappear.", 50, this.skipOutroController.signal);
                    await Playnewton.CLOCK.delay(2000, this.skipOutroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#8fffff");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Sara] By running away ?", 50, this.skipOutroController.signal);
                    await Playnewton.CLOCK.delay(2000, this.skipOutroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#e0befb");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Witch] Oh you know the trick...", 50, this.skipOutroController.signal);
                    await Playnewton.CLOCK.delay(2000, this.skipOutroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#ffffff");
                    Playnewton.GPU.HUD.SetLabelPosition(label, 512, 532);
                    Playnewton.GPU.HUD.SetLabelAlign(label, "center");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "THE END", 200, 50, this.skipOutroController.signal);
                    await Playnewton.CLOCK.delay(2000, this.skipOutroController.signal);
                    this.witch.flee();
                } catch (e) {
                    if (!(e instanceof Playnewton.CLOCK_SkipException)) {
                        throw e;
                    }
                } finally {
                    this.fadeoutToNextLevel();
                }
            });
        }

        let pad = Playnewton.CTRL.GetPad(0);
        if (pad.startWasNotPressed && pad.start) {
            this.fadeoutToNextLevel();
            this.skipOutroController.skip();
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
