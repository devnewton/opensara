import Scene from "./scene.js"
import Playnewton from "../playnewton.js"
import Sara from "../entities/sara.js"
import Heart from "../entities/heart.js"

export default class Level extends Scene {

    /**
     * @type Sara
     */
    sara;

    /**
     * @type Heart[]
     */
    hearts = [];

    async InitSara() {
        await Sara.Preload();
        this.sara = new Sara();
    }

    async InitCollectibles(map) {
        await Heart.Preload();
        Playnewton.DRIVE.ForeachTmxMapObject(
                (object, objectgroup, x, y) => {
            if (object.tile && object.tile.properties.get("type") === "heart") {
                let heart = new Heart();
                Playnewton.GPU.SetSpritePosition(heart.sprite, x, y - heart.sprite.height);
                this.hearts.push(heart);
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

    async Start() {
        await this.InitSara();
        await this.InitMoutainLevels();
    }

    UpdateBodies() {
        this.sara.UpdateBody();
    }

    UpdateSprites() {
        this.sara.UpdateSprite();
        this.hearts = this.hearts.filter((heart) => {
            if (heart.Pursue(this.sara.sprite)) {
                this.sara.CollectOneHeart();
                heart.Free();
                return false;
            } else {
                return true;
            }
        });
    }
}
