import Scene from "./scene.js"
import * as Playnewton from "../playnewton.js"
import Sara from "../entities/sara.js"
import Enemy from "../entities/enemy.js"
import Z_ORDER from "../utils/z_order.js"
import Fadeout from "../entities/fadeout.js"
import Lava from "../entities/lava.js"

export default class TowerLevel extends Scene {

    /**
     * @type Sara
     */
    sara;

    /**
     * @type Lava
     */
    lava;

    /**
     * @type Playnewton.GPU_Bar
     */
    healthBar;

    /**
     * @type Array<Enemy>
     */
    enemies = [];

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

    skipIntroController = new Playnewton.CLOCK_SkipController();

    constructor(mapPath, nextSceneOnExit) {
        super();
        this.mapPath = mapPath;
        this.nextSceneOnExit = nextSceneOnExit;
    }

    async InitSara() {
        await Sara.Preload();
    }

    async InitEnemies() {
    }

    async InitMap() {
        let map = await Playnewton.DRIVE.LoadTmxMap(this.mapPath);

        Playnewton.PPU.SetWorldBounds(0, 0, 32 * 32, 152 * 32);
        Playnewton.PPU.SetWorldGravity(0, 1);

        Playnewton.DRIVE.ConvertTmxMapToGPUSprites(Playnewton.GPU, map, 0, 0, Z_ORDER.BACKGROUND);
        Playnewton.DRIVE.ConvertTmxMapToPPUBodies(Playnewton.PPU, map, 0, 0);

        await this.InitMapObjects(map);
    }

    async InitMapObjects(map) {
        Playnewton.DRIVE.ForeachTmxMapObject(
            (object, objectgroup, x, y) => {
                let type = object.type || (object.tile && object.tile.properties.get("type"));
                switch (type) {
                    case "sara":
                        if (!this.sara) {
                            this.sara = new Sara(x, y);
                            this.sara.Wait();
                        }
                        break;
                    case "lava":
                        if (!this.lava) {
                            this.lava = new Lava(Playnewton.GPU.GetLayer(objectgroup.z), object.y + objectgroup.y);
                        }
                    default:
                        break;
                }
            },
            map);

    }


    async InitHUD() {
        this.healthBar = Playnewton.GPU.HUD.CreateBar();
        Playnewton.GPU.HUD.SetBarPosition(this.healthBar, 10, 10);
        Playnewton.GPU.HUD.SetBarSize(this.healthBar, this.sara.maxHealth);
        Playnewton.GPU.HUD.SetBarLevel(this.healthBar, this.sara.health);
        Playnewton.GPU.HUD.EnableBar(this.healthBar, true);

        Playnewton.GPU.EnableHUD(true);
    }

    async Start() {
        await super.Start();

        this.progress = 0;

        for (let z = Z_ORDER.MIN; z <= Z_ORDER.MAX; ++z) {
            let layer = Playnewton.GPU.GetLayer(z);
            Playnewton.GPU.EnableLayer(layer);
        }
        this.progress = 20;

        await this.InitSara();
        this.progress = 40;

        await this.InitEnemies();
        this.progress = 50;

        await this.InitMap();
        this.progress = 80;

        await this.InitHUD();
        this.progress = 100;

        this.IntroDialog();
    }

    async IntroDialog() {
        let skipLabel = Playnewton.GPU.HUD.CreateLabel();
        Playnewton.GPU.HUD.SetLabelFont(skipLabel, "bold 12px monospace");
        Playnewton.GPU.HUD.SetLabelAlign(skipLabel, "right");
        Playnewton.GPU.HUD.SetLabelPosition(skipLabel, 1024, 564);
        Playnewton.GPU.HUD.SetLabelColor(skipLabel, "#eeeeee");
        Playnewton.GPU.HUD.SetLabelText(skipLabel, "Skip with ⌨️F1 or 🎮start");
        Playnewton.GPU.HUD.EnableLabel(skipLabel);

        let label = Playnewton.GPU.HUD.CreateLabel();
        Playnewton.GPU.HUD.SetLabelFont(label, "bold 32px monospace");
        Playnewton.GPU.HUD.SetLabelAlign(label, "left");
        Playnewton.GPU.HUD.SetLabelPosition(label, 8, 550);
        Playnewton.GPU.HUD.EnableLabel(label);

        try {
            Playnewton.GPU.HUD.SetLabelColor(label, "#8fffff");
            await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Sara] Hello ? It's raining outside...", 50, this.skipIntroController.signal);
            await Playnewton.delay(2000);
            await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Sara] Can I stay here for the night ?", 50, this.skipIntroController.signal);
            await Playnewton.delay(2000);
            Playnewton.GPU.HUD.SetLabelColor(label, "#e0befb");
            await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Drakul] Please do, the lava will warm up your body.", 50, this.skipIntroController.signal);
            await Playnewton.delay(2000);
            Playnewton.GPU.HUD.SetLabelColor(label, "#8fffff");
            await Playnewton.GPU.HUD.StartLabelTypewriterEffect(label, "[Sara] What lava ?", 50, this.skipIntroController.signal);
            await Playnewton.delay(2000);
        } catch (e) {
            if( !(e instanceof Playnewton.CLOCK_SkipException) ) {
                throw e;
            }
        }
        finally {
            Playnewton.GPU.HUD.DisableLabel(label);
            Playnewton.GPU.HUD.DisableLabel(skipLabel);

            this.sara.StopWaiting();
            this.lava.Erupt();
        }
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
        this.enemies.forEach((enemy) => enemy.UpdateBody());
    }

    UpdateSprites() {
        let pad = Playnewton.CTRL.GetPad(0);
        if (pad.start) {
            this.skipIntroController.skip();
        }


        this.lava.UpdateSprite();
        this.sara.UpdateSprite();

        let scrollY = -this.sara.sprite.y + 288;
        scrollY = Math.max(scrollY, -152 * 32 + 576);
        Playnewton.GPU.SetScroll(0, scrollY);

        this.enemies.forEach((enemy) => enemy.UpdateSprite());
        Playnewton.GPU.HUD.SetBarLevel(this.healthBar, this.sara.health);

        this.enemies.forEach((enemy) => {
            this.sara.Stomp(enemy);
            enemy.Pursue(this.sara);
        });

        if (this.fadeout) {
            this.fadeout.Update();
        }
    }
}
