import Playnewton from "./playnewton.js"
import Sara from "./entities/sara.js"
import Level from "./scenes/level.js"

export default class OpenSara {

    async Start() {
        Playnewton.GPU.SetVideoOutput(document.getElementById('game'));

        for (let z = 0; z < 16; ++z) {
            let layer = Playnewton.GPU.GetLayer(z);
            Playnewton.GPU.EnableLayer(layer);
        }

        let scene = new Level();
        await scene.Start();

        let redraw = (timestamp) => {
            Playnewton.CTRL.Poll();
            scene.UpdateBodies();
            Playnewton.PPU.Update();
            scene.UpdateSprites();
            Playnewton.GPU.DrawFrame(timestamp);
            //Playnewton.PPU.DebugDraw(Playnewton.GPU.ctx);
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