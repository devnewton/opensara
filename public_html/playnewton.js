/**
 * Frame description for TLN.CreateSpriteset()
 * @type GPU_SpritesetFrameDescription
 */
class GPU_SpritesetFrameDescription {
    name;
    x;
    y;
    w;
    h;
}

/**
 * 
 * @type GPU_SpritePicture
 */
class GPU_SpritePicture {

    /**
     * 
     * @type String
     */
    name;

    /**
     * 
     * @type ImageBitmap
     */
    bitmap;

    /**
     * 
     * @type number
     */
    x;

    /**
     * 
     * @type number
     */
    y;

    /**
     * 
     * @type number
     */
    w;

    /**
     * 
     * @type number
     */
    h;
}

/**
 * 
 * @type GPU_Spriteset
 */
class GPU_Spriteset {
    /**
     * 
     * @type GPU_SpritePicture[]
     */
    pictures = [];
}

/**
 * 
 * @type GPU_Sprite
 */
class GPU_Sprite {

    /**
     * 
     * @type GPU_SpritePicture
     */
    picture;
    scale;
    angle;
    enabled = false;
    /**
     * 
     * @type GPU_SpriteAnimation
     */
    animation;
    /**
     * 
     * @type GPU_AnimationMode
     */
    animationMode;
    /**
     * 
     * @type GPU_AnimationState
     */
    animationState;
    animationCurrentFrameIndex;
    animationCurrentTime;
}

/**
 * 
 * @type GPU_SpriteAnimationFrameDescription
 */
class GPU_SpriteAnimationFrameDescription {
    /**
     * Picture name in spriteset
     * @type string
     */
    name;

    /**
     * Delay in ms
     * @type number
     */
    delay;
}

/**
 * 
 * @type GPU_SpriteAnimationFrame
 */
class GPU_SpriteAnimationFrame {
    /**
     * 
     * @type GPU_SpritePicture
     */
    picture;

    /**
     * End of frame time
     * @type number
     */
    endTime;
}

/**
 * 
 * @type GPU_SpriteAnimation
 */
class GPU_SpriteAnimation {

    /**
     * 
     * @type GPU_SpriteAnimationFrame[]
     */
    frames = [];

    /**
     * Sum of frame delays
     * @type number
     */
    totalDuration;
}

/**
 * Enum for animation play mode.
 * @readonly
 * @enum {number}
 */
const GPU_AnimationMode = {
    ONCE: 1,
    LOOP: 2
};

/**
 * 
 * @type GPU_AnimationState
 */
const GPU_AnimationState = {
    STARTED: 1,
    STOPPED: 2
};

class GPU_Tile {
    imageBitmap;
}

class GPU_Tileset {
    name;
}

/**
 * Use this with requestAnimationFrame to limit frame per second
 * @type GPU_FpsLimiter
 */
class GPU_FpsLimiter {
    fps;
    now;
    then;
    interval;
    delta;

    constructor(fps = 60) {
        this.fps = fps;
        this.then = performance.now();
        this.interval = 1000 / fps;
    }

    /**
     * 
     * @returns {boolean}
     */
    ShouldDraw() {
        this.now = performance.now();
        this.delta = this.now - this.then;
        if (this.delta > this.interval) {
            this.then = this.now - (this.delta % this.interval);
            return true;
        }
        return false;
    }
}

class CTRL_Gamepad {
    /**
     * 
     * @type name
     */
    name;

    /**
     * Is the up button being pressed?
     * @type boolean
     */
    up;

    /**
     * Is the down button being pressed?
     * @type boolean
     */
    down;

    /**
     * Is the left button being pressed?
     * @type boolean
     */
    left;

    /**
     * Is the right button being pressed?
     * @type boolean
     */
    right;

    /**
     * Is the bottom button in the right button cluster being pressed?
     * @type boolean
     */
    A;

    /**
     * Is the right button in the right button cluster being pressed?
     * @type boolean
     */
    B;

    /**
     * Is the left button in the right button cluster being pressed?
     * @type boolean
     */
    X;

