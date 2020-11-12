import Playnewton from "../playnewton.js"

export default class Poison {

    /**
     * @type number
     */
    hurtCooldown = 3;

    /**
     * @type number
     */
    hurtCounter;

    /**
     * @type number
     */
    intervalId;

    constructor(victim) {
        this.victim = victim;
        this.hurtCounter = this.hurtCooldown;

        this.intervalId = setInterval(() => this.Update(), 1000);
    }

    Update() {
        --this.hurtCounter;
        if (this.hurtCounter < 0) {
            this.victim.HurtByPoison();
            this.hurtCounter = this.hurtCooldown;
        }
        if(this.victim.dead) {
            clearInterval(this.intervalId);
        }
    }

    Stop() {
        clearInterval(this.intervalId);
    }

}