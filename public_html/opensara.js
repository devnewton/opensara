import Playnewton from "./playnewton.js"
import Sara from "./entities/sara.js"

export default class OpenSara {

    /**
     * @type Sara
     */
    sara;
    
    async InitSara() {
        await Sara.Preload();
        this.sara = new Sara();
    }

    async InitCollectibles() {
        let bitmap = await Playnewton.DRIVE.LoadBitmap("sprites/collectibles.png");

        let spriteset = Playnewton.GPU.CreateSpriteset(bitmap, [
            {name: "heart1", x: 0, y: 0, w: 32, h: 32},
            {name: "heart2", x: 32, y: 0, w: 32, h: 32},
            {name: "heart3", x: 64, y: 0, w: 32, h: 32},
            {name: "heart4", x: 96, y: 0, w: 32, h: 32},
            {name: "heart5", x: 128, y: 0, w: 32, h: 32},
            {name: "heart6", x: 160, y: 0, w: 32, h: 32},
            {name: "heart7", x: 192, y: 0, w: 32, h: 32}

        ]);
        let heartAnimation = Playnewton.GPU.CreateAnimation(spriteset, [
            {name: "heart1", delay: 100},
            {name: "heart2", delay: 100},
            {name: "heart3", delay: 100},
            {name: "heart4", delay: 100},
            {name: "heart5", delay: 100},
            {name: "heart6", delay: 100},
            {name: "heart7", delay: 100}
        ]);

        let heart = Playnewton.GPU.GetAvailableSprite();
        Playnewton.GPU.SetSpriteAnimation(heart, heartAnimation);
        Playnewton.GPU.SetSpriteZ(heart, 15);
        Playnewton.GPU.EnableSprite(heart);
        Playnewton.GPU.SetSpritePosition(heart, 200, 200);
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