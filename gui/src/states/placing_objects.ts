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
        canvas.onclick = e => this.onCanvasClick(e);

        const exportButton = document.getElementById("export-puzzle-button")!;
        exportButton.onclick = () => {
            this.exportPuzzle();
        };

        const solveButton = document.getElementById("solve-button")!;
        solveButton.onclick = () => {
            this.board.solve().then(solution => {
                if (solution) {
                    switchState(new ShowingSolutionState(this.board, this.painter, solution));
                } else {
                    const solveButton = document.getElementById("solve-button")!;
                    solveButton.innerText = "Couldn't find a solution.";
                    solveButton.setAttribute("disabled", "");
                }
            });
        };

        this.painter = new Painter(canvas, board.width, board.height);
        this.board = board;

        this.onBoardUpdate();
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
                    const xDistance = Math.abs(wall[0][0] - wall[1][0]);
                    const yDistance = Math.abs(wall[0][1] - wall[1][1]);
                    if (xDistance + yDistance === 1) {
                        this.board.addWall(wall);
                    }
                }
            }
        } else {
            this.selectedTile = clickedTile;
        }

        this.onBoardUpdate();
    }

    private onBoardUpdate() {
        const solveButton = document.getElementById("solve-button")!;
        if (this.board.isComplete()) {
            solveButton.innerText = "Solve";
            solveButton.removeAttribute("disabled");
        } else {
            solveButton.innerText = "Complete board to solve.";
            solveButton.setAttribute("disabled", "");
        }

        this.narrowApplicableExistingPuzzles(puzzles);
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

        const button = document.getElementById("found-existing-puzzle-button")!;

        if (applicableExistingPuzzles.length === 1) {
            button.removeAttribute("disabled");
            button.innerText = "Apply existing puzzle";
            const foundPuzzle = applicableExistingPuzzles[0];

            button.onclick = () => {
                this.board = puzzleToBoard(foundPuzzle);
                this.onBoardUpdate();
            };
        } else {
            button.innerText = `${applicableExistingPuzzles.length} puzzles found.`;
            button.setAttribute("disabled", "");
        }
    }

    private exportPuzzle() {
        const puzzleString = JSON.stringify(boardToPuzzle(this.board));
        navigator.clipboard.writeText(puzzleString);
    }
}
