import Scene from "./scene.js"
import Playnewton from "../playnewton.js"
import Sara from "../entities/sara.js"
import Collectible from "../entities/collectible.js"
import Exit from "../entities/exit.js"
import Heart from "../entities/heart.js"
import Key from "../entities/key.js"
import Apple from "../entities/apple.js"
import Poison from "../entities/poison.js"
import Tatou from "../entities/tatou.js"
import Enemy from "../entities/enemy.js"
import Z_ORDER from "../utils/z_order.js"
import Cat from "../entities/cat.js"
import Vulture from "../entities/vulture.js"
import Fadeout from "../entities/fadeout.js"
import HueRotate from "../entities/huerotate.js"

export default class MoutainIntroLevel extends Scene {

    /**
     * @type Sara
     */
    sara;

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

    constructor(mapPath, nextSceneOnExit) {
        super();
        this.mapPath = mapPath;
        this.nextSceneOnExit = nextSceneOnExit;
    }

    async InitSara() {
        await Sara.Preload();
    }

    async InitCollectibles(map) {
        await Collectible.Preload();
        await Apple.Preload();
        Playnewton.DRIVE.ForeachTmxMapObject(
                (object, objectgroup, x, y) => {
            if (object.tile) {
                switch (object.tile.properties.get("type")) {
                    case "sara":
                        if(!this.sara) {
                            this.sara = new Sara(x, y);
                        }
                        break;
                    case "apple":
                        let apple = new Apple(x, y);
                        this.apples.push(apple);
                        break;
                }
            }
        },
                map);

    }

    async InitMoutainIntroLevels() {
        let skyBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/sky.png");

        let map = await Playnewton.DRIVE.LoadTmxMap(this.mapPath);

        let skySprite = Playnewton.GPU.CreateSprite();
        Playnewton.GPU.SetSpritePicture(skySprite, Playnewton.GPU.CreatePicture(skyBitmap));
        Playnewton.GPU.SetSpritePosition(skySprite, 0, 0);
        Playnewton.GPU.EnableSprite(skySprite);

        Playnewton.PPU.SetWorldBounds(0, 0, 1024, 576);
        Playnewton.PPU.SetWorldGravity(0, 1);

        Playnewton.DRIVE.ConvertTmxMapToGPUSprites(Playnewton.GPU, map, 0, 0, Z_ORDER.BACKGROUND);
        Playnewton.DRIVE.ConvertTmxMapToPPUBodies(Playnewton.PPU, map, 0, 0);

        await this.InitCollectibles(map);
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
        this.progress = 50;

        await this.InitMoutainIntroLevels();
        this.progress = 100;
    }

    UpdateBodies() {
        this.sara.UpdateBody();
    }

    UpdateSprites() {
        this.sara.UpdateSprite();

        this.apples = this.apples.filter((apple) => {
            if (apple.Pursue(this.sara.sprite)) {
                apple.Free();
                return false;
            } else {
                return true;
            }
        });
        if(this.apples.length === 0 && !this.hueRotate) {
            let layers = [];
            for (let i = Z_ORDER.MIN; i <= Z_ORDER.MAX; ++i) {
                layers.push(i);
            }
            this.hueRotate = new HueRotate(layers, () => {
                //TODO
            });
        }

        if(this.hueRotate) {
            this.hueRotate.Update();
        }

        if(this.fadeout) {
            this.fadeout.Update();
        }
    }
}
