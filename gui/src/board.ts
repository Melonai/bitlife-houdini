import { TILE_SIZE } from "./painter";
import { boardToPuzzle } from "./puzzle";
import { SpecialTiles } from "./special_tiles";
import { equal } from "./utils";
import { Wall } from "./wall";

export class Board {
    readonly specialTiles: SpecialTiles;
    readonly walls: Wall[];

    readonly width: number;
    readonly height: number;

    constructor(
        width: number,
        height: number,
        walls: Wall[] = [],
        specialTiles: SpecialTiles = new SpecialTiles(),
    ) {
        this.width = width;
        this.height = height;
        this.walls = walls;
        this.specialTiles = specialTiles;
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

    async solve(): Promise<Solution> {
        const puzzle = boardToPuzzle(this);

        const module = await import("../../wasm/pkg");

        const result = module.solve(puzzle) as Solution;
        return result;
    }
}

export type Solution = {
    guard: Tile;
    prisoner: Tile;
}[];

export type Tile = [number, number];