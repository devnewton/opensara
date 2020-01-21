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
     * @type number
     */
    z = 0;
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

        document.addEventListener("keydown", (event) => this._SetKeyboardPadButton(event, true));
        document.addEventListener("keyup", (event) => this._SetKeyboardPadButton(event, false));
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
                this.keyboardVirtualPad.up = down;
                break;
            case "ArrowDown":
                this.keyboardVirtualPad.down = down;
                break;
            case "ArrowLeft":
                this.keyboardVirtualPad.left = down;
                break;
            case "ArrowRight":
                this.keyboardVirtualPad.right = down;
                break;
            case "KeyZ":
                this.keyboardVirtualPad.A = down;
                break;
            case "KeyX":
                this.keyboardVirtualPad.B = down;
                break;
            case "KeyA":
                this.keyboardVirtualPad.X = down;
                break;
            case "KeyS":
                this.keyboardVirtualPad.Y = down;
                break;
            case "KeyD":
                this.keyboardVirtualPad.L = down;
                break;
            case "KeyC":
                this.keyboardVirtualPad.L = down;
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
                layer.chunks.push(this._LoadChunkElement(map, dataElement));
                for (let chunkElement of dataElement.getElementsByTagName("chunk")) {
                    layer.chunks.push(this._LoadChunkElement(map, chunkElement));
                }
            }
            map.layers.push(layer);
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
                if (!tile.animation) {
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
            ++z;
            for (let chunk of layer.chunks) {
                for (let y = 0; y < chunk.height; ++y) {
                    for (let x = 0; x < chunk.width; ++x) {
                        let tile = chunk.tiles[y][x];
                        if (tile) {
                            let sprite = GPU.GetAvailableSprite();
                            if (sprite) {
                                let picture = picturesByTile.get(tile);
                                if (picture) {
                                    picture = GPU.CreatePicture(tile.bitmap, tile.sx, tile.sy, tile.w, tile.h);
                                    GPU.SetSpritePicture(sprite, picture);
                                }
                                let animation = animationsByTile.get(tile);
                                if (animation) {
                                    GPU.SetSpriteAnimation(sprite, animation);
                                }
                                if (animation || picture) {
                                    GPU.SetSpritePosition(sprite, mapX + (layer.x + chunk.x + x) * map.tileWidth, mapY + (layer.y + chunk.y + y) * map.tileHeight, mapZ + z);
                                    GPU.EnableSprite(sprite);
                                }
                            } else {
                                console.log("No available sprite");
                            }
                        }
                    }
                }
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
            tileset.tiles.set(tile.id, tile);
        }
        if (tileset.bitmap) {
            let maxX = tileset.bitmap.width - tileset.margin;
            let maxY = tileset.bitmap.height - tileset.margin;
            let id = 0;
            for (let y = tileset.margin; y < maxY; y += tileset.tileWidth + tileset.spacing) {
                for (let x = tileset.margin; x < maxX; x += tileset.tileHeight + tileset.spacing) {
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
     * @param {TMX_Map} map
     * @param {Element} dataOrChunkElement
     * @returns {TMX_Chunk}
     */
    _LoadChunkElement(map, dataOrChunkElement) {
        let chunk = new TMX_Chunk();

        chunk.x = parseInt(dataOrChunkElement.getAttribute("x") || 0, 10);
        chunk.y = parseInt(dataOrChunkElement.getAttribute("y") || 0, 10);
        chunk.width = parseInt(dataOrChunkElement.getAttribute("width") || map.width, 10);
        chunk.height = parseInt(dataOrChunkElement.getAttribute("height") || map.height, 10);
        let data = this._DecodeChunkData(dataOrChunkElement, chunk.width * chunk.height);
        this._ConvertDataToTiles(map, chunk, data);
        return chunk;
    }

    /**
     * 
     * @param {Element} dataOrChunkElement
     * @param {number} nbtiles
     * @returns {Uint32Array}
     */
    _DecodeChunkData(dataOrChunkElement, nbtiles) {
        switch (dataOrChunkElement.getAttribute("encoding")) {
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

        // Bits on the far end of the 32-bit global tile ID are used for tile flags
        const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
        const FLIPPED_VERTICALLY_FLAG = 0x40000000;
        const FLIPPED_DIAGONALLY_FLAG = 0x20000000;
        let tile_index = 0;

        chunk.tiles = [];

        // Here you should check that the data has the right size
        // (map_width * map_height * 4)

        for (let y = 0; y < chunk.height; ++y) {
            chunk.tiles[y] = [];
            for (let x = 0; x < chunk.width; ++x) {
                let global_tile_id = data[tile_index++];

                //TODO Read out the flags
                //let flipped_horizontally = (global_tile_id & FLIPPED_HORIZONTALLY_FLAG);
                //let flipped_vertically = (global_tile_id & FLIPPED_VERTICALLY_FLAG);
                //let flipped_diagonally = (global_tile_id & FLIPPED_DIAGONALLY_FLAG);

                // Clear the flags
                global_tile_id &= ~(FLIPPED_HORIZONTALLY_FLAG | FLIPPED_VERTICALLY_FLAG | FLIPPED_DIAGONALLY_FLAG);

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
 * @type GPU_FX
 */
class GPU_FX {
    /**
     * 
     * @type number
     */
    scale = 1;
    /**
     * 
     * @type number
     */
    rotate = 0;
    /**
     * 
     * @type number
     */
    alpha = 1;
    /**
     * 
     * @type number
     */
    zmin = -9999;
    /**
     * 
     * @type number
     */
    zmax = 9999;
    /**
     * 
     * @type boolean
     */
    enabled = false;
}

class Playnewton_GPU {

    /**
     * @type GPU_Sprite[]
     */
    sprites = [];
    /**
     * 
     * @type GPU_FX[]
     */
    fx = [];
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
     * @param {number} numfx Max number of fx
     * @returns {Playnewton_GPU}
     */
    constructor(numsprites, numfx = 16) {
        for (let s = 0; s < numsprites; ++s) {
            this.sprites.push(new GPU_Sprite());
        }
        for (let f = 0; f < numfx; ++f) {
            this.fx.push(new GPU_FX());
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
     * @param {number} z order (greater = in front)
     */
    SetSpritePosition(sprite, x, y, z = 0) {
        sprite.x = x;
        sprite.y = y;
        sprite.z = z;
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
     * @returns {GPU_FX}
     */
    GetAvailableFX() {
        return this.fx.find((fx) => !fx.enabled);
    }

    /**
     * @param {GPU_FX} fx
     */
    EnableFx(fx) {
        fx.enabled = true;
    }

    /**
     * @param {GPU_FX} fx
     */
    DisableFX(fx) {
        fx.enabled = false;
    }

    /**
     * @param {GPU_FX} fx
     * @param {number} scale size factor
     * @param {number} angle rotation angle in radians
     */
    SetFXRotozoom(fx, scale = 1, angle = 0) {
        fx.scale = scale;
        fx.angle = angle;
    }

    /**
     * @param {GPU_FX} fx
     * @param {number} alpha opacity
     */
    SetFXOpacity(fx, alpha = 1) {
        fx.alpha = alpha;
    }

    /**
     * @param {GPU_FX} fx
     * @param {number} zmin Effect apply only to sprite with zmin <= z
     * @param {number} zmax Effect apply only to sprite with z <= zmax
     */
    SetFXZRange(fx, zmin = 9999, zmax = 9999) {
        fx.zmin = zmin;
        fx.zmax = zmax;
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
        this.sprites.sort((a, b) => a.z - b.z);
        this.fx.sort((a, b) => a.zmin - b.zmin || a.zmax - b.zmax);
        let z;
        for (let sprite of this.sprites) {
            if (z !== sprite.z) {
                this._PopFX(z);
                z = sprite.z;
                this._PushFX(z);
            }
            if (this._IsSpriteVisible(sprite)) {
                this._DrawSprite(sprite);
            }
        }
        this._PopFX(z);
    }

    /**
     * 
     * @param {number} z
     */
    _PushFX(z) {
        for (let fx of this.fx) {
            if (fx.enabled && fx.zmin <= z && z <= fx.zmax) {
                this.ctx.save();
                this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
                this.ctx.rotate(fx.angle);
                this.ctx.scale(fx.scale, fx.scale);
                this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
                this.ctx.globalAlpha = fx.alpha;
            }
        }
    }

    /**
     * 
     * @param {number} z
     */
    _PopFX(z) {
        for (let fx of this.fx) {
            if (fx.enabled && fx.zmin <= z && z <= fx.zmax) {
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
