const PLAYNEWTON_DEFAULT_SCREEN_WIDTH = 1280;
const PLAYNEWTON_DEFAULT_SCREEN_HEIGHT = 720;

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
     * @type number
     */
    x;

    /**
     * 
     * @type number
     */
    y;
    /**
     * Z order (greater z order is always in front of than lower)
     * Math.floor(z) gives the layer index
     * @type number
     */
    z = 0;
    /**
     * 
     * @type GPU_SpritePicture
     */
    picture;
    scale = 1;
    angle = 0;
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

    /**
     * 
     * @returns {number}
     */
    get width() {
        return this.picture.w;
    }
    /**
     * 
     * @returns {number}
     */
    get height() {
        return this.picture.h;
    }

    get left() {
        return this.x;
    }
    get top() {
        return this.y;
    }

    get right() {
        return this.left + this.width;
    }
    get bottom() {
        return this.top + this.height;
    }

    /**
     * 
     * @returns {number}
     */
    get centerX() {
        return (this.left + this.right) / 2;
    }

    /**
     * @param {number} x
     */
    set centerX(x) {
        return this.x = x - this.width / 2;
    }

    /**
     * @param {number} y
     */
    set centerY(y) {
        return this.y = y - this.height / 2;
    }

    /**
     * 
     * @returns {number}
     */
    get centerY() {
        return (this.top + this.bottom) / 2;
    }
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
    up = false;
    /**
     * Is the down button being pressed?
     * @type boolean
     */
    down = false;
    /**
     * Is the left button being pressed?
     * @type boolean
     */
    left = false;
    /**
     * Is the right button being pressed?
     * @type boolean
     */
    right = false;
    /**
     * Is the bottom button in the right button cluster being pressed?
     * @type boolean
     */
    A = false;
    /**
     * Is the right button in the right button cluster being pressed?
     * @type boolean
     */
    B = false;
    /**
     * Is the left button in the right button cluster being pressed?
     * @type boolean
     */
    X = false;
    /**
     * Is the top button in the right button cluster being pressed?
     * @type boolean
     */
    Y = false;
    /**
     * Is the left shoulder button being pressed?
     * @type boolean
     */
    L = false;
    /**
     * Is the right shoulder button being pressed?
     * @type boolean
     */
    R = false;
    /**
     * Is the start button being pressed?
     * @type boolean
     */
    start = false;
}

class Playnewton_CTRL {

    /**
     * 
     * @type CTRL_Gamepad
     */
    keyboardVirtualPad;
    /**
     * 
     * @type CTRL_Gamepad[]
     */
    pads;
    /**
     * 
     * @param {number} maxPlayer Max number of players for the game
     * @returns {Playnewton_CTRL}
     */
    constructor(maxPlayer = 1) {
        this.keyboardVirtualPad = new CTRL_Gamepad();
        this.pads = [];
        for (let i = 0; i < maxPlayer; ++i) {
            this.pads[i] = new CTRL_Gamepad();
        }

        document.addEventListener("keydown", (event) => {
            this.MapKeyboardEventToPadButton(this.keyboardVirtualPad, event, true);
            return false;
        });
        document.addEventListener("keyup", (event) => {
            this.MapKeyboardEventToPadButton(this.keyboardVirtualPad, event, false);
            return false;
        });
    }

    /**
     * @param {CTRL_Gamepad} pad
     * @param {KeyboardEvent} event
     * @param {boolean} down
     * @returns boolean
     */
    MapKeyboardEventToPadButton(pad, event, down) {
        switch (event.code) {
            case "ArrowUp":
                pad.up = down;
                break;
            case "ArrowDown":
                pad.down = down;
                break;
            case "ArrowLeft":
                pad.left = down;
                break;
            case "ArrowRight":
                pad.right = down;
                break;
            case "KeyZ":
                pad.A = down;
                break;
            case "KeyX":
                pad.B = down;
                break;
            case "KeyA":
                pad.X = down;
                break;
            case "KeyS":
                pad.Y = down;
                break;
            case "KeyD":
                pad.L = down;
                break;
            case "KeyC":
                pad.R = down;
                break;
            case "Enter":
                pad.start = down;
        }
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

        if (p < this.pads.length) {
            //use keyboard as a pad when there is less pads than players
            this._MergePadsStates(this.pads[p], this.keyboardVirtualPad);
        } else if (this.pads.length === 1) {
            //use keyboard as an alternative pad when there is only one player
            this._MergePadsStates(this.pads[0], this.keyboardVirtualPad);
        }
    }

    /**
     * 
     * @param {number} player Player index
     * @returns {CTRL_Gamepad}
     */
    GetPad(player) {
        return this.pads[player];
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

    /**
     * 
     * @param {CTRL_Gamepad} dest
     * @param {CTRL_Gamepad} src
     */
    _MergePadsStates(dest, src) {
        dest.up = dest.up || src.up;
        dest.down = dest.down || src.down;
        dest.left = dest.left || src.left;
        dest.right = dest.right || src.right;
        dest.A = dest.A || src.A;
        dest.B = dest.B || src.B;
        dest.X = dest.X || src.X;
        dest.Y = dest.Y || src.Y;
        dest.L = dest.L || src.L;
        dest.R = dest.R || src.R;
        dest.start = dest.start || src.start;
    }
}

// Bits on the far end of the 32-bit global tile ID are used for tile flags
const TMX_FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
const TMX_FLIPPED_VERTICALLY_FLAG = 0x40000000;
const TMX_FLIPPED_DIAGONALLY_FLAG = 0x20000000;

class TMX_TileAnimationFrame {
    /**
     * 
     * @type number Local ID of a tile within the parent tileset
     */
    tileid;

    /**
     * How long (in milliseconds) this frame should be displayed before advancing to the next frame
     * @type number
     */
    duration;
}

class TMX_TileAnimation {
    /**
     * 
     * @type TMX_TileAnimationFrame[]
     */
    frames = [];
}

class TMX_Tile {
    /**
     * Local tile ID within its tileset.
     * @type number
     */
    id;

    /**
     * The type of the tile. Refers to an object type and is used by tile objects.
     * @type string
     */
    type;

    /**
     * 
     * @type ImageBitmap
     */
    bitmap;

    /**
     * X coordinate in source bitmap
     * @type number
     */
    sx;

    /**
     * Y coordinate in source bitmap
     * @type number
     */
    sy;

    /**
     * Tile width
     * @type number
     */
    w;

    /**
     * Tile height
     * @type number
     */
    h;

    /**
     * 
     * @type TMX_TileAnimation
     */
    animation;

    properties = new Map();
}

class TMX_Tileset {

    /**
     * The first global tile ID of this tileset (this global ID maps to the first tile in this tileset)
     * @type number
     */
    firstgid;

    /**
     * @type string
     */
    name;
    /**
     * Width of a tile
     * @type number
     */
    tileWidth;
    /**
     * Height of a tile
     * @type number
     */
    tileHeight;
    /**
     * Spacing in pixels between the tiles in this tileset (applies to the tileset image)
     * @type number
     */
    spacing;
    /**
     * Margin around the tiles in this tileset (applies to the tileset image)
     * @type number
     */
    margin;

    /**
     * 
     * @type ImageBitmap
     */
    bitmap;

    /**
     * 
     * @type Map<number, TMX_Tile>
     */
    tiles = new Map();
}

class TMX_Chunk {
    /**
     * X coordinate of the chunk in tiles.
     * @type number
     */
    x;
    /**
     * Y coordinate of the chunk in tiles.
     * @type number
     */
    y;
    /**
     * Width of the chunk in tiles.
     * @type number
     */
    width;
    /**
     * Height: The height of the chunk in tiles.
     * @type number
     */
    height;

