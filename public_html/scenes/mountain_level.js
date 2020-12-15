import Scene from "./scene.js"
import * as Playnewton from "../playnewton.js"
import Sara from "../entities/sara.js"
import Collectible from "../entities/collectible.js"
import Exit from "../entities/exit.js"
import Heart from "../entities/heart.js"
import Key from "../entities/key.js"
import Poison from "../entities/poison.js"
import Tatou from "../entities/tatou.js"
import Enemy from "../entities/enemy.js"
import Z_ORDER from "../utils/z_order.js"
import Cat from "../entities/cat.js"
import Vulture from "../entities/vulture.js"
import Fadeout from "../entities/fadeout.js"
import { IngameMapKeyboardEventToPadButton } from "../utils/keyboard_mappings.js"

export default class MountainLevel extends Scene {

    /**
     * @type Sara
     */
    sara;

    /**
     * @type Heart[]
     */
    hearts = [];

    /**
     * @type Key[]
     */
    keys = [];

    /**
     * @type Exit[]
     */
    exits = [];

    /**
     * @type Playnewton.GPU_Bar
     */
    healthBar;

    /**
     * @type Playnewton.GPU_Label
     */
    poisonCounterLabel;

    /**
     * @type Playnewton.GPU_Label
     */
    itemsLabel;

    /**
     * @type Poison
     */
    poison;

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

    constructor(mapPath, nextSceneOnExit) {
        super();
        this.mapPath = mapPath;
        this.nextSceneOnExit = nextSceneOnExit;
    }

    async InitMapObjects(map) {
        await Collectible.Load();
        await Exit.Load();
        await Heart.Load();
        await Key.Load();
        Playnewton.DRIVE.ForeachTmxMapObject(
            (object, objectgroup, x, y) => {
                switch (object.type) {
                    case "exit":
                        let exit = new Exit();
                        Playnewton.GPU.SetSpritePosition(exit.sprite, x, y - exit.sprite.height);
                        this.exits.push(exit);
                        break;
                    case "heart":
                        let heart = new Heart();
                        Playnewton.GPU.SetSpritePosition(heart.sprite, x, y - heart.sprite.height);
                        this.hearts.push(heart);
                        break;
                    case "key":
                        let key = new Key();
                        Playnewton.GPU.SetSpritePosition(key.sprite, x, y - key.sprite.height);
                        this.keys.push(key);
                        break;
                    case "cat":
                        let cat = new Cat(x, y);
                        this.enemies.push(cat);
                        break;
                    case "tatou":
                        let tatou = new Tatou(x, y);
                        this.enemies.push(tatou);
                        break;
                    case "vulture":
                        let vulture = new Vulture(x, y);
                        this.enemies.push(vulture);
                        break;
                    case "sara":
                        if (!this.sara) {
                            this.sara = new Sara(x, y);
                        }
                        break;
                }
            },
            map);

    }

    async InitMap() {
        let map = await Playnewton.DRIVE.LoadTmxMap(this.mapPath);

        Playnewton.PPU.SetWorldBounds(0, 0, 1024, 576);
        Playnewton.PPU.SetWorldGravity(0, 1);

        Playnewton.DRIVE.ConvertTmxMapToGPUSprites(Playnewton.GPU, map, 0, 0, Z_ORDER.BACKGROUND);
        Playnewton.DRIVE.ConvertTmxMapToPPUBodies(Playnewton.PPU, map, 0, 0);

        await this.InitMapObjects(map);

        this.poison = new Poison(this.sara);
    }

    async InitHUD() {
        this.healthBar = Playnewton.GPU.HUD.CreateBar();
        Playnewton.GPU.HUD.SetBarPosition(this.healthBar, 10, 10);
        Playnewton.GPU.HUD.SetBarSize(this.healthBar, this.sara.maxHealth);
        Playnewton.GPU.HUD.SetBarLevel(this.healthBar, this.sara.health);
        Playnewton.GPU.HUD.EnableBar(this.healthBar, true);

        this.poisonCounterLabel = Playnewton.GPU.HUD.CreateLabel();
        Playnewton.GPU.HUD.SetLabelPosition(this.poisonCounterLabel, 150, 22);
        Playnewton.GPU.HUD.SetLabelText(this.poisonCounterLabel, "");
        Playnewton.GPU.HUD.EnableLabel(this.poisonCounterLabel);

        this.itemsLabel = Playnewton.GPU.HUD.CreateLabel();
        Playnewton.GPU.HUD.SetLabelPosition(this.itemsLabel, 200, 22);
        Playnewton.GPU.HUD.SetLabelText(this.itemsLabel, "");
        Playnewton.GPU.HUD.EnableLabel(this.itemsLabel);

        Playnewton.GPU.EnableHUD(true);
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
        this.progress = 30;

        await Tatou.Load();
        this.progress = 40;

        await Cat.Load();
        this.progress = 50;

        await Vulture.Load();
        this.progress = 60;

        await this.InitMap();
        this.progress = 80;

        await this.InitHUD();
        this.progress = 100;
    }

    Stop() {
        super.Stop();
        Sara.Unload();
        Tatou.Unload();
        Cat.Unload();
        Vulture.Unload();
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
                Playnewton.GPU.HUD.DisableLabel(this.poisonCounterLabel);
                Playnewton.GPU.HUD.DisableLabel(this.itemsLabel);
            });
        }
        this.sara.UpdateBody();
        this.enemies.forEach((enemy) => enemy.UpdateBody());
        if (this.poison) {
            this.poison.Update();
        }
    }

    UpdateSprites() {
        this.sara.UpdateSprite();
        this.enemies.forEach((enemy) => enemy.UpdateSprite());
        Playnewton.GPU.HUD.SetBarLevel(this.healthBar, this.sara.health);
        if (this.poison) {
            Playnewton.GPU.HUD.SetLabelText(this.poisonCounterLabel, `${this.poison.countDown}💀`);
        }
        Playnewton.GPU.HUD.SetLabelText(this.itemsLabel, "🔑".repeat(this.sara.nbKeys));

        this.enemies.forEach((enemy) => {
            this.sara.Stomp(enemy);
            enemy.Pursue(this.sara);
        });

        this.hearts = this.hearts.filter((heart) => {
            if (heart.Pursue(this.sara.sprite)) {
                this.sara.CollectOneHeart();
                heart.Free();
                return false;
            } else {
                return true;
            }
        });

        this.keys = this.keys.filter((key) => {
            if (key.Pursue(this.sara.sprite)) {
                this.sara.CollectOneKey();
                this.exits.some((exit) => exit.OpenOneLock())
                key.Free();
                return false;
            } else {
                return true;
            }
        });

        this.exits = this.exits.filter((exit) => {
            if (exit.Pursue(this.sara.sprite)) {
                exit.Free();
                if (!this.sara.dead && !this.fadeout) {
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
                return false;
            } else {
                return true;
            }
        });

        if (this.fadeout) {
            this.fadeout.Update();
        }
    }
}
