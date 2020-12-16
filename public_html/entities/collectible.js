import * as Playnewton from "../playnewton.js"

export default class Collectible {

    /**
     * @type ImageBitmap
     */
    static bitmap;

    static async Load() {
        Collectible.bitmap = await Playnewton.DRIVE.LoadBitmap("maps/collectibles/collectibles.png");
    }

    static Unload() {
    }
}