async function main() {

    let GPU = new Playnewton_GPU(100);
    let bitmap = await GPU.LoadBitmap("sprites/sara.png");
    let spriteset = await GPU.CreateSpriteset(bitmap, [
        {name: "stand", x: 1, y: 1, w: 32, h: 48},
        {name: "walk0", x: 35, y: 1, w: 32, h: 48},
        {name: "walk1", x: 70, y: 1, w: 32, h: 48},
        {name: "walk2", x: 35, y: 1, w: 32, h: 48}
    ]);

    let sara = GPU.GetAvailableSprite();
    //TLN.SetSpritePicture(sara, TLN.FindPictureByName(spriteset, "stand"));
    let walkAnimation = GPU.CreateAnimation(spriteset, [{name: "walk0", delay: 500}, {name: "walk1", delay: 500}, {name: "walk2", delay: 500}]);
    GPU.SetSpriteAnimation(sara, walkAnimation);
    GPU.SetSpritePosition(sara, 0, 0);
    GPU.EnableSprite(sara);

    GPU.SetVideoOutput(document.getElementById('game'));

    function redraw(timestamp) {
            GPU.DrawFrame(timestamp);
        requestAnimationFrame(redraw);
    }
    requestAnimationFrame(redraw);
}

main();

