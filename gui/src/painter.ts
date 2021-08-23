import { Board, Tile } from "./board";
import { SpecialTiles, TileType } from "./special_tiles";
import { Wall } from "./wall";

export const TILE_SIZE = 50;

// TODO: Further abstract this class to draw only paintable objects.
export class Painter {
    private context: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, boardWidth: number, boardHeight: number) {
        this.context = canvas.getContext("2d")!;

        canvas.style.width = boardWidth * TILE_SIZE + "px";
        canvas.style.height = boardHeight * TILE_SIZE + "px";

        const scale = window.devicePixelRatio;
        canvas.width = boardWidth * TILE_SIZE * scale;
        canvas.height = boardHeight * TILE_SIZE * scale;

        this.context.scale(scale, scale);
    }

    paint(selectedTile: Tile | null, board: Board) {
        this.paintBoard(board);

        if (selectedTile) {
            this.paintSelection(selectedTile, board);
        }

        this.paintSpecialTiles(board.specialTiles);
        this.paintWalls(board.walls);
    }

    paintBoard(board: Board) {
        this.context.fillStyle = "rgb(255, 255, 255)";
        this.context.fillRect(0, 0, board.width * TILE_SIZE, board.height * TILE_SIZE);

        this.context.fillStyle = "rgb(236, 236, 236)";

        for (let x = 0; x < board.width; x += 2) {
            for (let y = 0; y < board.height; y++) {
                // Shift X on uneven rows to create a checkered pattern.
                const actualX = x + (y % 2);
                if (board.specialTiles.getTileType([actualX, y]) !== TileType.Exit) {
                    this.context.fillRect(actualX * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }

    paintWalls(walls: Wall[]) {
        this.context.strokeStyle = "rgb(210, 210, 206)";

        for (let wall of walls) {
            let wallCorners: [[number, number], [number, number]];

            const wallSpace = 7;

            if (wall[0][0] !== wall[1][0]) {
                const x = wall[1][0] * TILE_SIZE;
                const fromY = wall[0][1] * TILE_SIZE + wallSpace;
                const toY = (wall[0][1] + 1) * TILE_SIZE - wallSpace;

                wallCorners = [
                    [x, fromY],
                    [x, toY],
                ];
            } else {
                const y = wall[1][1] * TILE_SIZE;
                const fromX = wall[0][0] * TILE_SIZE + wallSpace;
                const toX = (wall[0][0] + 1) * TILE_SIZE - wallSpace;

                wallCorners = [
                    [fromX, y],
                    [toX, y],
                ];
            }

            this.context.beginPath();
            this.context.lineWidth = 6;
            this.context.lineCap = "round";

            this.context.moveTo(...wallCorners[0]);
            this.context.lineTo(...wallCorners[1]);
            this.context.stroke();
        }
    }

    paintSpecialTiles(specialTiles: SpecialTiles) {
        for (let specialTile of specialTiles.tiles) {
            const tile = specialTile[0];

            const x = tile[0] * TILE_SIZE;
            const y = tile[1] * TILE_SIZE;

            switch (specialTile[1]) {
                case TileType.Prisoner:
                    this.paintPerson(x + 25, y + 25, "rgb(255, 145, 111)");
                    break;
                case TileType.Guard:
                    this.paintPerson(x + 25, y + 25, "rgb(111, 160, 255)");
                    break;
                case TileType.Exit:
                    this.context.fillStyle = "rgba(255, 145, 111, 0.25)";
                    this.paintRoundedRectangle(x + 7, y + 7, 36, 36, 14, true);
                    break;
                default:
                    throw new Error("Unknown tile type.");
            }
        }
    }

    paintSelection(selectedTile: Tile, board: Board) {
        let highlightedTiles: Tile[] = [
            selectedTile,
            [selectedTile[0] + 1, selectedTile[1]],
            [selectedTile[0] - 1, selectedTile[1]],
            [selectedTile[0], selectedTile[1] + 1],
            [selectedTile[0], selectedTile[1] - 1],
        ];

        for (let tile of highlightedTiles) {
            if (
                tile[0] >= 0 &&
                tile[0] < board.width &&
                tile[1] >= 0 &&
                tile[1] < board.height
            ) {
                this.context.lineWidth = 6;
                if ((tile[0] + tile[1]) % 2 == 0) {
                    this.context.strokeStyle = "rgb(255, 255, 255)";
                } else {
                    this.context.strokeStyle = "rgb(236, 236, 236)";
                }

                const x = tile[0] * TILE_SIZE;
                const y = tile[1] * TILE_SIZE;
                this.paintRoundedRectangle(x + 10, y + 10, 30, 30, 10, false);
            }
        }
    }

    paintPerson(x: number, y: number, color: string) {
        this.context.beginPath();
        this.context.arc(x, y, 15, 0, 2 * Math.PI, false);
        this.context.fillStyle = color;
        this.context.fill();
        this.context.lineWidth = 5;
        this.context.strokeStyle = "#FFFFFF";
        this.context.stroke();
    }

    paintRoundedRectangle(
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        filled: boolean,
    ) {
        this.context.beginPath();
        this.context.moveTo(x + radius, y);
        this.context.lineTo(x + width - radius, y);
        this.context.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.context.lineTo(x + width, y + height - radius);
        this.context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.context.lineTo(x + radius, y + height);
        this.context.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.context.lineTo(x, y + radius);
        this.context.quadraticCurveTo(x, y, x + radius, y);
        this.context.closePath();
        if (filled) {
            this.context.fill();
        } else {
            this.context.stroke();
        }
    }
}