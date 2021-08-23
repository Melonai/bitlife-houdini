import { Board, Tile } from "../board";
import { puzzles } from "../existing_puzzles";
import { Painter } from "../painter";
import { boardToPuzzle, isPuzzleSubsetOfAnother, Puzzle, rotatePuzzle } from "../puzzle";
import { StateType, switchState } from "../state";
import { equal } from "../utils";
import { createWall } from "../wall";
import { ShowingSolutionState } from "./showing_solution";

export class PlacingObjectsState {
    readonly type: StateType = StateType.PlacingObjects;

    private painter: Painter;

    private selectedTile: Tile | null = null;

    private board: Board;
    private applicableExistingPuzzles = puzzles;

    constructor(board: Board) {
        const canvas = <HTMLCanvasElement>document.getElementById("board");
        canvas.addEventListener("click", e => this.onCanvasClick(e));

        // TODO: Remove event listeners when state is changed.
        document.addEventListener("keyup", e => {
            e.preventDefault();
            if (e.key === "Enter") {
                this.onEnter();
            }
        });

        const exportButton = document.getElementById("export-puzzle-button")!;
        exportButton.addEventListener("click", () => {
            this.exportPuzzle();
        });

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
                this.narrowApplicableExistingPuzzles(puzzles);
            } else {
                const wall = createWall(clickedTile, selectedTile);

                if (this.board.wallExists(wall)) {
                    this.board.removeWall(wall);
                    // If the wall was removed, we have to restart the list of applicable existing puzzles.
                    this.narrowApplicableExistingPuzzles(puzzles);
                } else {
                    this.narrowApplicableExistingPuzzles(this.applicableExistingPuzzles);
                    this.board.addWall(wall);
                }
            }
        } else {
            this.selectedTile = clickedTile;
        }

        this.painter.paint(this.selectedTile, this.board);
    }

    private narrowApplicableExistingPuzzles(existingPuzzles: Puzzle[]) {
        const puzzle1 = boardToPuzzle(this.board);
        const puzzle2 = rotatePuzzle(puzzle1, 1);
        const puzzle3 = rotatePuzzle(puzzle1, 2);
        const puzzle4 = rotatePuzzle(puzzle1, 3);

        const givenPuzzles = [puzzle1, puzzle2, puzzle3, puzzle4];

        this.applicableExistingPuzzles = existingPuzzles.filter(existingPuzzle => {
            return givenPuzzles.some(givenPuzzle =>
                isPuzzleSubsetOfAnother(givenPuzzle, existingPuzzle),
            );
        });

        console.log(this.applicableExistingPuzzles.length, "puzzles found.");
    }

    private onEnter() {
        this.board.solve().then(solution => {
            switchState(new ShowingSolutionState(this.board, this.painter, solution));
        });
    }

    private exportPuzzle() {
        const puzzleString = JSON.stringify(boardToPuzzle(this.board));
        navigator.clipboard.writeText(puzzleString);
    }
}
