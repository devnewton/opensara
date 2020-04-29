import Scene from "./scene.js"
import Playnewton from "../playnewton.js"
import Sara from "../entities/sara.js"
import Collectible from "../entities/collectible.js"
import Heart from "../entities/heart.js"
import Key from "../entities/key.js"
import Poison from "../entities/poison.js"

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
     * @type Playnewton.GPU_Bar
     */
    healthBar;

    /**
     * @type Playnewton.GPU_Label
     */
    poisonCounterLabel;

    /**
     * @type Poison
     */
    poison;

    async InitSara() {
        await Sara.Preload();
        this.sara = new Sara();
        this.poison = new Poison(this.sara);
    }

    async InitCollectibles(map) {
        await Collectible.Preload();
        await Heart.Preload();
        await Key.Preload();
        Playnewton.DRIVE.ForeachTmxMapObject(
                (object, objectgroup, x, y) => {
            if (object.tile) {
                switch (object.tile.properties.get("type")) {
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

        Playnewton.DRIVE.ConvertTmxMapToGPUSprites(Playnewton.GPU, map, 0, 0, 0);
        Playnewton.DRIVE.ConvertTmxMapToPPUBodies(Playnewton.PPU, map, 0, 0);

        await this.InitCollectibles(map);

    }

    async InitHUD() {
        let hud = Playnewton.GPU.GetHUD();

        this.healthBar = hud.GetAvailableBar();
        hud.SetBarPosition(this.healthBar, 10, 10);
        hud.SetBarSize(this.healthBar, this.sara.maxHealth);
        hud.SetBarLevel(this.healthBar, this.sara.health);
        hud.EnableBar(this.healthBar, true);

        this.poisonCounterLabel = hud.GetAvailableLabel();
        hud.SetLabelPosition(this.poisonCounterLabel, 150, 22);
        hud.SetLabelText(this.poisonCounterLabel, "16💀");
        hud.EnableLabel(this.poisonCounterLabel);

        Playnewton.GPU.EnableHUD(hud, true);
    }

    async Start() {
        await this.InitSara();
        await this.InitMoutainLevels();
        await this.InitHUD();
    }

    UpdateBodies() {
        this.sara.UpdateBody();
    }

    UpdateSprites() {
        this.sara.UpdateSprite();
        let hud = Playnewton.GPU.GetHUD();
        hud.SetBarLevel(this.healthBar, this.sara.health);
        hud.SetLabelText(this.poisonCounterLabel, `${this.poison.hurtCounter}💀`);
        
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
                key.Free();
                return false;
            } else {
                return true;
            }
        });
    }
}
