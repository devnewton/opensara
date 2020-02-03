import Playnewton from "./playnewton.js"

export class OpenSara {
    /**
     * 
     * @type GPU_Sprite
     */
    sara;

    /**
     * 
     * @type PPU_Body
     */
    saraBody;

    async InitSara() {
        let saraBitmap = await Playnewton.DRIVE.LoadBitmap("sprites/sara.png");

        let spriteset = Playnewton.GPU.CreateSpriteset(saraBitmap, [
            {name: "stand", x: 1, y: 1, w: 32, h: 48},
            {name: "walk0", x: 35, y: 1, w: 32, h: 48},
            {name: "walk1", x: 70, y: 1, w: 32, h: 48},
            {name: "walk2", x: 104, y: 1, w: 32, h: 48}
        ]);
        let walkAnimation = Playnewton.GPU.CreateAnimation(spriteset, [{name: "walk0", delay: 100}, {name: "walk1", delay: 100}, {name: "walk2", delay: 100}]);

        this.sara = Playnewton.GPU.GetAvailableSprite();
        Playnewton.GPU.SetSpriteAnimation(this.sara, walkAnimation);
        Playnewton.GPU.SetSpriteZ(this.sara, 15);
        Playnewton.GPU.EnableSprite(this.sara);

        this.saraBody = Playnewton.PPU.GetAvailableBody();
        Playnewton.PPU.SetBodyRectangle(this.saraBody, 0, 0, 32, 48);
        Playnewton.PPU.SetBodyPosition(this.saraBody, 320, 180);
        Playnewton.PPU.SetBodyCollideWorldBounds(this.saraBody, true);
        Playnewton.PPU.EnableBody(this.saraBody);
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
        Playnewton.PPU.SetWorldGravity(0, 5);

        Playnewton.DRIVE.ConvertTmxMapToGPUSprites(Playnewton.GPU, map, 0, 0, 0);
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

            this.saraBody.velocity.x = (pad.left && -1) || (pad.right && 1) || 0;
            Playnewton.PPU.Update();

            Playnewton.GPU.SetSpritePosition(this.sara, this.saraBody.position.x, this.saraBody.position.y);
            Playnewton.GPU.DrawFrame(timestamp);
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