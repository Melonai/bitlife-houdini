import { Board, Solution } from "../board";
import { Painter } from "../painter";
import { SpecialTiles, TileType } from "../special_tiles";
import { StateType } from "../state";
import { clone } from "../utils";
export class ShowingSolutionState {
    readonly type: StateType = StateType.ShowingSolution;

    private painter: Painter;

    private originalBoard: Board;

    private solution: Solution;
    private progress = -1;

    constructor(originalBoard: Board, painter: Painter, solution: Solution) {
        this.solution = solution;
        this.painter = painter;

        const exitTile = originalBoard.specialTiles.findTileOfType(TileType.Exit)!;
        const specialTiles = new SpecialTiles();
        specialTiles.setTile(exitTile, TileType.Exit);

        this.originalBoard = new Board(
            originalBoard.width,
            originalBoard.height,
            clone(originalBoard.walls),
            specialTiles,
        );

        // TODO: Remove event listener when state is changed.
        document.addEventListener("keyup", e => {
            switch (e.key) {
                case "ArrowLeft":
                    this.back();
                    break;
                case "ArrowRight":
                    this.advance();
                    break;
            }
        });

        this.advance();
    }

    advance() {
        if (this.progress < this.solution.length - 1) {
            this.progress++;
            this.paintCurrent();
        }
    }

    back() {
        if (this.progress > 0) {
            this.progress--;
            this.paintCurrent();
        }
    }

    paintCurrent() {
        const { guard, prisoner } = this.solution[this.progress];
        const exitTile = this.originalBoard.specialTiles.findTileOfType(TileType.Exit)!;

        const specialTiles = new SpecialTiles();
        specialTiles.setTile(exitTile, TileType.Exit);
        specialTiles.setTile(guard, TileType.Guard);
        specialTiles.setTile(prisoner, TileType.Prisoner);

        const newBoard = new Board(
            this.originalBoard.width,
            this.originalBoard.height,
            clone(this.originalBoard.walls),
            specialTiles,
        );

        this.painter.paint(null, newBoard);
    }
}
