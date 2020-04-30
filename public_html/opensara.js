import Playnewton from "./playnewton.js"
import Sara from "./entities/sara.js"
import Level from "./scenes/level.js"

export default class OpenSara {

    async Start() {
        let progress = document.getElementById('progress');
        Playnewton.GPU.SetVideoOutput(document.getElementById('game'));

        for (let z = 0; z < 16; ++z) {
            let layer = Playnewton.GPU.GetLayer(z);
            Playnewton.GPU.EnableLayer(layer);
        }

        let scene = new Level();
        scene.Start();

        let redraw = (timestamp) => {
            if(scene.ready) {
                progress.style.visibility = "hidden";
                progress.innerText = "";
                Playnewton.CTRL.Poll();
                scene.UpdateBodies();
                Playnewton.PPU.Update();
                scene.UpdateSprites();
                Playnewton.GPU.DrawFrame(timestamp);
            } else {
                progress.style.visibility = "visible";
                progress.innerText = `Loading ${scene.progress}%`;
            }
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