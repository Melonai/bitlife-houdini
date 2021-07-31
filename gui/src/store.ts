import type { Tile, Wall } from "./types";
import { prepareWall } from "./game";
import { equal } from "./utils";

let store: Store | null = null;

export enum AppState {
    CreatingBoard,
    PlacingWalls,
}

export class Store {
    private currentState: AppState = AppState.CreatingBoard;

    private _context: CanvasRenderingContext2D | null = null;

    private _width: number | null = null;
    private _height: number | null = null;

    private _selectedTile: Tile | null = null;
    private _specialTiles: SpecialTiles | null = null;

    private _walls: Wall[] | null = null;

    static get the(): Store {
        if (store !== null) {
            return store;
        }

        throw new Error("Accessing store before initialization.");
    }

    static create() {
        if (store === null) {
            store = new Store();
        } else {
            throw new Error("Only one store is allowed to exist.");
        }
    }

    get state(): AppState {
        return this.currentState;
    }

    get context(): CanvasRenderingContext2D {
        this.verifyBoard();
        return this._context!;
    }

    private verifyBoard() {
        if (this.state === AppState.CreatingBoard) {
            throw new Error("Board has been created yet.");
        }
    }

    get width(): number {
        this.verifyBoard();
        return this._width!;
    }

    get height(): number {
        this.verifyBoard();
        return this._height!;
    }

    get selectedTile(): Tile | null {
        this.verifyBoard();
        return this._selectedTile;
    }

    selectTile(tile: Tile) {
        this._selectedTile = tile;
    }

    deselectTile() {
        this._selectedTile = null;
    }

    createBoard(context: CanvasRenderingContext2D, width: number, height: number) {
        if (this.currentState === AppState.CreatingBoard) {
            this._width = width;
            this._height = height;

            this._walls = [];
            this._specialTiles = new SpecialTiles();
            this._context = context;

            this.currentState = AppState.PlacingWalls;
        } else {
            throw new Error("Already created Board.");
        }
    }

    get walls(): Wall[] {
        this.verifyBoard();
        return this._walls!;
    }

    wallExists(wall: Wall): boolean {
        this.verifyBoard();
        const wallToFind = prepareWall(wall);
        return this.walls.some(otherWall => equal(wallToFind, otherWall));
    }

    addWall(wall: Wall) {
        this.verifyBoard();
        const newWall = prepareWall(wall);
        this.walls.push(newWall);
    }

    removeWall(wall: Wall) {
        this.verifyBoard();
        const wallToRemove = prepareWall(wall);
        const wallIndex = this.walls.findIndex(wall => equal(wall, wallToRemove));

        if (wallIndex !== -1) {
            this.walls.splice(wallIndex, 1);
        }
    }

    get specialTiles(): SpecialTiles {
        this.verifyBoard();
        return this._specialTiles!;
    }
}

export enum TileType {
    Prisoner,
    Guard,
    Exit,
}

class SpecialTiles {
    public tiles: [Tile, TileType][] = [];

    cycleTile(tile: Tile) {
        const index = this.tiles.findIndex(([otherTile]) => equal(tile, otherTile));

        if (index !== -1) {
            const foundTile = this.tiles[index];
            if (foundTile[1] === TileType.Exit) {
                this.tiles.splice(index, 1);
            } else {
                foundTile[1] += 1;
            }
        } else {
            this.tiles.push([tile, TileType.Prisoner]);
        }
    }

    getTileType(tile: Tile): TileType | null {
        const foundTile = this.tiles.find(([otherTile]) => equal(tile, otherTile));

        if (foundTile) {
            return foundTile[1];
        }
        return null;
    }
}
