import type { Tile, Wall } from "./types";
import { prepareWall } from "./game";
import { equal } from "./utils";

let store: Store = null;

export enum AppState {
    CreatingBoard,
    PlacingWalls,
}

export class Store {
    private currentState: AppState = AppState.CreatingBoard;

    public context: CanvasRenderingContext2D;

    private _width: number | null;
    private _height: number | null;

    private _selectedTile: Tile | null;

    private _walls: Wall[] | null;

    static get the(): Store {
        if (store !== null) {
            return store;
        }

        throw new Error("Accessing store before initialization.");
    }

    static create(context: CanvasRenderingContext2D) {
        if (store === null) {
            store = new Store(context);
        } else {
            throw new Error("Only one store is allowed to exist.");
        }
    }

    private constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    get state(): AppState {
        return this.currentState;
    }

    private verifyBoard() {
        if (this.state === AppState.CreatingBoard) {
            throw new Error("Board has been created yet.");
        }
    }

    get width(): number {
        this.verifyBoard();
        return this._width;
    }

    get height(): number {
        this.verifyBoard();
        return this._height;
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

    setBoardSize(width: number, height: number) {
        if (this.currentState === AppState.CreatingBoard) {
            this._width = width;
            this._height = height;

            this._walls = [];

            this.currentState = AppState.PlacingWalls;
        } else {
            throw new Error("Already set board size.");
        }
    }

    get walls(): Wall[] {
        this.verifyBoard();
        return this._walls;
    }

    wallExists(wall: Wall): boolean {
        this.verifyBoard();
        const wallToFind = prepareWall(wall);
        return this._walls.some(otherWall => equal(wallToFind, otherWall));
    }

    addWall(wall: Wall) {
        this.verifyBoard();
        const newWall = prepareWall(wall);
        this._walls.push(newWall);
    }

    removeWall(wall: Wall) {
        this.verifyBoard();
        const wallToRemove = prepareWall(wall);
        const wallIndex = this._walls.findIndex(wall => equal(wall, wallToRemove));

        if (wallIndex !== -1) {
            this._walls.splice(wallIndex, 1);
        }
    }
}
