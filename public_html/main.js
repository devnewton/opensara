async function main() {

    let gameCanvas = document.getElementById('game');

    let TLN = new TLN_Engine(100);
    let bitmap = await TLN.LoadBitmap("sprites/sara.png");
    let spriteset = await TLN.CreateSpriteset(bitmap, [{name: "stand", x: 1, y: 1, w: 32, h: 48}]);

    let sara = TLN.GetAvailableSprite();
    TLN.SetSpriteSet(sara, spriteset);

    TLN.SetSpritePicture(sara, TLN.FindPictureEntryByName(spriteset, "stand"));
    TLN.SetSpritePosition(sara, 0, 0);
    TLN.EnableSprite(sara);

    TLN.SetRenderTarget(gameCanvas.getContext("2d"));

    function redraw(timestamp) {
        TLN.DrawFrame(timestamp);
        requestAnimationFrame(redraw);
    }
    requestAnimationFrame(redraw);
}

main();