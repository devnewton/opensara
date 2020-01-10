/**
 * Frame description for TLN.CreateSpriteset()
 * @type TLN_SpritesetFrameDescription
 */
class TLN_SpritesetFrameDescription {
    name;
    x;
    y;
    w;
    h;
}

/**
 * 
 * @type TLN_SpritePicture
 */
class TLN_SpritePicture {

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
}

/**
 * 
 * @type TLN_Spriteset
 */
class TLN_Spriteset {
    /**
     * 
     * @type TLN_SpritePicture[]
     */
    pictures = [];
}

/**
 * 
 * @type TLN_Sprite
 */
class TLN_Sprite {

    /**
     * 
     * @type TLN_SpritePicture
     */
    picture;
    scale;
    angle;
    enabled = false;
    /**
     * 
     * @type TLN_SpriteAnimation
     */
    animation;
    /**
     * 
     * @type TLN_AnimationMode
     */
    animationMode;
    /**
     * 
     * @type TLN_AnimationState
     */
    animationState;
    animationCurrentFrameIndex;
    animationCurrentTime;
}

/**
 * 
 * @type TLN_SpriteAnimationFrameDescription
 */
class TLN_SpriteAnimationFrameDescription {
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
 * @type TLN_SpriteAnimationFrame
 */
class TLN_SpriteAnimationFrame {
    /**
     * 
     * @type TLN_SpritePicture
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
 * @type TLN_SpriteAnimation
 */
class TLN_SpriteAnimation {

    /**
     * 
     * @type TLN_SpriteAnimationFrame[]
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
const TLN_AnimationMode = {
    ONCE: 1,
    LOOP: 2
};

/**
 * 
 * @type TLN_AnimationState
 */
const TLN_AnimationState = {
    STARTED: 1,
    STOPPED: 2
};

class TLN_Tile {
    imageBitmap;
}

class TLN_Tileset {
    name;
}

class TLN_Engine {

    /**
     * 
     * @type TLN_Sprite[]
     */
    sprites = [];

    /**
     * Time elapsed since last frame for animation control
     * @type number 
     */
    frameDuration = 1000 / 60;

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
            this.sprites.push(new TLN_Sprite());
        }
    }

    /**
     * Loads a spriteset from a png/json file pair.
     * @param {string} baseURL Base url for png/json files
     * @return ImageBitmap
     * 
     */
    async LoadBitmap(baseURL) {
        return await createImageBitmap(await (await fetch(baseURL)).blob());
    }

    /**
     * Creates a new spriteset.
     * @param {ImageBitmap} bitmap
     * @param {TLN_SpritesetFrameDescription[]} frames
     * @returns {TLN_Spriteset}
     */
    async CreateSpriteset(bitmap, frames) {
        let spriteset = new TLN_Spriteset();
        for (let frame of frames) {
            let spritePicture = new TLN_SpritePicture();
            spritePicture.name = frame.name;
            spritePicture.bitmap = await createImageBitmap(bitmap, frame.x, frame.y, frame.w, frame.h);
            spriteset.pictures.push(spritePicture);
        }
        return spriteset;
    }

    /**
     * Deletes the specified spriteset and frees memory
     * @param {TLN_Spriteset} spriteset
     */
    DeleteSpriteset(spriteset) {
        for (let bitmap of spriteset.pictures) {
            bitmap.close();
        }
    }

    /**
     * Find a picture entry by name in spriteset
     * @param {TLN_Spriteset} spriteset
     * @param {string} name
     * @return {TLN_SpritePicture} Index of the actual picture inside the spriteset
     */
    FindPictureByName(spriteset, name) {
        return spriteset.pictures.find(p => p.name === name);
    }

