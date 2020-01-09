/**
 * Sprite creation info for TLN.CreateSpriteset()
 * @type TLN_SpriteData
 */
class TLN_SpriteData {
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
     * @type TLN_Spriteset
     */
    spriteset;
    picture;
    scale;
    angle;
    enabled = false;
}

class TLN_Tile {
    imageBitmap;
}

class TLN_Tileset {
    name;
}

class TLN_Engine {

    spriteSets = new Map();

    /**
     * 
     * @type TLN_Sprite[]
     */
    sprites = [];

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
    constructor(numsprites) {
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
     * @param {TLN_SpriteData[]} spriteDatas
     * @returns {TLN_Spriteset}
     */
    async CreateSpriteset(bitmap, spriteDatas) {
        let spriteset = new TLN_Spriteset();
        for (let spriteData of spriteDatas) {
            let spritePicture = new TLN_SpritePicture();
            spritePicture.name = spriteData.name;
            spritePicture.bitmap = await createImageBitmap(bitmap, spriteData.x, spriteData.y, spriteData.w, spriteData.h);
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
     * @return {number} Index of the actual picture inside the spriteset
     */
    FindPictureEntryByName(spriteset, name) {
        return spriteset.pictures.findIndex(p => p.name === name);
    }

    /**
     * 
     * @param {number} nsprite Id of the sprite [0, num_sprites - 1]
     * @param {TLN_Spriteset} spriteset Reference of the spriteset containing the graphics to set
     */
    SetSpriteSet(nsprite, spriteset) {
        this.sprites[nsprite].spriteset = spriteset;
    }

    /**
     * 
     * @param {number} nsprite nsprite Id of the sprite [0, num_sprites - 1]
     * @param {number} entry Index of the actual picture inside the spriteset to assign (0 <= entry < num_spriteset_pictures)
     */
    SetSpritePicture(nsprite, entry) {
        let sprite = this.sprites[nsprite];
        sprite.picture = sprite.spriteset.pictures[entry];
    }

    /**
     * 
     * @param {number} nsprite nsprite Id of the sprite [0, num_sprites - 1]
     * @param {number} x Horizontal position (0 = left margin)
     * @param {number} y Vertical position (0 = top margin)
     */
    SetSpritePosition(nsprite, x, y) {
        let sprite = this.sprites[nsprite];
        sprite.x = x;
        sprite.y = y;
    }

    /**
     * Apply rotozoom effect on sprite
     * @param {number} nsprite nsprite Id of the sprite [0, num_sprites - 1]
     * @param {number} scale size factor
     * @param {number} angle rotation angle in radians
     */
    SetSpriteRotozoom(nsprite, scale, angle) {
        let sprite = this.sprites[nsprite];
        sprite.scale = scale;
        sprite.angle = angle;
    }

    /**
     * Disable rotozoom effect on sprite
     * @param {number} nsprite nsprite Id of the sprite [0, num_sprites - 1]
     */
    DisableSpriteRotozoom(nsprite) {
        this.SetSpriteRotozoom(nsprite, null, null);
    }

    /**
     * Finds an available (unused) sprite. 
     * @returns {number} Id of the sprite [0, num_sprites - 1]
     */
    GetAvailableSprite() {
        return this.sprites.findIndex(sprite => !sprite.enabled);
    }

    /**
     * Enable the sprite so it is drawn. 
     * @param {number} nsprite nsprite Id of the sprite [0, num_sprites - 1]
     */
    EnableSprite(nsprite) {
        let sprite = this.sprites[nsprite];
        sprite.enabled = true;
    }

    /**
     * Disables the sprite so it is not drawn. 
     * Disabled sprites are returned by the function GetAvailableSprite as available 
     * @param {number} nsprite nsprite Id of the sprite [0, num_sprites - 1]
     */
    DisableSprite(nsprite) {
        let sprite = this.sprites[nsprite];
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
     * Draws the frame to the previously specified render target.
     * @param {number} time timestamp for animation control
     */
    DrawFrame(time) {
        if (this.ctx) {
            this._DrawSprites();
        }
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
