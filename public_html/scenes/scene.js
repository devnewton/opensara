import Playnewton from "../playnewton.js"

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
        this.progress = 0;
    }

    Stop() {
        Playnewton.GPU.Reset();
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