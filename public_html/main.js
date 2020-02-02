class OpenSara {
    /**
     * 
     * @type Playnewton_DRIVE
     */
    DRIVE = new Playnewton_DRIVE();

    /**
     * 
     * @type Playnewton_GPU
     */
    GPU = new Playnewton_GPU();

    /**
     * 
     * @type Playnewton_PPU
     */
    PPU = new Playnewton_PPU();

    /**
     * 
     * @type Playnewton_CTRL
     */
    CTRL = new Playnewton_CTRL();

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

    async Start() {
        this.GPU.SetVideoOutput(document.getElementById('game'));
        await this.InitSara();
        await this.InitCollectibles();
        await this.InitMoutainLevels();

        let scale = 1;
        let angle = 0;

        let redraw = (timestamp) => {
            this.PPU.Update();

            this.CTRL.Poll();

            let pad = this.CTRL.GetPad(0);
            let rotateInc = 0;
            if (pad.left) {
                rotateInc = -0.04;
            } else if (pad.right) {
                rotateInc = 0.04;
            }

            let scaleInc = 0;
            if (pad.down) {
                scaleInc = -0.1;
            } else if (pad.up) {
                scaleInc = 0.1;
            }

            scale += scaleInc;
            angle += rotateInc;
            for (let z = 0; z < 16; ++z) {
                let layer = this.GPU.GetLayer(z);
                this.GPU.SetLayerRotozoom(layer, scale, angle);
            }

            this.GPU.SetSpritePosition(this.sara, this.saraBody.x, this.saraBody.y);
            this.GPU.DrawFrame(timestamp);
            requestAnimationFrame(redraw);
        };
        requestAnimationFrame(redraw);

    }

    async InitSara() {
        let saraBitmap = await this.DRIVE.LoadBitmap("sprites/sara.png");

        let spriteset = this.GPU.CreateSpriteset(saraBitmap, [
            {name: "stand", x: 1, y: 1, w: 32, h: 48},
            {name: "walk0", x: 35, y: 1, w: 32, h: 48},
            {name: "walk1", x: 70, y: 1, w: 32, h: 48},
            {name: "walk2", x: 104, y: 1, w: 32, h: 48}
        ]);
        let walkAnimation = this.GPU.CreateAnimation(spriteset, [{name: "walk0", delay: 500}, {name: "walk1", delay: 500}, {name: "walk2", delay: 500}]);

        this.sara = this.GPU.GetAvailableSprite();
        this.GPU.SetSpriteAnimation(this.sara, walkAnimation);
        this.GPU.SetSpriteZ(this.sara, 15);
        this.GPU.EnableSprite(this.sara);

        this.saraBody = this.PPU.GetAvailableBody();
        this.PPU.SetBodyRectangle(this.saraBody, 0, 0, 32, 48);
        this.PPU.SetBodyPosition(this.saraBody, 320, 180);
        this.PPU.SetBodyCollideWorldBounds(this.saraBody, true);
        this.PPU.EnableBody(this.saraBody);
    }

    async InitCollectibles() {
        let bitmap = await this.DRIVE.LoadBitmap("sprites/collectibles.png");

        let spriteset = this.GPU.CreateSpriteset(bitmap, [
            {name: "heart1", x: 0, y: 0, w: 32, h: 32},
            {name: "heart2", x: 32, y: 0, w: 32, h: 32},
            {name: "heart3", x: 64, y: 0, w: 32, h: 32},
            {name: "heart4", x: 96, y: 0, w: 32, h: 32},
            {name: "heart5", x: 128, y: 0, w: 32, h: 32},
            {name: "heart6", x: 160, y: 0, w: 32, h: 32},
            {name: "heart7", x: 192, y: 0, w: 32, h: 32}

        ]);
        let heartAnimation = this.GPU.CreateAnimation(spriteset, [
            {name: "heart1", delay: 100},
            {name: "heart2", delay: 100},
            {name: "heart3", delay: 100},
            {name: "heart4", delay: 100},
            {name: "heart5", delay: 100},
            {name: "heart6", delay: 100},
            {name: "heart7", delay: 100}
        ]);

        let heart = this.GPU.GetAvailableSprite();
        this.GPU.SetSpriteAnimation(heart, heartAnimation);
        this.GPU.SetSpriteZ(heart, 15);
        this.GPU.EnableSprite(heart);
        this.GPU.SetSpritePosition(heart, 200, 200);
    }

    async InitMoutainLevels() {
        let skyBitmap = await this.DRIVE.LoadBitmap("sprites/sky.png");

        let map = await this.DRIVE.LoadTmxMap("maps/mountain/mountain_01.tmx");

        let skySprite = this.GPU.GetAvailableSprite();
        this.GPU.SetSpritePicture(skySprite, this.GPU.CreatePicture(skyBitmap));
        this.GPU.SetSpritePosition(skySprite, 0, 0);
        this.GPU.EnableSprite(skySprite);

        this.PPU.SetWorldBounds(0, 0, 1024, 576);
        this.PPU.SetWorldGravity(10, 5);

        this.DRIVE.ConvertTmxMapToGPUSprites(this.GPU, map, 0, 0, 0);
    }
}



async function main() {
    let game = new OpenSara();
    game.Start();
}

main();