    /**
     * 
     * @type TMX_Tile[][]
     */
    tiles
}

/**
 * 
 * @type TMX_Layer
 */
class TMX_Layer {

    /**
     * Name of the layer
     * @type string
     */
    name;

    /**
     * The x coordinate of the layer in tiles
     * @type number
     */
    x;
    /**
     * The y coordinate of the layer in tiles
     * @type number
     */
    y;

    /**
     * Width of the layer in tiles
     * @type number
     */
    width;
    /**
     * Height of the layer in tiles
     * @type number
     */
    height; //The h. Always the same as the map height for fixed-size maps.

    /**
     * 
     * @type TMX_Chunk[]
     */
    chunks = [];
}


/**
 * 
 * @type TMX_Object
 */
class TMX_Object {
    /**
     * Name of the object
     * @type string
     */
    name;

    /**
     * The x coordinate of the object in pixels
     * @type number
     */
    x;
    /**
     * The y coordinate of object in pixels
     * @type number
     */
    y;

    /**
     * Width of the object
     * @type number
     */
    width;
    /**
     * Height of the object
     * @type number
     */
    height;

    /**
     * @type Map
     */
    properties;

    /**
     * 
     * @type TMX_Tile
     */
    tile;
}

/**
 * 
 * @type TMX_ObjectGroup
 */
class TMX_ObjectGroup {

    /**
     * Name of the object group
     * @type string
     */
    name;

    /**
     * Color of the object group
     * @type string
     */
    color;

    /**
     * The x coordinate of the object group in tiles
     * @type number
     */
    x;
    /**
     * The y coordinate of the object group in tiles
     * @type number
     */
    y;

    /**
     * @type Map
     */
    properties;

    /**
     * Object list
     * @type TMX_Object[]
     */
    objects = [];
}

class TMX_Map {

    /**
     * Map width in tiles
     * @type number
     */
    width;
    /**
     * Map height in tiles
     * @type number
     */
    height;
    /**
     * Width of a tile
     * @type number
     */
    tileWidth;
    /**
     * Height of a tile
     * @type number
     */
    tileHeight;
    /**
     * 
     * @type TMX_Tileset[]
     */
    tilesets = [];

    /**
     * 
     * @type TMX_Layer[]
     */
    layers = [];

    /**
     * @type TMX_ObjectGroup[]
     */
    objectgroups = [];
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

    /**
     * Load a [Tiled](https://www.mapeditor.org/) map
     * @param {string} tmxUrl
     * @returns {TMX_Map}
     */
    async LoadTmxMap(tmxUrl) {
        let map = new TMX_Map();
        let parser = new DOMParser();
        let tmx = await (await fetch(tmxUrl)).text();
        let doc = parser.parseFromString(tmx, "application/xml");
        let mapElement = doc.getElementsByTagName("map")[0];
        map.width = parseInt(mapElement.getAttribute("width"), 10);
        map.height = parseInt(mapElement.getAttribute("height"), 10);
        map.tileWidth = parseInt(mapElement.getAttribute("tilewidth"), 10);
        map.tileHeight = parseInt(mapElement.getAttribute("tileheight"), 10);

        let baseUrl = tmxUrl.slice(0, tmxUrl.lastIndexOf("/") + 1);
        for (let tilesetElement of doc.getElementsByTagName("tileset")) {
            let source = tilesetElement.getAttribute("source");
            let tileset;
            if (source) {
                tileset = await this.LoadTileset(baseUrl + source);
            } else {
                tileset = await this._LoadTilesetElement(tilesetElement, baseUrl);
            }
            tileset.firstgid = tilesetElement.getAttribute("firstgid");
            map.tilesets.push(tileset);
        }

        for (let layerElement of doc.getElementsByTagName("layer")) {
            let layer = new TMX_Layer();
            layer.name = layerElement.getAttribute("name");
            layer.x = parseInt(layerElement.getAttribute("x"), 10) || 0;
            layer.y = parseInt(layerElement.getAttribute("y"), 10) || 0;
            layer.width = parseInt(layerElement.getAttribute("width"), 10);
            layer.height = parseInt(layerElement.getAttribute("height"), 10);

            let dataElement = layerElement.getElementsByTagName("data")[0];
            if (dataElement) {
                let encoding = dataElement.getAttribute("encoding");
                let chunkElements = dataElement.getElementsByTagName("chunk");
                if (chunkElements.length > 0) {
                    for (let chunkElement of chunkElements) {
                        layer.chunks.push(this._LoadChunkElement(map, chunkElement, encoding));
                    }
                } else {
                    layer.chunks.push(this._LoadChunkElement(map, dataElement));
                }

            }
            map.layers.push(layer);
        }

        for (let objectgroupElement of doc.getElementsByTagName("objectgroup")) {
            let objectGroup = new TMX_ObjectGroup();
            objectGroup.name = objectgroupElement.getAttribute("name");
            objectGroup.color = objectgroupElement.getAttribute("color");
            objectGroup.x = parseInt(objectgroupElement.getAttribute("x"), 10) || 0;
            objectGroup.y = parseInt(objectgroupElement.getAttribute("y"), 10) || 0;
            objectGroup.properties = this._LoadTmxProperties(objectgroupElement);
            for (let objectElement of objectgroupElement.getElementsByTagName("object")) {
                let object = new TMX_Object();
                object.name = objectElement.getAttribute("name");
                object.x = parseInt(objectElement.getAttribute("x"), 10) || 0;
                object.y = parseInt(objectElement.getAttribute("y"), 10) || 0;
                object.width = parseInt(objectElement.getAttribute("width"), 10);
                object.height = parseInt(objectElement.getAttribute("height"), 10);
                let global_tile_id = parseInt(objectElement.getAttribute("gid"), 10);
                if (global_tile_id) {
                    //TODO Read out the flags
                    //let flipped_horizontally = (global_tile_id & TMX_FLIPPED_HORIZONTALLY_FLAG);
                    //let flipped_vertically = (global_tile_id & TMX_FLIPPED_VERTICALLY_FLAG);
                    //let flipped_diagonally = (global_tile_id & TMX_FLIPPED_DIAGONALLY_FLAG);

                    // Clear the flags
                    global_tile_id &= ~(TMX_FLIPPED_HORIZONTALLY_FLAG | TMX_FLIPPED_VERTICALLY_FLAG | TMX_FLIPPED_DIAGONALLY_FLAG);

                    // Resolve the tile
                    for (let i = map.tilesets.length - 1; i >= 0; --i) {
                        let tileset = map.tilesets[i];

                        if (tileset.firstgid <= global_tile_id) {
                            object.tile = tileset.tiles.get(global_tile_id - tileset.firstgid);
                            break;
                        }
                    }
                }
                object.properties = this._LoadTmxProperties(objectElement);
                objectGroup.objects.push(object);
            }
            map.objectgroups.push(objectGroup);
        }

        return map;
    }