    /**
     * Is the top button in the right button cluster being pressed?
     * @type boolean
     */
    Y;

    /**
     * Is the left shoulder button being pressed?
     * @type boolean
     */
    L;

    /**
     * Is the right shoulder button being pressed?
     * @type boolean
     */
    R;

    /**
     * Is the start button being pressed?
     * @type boolean
     */
    start;
}

class Playnewton_CTRL {

    /**
     * 
     * @type CTRL_Gamepad
     */
    keyboardPad;

    /**
     * 
     * @type CTRL_Gamepad[]
     */
    pads;

    /**
     * Number of player for the game
     * @type number
     */
    nplayer;

    /**
     * 
     * @param {number} nplayer Number of player for the game
     * @returns {Playnewton_CTRL}
     */
    constructor(nplayer = 1) {
        this.nplayer = nplayer;
        this.keyboardPad = new CTRL_Gamepad();
        this.pads = [];
        for (let i = 0; i < nplayer; ++i) {
            this.pads[i] = new CTRL_Gamepad();
        }

        document.addEventListener("keydown", (event) => this._SetKeyboardPadButton(event,true));
        document.addEventListener("keyup", (event) => this._SetKeyboardPadButton(event,false));
    }

    /**
     * 
     * @param {KeyboardEvent} event
     * @param {boolean} down
     * @returns boolean
     */
    _SetKeyboardPadButton(event, down) {
        switch (event.code) {
            case "ArrowUp":
                this.keyboardPad.up = down;
                break;
            case "ArrowDown":
                this.keyboardPad.down = down;
                break;
            case "ArrowLeft":
                this.keyboardPad.left = down;
                break;
            case "ArrowRight":
                this.keyboardPad.right = down;
                break;
            case "KeyZ":
                this.keyboardPad.A = down;
                break;
            case "KeyX":
                this.keyboardPad.B = down;
                break;
            case "KeyA":
                this.keyboardPad.X = down;
                break;
            case "KeyS":
                this.keyboardPad.Y = down;
                break;
            case "KeyD":
                this.keyboardPad.L = down;
                break;
            case "KeyC":
                this.keyboardPad.L = down;
                break;
        }
        return false;
    }

    Poll() {
        let p = 0;
        this._ResetPadsStates();
        for (let webpad of navigator.getGamepads()) {
            if (p >= this.pads.length) {
                break;
            }
            if (webpad) {
                let pad = this.pads[p];
                pad.up = webpad.buttons[12].pressed;
                pad.down = webpad.buttons[13].pressed;
                pad.left = webpad.buttons[14].pressed;
                pad.right = webpad.buttons[15].pressed;
                pad.A = webpad.buttons[0].pressed;
                pad.B = webpad.buttons[1].pressed;
                pad.X = webpad.buttons[2].pressed;
                pad.Y = webpad.buttons[3].pressed;
                pad.L = webpad.buttons[4].pressed;
                pad.R = webpad.buttons[5].pressed;
                pad.start = webpad.buttons[9].pressed;
                ++p;
            }
        }
    }

    _ResetPadsStates() {
        for (let pad of this.pads) {
            pad.up = false;
            pad.down = false;
            pad.left = false;
            pad.right = false;
            pad.A = false;
            pad.B = false;
            pad.X = false;
            pad.Y = false;
            pad.L = false;
            pad.R = false;
            pad.start = false;
        }
    }
}

class Playnewton_DRIVE {
    /**
     * Loads a spriteset from a png/json file pair.
     * @param {string} baseURL Base url for png/json files
     * @return ImageBitmap
     * 
     */
    async LoadBitmap(baseURL) {
        return await createImageBitmap(await (await fetch(baseURL)).blob());
    }
}

class Playnewton_GPU {

    /**
     * 
     * @type GPU_Sprite[]
     */
    sprites = [];

    /**
     * Time elapsed since last frame for animation control
     * @type number 
     */
    frameDuration = 1000 / 60;

    /**
     * 
     * @type GPU_FpsLimiter
     */
    fpsLimiter;

