import * as Playnewton from "../playnewton.js"

export default class Poison {
    /**
     * @type number
     */
    nextPoison = 0;

    /**
     * @type number
     */
    countDown = 0;

    static poisonInterval = 4000;

    constructor(victim) {
        this.victim = victim;
    }

    Update() {
        let now = Playnewton.GPU.fpsLimiter.now;
        if(this.nextPoison === 0) {
            this.nextPoison = now + Poison.poisonInterval;
        }
        if(this.nextPoison < now) {
            this.nextPoison = now + Poison.poisonInterval;
            this.victim.HurtByPoison();
            return;
        }
        this.countDown = Math.trunc((this.nextPoison - now) / 1000);
    }

}