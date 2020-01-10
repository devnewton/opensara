async function main() {

    let IO = new Playnewton_IO();
    let bitmap = await IO.LoadBitmap("sprites/sara.png");

    let GPU = new Playnewton_GPU(100);
    let spriteset = GPU.CreateSpriteset(bitmap, [
        {name: "stand", x: 1, y: 1, w: 32, h: 48},
        {name: "walk0", x: 35, y: 1, w: 32, h: 48},
        {name: "walk1", x: 70, y: 1, w: 32, h: 48},
        {name: "walk2", x: 104, y: 1, w: 32, h: 48}
    ]);
    let walkAnimation = GPU.CreateAnimation(spriteset, [{name: "walk0", delay: 500}, {name: "walk1", delay: 500}, {name: "walk2", delay: 500}]);

    let sara = GPU.GetAvailableSprite();
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

