import { Board } from "../board";
import { Painter } from "../painter";
import { StateType } from "../state";
import { Tile, Wall } from "../types";
import { equal } from "../utils";

export class PlacingObjectsState {
    readonly type: StateType = StateType.PlacingObjects;

    private painter: Painter;

    private selectedTile: Tile | null = null;

    private board: Board;

    constructor(board: Board) {
        const canvas = <HTMLCanvasElement>document.getElementById("board");
        canvas.addEventListener("click", e => this.onCanvasClick(e));

        this.painter = new Painter(canvas, board.width, board.height);
        this.painter.paint(null, board);
        this.board = board;
    }

    private onCanvasClick(event: MouseEvent) {
        const clickedTile = this.board.canvasCoordinatesToTile(event.offsetX, event.offsetY);
        const selectedTile = this.selectedTile;

        if (selectedTile) {
            // Deselect the tile
            this.selectedTile = null;

            if (equal(clickedTile, selectedTile)) {
                this.board.specialTiles.cycleTile(clickedTile);
            } else {
                let wall: Wall;

                // Make sure the wall isn't placed on the same tile
                if (equal(clickedTile, selectedTile)) {
                    throw new Error("Wall can't go between the same tile.");
                }

                // Make sure wall always has the same orientation
                if (clickedTile[0] <= selectedTile[0] && clickedTile[1] <= selectedTile[1]) {
                    wall = [clickedTile, selectedTile];
                } else {
                    wall = [selectedTile, clickedTile];
                }

                if (this.board.wallExists(wall)) {
                    this.board.removeWall(wall);
                } else {
                    this.board.addWall(wall);
                }
            }
        } else {
            this.selectedTile = clickedTile;
        }

        this.painter.paint(this.selectedTile, this.board);
    }
}
