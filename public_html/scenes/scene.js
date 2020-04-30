import Playnewton from "../playnewton.js"

export default class Scene {

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

    async Start() {
        this.progress = 0;
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