    /**
     * Convert map tiles to GPU sprites
     * @param {Playnewton_GPU} GPU
     * @param {TMX_Map} map
     * @param {number} mapX
     * @param {number} mapY
     * @param {number} mapZ
     */
    ConvertTmxMapToGPUSprites(GPU, map, mapX = 0, mapY = 0, mapZ = 0) {
        /**
         * @type Map<TMX_Tile, GPU_SpritePicture>
         */
        let picturesByTile = new Map();
        /**
         * @type Map<TMX_Tile, GPU_SpriteAnimation>
         */
        let animationsByTile = new Map();
        for (let tileset of map.tilesets) {
            for (let tile of tileset.tiles.values()) {
                if (!tile.animation && tile.bitmap) {
                    let picture = GPU.CreatePicture(tile.bitmap, tile.sx, tile.sy, tile.w, tile.h);
                    picturesByTile.set(tile, picture);
                }
            }
            for (let tile of tileset.tiles.values()) {
                if (tile.animation) {
                    let animation = new GPU_SpriteAnimation();
                    let time = 0;
                    for (let tileFrame of tile.animation.frames) {
                        let frame = new GPU_SpriteAnimationFrame();
                        frame.picture = picturesByTile.get(tileset.tiles.get(tileFrame.tileid));
                        time += tileFrame.duration;
                        frame.endTime = time;
                        animation.frames.push(frame);
                    }
                    animation.totalDuration = time;
                    animationsByTile.set(tile, animation);
                }
            }
        }
        let z = 0;
        for (let layer of map.layers) {
            for (let chunk of layer.chunks) {
                for (let y = 0; y < chunk.height; ++y) {
                    for (let x = 0; x < chunk.width; ++x) {
                        let tile = chunk.tiles[y][x];
                        if (tile) {
                            let picture = picturesByTile.get(tile);
                            let animation = animationsByTile.get(tile);
                            let sprite = GPU.GetAvailableSprite();
                            if (sprite && (picture || animation)) {
                                if (picture) {
                                    picture = GPU.CreatePicture(tile.bitmap, tile.sx, tile.sy, tile.w, tile.h);
                                    GPU.SetSpritePicture(sprite, picture);
                                }
                                if (animation) {
                                    GPU.SetSpriteAnimation(sprite, animation);
                                }
                                GPU.SetSpritePosition(sprite, mapX + (layer.x + chunk.x + x) * map.tileWidth, mapY + (layer.y + chunk.y + y) * map.tileHeight);
                                GPU.SetSpriteZ(sprite, mapZ + z);
                                GPU.EnableSprite(sprite);
                            } else {
                                console.log("No available sprite");
                            }
                        }
                    }
                }
                ++z;
            }
    }
    }

    /**
     * Convert map tiles to GPU sprites
     * @param {Playnewton_PPU} PPU
     * @param {TMX_Map} map
     * @param {number} mapX
     * @param {number} mapY
     */
    ConvertTmxMapToPPUBodies(PPU, map, mapX = 0, mapY = 0) {
        for (let objectgroup of map.objectgroups) {
            let groupX = mapX + objectgroup.x * map.tileWidth;
            let groupY = mapY + objectgroup.y * map.tileWidth;
            for (let object of objectgroup.objects) {
                let type = this._ParseStringProperty("type", object.properties, objectgroup.properties);
                if (type === "body") {
                    let body = PPU.GetAvailableBody();
                    if (body) {
                        body.debugColor = objectgroup.color;
                        PPU.SetBodyPosition(body, groupX + object.x, groupY + object.y);
                        PPU.SetBodyRectangle(body, 0, 0, object.width, object.height);
                        PPU.SetBodyImmovable(body, this._ParseBooleanProperty("immovable", object.properties, objectgroup.properties));
                        PPU.EnableBody(body);
                    } else {
                        console.log("No available body");
                    }
                }
            }
    }
    }

    /**
     * @callback ForeachTmxMapObjectCallback
     * @param {TMX_Object} object
     * @param {TMX_ObjectGroup} objectgroup
     * @param {number} x
     * @param {number} y
     * 
     */

    /**
     * Iterate over map objects
     * @param {ForeachTmxMapObjectCallback} callback
     * @param {TMX_Map} map
     * @param {number} mapX
     * @param {number} mapY
     */
    ForeachTmxMapObject(callback, map, mapX = 0, mapY = 0) {
        for (let objectgroup of map.objectgroups) {
            let groupX = mapX + objectgroup.x * map.tileWidth;
            let groupY = mapY + objectgroup.y * map.tileWidth;
            for (let object of objectgroup.objects) {
                callback(object, objectgroup, groupX + object.x, groupY + object.y);
            }
    }
    }

    async LoadTileset(tsxUrl) {
        let tsx = await (await fetch(tsxUrl)).text();
        let parser = new DOMParser();
        let tilesetElement = parser.parseFromString(tsx, "application/xml").getElementsByTagName("tileset")[0];
        let baseUrl = tsxUrl.slice(0, tsxUrl.lastIndexOf("/") + 1);
        return await this._LoadTilesetElement(tilesetElement, baseUrl);
    }

    _ParseStringProperty(name, objectProperties, groupProperties) {
        let prop = objectProperties.get(name) || groupProperties.get(name);
        return prop;
    }

    _ParseBooleanProperty(name, objectProperties, groupProperties) {
        let prop = objectProperties.get(name) || groupProperties.get(name);
        return "true" === prop;
    }

    /**
     * @param {Element} tilesetElement
     * @param {string} baseUrl
     * @returns {TMX_Tileset}
     */
    async _LoadTilesetElement(tilesetElement, baseUrl = "") {
        let tileset = new TMX_Tileset();
        tileset.name = tilesetElement.getAttribute("name");
        tileset.firstgid = parseInt(tilesetElement.getAttribute("firstgid"), 10);
        tileset.tileWidth = parseInt(tilesetElement.getAttribute("tilewidth"), 10);
        tileset.tileHeight = parseInt(tilesetElement.getAttribute("tileheight"), 10);
        tileset.spacing = parseInt(tilesetElement.getAttribute("spacing"), 10) || 0;
        tileset.margin = parseInt(tilesetElement.getAttribute("margin"), 10) || 0;
        tileset.bitmap = await this.LoadBitmap(baseUrl + tilesetElement.getElementsByTagName("image")[0].getAttribute("source"));

        for (let tileElement of tilesetElement.getElementsByTagName("tile")) {
            let tile = new TMX_Tile();
            tile.id = parseInt(tileElement.getAttribute("id"), 10);
            tile.type = tileElement.getAttribute("type");
            let animationElement = tileElement.getElementsByTagName("animation")[0];
            if (animationElement) {
                tile.animation = this._LoadTileAnimation(animationElement);
            }
            let imageElement = tileElement.getElementsByTagName("image")[0];
            if (imageElement) {
                tile.bitmap = await this.LoadBitmap(baseUrl + imageElement.getAttribute("source"));
                tile.sx = 0;
                tile.sy = 0;
                tile.w = tile.bitmap.width;
                tile.h = tile.bitmap.height;
            }
            tile.properties = this._LoadTmxProperties(tileElement);
            tileset.tiles.set(tile.id, tile);
        }
        if (tileset.bitmap) {
            let maxX = tileset.bitmap.width - tileset.margin - tileset.tileHeight - tileset.spacing;
            let maxY = tileset.bitmap.height - tileset.margin - tileset.tileWidth - tileset.spacing;
            let id = 0;
            for (let y = tileset.margin; y <= maxY; y += tileset.tileHeight + tileset.spacing) {
                for (let x = tileset.margin; x <= maxX; x += tileset.tileWidth + tileset.spacing) {
                    let tile = tileset.tiles.get(id);
                    if (!tile) {
                        tile = new TMX_Tile();
                        tile.id = id;
                        tile.bitmap = tileset.bitmap;
                        tile.sx = x;
                        tile.sy = y;
                        tile.w = tileset.tileWidth;
                        tile.h = tileset.tileHeight;
                        tileset.tiles.set(id, tile);
                    }
                    ++id;
                }
            }
        }

        return tileset;
    }

