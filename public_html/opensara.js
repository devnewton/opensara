import Playnewton from "./playnewton.js"
import Level from "./scenes/level.js"
import Title from "./scenes/title.js"

export default class OpenSara {

    async Start() {
        Playnewton.CTRL.MapKeyboardEventToPadButton = (pad, event, down) => {
            switch (event.code) {
                case "ArrowUp":
                    pad.A = down;
                    break;
                case "ArrowLeft":
                    pad.left = down;
                    break;
                case "ArrowRight":
                    pad.right = down;
                    break;
                case "F1":
                    pad.start = down;
            }
        };

        Playnewton.GPU.SetVideoOutput(document.getElementById('game'));

        let scene = new Title();
        scene.Start();

        let redraw = (timestamp) => {
            if(scene.ready) {
                Playnewton.GPU.GetHUD().SetLoadingText("");
                Playnewton.CTRL.Poll();
                scene.UpdateBodies();
                Playnewton.PPU.Update();
                scene.UpdateSprites();
            } else {
                Playnewton.GPU.GetHUD().SetLoadingText(`Loading ${scene.progress}%`);
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