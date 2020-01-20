async function main() {
    let DRIVE = new Playnewton_DRIVE();
    let bitmap = await DRIVE.LoadBitmap("sprites/sara.png");
    
    let map = await DRIVE.LoadTmxMap("maps/TileKit/TileKitDemo.tmx");
    console.log(map);

    let GPU = new Playnewton_GPU(100000);
    
    DRIVE.ConvertTmxMapToGPUSprites(GPU, map)
    
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
    GPU.EnableSprite(sara);

    GPU.SetVideoOutput(document.getElementById('game'));

    let CTRL = new Playnewton_CTRL();

    let scale = 1;
    let rotate = 0.01;
    function redraw(timestamp) {
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
        GPU.SetSpriteRotozoom(sara, scale, rotate);
        GPU.DrawFrame(timestamp);
        requestAnimationFrame(redraw);
    }
    requestAnimationFrame(redraw);
}

main();

