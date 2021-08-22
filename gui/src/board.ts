import { TILE_SIZE } from "./painter";
import { SpecialTiles } from "./special_tiles";
import { Tile, Wall } from "./types";
import { equal } from "./utils";

export class Board {
    readonly specialTiles: SpecialTiles = new SpecialTiles();
    readonly walls: Wall[] = [];

    readonly width: number;
    readonly height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    wallExists(wallToFind: Wall): boolean {
        return this.walls.some(otherWall => equal(wallToFind, otherWall));
    }

    addWall(wall: Wall) {
        this.walls.push(wall);
    }

    removeWall(wallToRemove: Wall) {
        const wallIndex = this.walls.findIndex(wall => equal(wall, wallToRemove));

        if (wallIndex !== -1) {
            this.walls.splice(wallIndex, 1);
        }
    }

    canvasCoordinatesToTile(x: number, y: number): Tile {
        const tileX = Math.floor(x / TILE_SIZE);
        const tileY = Math.floor(y / TILE_SIZE);
    
        return [tileX, tileY];
    }
}