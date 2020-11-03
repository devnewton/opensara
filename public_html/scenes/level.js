import Scene from "./scene.js"
import Playnewton from "../playnewton.js"
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

export default class Level extends Scene {

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

    async InitSara() {
        await Sara.Preload();
    }

    async InitEnemies() {
        await Tatou.Preload();
        await Cat.Preload();
    }

    async InitCollectibles(map) {
        await Collectible.Preload();
        await Exit.Preload();
        await Heart.Preload();
        await Key.Preload();
        Playnewton.DRIVE.ForeachTmxMapObject(
                (object, objectgroup, x, y) => {
            if (object.tile) {
                switch (object.tile.properties.get("type")) {
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
                    case "sara":
                        if(!this.sara) {
                            this.sara = new Sara(x, y);
                        }
                        break;
                }
            }
        },
                map);

    }

    async InitMoutainLevels() {
        let skyBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/sky.png");

        let map = await Playnewton.DRIVE.LoadTmxMap("maps/mountain/mountain_01.tmx");

        let skySprite = Playnewton.GPU.GetAvailableSprite();
        Playnewton.GPU.SetSpritePicture(skySprite, Playnewton.GPU.CreatePicture(skyBitmap));
        Playnewton.GPU.SetSpritePosition(skySprite, 0, 0);
        Playnewton.GPU.EnableSprite(skySprite);

        Playnewton.PPU.SetWorldBounds(0, 0, 1024, 576);
        Playnewton.PPU.SetWorldGravity(0, 1);

        Playnewton.DRIVE.ConvertTmxMapToGPUSprites(Playnewton.GPU, map, 0, 0, Z_ORDER.BACKGROUND);
        Playnewton.DRIVE.ConvertTmxMapToPPUBodies(Playnewton.PPU, map, 0, 0);

        await this.InitCollectibles(map);

    }

    async InitHUD() {
        this.healthBar = Playnewton.GPU.HUD.GetAvailableBar();
        Playnewton.GPU.HUD.SetBarPosition(this.healthBar, 10, 10);
        Playnewton.GPU.HUD.SetBarSize(this.healthBar, this.sara.maxHealth);
        Playnewton.GPU.HUD.SetBarLevel(this.healthBar, this.sara.health);
        Playnewton.GPU.HUD.EnableBar(this.healthBar, true);

        this.poisonCounterLabel = Playnewton.GPU.HUD.GetAvailableLabel();
        Playnewton.GPU.HUD.SetLabelPosition(this.poisonCounterLabel, 150, 22);
        Playnewton.GPU.HUD.SetLabelText(this.poisonCounterLabel, "16💀");
        Playnewton.GPU.HUD.EnableLabel(this.poisonCounterLabel);

        this.itemsLabel = Playnewton.GPU.HUD.GetAvailableLabel();
        Playnewton.GPU.HUD.SetLabelPosition(this.itemsLabel, 200, 22);
        Playnewton.GPU.HUD.SetLabelText(this.itemsLabel, "");
        Playnewton.GPU.HUD.EnableLabel(this.itemsLabel);

        Playnewton.GPU.EnableHUD(true);
    }

    async Start() {
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

        await this.InitMoutainLevels();
        this.progress = 80;

        await this.InitHUD();
        this.progress = 90;

        this.poison = new Poison(this.sara);
        this.progress = 100;
    }

    UpdateBodies() {
        this.sara.UpdateBody();
        this.enemies.forEach((enemy) => enemy.UpdateBody());
    }

    UpdateSprites() {
        this.sara.UpdateSprite();
        this.enemies.forEach((enemy) => enemy.UpdateSprite());
        Playnewton.GPU.HUD.SetBarLevel(this.healthBar, this.sara.health);
        Playnewton.GPU.HUD.SetLabelText(this.poisonCounterLabel, `${this.poison.hurtCounter}💀`);
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
                this.exits.some((exit) => exit.OpenOneLock() )
                key.Free();
                return false;
            } else {
                return true;
            }
        });

        this.exits = this.exits.filter((exit) => {
            if (exit.Pursue(this.sara.sprite)) {
                exit.Free();
                return false;
            } else {
                return true;
            }
        });
    }
}
