import Scene from "./scene.js"
import * as Playnewton from "../playnewton.js"
import Sara from "../entities/sara.js"
import Collectible from "../entities/collectible.js"
import Apple from "../entities/apple.js"
import Z_ORDER from "../utils/z_order.js"
import Fadeout from "../entities/fadeout.js"
import HueRotate from "../entities/huerotate.js"
import Witch from "../entities/witch.js"
import {IngameMapKeyboardEventToPadButton} from "../utils/keyboard_mappings.js";


export default class MountainIntroLevel extends Scene {

    /**
     * @type Sara
     */
    sara;

    /**
     * @type Witch
     */
    witch;

    /**
     * @type Apple[]
     */
    apples = [];

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

    skipIntroController = new Playnewton.CLOCK_SkipController();

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
                        case "apple":
                            let apple = new Apple(x, y);
                            this.apples.push(apple);
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

    async InitMountainIntroLevels() {
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

        await Sara.Load();;
        this.progress = 50;

        await Witch.Load();
        this.properties = 60;

        await Collectible.Load();
        this.properties = 70;

        await Apple.Load();
        this.properties = 80;

        await this.InitMountainIntroLevels();
        this.progress = 90;

        this.InitSkipLabel();
        this.progress = 100;
    }

    Stop() {
        super.Stop();
        Sara.Unload();
        Witch.Unload();
        Collectible.Unload();
        Apple.Unload();
    }

    InitSkipLabel() {
        let label = Playnewton.GPU.HUD.CreateLabel();
        Playnewton.GPU.HUD.SetLabelFont(label, "bold 12px monospace");
        Playnewton.GPU.HUD.SetLabelAlign(label, "right");
        Playnewton.GPU.HUD.SetLabelPosition(label, 1024, 564);
        Playnewton.GPU.HUD.SetLabelColor(label, "#eeeeee");
        Playnewton.GPU.HUD.SetLabelText(label, "Skip with ⌨️enter or 🎮start");
        Playnewton.GPU.HUD.EnableLabel(label);
    }

    UpdateBodies() {
        this.sara.UpdateBody();
        this.witch.UpdateBody();
    }

    UpdateSprites() {
        this.sara.UpdateSprite();
        this.witch.UpdateSprite();

        this.witch.Pursue(this.sara);

        this.apples = this.apples.filter((apple) => {
            if (apple.Pursue(this.sara.sprite)) {
                apple.Free();
                return false;
            } else {
                return true;
            }
        });
        if (this.apples.length === 0 && !this.hueRotate) {
            let layers = [];
            for (let i = Z_ORDER.MIN; i <= Z_ORDER.MAX; ++i) {
                layers.push(i);
            }
            this.hueRotate = new HueRotate(layers, async () => {
                this.witch.fly();
                let label = Playnewton.GPU.HUD.CreateLabel();
                Playnewton.GPU.HUD.SetLabelFont(label, "bold 32px monospace");

                Playnewton.GPU.HUD.SetLabelAlign(label, "left");
                Playnewton.GPU.HUD.SetLabelPosition(label, 32, 532);
                Playnewton.GPU.HUD.EnableLabel(label);

                try {
                    Playnewton.GPU.HUD.SetLabelColor(label, "#e0befb");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Witch] Sara ! You just ate my poisoned apples !", 50, this.skipIntroController.signal);
                    await Playnewton.CLOCK.Delay(2000, this.skipIntroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#8fffff");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Sara] What? Why do you poison apples ?", 50, this.skipIntroController.signal);
                    await Playnewton.CLOCK.Delay(2000, this.skipIntroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#e0befb");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Witch] No time to explain. Do you want to live ?", 50, this.skipIntroController.signal);
                    await Playnewton.CLOCK.Delay(2000, this.skipIntroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#8fffff");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Sara] Sure !", 50, this.skipIntroController.signal);
                    await Playnewton.CLOCK.Delay(2000, this.skipIntroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#e0befb");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Witch] You need a magic flower to cure you.", 50, this.skipIntroController.signal);
                    await Playnewton.CLOCK.Delay(2000, this.skipIntroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#8fffff");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Sara] Where does this magic flower grow?", 50, this.skipIntroController.signal);
                    await Playnewton.CLOCK.Delay(2000, this.skipIntroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#e0befb");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Witch] Find magic keys to open magic signs.", 50, this.skipIntroController.signal);
                    await Playnewton.CLOCK.Delay(2000, this.skipIntroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#8fffff");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Sara] That's magic bullshit !", 50, this.skipIntroController.signal);
                    await Playnewton.CLOCK.Delay(2000, this.skipIntroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#e0befb");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Witch] Do you want to live ?", 50, this.skipIntroController.signal);
                    await Playnewton.CLOCK.Delay(2000, this.skipIntroController.signal);
                    Playnewton.GPU.HUD.SetLabelColor(label, "#8fffff");
                    await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Sara] Ok...", 50, this.skipIntroController.signal);
                    await Playnewton.CLOCK.Delay(2000, this.skipIntroController.signal);
                } catch (e) {
                    if( !(e instanceof Playnewton.CLOCK_SkipException) ) {
                        throw e;
                    }
                } finally {
                    this.fadeoutToNextLevel();
                }
            });
        }

        let pad = Playnewton.CTRL.GetMasterPad();
        if (pad.TestStartAndResetIfPressed()) {
            this.fadeoutToNextLevel();
            this.skipIntroController.skip();
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