    /**
     * 
     * @param {Element} animationElement
     * @returns {TMX_TileAnimation}
     */
    _LoadTileAnimation(animationElement) {
        let animation = new TMX_TileAnimation();
        for (let frameElement of animationElement.getElementsByTagName("frame")) {
            let frame = new TMX_TileAnimationFrame();
            frame.tileid = parseInt(frameElement.getAttribute("tileid"), 10);
            frame.duration = parseInt(frameElement.getAttribute("duration"), 10);
            animation.frames.push(frame);
        }
        return animation;
    }

    /**
     * 
     * @param {Element} element
     * @returns {Map}
     */
    _LoadTmxProperties(element) {
        let props = new Map();
        for (let propertyElement of element.getElementsByTagName("property")) {
            props.set(propertyElement.getAttribute("name"), propertyElement.getAttribute("value"));
        }
        return props;
    }

    /**
     * 
     * @param {TMX_Map} map
     * @param {Element} dataOrChunkElement
     * @param {Element} encoding
     * @returns {TMX_Chunk}
     */
    _LoadChunkElement(map, dataOrChunkElement, encoding) {
        let chunk = new TMX_Chunk();
        chunk.x = parseInt(dataOrChunkElement.getAttribute("x") || 0, 10);
        chunk.y = parseInt(dataOrChunkElement.getAttribute("y") || 0, 10);
        chunk.width = parseInt(dataOrChunkElement.getAttribute("width") || map.width, 10);
        chunk.height = parseInt(dataOrChunkElement.getAttribute("height") || map.height, 10);
        let data = this._DecodeChunkData(dataOrChunkElement, chunk.width * chunk.height, encoding);
        this._ConvertDataToTiles(map, chunk, data);
        return chunk;
    }

    /**
     * 
     * @param {Element} dataOrChunkElement
     * @param {number} nbtiles
     * @param {string} encoding
     * @returns {Uint32Array}
     */
    _DecodeChunkData(dataOrChunkElement, nbtiles, encoding) {
        switch (dataOrChunkElement.getAttribute("encoding") || encoding) {
            case "base64":
                return this._DecodeBase64ChunkData(dataOrChunkElement, nbtiles);
            case "csv":
                return this._DecodeCSVChunkData(dataOrChunkElement, nbtiles);
            default:
                return this._DecodeXMLChunkData(dataOrChunkElement, nbtiles);
        }
    }

    /**
     * 
     * @param {Element} dataOrChunkElement
     * @param {number} nbtiles
     * @returns {Uint32Array}
     */
    _DecodeBase64ChunkData(dataOrChunkElement, nbtiles) {
        let compression = dataOrChunkElement.getAttribute("compression");
        switch (compression) {
            case "zlib":
            case "gzip":
                throw "Tiled map compression is not supported";
            default:
        }
        return this._DecodeBase64ToUint32Array(dataOrChunkElement.textContent, nbtiles);
    }

    /**
     * 
     * @param {string} base64Str
     * @param {number} nbtiles
     * @returns {Uint32Array}
     */
    _DecodeBase64ToUint32Array(base64Str, nbtiles) {
        let str = window.atob(base64Str);
        let data = new Uint32Array(nbtiles);
        for (let i = 0; i < str.length; i += 4) {
            data[i / 4] = (
                    str.charCodeAt(i) |
                    str.charCodeAt(i + 1) << 8 |
                    str.charCodeAt(i + 2) << 16 |
                    str.charCodeAt(i + 3) << 24
                    ) >>> 0;
        }
        return data;
    }

    /**
     * 
     * @param {Element} dataOrChunkElement
     * @param {number} nbtiles
     * @returns {Uint32Array}
     */
    _DecodeCSVChunkData(dataOrChunkElement, nbtiles) {
        let data = new Uint32Array(nbtiles);
        let i = 0;
        for (let m of dataOrChunkElement.textContent.matchAll(/\d+/g)) {
            data[i++] = parseInt(m[0], 10);
        }
        return data;
    }

    /**
     * 
     * @param {Element} dataOrChunkElement
     * @param {number} nbtiles
     * @returns {Uint32Array}
     */
    _DecodeXMLChunkData(dataOrChunkElement, nbtiles) {
        let data = new Uint32Array(nbtiles);
        let tileElements = dataOrChunkElement.getElementsByTagName("tile");
        let i = 0;
        for (let tileElement of tileElements) {
            data[i++] = parseInt(tileElement.getAttribute("gid"), 10);
        }
        return data;
    }

    /**
     * 
     * @param {TMX_Map} map
     * @param {TMX_Chunk} chunk
     * @param {Uint32Array} data
     * @returns {TMX_Tile[][]}
     */
    _ConvertDataToTiles(map, chunk, data) {
        let tile_index = 0;

        chunk.tiles = [];

        // Here you should check that the data has the right size
        // (map_width * map_height * 4)

        for (let y = 0; y < chunk.height; ++y) {
            chunk.tiles[y] = [];
            for (let x = 0; x < chunk.width; ++x) {
                let global_tile_id = data[tile_index++];

                //TODO Read out the flags
                //let flipped_horizontally = (global_tile_id & TMX_FLIPPED_HORIZONTALLY_FLAG);
                //let flipped_vertically = (global_tile_id & TMX_FLIPPED_VERTICALLY_FLAG);
                //let flipped_diagonally = (global_tile_id & TMX_FLIPPED_DIAGONALLY_FLAG);

                // Clear the flags
                global_tile_id &= ~(TMX_FLIPPED_HORIZONTALLY_FLAG | TMX_FLIPPED_VERTICALLY_FLAG | TMX_FLIPPED_DIAGONALLY_FLAG);

                // Resolve the tile
                for (let i = map.tilesets.length - 1; i >= 0; --i) {
                    let tileset = map.tilesets[i];

                    if (tileset.firstgid <= global_tile_id) {
                        chunk.tiles[y][x] = tileset.tiles.get(global_tile_id - tileset.firstgid);
                        break;
                    }
                }
            }
        }
    }
}

/**
 * 
 * @type GPU_Layer
 */
class GPU_Layer {
    /**
     * 
     * @type number
     */
    x = 0;
    /**
     * 
     * @type number
     */
    y = 0;
    /**
     * 
     * @type number
     */
    scale = 1;
    /**
     * 
     * @type number
     */
    angle = 0;
    /**
     * 
     * @type number
     */
    alpha = 1;
    /**
     * @type string
     */
    filter = "none";
    /**
     * 
     * @type boolean
     */
    enabled = true;
}

class GPU_Bar {
    /**
     * @type number
     */
    level = 3;

    /**
     * @type number
     */
    nbColumns = 3

    /**
     * @type number
     */
    nbRows = 1;

    /**
     * @type number
     */
    cellWidth = 8;

    /**
     * @type number
     */
    cellHeight = 16;

    /**
     * @type number
     */
    cellSpacing = 4;

    /**
     * @type string
     */
    borderColor = "#101820";

    /**
     * @type string
     */
    emptyColor = "#9898c8";

    /**
     * @type string
     */
    filledColor = "#b80000";

    /**
     * @type number
     */
    x = 0;

    /**
     * @type number
     */
    y = 0;

    /**
     * @type boolean
     */
    enabled = false;
}

class GPU_Label {
    /**
     * @type string
     */
    text;

    /**
     * @type number
     */
    x = 0;

    /**
     * @type number
     */
    y = 0;

    /**
     * @type string
     */
    font = "bold 16px monospace";

