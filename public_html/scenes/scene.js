import * as Playnewton from "../playnewton.js"

export default class Scene {

    /**
     * @type Scene
     */
    nextScene;
    
    /**
     * @type number
     */
    progress = -1;

    /**
     * 
     * @returns {boolean}
     */
    get started() {
        return this.progress >= 0;
    }

    /**
     * 
     * @returns {boolean}
     */
    get ready() {
        return this.progress >= 100;
    }

    constructor() {
        this.nextScene = this;
    }

    async Start() {
        Playnewton.GPU.Reset();
        Playnewton.PPU.Reset();
        this.progress = 0;
    }

    Stop() {
        Playnewton.GPU.Reset();
        Playnewton.PPU.Reset();
    }

    /**
     * 
     * @param {number} progress 
     */
    Progress(progress) {
        this.progress = progress;
    }

    UpdateBodies() {
    }
    
    UpdateSprites() {
    }
}