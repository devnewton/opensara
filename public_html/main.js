async function main() {

    let gameCanvas = document.getElementById('game');

    let TLN = new TLN_Engine(100);
    let bitmap = await TLN.LoadBitmap("sprites/sara.png");
    let spriteset = await TLN.CreateSpriteset(bitmap, [
        {name: "stand", x: 1, y: 1, w: 32, h: 48},
        {name: "walk0", x: 35, y: 1, w: 32, h: 48},
        {name: "walk1", x: 70, y: 1, w: 32, h: 48},
        {name: "walk2", x: 35, y: 1, w: 32, h: 48}
    ]);

    let sara = TLN.GetAvailableSprite();
    //TLN.SetSpritePicture(sara, TLN.FindPictureByName(spriteset, "stand"));
    let walkAnimation = TLN.CreateAnimation(spriteset, [{name: "walk0", delay: 500}, {name: "walk1", delay: 500}, {name: "walk2", delay: 500}]);
    TLN.SetSpriteAnimation(sara, walkAnimation);
    TLN.SetSpritePosition(sara, 0, 0);
    TLN.EnableSprite(sara);

    let ctx = gameCanvas.getContext("2d");
    TLN.SetRenderTarget(ctx);

    let fpsLimiter = new FPS_Limiter();

    function redraw(timestamp) {
        if (fpsLimiter.ShouldDraw()) {
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            TLN.DrawFrame(timestamp);
        }
        requestAnimationFrame(redraw);
    }
    requestAnimationFrame(redraw);
}

main();

