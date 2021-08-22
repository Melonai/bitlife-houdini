import { TILE_SIZE } from "./painter";
import { SpecialTiles, TileType } from "./special_tiles";
import { Tile, Wall } from "./types";
import { equal } from "./utils";

type WasmPuzzle = {
    people: {
        guard: Tile; // Position
        prisoner: Tile; // Position
    }; // PositionState
    room: {
        width: number; // u8
        height: number; // u8
        rotation: 0; // u8
        exit: Tile; // Position
        walls: {
            from: Tile; // Position
            to: Tile; // Position
        }[]; // Vec<Wall>
    }; // Room
};

export type Solution = {
    guard: Tile;
    prisoner: Tile;
}[];

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
        const puzzle = this.toWasmPuzzle();

        const module = await import("../../wasm/pkg");

        const result = module.solve(puzzle) as Solution;
        return result;
    }

    private toWasmPuzzle(): WasmPuzzle {
        const guard = this.specialTiles.findTileOfType(TileType.Guard);
        const prisoner = this.specialTiles.findTileOfType(TileType.Prisoner);
        const exit = this.specialTiles.findTileOfType(TileType.Exit);

        if ([guard, prisoner, exit].some(special => special === null)) {
            throw new Error("Not all special tiles found");
        }

        const walls = this.walls.map(wall => {
            return {
                from: wall[0],
                to: wall[1],
            };
        });

        return {
            people: {
                guard: guard!,
                prisoner: prisoner!,
            },
            room: {
                width: this.width,
                height: this.height,
                rotation: 0,
                exit: exit!,
                walls,
            },
        };
    }
}
