import * as Playnewton from "./playnewton.js"
import Title from "./scenes/title.js"

export default class OpenSara {

    async Start() {
        Playnewton.GPU.SetVideoOutput(document.getElementById('game'));

        let scene = new Title();
        scene.Start();

        let redraw = (timestamp) => {
            if(scene.ready) {
                Playnewton.GPU.HUD.SetLoadingText("");
                Playnewton.CTRL.Poll();
                Playnewton.CLOCK.Update();
                scene.UpdateBodies();
                Playnewton.PPU.Update();
                scene.UpdateSprites();
            } else {
                Playnewton.GPU.HUD.SetLoadingText(`Loading ${scene.progress}%`);
            }
            Playnewton.GPU.DrawFrame(timestamp);
            scene = scene.nextScene;
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