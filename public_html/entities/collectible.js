import * as Playnewton from "../playnewton.js"

export default class Collectible {

    static async Preload() {
        Collectible.bitmap = await Playnewton.DRIVE.LoadBitmap("maps/collectibles/collectibles.png");
    }
}