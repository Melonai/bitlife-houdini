import { Board, Tile } from "../board";
import { puzzles } from "../existing_puzzles";
import { Painter } from "../painter";
import {
    boardToPuzzle,
    isPuzzleSubsetOfAnother,
    Puzzle,
    puzzleToBoard,
    rotatePuzzle,
} from "../puzzle";
import { StateType, switchState } from "../state";
import { equal } from "../utils";
import { createWall } from "../wall";
import { ShowingSolutionState } from "./showing_solution";

export class PlacingObjectsState {
    readonly type: StateType = StateType.PlacingObjects;

    private painter: Painter;

    private selectedTile: Tile | null = null;

    private board: Board;

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
            } else {
                const wall = createWall(clickedTile, selectedTile);
                if (this.board.wallExists(wall)) {
                    this.board.removeWall(wall);
                } else {
                    this.board.addWall(wall);
                }
            }

            this.narrowApplicableExistingPuzzles(puzzles);
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

        const applicableExistingPuzzles = [];

        for (const existingPuzzle of existingPuzzles) {
            for (const [rotation, givenPuzzle] of givenPuzzles.entries()) {
                if (isPuzzleSubsetOfAnother(givenPuzzle, existingPuzzle)) {
                    // Rotate the existing puzzle in the opposite direction to the given puzzle, so that they are the same.
                    applicableExistingPuzzles.push(rotatePuzzle(existingPuzzle, 4 - rotation));
                }
            }
        }

        const messageBox = document.getElementById("found-existing-puzzle-message")!;
        const button = document.getElementById("found-existing-puzzle-button")!;

        if (applicableExistingPuzzles.length === 1) {
            const foundPuzzle = applicableExistingPuzzles[0];

            messageBox.classList.remove("hidden");
            button.onclick = () => {
                messageBox.classList.add("hidden");

                this.board = puzzleToBoard(foundPuzzle);
                this.painter.paint(this.selectedTile, this.board);
            };
        } else {
            messageBox.classList.add("hidden");
        }
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
