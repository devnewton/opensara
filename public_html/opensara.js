import Playnewton from "./playnewton.js"
import Level from "./scenes/level.js"
import Title from "./scenes/title.js"

export default class OpenSara {

    async Start() {
        let progress = document.getElementById('progress');
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
                progress.style.visibility = "hidden";
                progress.innerText = "";
                Playnewton.CTRL.Poll();
                scene.UpdateBodies();
                Playnewton.PPU.Update();
                scene.UpdateSprites();
                Playnewton.GPU.DrawFrame(timestamp);
                scene = scene.nextScene;
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