    /**
     * type string
     */
    color = "#ffffff";

    /**
     * 
     * @type string
     */
    align = "start";
}

/**
 * @type GPU_HUD
 */
class GPU_HUD {
    /**
     * @type GPU_Bar[]
     */
    bars = []

    /**
     * @type GPU_Label[]
     */
    labels = []

    /**
     * @type boolean
     */
    enabled = false;

    loadingFrames = [ '⣾', '⣽', '⣻', '⢿', '⡿', '⣟','⣯', '⣷' ];

    currentLoadingFrame = 0;

    /**
     * @type string
     */
    loadingText;

    Reset() {
        this.bars = [];
        this.labels = [];
    }

    /**
     * Finds an available (unused) label. 
     * @returns {GPU_Label} label
     */
    GetAvailableLabel() {
        let label = this.labels.find(label => !label.enabled);
        if (!label) {
            label = new GPU_Label();
            this.labels.push(label);
        }
        return label;
    }

    /**
     * 
     * @param {GPU_Label} label
     * @param {string} text
     */
    SetLabelText(label, text) {
        label.text = text;
    }

    /**
     * 
     * @param {GPU_Label} label
     * @param {string} color
     */
    SetLabelColor(label, color) {
        label.color = color;
    }

    /**
     * 
     * @param {GPU_Label} label
     * @param {string} font
     */
    SetLabelFont(label, font) {
        label.font = font;
    }

    /**
     * 
     * @param {GPU_Label} label
     * @param {string} align
     */
    SetLabelAlign(label, align) {
        label.align = align;
    }

    /**
     * Enable the sprite so it is drawn. 
     * @param {GPU_Label} label
     */
    EnableLabel(label) {
        label.enabled = true;
    }

    /**
     * Enable the sprite so it is drawn. 
     * @param {GPU_Label} label
     */
    DisableLabel(label) {
        label.enabled = false;
    }

    /**
     * 
     * @param {GPU_Label} label
     * @param {number} x 
     * @param {number} y 
     */
    SetLabelPosition(label, x, y) {
        label.x = x;
        label.y = y;
    }

    /**
     * Finds an available (unused) bar. 
     * @returns {GPU_Bar} bar
     */
    GetAvailableBar() {
        let bar = this.bars.find(bar => !bar.enabled);
        if (!bar) {
            bar = new GPU_Bar();
            this.bars.push(bar);
        }
        return bar;
    }

    /**
     * 
     * @param {GPU_Bar} bar
     * @param {number} x 
     * @param {number} y 
     */
    SetBarPosition(bar, x, y) {
        bar.x = x;
        bar.y = y;
    }

    /**
     * 
     * @param {GPU_Bar} bar
     * @param {number} nbColumns 
     * @param {number} nbRows 
     */
    SetBarSize(bar, nbColumns = 3, nbRows = 1) {
        bar.nbColumns = nbColumns;
        bar.nbRows = nbRows;
    }

    /**
     * 
     * @param {GPU_Bar} bar
     * @param {number} level
     */
    SetBarLevel(bar, level) {
        bar.level = Math.max(0, Math.min(level, bar.nbColumns * bar.nbRows));
    }

    /**
     *
     * @param {GPU_Bar} bar 
     * @param {number} cellWidth 
     * @param {number} cellHeight 
     * @param {number} cellSpacing 
     * @param {string} borderColor 
     * @param {string} emptyColor 
     * @param {string} filledColor 
     */
    SetBarStyle(bar, cellWidth, cellHeight, cellSpacing, borderColor, emptyColor, filledColor) {
        bar.cellWidth = cellWidth;
        bar.cellHeight = cellHeight;
        bar.cellSpacing = cellSpacing;
        bar.borderColor = borderColor;
        bar.emptyColor = emptyColor;
        bar.filledColor = filledColor;
    }

    /**
     * Enable the sprite so it is drawn. 
     * @param {GPU_Bar} bar
     */
    EnableBar(bar) {
        bar.enabled = true;
    }

    /**
     * Enable the sprite so it is drawn. 
     * @param {GPU_Bar} bar
     */
    DisableBar(bar) {
        bar.enabled = false;
    }

    /**
     * 
     * @param {string} text 
     */
    SetLoadingText(text) {
        if(text) {
            this.currentLoadingFrame =  (this.currentLoadingFrame + 1) % this.loadingFrames.length;
            this.loadingText = `${this.loadingFrames[this.currentLoadingFrame]}${text}`;
            console.log(this.loadingText);
        } else {
            this.loadingText = null;
        }
    }
}

class Playnewton_GPU {

    /**
     * 
     * @type GPU_Layer[]
     */
    layers = [];

    /**
     * @type GPU_Sprite[]
     */
    sprites = [];

    /**
     * @type GPU_Hud
     */
    HUD = new GPU_HUD();

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
     * @returns {Playnewton_GPU}
     */
    constructor() {
        this.fpsLimiter = new GPU_FpsLimiter();
    }

    Reset() {
        this.layers = [];
        this.sprites = [];
        this.HUD.Reset();
    }