    /**
     * 
     * @type HTMLCanvasElement
     */
    canvas;

    /**
     * 
     * @type CanvasRenderingContext2D
     */
    ctx;

    /**
     * 
     * @param {number} numsprites Max number of sprite
     * @returns {TLN}
     */
    constructor(numsprites)
    {
        for (let s = 0; s < numsprites; ++s) {
            this.sprites.push(new GPU_Sprite());
        }
        this.fpsLimiter = new GPU_FpsLimiter();
    }

    /**
     * Creates a new spriteset.
     * @param {ImageBitmap} bitmap
     * @param {GPU_SpritesetFrameDescription[]} frames
     * @returns {GPU_Spriteset}
     */
    CreateSpriteset(bitmap, frames) {
        let spriteset = new GPU_Spriteset();
        for (let frame of frames) {
            let spritePicture = new GPU_SpritePicture();
            spritePicture.name = frame.name;
            spritePicture.bitmap = bitmap;
            spritePicture.x = frame.x;
            spritePicture.y = frame.y;
            spritePicture.w = frame.w;
            spritePicture.h = frame.h;
            spriteset.pictures.push(spritePicture);
        }
        return spriteset;
    }

    /**
     * Deletes the specified spriteset and frees memory
     * @param {GPU_Spriteset} spriteset
     */
    DeleteSpriteset(spriteset) {
        for (let bitmap of spriteset.pictures) {
            bitmap.close();
        }
    }

    /**
     * Find a picture entry by name in spriteset
     * @param {GPU_Spriteset} spriteset
     * @param {string} name
     * @return {GPU_SpritePicture} Index of the actual picture inside the spriteset
     */
    FindPictureByName(spriteset, name) {
        return spriteset.pictures.find(p => p.name === name);
    }

    /**
     * 
     * @param {GPU_Spriteset} spriteset
     * @param {GPU_SpriteAnimationFrameDescription} frames
     * @returns {GPU_SpriteAnimation}
     */
    CreateAnimation(spriteset, frames) {
        let animation = new GPU_SpriteAnimation();
        let time = 0;
        for (let frameDescription of frames) {
            let frame = new GPU_SpriteAnimationFrame();
            frame.picture = this.FindPictureByName(spriteset, frameDescription.name);
            time += frameDescription.delay;
            frame.endTime = time;
            animation.frames.push(frame);
        }
        animation.totalDuration = time;
        return animation;
    }

    /**
     * Set sprite picture
     * @param {GPU_Sprite} sprite
     * @param {GPU_SpritePicture} picture
     */
    SetSpritePicture(sprite, picture) {
        sprite.picture = picture;
    }

    /**
     *  Set sprite animation
     * @param {GPU_Sprite} sprite
     * @param {GPU_SpriteAnimation} animation
     * @param {GPU_AnimationMode} mode play mode
     */
    SetSpriteAnimation(sprite, animation, mode = GPU_AnimationMode.LOOP) {
        sprite.animation = animation;
        sprite.animationMode = mode;
        sprite.animationCurrentFrameIndex = 0;
        sprite.animationCurrentTime = 0;
        sprite.picture = sprite.animation.frames[0].picture;
    }

    /**
     * 
     * @param {GPU_Sprite} sprite
     * @param {number} x Horizontal position (0 = left margin)
     * @param {number} y Vertical position (0 = top margin)
     */
    SetSpritePosition(sprite, x, y) {
        sprite.x = x;
        sprite.y = y;
    }

    /**
     * Apply rotozoom effect on sprite
     * @param {GPU_Sprite} sprite
     * @param {number} scale size factor
     * @param {number} angle rotation angle in radians
     */
    SetSpriteRotozoom(sprite, scale, angle) {
        sprite.scale = scale;
        sprite.angle = angle;
    }

    /**
     * Disable rotozoom effect on sprite
     * @param {GPU_Sprite} sprite
     */
    DisableSpriteRotozoom(sprite) {
        this.SetSpriteRotozoom(sprite, null, null);
    }

