async function main() {
    let DRIVE = new Playnewton_DRIVE();
    let bitmap = await DRIVE.LoadBitmap("sprites/sara.png");

    let map = await DRIVE.LoadTmxMap("maps/TileKit/TileKitDemo.tmx");
    console.log(map);

    let GPU = new Playnewton_GPU(100000);

    DRIVE.ConvertTmxMapToGPUSprites(GPU, map, 0, 0, 0)

    let spriteset = GPU.CreateSpriteset(bitmap, [
        {name: "stand", x: 1, y: 1, w: 32, h: 48},
        {name: "walk0", x: 35, y: 1, w: 32, h: 48},
        {name: "walk1", x: 70, y: 1, w: 32, h: 48},
        {name: "walk2", x: 104, y: 1, w: 32, h: 48}
    ]);
    let walkAnimation = GPU.CreateAnimation(spriteset, [{name: "walk0", delay: 500}, {name: "walk1", delay: 500}, {name: "walk2", delay: 500}]);

    let sara = GPU.GetAvailableSprite();
    GPU.SetSpriteAnimation(sara, walkAnimation);
    GPU.SetSpritePosition(sara, 640, 100);
    GPU.SetSpriteZ(sara, 15);
    GPU.EnableSprite(sara);

    let PPU = new Playnewton_PPU(100);
    PPU.SetWorldBounds(0, 0, 1280, 720);
    PPU.SetWorldGravity(-10, -5);
    let saraBody = PPU.GetAvailableBody();
    PPU.SetBodyPosition(saraBody, 640, 100);
    PPU.SetBodyCollideWorldBounds(saraBody, true);
    PPU.EnableBody(saraBody);

    GPU.SetVideoOutput(document.getElementById('game'));
    

    let CTRL = new Playnewton_CTRL();

    let scale = 1;
    let rotate = 0.01;

    function redraw(timestamp) {
        PPU.Update();

        CTRL.Poll();

        let pad = CTRL.GetPad(0);
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
        rotate += rotateInc;
        for (let z = 0; z < 15; ++z) {
            let layer = GPU.GetLayer(z);
            GPU.SetLayerRotozoom(layer, scale, rotate);
        }

        //GPU.SetSpriteRotozoom(sara, scale, rotate);
        GPU.SetSpritePosition(sara, saraBody.x, saraBody.y);
        GPU.DrawFrame(timestamp);
        requestAnimationFrame(redraw);
    }
    requestAnimationFrame(redraw);
}

main();