    /**
     * @param {boolean} enabled 
     */
    EnableHUD(enabled) {
        this.HUD.enabled = enabled;
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
     * Creates a picture.
     * @param {ImageBitmap} bitmap
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @returns {GPU_Spriteset}
     */
    CreatePicture(bitmap, x = 0, y = 0, w = undefined, h = undefined) {
        let spritePicture = new GPU_SpritePicture();
        spritePicture.bitmap = bitmap;
        spritePicture.x = x;
        spritePicture.y = y;
        spritePicture.w = w || bitmap.width;
        spritePicture.h = h || bitmap.height;
        return spritePicture;
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
        sprite.animationMode = mode;
        if (sprite.animation !== animation) {
            sprite.animation = animation;
            sprite.animationCurrentFrameIndex = 0;
            sprite.animationCurrentTime = 0;
            sprite.picture = sprite.animation.frames[0].picture;
    }
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
     * 
     * @param {GPU_Sprite} sprite
     * @param {number} z order (greater = in front), Math.floor(z) give the layer index
     */
    SetSpriteZ(sprite, z) {
        sprite.z = z;
    }

    /**
     * Apply rotozoom effect on sprite
     * @param {GPU_Sprite} sprite
     * @param {number} scale size factor
     * @param {number} angle rotation angle in radians
     */
    SetSpriteRotozoom(sprite, scale = 1, angle = 0) {
        sprite.scale = scale;
        sprite.angle = angle;
    }

    /**
     * @param {number} z order (greater = in front), Math.floor(z) give the layer index
     * @returns {GPU_Layer}
     */
    GetLayer(z) {
        z = Math.floor(z);
        let layer = this.layers[z];
        if (!layer) {
            layer = new GPU_Layer();
            this.layers[z] = layer;
        }
        return layer;
    }

    /**
     * @param {GPU_Layer} layer
     */
    EnableLayer(layer) {
        layer.enabled = true;
    }

    /**
     * @param {GPU_Layer} layer
     */
    DisableLayer(layer) {
        layer.enabled = false;
    }

    /**
     * @param {GPU_Layer} layer
     * @param {number} scale size factor
     * @param {number} angle rotation angle in radians
     */
    SetLayerRotozoom(layer, scale = 1, angle = 0) {
        layer.scale = scale;
        layer.angle = angle;
    }

    /**
     * @param {GPU_Layer} layer
     * @param {number} alpha opacity
     */
    SetLayerOpacity(layer, alpha = 1) {
        layer.alpha = alpha;
    }

    /**
     * Finds an available (unused) sprite. 
     * @returns {GPU_Sprite} sprite
     */
    GetAvailableSprite() {
        let sprite = this.sprites.find(sprite => !sprite.enabled);
        if (!sprite) {
            sprite = new GPU_Sprite();
            this.sprites.push(sprite);
        }
        return sprite;
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
        this.ctx = canvas.getContext("2d", {alpha: false});
        this.ctx.imageSmoothingEnabled = false;
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
            this._UpdateSprites(elapsedTime);
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this._DrawSprites();
                this._DrawHUD(this.HUD);
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
        for (let z = 0; z < this.layers.length; ++z) {
            let layer = this.layers[z];
            if (layer && layer.enabled) {
                this.ctx.save();
                this.ctx.filter = layer.filter;
                if (layer.x !== 0 && layer.x !== 0) {
                    this.ctx.translate(layer.x, layer.y);
                }
                if (layer.angle !== 0 || layer.scale !== 1) {
                    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
                    this.ctx.rotate(layer.angle);
                    this.ctx.scale(layer.scale, layer.scale);
                    this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
                }
                if (layer.alpha !== 1) {
                    this.ctx.globalAlpha = layer.alpha;
                }
                for (let sprite of this.sprites) {
                    if (z === Math.floor(sprite.z)) {
                        if (this._IsSpriteVisible(sprite)) {
                            this._DrawSprite(sprite);
                        }
                    }
                }
                this.ctx.restore();
            }
        }
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
        if (sprite.scale !== 1 || sprite.angle !== 0) {
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

    /**
     * 
     * @param {GPU_HUD} hud 
     */
    _DrawHUD(hud) {
        if (hud.enabled) {
            this.ctx.save();
            for (let bar of hud.bars) {
                this._DrawBar(bar);
            }
            for (let label of hud.labels) {
                this._DrawLabel(label);
            }
            this.ctx.restore();
            this.ctx.save();
            this._DrawLoadingText(hud);
            this.ctx.restore();
        }
    }

    /**
     * 
     * @param {type} label
     */
    _DrawLabel(label) {
        this.ctx.font = label.font;
        this.ctx.fillStyle = label.color;
        this.ctx.textAlign = label.align;
        this.ctx.fillText(label.text, label.x, label.y);
    }

    /**
     * 
     * @param {GPU_HUD} hud 
     */
    _DrawLoadingText(hud) {
        if(hud.loadingText) {
            console.log(hud.loadingText);
            this.ctx.font = "bold 48px monospace";
            this.ctx.fillStyle = "#ffffff";
            this.ctx.textAlign = "right";
            this.ctx.textBaseline = "bottom";
            this.ctx.fillText(hud.loadingText, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * 
     * @param {GPU_Bar} bar 
     */
    _DrawBar(bar) {
        let x, y;
        let level = bar.level;
        for (let x = 0; x < bar.nbColumns; ++x) {
            for (let y = 0; y < bar.nbRows; ++y) {
                this.ctx.beginPath();
                this.ctx.rect(-0.5 + bar.x + x * (bar.cellWidth + bar.cellSpacing), -0.5 + bar.y + y * (bar.cellHeight + bar.cellSpacing), bar.cellWidth, bar.cellHeight);
                this.ctx.fillStyle = level-- > 0 ? bar.filledColor : bar.emptyColor;
                this.ctx.fill();
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = bar.borderColor;
                this.ctx.stroke();
            }
        }
    }
}

/**
 * 
 * @type PPU_Intersection
 */
class PPU_Intersection {
    /**
     * @type boolean
     */
    top;
    /**
     * @type boolean
     */
    bottom;
    /**
     * @type boolean
     */
    left;
    /**
     * @type boolean
     */
    right;

    /**
     * @type number
     */
    dx;

    /**
     * @type number
     */
    dy;

    /**
     * 
     * @returns {boolean}
     */
    get horizontalOnly() {
        return (this.left || this.right) && (!this.top && !this.bottom);
    }

    /**
     * 
     * @returns {boolean}
     */
    get verticalOnly() {
        return (this.top || this.bottom) && (!this.left && !this.right);
    }
}

/**
 * 
 * @type PPU_Shape
 */
class PPU_Shape {

    get left() {
        return 0;
    }
    get top() {
        return 0;
    }

    get right() {
        return 0;
    }
    get bottom() {
        return 0;
    }

    get width() {
        return this.right - this.left;
    }

    get height() {
        return this.bottom - this.top;
    }
}

const PPU_DEFAULT_SHAPE = new PPU_Shape();


/**
 * 
 * @type PPU_Circle
 */
class PPU_Circle extends PPU_Shape {
    /**
     * 
     * @type number
     */
    x = 0;
    /**
     * 
     * @type number
     */
    y = 0;
    /**
     * 
     * @type number
     */
    radius = 16;

    get left() {
        return this.x - this.radius;
    }
    get top() {
        return this.y - this.radius;
    }

    get right() {
        return this.x + this.radius;
    }
    get bottom() {
        return this.y + this.radius;
    }

}

/**
 * 
 * @type PPU_Rectangle
 */
class PPU_Rectangle extends PPU_Shape {

    /**
     * 
     * @type number
     */
    x = 0;
    /**
     * 
     * @type number
     */
    y = 0;
    /**
     * 
     * @type number
     */
    w = 32;
    /**
     * 
     * @type number
     */
    h = 32;

    get left() {
        return this.x;
    }
    get top() {
        return this.y;
    }

    get right() {
        return this.left + this.w;
    }
    get bottom() {
        return this.top + this.h;
    }
}

/**
 * 
 * @type PPU_Vector
 */
class PPU_Vector {
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
     * @param {number} x
     * @param {number} y
     * @returns {PPU_Vector}
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * 
     * @param {PPU_Vector} force
     */
    addForce(force) {
        this.x += force.x;
        this.y += force.y;
    }
}

/**
 * 
 * @type PPU_World
 */
class PPU_World {

    constructor() {
        this.bounds = new PPU_Rectangle();
        this.bounds.x = 0;
        this.bounds.y = 0;
        this.bounds.w = PLAYNEWTON_DEFAULT_SCREEN_WIDTH;
        this.bounds.h = PLAYNEWTON_DEFAULT_SCREEN_HEIGHT;
    }
    /**
     * 
     * @type PPU_Rectangle
     */
    bounds = new PPU_Rectangle();
    /**
     * 
     * @type PPU_Vector
     */
    gravity = new PPU_Vector();
}

/**
 * 
 * @type PPU_BodyTouches
 */
class PPU_BodyTouches {
    /**
     * @type PPU_Body
     */
    left;
    /**
     * @type PPU_Body
     */
    right;
    /**
     * @type PPU_Body
     */
    top;
    /**
     * @type PPU_Body
     */
    bottom;

    reset() {
        this.left = null;
        this.right = null;
        this.top = null;
        this.bottom = null;
    }
}

/**
 * 
 * @type PPU_Body
 */
class PPU_Body {
    /**
     * 
     * @type PPU_Vector
     */
    previousPosition = new PPU_Vector();

    /**
     * 
     * @type PPU_Vector
     */
    position = new PPU_Vector();

    /**
     * 
     * @type PPU_Vector
     */
    velocity = new PPU_Vector();

    /**
     * 
     * @type number
     */
    minXVelocity = -10000;

    /**
     * 
     * @type number
     */
    maxXVelocity = 10000;
    /**
     * 
     * @type number
     */
    minYVelocity = -10000;

    /**
     * 
     * @type number
     */
    maxYVelocity = 10000;

    /**
     * @type boolean 
     */
    immovable = false;

    /**
     * 
     * @type PPU_Shape
     */
    shape = PPU_DEFAULT_SHAPE;

    /**
     * Keep the body in world bounds?
     * @type boolean
     */
    collideWorldBounds = false;

    /**
     * @type PPU_BodyTouches
     */
    touches = new PPU_BodyTouches();

    /**
     * 
     * @type boolean
     */
    enabled = false;

    /**
     * @type string
     */
    debugColor;

    /**
     * 
     * @returns {boolean}
     */
    get movable() {
        return !this.immovable;
    }

    /**
     * @param {boolean} movable
     */
    set movable(movable) {
        this.immovable = !movable;
    }

    /**
     * 
     * @returns {number}
     */
    get left() {
        return this.position.x + this.shape.left;
    }

    /**
     * @param {number} x
     */
    set left(x) {
        this.position.x = x - this.shape.left;
    }

    /**
     * 
     * @returns {number}
     */
    get top() {
        return this.position.y + this.shape.top;
    }

    /**
     * @param {number} y
     */
    set top(y) {
        this.position.y = y - this.shape.top;
    }

    /**
     * 
     * @returns {number}
     */
    get right() {
        return this.position.x + this.shape.right;
    }

    /**
     * @param {number} x
     */
    set right(x) {
        this.position.x = x - this.shape.right;
    }

    /**
     * 
     * @returns {number}
     */
    get bottom() {
        return this.position.y + this.shape.bottom;
    }

    /**
     * @param {number} y
     */
    set bottom(y) {
        this.position.y = y - this.shape.bottom;
    }

    /**
     * 
     * @returns {number}
     */
    get width() {
        return this.shape.width;
    }

    /**
     * 
     * @returns {number}
     */
    get height() {
        return this.shape.height;
    }

    /**
     * 
     * @returns {number}
     */
    get centerX() {
        return (this.left + this.right) / 2;
    }

    /**
     * 
     * @returns {number}
     */
    get centerY() {
        return (this.top + this.bottom) / 2;
    }

    /**
     * 
     * @returns {boolean}
     */
    get isGoingLeft() {
        return this.position.x < this.previousPosition.x;
    }

    /**
     * 
     * @returns {boolean}
     */
    get isGoingRight() {
        return this.position.x > this.previousPosition.x;
    }

    /**
     * 
     * @returns {boolean}
     */
    get isGoingUp() {
        return this.position.y < this.previousPosition.y;
    }

    /**
     * 
     * @returns {boolean}
     */
    get isGoingDown() {
        return this.position.y > this.previousPosition.y;
    }
}

/**
 * Physics Processing Unit for arcade physic and collision detection
 * @type Playnewton_PPU
 */
class Playnewton_PPU {
    /**
     * 
     * @type PPU_World
     */
    world;

    /**
     * 
     * @type PPU_Body[] 
     */
    bodies = [];

    /**
     * 
     */
    constructor() {
        this.world = new PPU_World();
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    SetWorldBounds(x, y, w, h) {
        this.world.bounds.x = x;
        this.world.bounds.y = y;
        this.world.bounds.w = w;
        this.world.bounds.h = h;
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    SetWorldGravity(x, y) {
        this.world.gravity.x = x;
        this.world.gravity.y = y;
    }

    /**
     * Finds an available (unused) body. 
     * @returns {PPU_Body} body
     */
    GetAvailableBody() {
        let body = this.bodies.find((body) => !body.enabled);
        if (!body) {
            body = new PPU_Body();
            this.bodies.push(body);
        }
        return body;
    }

    /**
     * Enable the body so it is updated. 
     * @param {PPU_Body} body
     */
    EnableBody(body) {
        body.enabled = true;
    }

    /**
     * Set collision rectangle on body
     * @param {PPU_Body} body
     * @param {number} leftx left x
     * @param {number} topy top y
     * @param {number} w
     * @param {number} h
     */
    SetBodyRectangle(body, leftx, topy, w, h) {
        body.shape = new PPU_Rectangle();
        body.shape.x = leftx;
        body.shape.y = topy;
        body.shape.w = w;
        body.shape.h = h;
    }

    /**
     * Set collision circle on body
     * @param {PPU_Body} body
     * @param {number} centerx
     * @param {number} centery
     * @param {number} radius
     */
    SetBodyCircle(body, centerx, centery, radius) {
        body.shape = new PPU_Circle();
        body.shape.centerx = centerx;
        body.shape.centery = centery;
        body.shape.radius = radius;
    }

    /**
     * Disables the body so it is not updated. 
     * Disabled bodies are returned by the function GetAvailableBody as available 
     * @param {PPU_Body} body
     */
    DisableBody(body) {
        body.enabled = false;
    }

    /**
     * @param {PPU_Body} body
     * @param {number} minX
     * @param {number} maxX
     * @param {number} minY
     * @param {number} maxY
     */
    SetBodyVelocityBounds(body, minX, maxX, minY, maxY) {
        body.minXVelocity = minX;
        body.maxXVelocity = maxX;
        body.minYVelocity = minY;
        body.maxYVelocity = maxY;
    }

    /**
     * @param {PPU_Body} body
     * @param {boolean} immovable 
     */
    SetBodyImmovable(body, immovable) {
        body.immovable = immovable;
    }

    /**
     * @param {PPU_Body} body
     * @param {number} x 
     * @param {number} y 
     */
    SetBodyPosition(body, x, y) {
        body.position.x = x;
        body.position.y = y;
    }

    /**
     * @param {PPU_Body} body
     * @param {number} vx 
     * @param {number} vy 
     */
    SetBodyVelocity(body, vx, vy) {
        body.velocity.x = vx;
        body.velocity.y = vy;
    }

    /**
     * @param {PPU_Body} body
     * @param {boolean} immovable 
     */
    SetBodyImmovable(body, immovable) {
        body.immovable = immovable;
    }

    /**
     * @param {PPU_Body} body
     * @param {boolean} collide 
     */
    SetBodyCollideWorldBounds(body, collide) {
        body.collideWorldBounds = collide;
    }

    Update() {
        for (let body of this.bodies) {
            this._MoveBody(body);
        }
        for (let body of this.bodies) {
            body.debugColor = "#00FF00";
            body.touches.reset();
        }
        for (let bodyA of this.bodies) {
            for (let bodyB of this.bodies) {
                this._CollideBodies(bodyA, bodyB);
            }
        }
        for (let body of this.bodies) {
            this._KeepBodyInWorldBound(body);
        }
    }

    /**
     * 
     * @param ctx CanvasRenderingContext2D
     */
    DebugDraw(ctx) {
        ctx.save();
        for (let body of this.bodies) {
            if (body.enabled) {
                ctx.strokeStyle = body.debugColor || "#00FF00";
                ctx.strokeRect(body.left, body.top, body.width, body.height);
            }
        }
        ctx.restore();
    }

    /**
     * 
     * @param {PPU_Body} bodyA
     * @param {PPU_Body} bodyB
     */
    _CollideBodies(bodyA, bodyB) {
        if (bodyA !== bodyB && bodyA.enabled && bodyB.enabled) {
            if (bodyA.movable && bodyB.immovable) {
                this._CollideMovableAndImmovableBodies(bodyA, bodyB);
            } else if (bodyA.immovable && bodyB.movable) {
                this._CollideMovableAndImmovableBodies(bodyB, bodyA);
            } else if (bodyA.movable && bodyB.movable) {
                //TODO
            }
        }
    }

    /**
     * 
     * @param {PPU_Body} movableBody
     * @param {PPU_Body} immovableBody
     */
    _CollideMovableAndImmovableBodies(movableBody, immovableBody) {
        let intersection = this._CheckIfMovableBodyIntersectsImmovableBody(movableBody, immovableBody);
        if (intersection) {
            if (intersection.horizontalOnly) {
                this._SeparateMovableBodyFromImmovableBodyByX(movableBody, immovableBody);
            } else if (intersection.verticalOnly) {
                this._SeparateMovableBodyFromImmovableBodyByY(movableBody, immovableBody);
            } else {
                if (Math.abs(intersection.dx) < Math.abs(intersection.dy)) {
                    this._SeparateMovableBodyFromImmovableBodyByX(movableBody, immovableBody);
                } else {
                    this._SeparateMovableBodyFromImmovableBodyByY(movableBody, immovableBody);
                }
            }
        }
    }
    /**
     * 
     * @param {PPU_Body} movableBody
     * @param {PPU_Body} immovableBody
     * @returns {PPU_Intersection} 
     */
    _CheckIfMovableBodyIntersectsImmovableBody(movableBody, immovableBody) {
        if (movableBody.right <= immovableBody.left) {
            return null;
        }
        if (movableBody.left >= immovableBody.right) {
            return null;
        }
        if (movableBody.bottom <= immovableBody.top) {
            return null;
        }
        if (movableBody.top >= immovableBody.bottom) {
            return null;
        }
        let intersection = new PPU_Intersection();
        intersection.right = immovableBody.left < movableBody.right && movableBody.right < immovableBody.right && movableBody.left < immovableBody.left;
        intersection.left = immovableBody.left < movableBody.left && movableBody.left < immovableBody.right && movableBody.right > immovableBody.right;
        if (movableBody.top < immovableBody.top && movableBody.bottom > immovableBody.bottom) {
            intersection.bottom = movableBody.isGoingDown;
            intersection.top = movableBody.isGoingUp;
        } else if (movableBody.top > immovableBody.top && movableBody.bottom < immovableBody.bottom) {
            //NOTHING ?
        } else {
            intersection.top = immovableBody.top <= movableBody.top && movableBody.top <= immovableBody.bottom;
            intersection.bottom = immovableBody.top <= movableBody.bottom && movableBody.bottom <= immovableBody.bottom;
        }

        let dxRight = intersection.right ? immovableBody.left - movableBody.right : 0;
        let dxLeft = intersection.left ? immovableBody.right - movableBody.left : 0;
        intersection.dx = Math.abs(dxRight) > Math.abs(dxLeft) ? dxRight : dxLeft;

        let dyTop = intersection.top ? immovableBody.bottom - movableBody.top : 0;
        let dyBottom = intersection.bottom ? immovableBody.top - movableBody.bottom : 0;
        intersection.dy = Math.abs(dyTop) > Math.abs(dyBottom) ? dyTop : dyBottom;

        movableBody.debugColor = "#ff0000";
        immovableBody.debugColor = "#ff0000";
        return intersection;
    }

    /**
     * 
     * @param {PPU_Body} movableBody
     * @param {PPU_Body} immovableBody
     */
    _SeparateMovableBodyFromImmovableBodyByX(movableBody, immovableBody) {
        if (movableBody.left < immovableBody.left && movableBody.right < immovableBody.right) {
            movableBody.right = immovableBody.left;
            movableBody.touches.right = immovableBody;
        } else {
            movableBody.left = immovableBody.right;
            movableBody.touches.left = immovableBody;
        }
    }

    /**
     * 
     * @param {PPU_Body} bodyA
     * @param {PPU_Body} bodyB
     */
    _SeparateMovableBodiesByX(bodyA, bodyB) {
        //TODO
    }

    /**
     * 
     * @param {PPU_Body} bodyA
     * @param {PPU_Body} bodyB
     */
    _SeparateBodiesByY(bodyA, bodyB) {
        if (bodyA.movable && bodyB.immovable) {
            this._SeparateMovableBodyFromImmovableBodyByY(bodyA, bodyB);
        } else
        if (bodyA.immovable && bodyB.movable) {
            this._SeparateMovableBodyFromImmovableBodyByY(bodyB, bodyA);
        } else if (bodyA.movable && bodyB.movable) {
            this._SeparateMovableBodiesByY(bodyB, bodyA);
        }
    }

    /**
     * 
     * @param {PPU_Body} movableBody
     * @param {PPU_Body} immovableBody
     */
    _SeparateMovableBodyFromImmovableBodyByY(movableBody, immovableBody) {
        if (movableBody.bottom > immovableBody.top && movableBody.top < immovableBody.top) {
            movableBody.bottom = immovableBody.top;
            movableBody.touches.bottom = immovableBody;
        } else {
            movableBody.top = immovableBody.bottom;
            movableBody.touches.top = immovableBody;
        }
    }

    /**
     * 
     * @param {PPU_Body} bodyA
     * @param {PPU_Body} bodyB
     */
    _ComputeBodiesOverlapX(bodyA, bodyB) {
        if (bodyA.isGoingLeft)
            if (bodyA.left < bodyB.left) {
                return bodyA.right - bodyB.left;
            } else {
                return bodyB.right - bodyA.left;
            }
    }

    /**
     * 
     * @param {PPU_Body} bodyA
     * @param {PPU_Body} bodyB
     */
    _ComputeBodiesOverlapY(bodyA, bodyB) {
        if (bodyA.top < bodyB.top) {
            return bodyA.bottom - bodyB.top;
        } else {
            return bodyB.bottom - bodyA.top;
        }
    }

    /**
     * 
     * @param {PPU_Body} body
     */
    _MoveBody(body) {
        if (body.enabled && !body.immovable) {
            body.previousPosition.x = body.position.x;
            body.previousPosition.y = body.position.y;

            body.velocity.addForce(this.world.gravity);

            if (body.velocity.x > body.maxXVelocity) {
                body.velocity.x = body.maxXVelocity;
            } else if (body.velocity.x < body.minXVelocity) {
                body.velocity.x = body.minXVelocity;
            }

            if (body.velocity.y > body.maxYVelocity) {
                body.velocity.y = body.maxYVelocity;
            } else if (body.velocity.y < body.minYVelocity) {
                body.velocity.y = body.minYVelocity;
            }

            body.position.addForce(body.velocity);
        }
    }

    /**
     * 
     * @param {PPU_Body} body
     */
    _KeepBodyInWorldBound(body) {
        if (body.enabled && body.collideWorldBounds) {
            if (body.left < this.world.bounds.left) {
                body.left = this.world.bounds.left;
            }
            if (body.top < this.world.bounds.top) {
                body.top = this.world.bounds.top;
            }
            if (body.right > this.world.bounds.right) {
                body.right = this.world.bounds.right;
            }
            if (body.bottom > this.world.bounds.bottom) {
                body.bottom = this.world.bounds.bottom;
            }
        }

    }
}

class Playnewton {
    /**
     * 
     * @type Playnewton_DRIVE
     */
    DRIVE = new Playnewton_DRIVE();

    /**
     * 
     * @type Playnewton_GPU
     */
    GPU = new Playnewton_GPU();

    /**
     * 
     * @type Playnewton_PPU
     */
    PPU = new Playnewton_PPU();

    /**
     * 
     * @type Playnewton_CTRL
     */
    CTRL = new Playnewton_CTRL();

    ENUMS = {
        GPU_AnimationMode: GPU_AnimationMode,
        GPU_AnimationState: GPU_AnimationState
    }
}

export default new Playnewton();
