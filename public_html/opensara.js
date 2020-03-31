import Playnewton from "./playnewton.js"
import Sara from "./entities/sara.js"
import Heart from "./entities/heart.js"

export default class OpenSara {

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

    async InitCollectibles() {
        await Heart.Preload();
        this.hearts.push(new Heart());
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
        
    }

    async Start() {
        Playnewton.GPU.SetVideoOutput(document.getElementById('game'));
        await this.InitSara();
        await this.InitCollectibles();
        await this.InitMoutainLevels();

        let angle = 0;

        let redraw = (timestamp) => {
            Playnewton.CTRL.Poll();

            let pad = Playnewton.CTRL.GetPad(0);
            let rotateInc = 0;
            if (pad.L) {
                rotateInc = -0.04;
            } else if (pad.R) {
                rotateInc = 0.04;
            }
            angle += rotateInc;
            for (let z = 0; z < 16; ++z) {
                let layer = Playnewton.GPU.GetLayer(z);
                Playnewton.GPU.SetLayerRotozoom(layer, 1, angle);
            }

            this.sara.UpdateBody();
            Playnewton.PPU.Update();

            this.sara.UpdateSprite();
            for(let heart of this.hearts) {
                heart.UpdateSprite();
            }
            Playnewton.GPU.DrawFrame(timestamp);
            Playnewton.PPU.DebugDraw(Playnewton.GPU.ctx);
            requestAnimationFrame(redraw);
        };
        requestAnimationFrame(redraw);
    }
}

async function main() {
    let game = new OpenSara();
    game.Start();
}
main();