    /**
     * Finds an available (unused) sprite. 
     * @returns {GPU_Sprite} sprite
     */
    GetAvailableSprite() {
        return this.sprites.find(sprite => !sprite.enabled);
    }

    /**
     * Enable the sprite so it is drawn. 
     * @param {GPU_Sprite} sprite
     */
    EnableSprite(sprite) {
        sprite.enabled = true;
    }

    /**
     * Disables the sprite so it is not drawn. 
     * Disabled sprites are returned by the function GetAvailableSprite as available 
     * @param {GPU_Sprite} sprite
     */
    DisableSprite(sprite) {
        sprite.enabled = false;
    }

    /**
     * 
     * @param {HTMLCanvasElement} canvas
     */
    SetVideoOutput(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    /**
     * @param {number} frameDuration time elapsed since last frame for animation control
     */
    SetFrameDuration(frameDuration) {
        this.frameDuration = frameDuration;
    }

    /**
     * Draws the frame to the previously specified render target.
     * @param {number} elapsedTime time elapsed since last frame for animation control
     */
    DrawFrame(elapsedTime) {
        if (this.fpsLimiter.ShouldDraw()) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this._UpdateSprites(elapsedTime);
            if (this.ctx) {
                this._DrawSprites();
            }
        }
    }

    _UpdateSprites() {
        this.sprites.forEach(sprite => sprite.enabled && this._UpdateSprite(sprite));
    }

    /**
     * 
     * @param {GPU_Sprite} sprite
     */
    _UpdateSprite(sprite) {
        if (sprite.animation) {
            this._UpdateSpriteAnimation(sprite);
        }
    }

    /**
     * 
     * @param {GPU_Sprite} sprite
     */
    _UpdateSpriteAnimation(sprite) {
        if (sprite.animationState === GPU_AnimationState.STOPPED) {
            return;
        }
        let frames = sprite.animation.frames;
        sprite.animationCurrentTime += this.frameDuration;
        if (sprite.animationCurrentTime >= sprite.animation.totalDuration) {
            switch (sprite.animationMode) {
                case GPU_AnimationMode.ONCE:
                    sprite.animationCurrentFrameIndex = frames.length - 1;
                    sprite.animationState = GPU_AnimationState.STOPPED;
                    return;
                case GPU_AnimationMode.LOOP:
                    sprite.animationCurrentFrameIndex = 0;
                    sprite.animationCurrentTime %= sprite.animation.totalDuration;
                    break;
            }
        }
        while (sprite.animationCurrentTime > frames[sprite.animationCurrentFrameIndex].endTime) {
            ++sprite.animationCurrentFrameIndex;
        }
        sprite.picture = sprite.animation.frames[sprite.animationCurrentFrameIndex].picture;
    }

    _DrawSprites() {
        this.sprites.forEach(sprite => this._IsSpriteVisible(sprite) && this._DrawSprite(sprite));
    }
    /**
     * 
     * @param {GPU_Sprite} sprite
     * @returns {boolean} 
     */
    _IsSpriteVisible(sprite) {
        return sprite.enabled && sprite.picture;
    }
    /**
     * 
     * @param {GPU_Sprite} sprite
     */
    _DrawSprite(sprite) {
        let hasRotozoom = sprite.scale || sprite.angle;
        if (hasRotozoom) {
            this.ctx.save();
            this.ctx.translate(sprite.x, sprite.y);
            this.ctx.rotate(sprite.angle);
            this.ctx.scale(sprite.scale, sprite.scale);
            this.ctx.drawImage(sprite.picture.bitmap, sprite.picture.x, sprite.picture.y, sprite.picture.w, sprite.picture.h, -sprite.picture.w / 2, -sprite.picture.h / 2, sprite.picture.w, sprite.picture.h);
            this.ctx.restore();

        } else {
            this.ctx.drawImage(sprite.picture.bitmap, sprite.picture.x, sprite.picture.y, sprite.picture.w, sprite.picture.h, sprite.x, sprite.y, sprite.picture.w, sprite.picture.h);
        }
    }
}