    /**
     * 
     * @param {TLN_Spriteset} spriteset
     * @param {TLN_SpriteAnimationFrameDescription} frames
     * @returns {TLN_SpriteAnimation}
     */
    CreateAnimation(spriteset, frames) {
        let animation = new TLN_SpriteAnimation();
        let time = 0;
        for (let frameDescription of frames) {
            let frame = new TLN_SpriteAnimationFrame();
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
     * @param {TLN_Sprite} sprite
     * @param {TLN_SpritePicture} picture
     */
    SetSpritePicture(sprite, picture) {
        sprite.picture = picture;
    }

    /**
     *  Set sprite animation
     * @param {TLN_Sprite} sprite
     * @param {TLN_SpriteAnimation} animation
     * @param {TLN_AnimationMode} mode play mode
     */
    SetSpriteAnimation(sprite, animation, mode = TLN_AnimationMode.LOOP) {
        sprite.animation = animation;
        sprite.animationMode = mode;
        sprite.animationCurrentFrameIndex = 0;
        sprite.animationCurrentTime = 0;
        sprite.picture = sprite.animation.frames[0].picture;
    }

    /**
     * 
     * @param {TLN_Sprite} sprite
     * @param {number} x Horizontal position (0 = left margin)
     * @param {number} y Vertical position (0 = top margin)
     */
    SetSpritePosition(sprite, x, y) {
        sprite.x = x;
        sprite.y = y;
    }

    /**
     * Apply rotozoom effect on sprite
     * @param {TLN_Sprite} sprite
     * @param {number} scale size factor
     * @param {number} angle rotation angle in radians
     */
    SetSpriteRotozoom(sprite, scale, angle) {
        sprite.scale = scale;
        sprite.angle = angle;
    }

    /**
     * Disable rotozoom effect on sprite
     * @param {TLN_Sprite} sprite
     */
    DisableSpriteRotozoom(sprite) {
        this.SetSpriteRotozoom(sprite, null, null);
    }

    /**
     * Finds an available (unused) sprite. 
     * @returns {TLN_Sprite} sprite
     */
    GetAvailableSprite() {
        return this.sprites.find(sprite => !sprite.enabled);
    }

    /**
     * Enable the sprite so it is drawn. 
     * @param {TLN_Sprite} sprite
     */
    EnableSprite(sprite) {
        sprite.enabled = true;
    }

    /**
     * Disables the sprite so it is not drawn. 
     * Disabled sprites are returned by the function GetAvailableSprite as available 
     * @param {TLN_Sprite} sprite
     */
    DisableSprite(sprite) {
        sprite.enabled = false;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx
     * @returns {undefined}
     */
    SetRenderTarget(ctx) {
        this.ctx = ctx;
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
        this._UpdateSprites(elapsedTime);
        if (this.ctx) {
            this._DrawSprites();
        }
    }

    _UpdateSprites() {
        this.sprites.forEach(sprite => sprite.enabled && this._UpdateSprite(sprite));
    }

    /**
     * 
     * @param {TLN_Sprite} sprite
     */
    _UpdateSprite(sprite) {
        if (sprite.animation) {
            this._UpdateSpriteAnimation(sprite);
        }
    }

    /**
     * 
     * @param {TLN_Sprite} sprite
     */
    _UpdateSpriteAnimation(sprite) {
        if (sprite.animationState === TLN_AnimationState.STOPPED) {
            return;
        }
        let frames = sprite.animation.frames;
        sprite.animationCurrentTime += this.frameDuration;
        if (sprite.animationCurrentTime >= sprite.animation.totalDuration) {
            switch (sprite.animationMode) {
                case TLN_AnimationMode.ONCE:
                    sprite.animationCurrentFrameIndex = frames.length - 1;
                    sprite.animationState = TLN_AnimationState.STOPPED;
                    return;
                case TLN_AnimationMode.LOOP:
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
     * @param {TLN_Sprite} sprite
     * @returns {boolean} 
     */
    _IsSpriteVisible(sprite) {
        return sprite.enabled && sprite.picture;
    }
    /**
     * 
     * @param {TLN_Sprite} sprite
     */
    _DrawSprite(sprite) {
        let hasRotozoom = sprite.scale || sprite.angle;
        if (hasRotozoom) {
            this.ctx.save();
            this.ctx.rotate(sprite.angle);
            this.ctx.scale(sprite.scale);
        }
        this.ctx.drawImage(sprite.picture.bitmap, sprite.x, sprite.y);

        if (hasRotozoom) {
            this.ctx.restore();
        }
    }
}

/**
 * Use this with requestAnimationFrame to limit frame per second
 * @type FPS_Limiter
 */
class FPS_Limiter {
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
