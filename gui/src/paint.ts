import { Store } from "./store";
import { getWallCorners, tileToCoordinates } from "./game";
import { SIZE } from "./context";
import { Tile } from "./types";

const paintBoard = () => {
    const context = Store.the.context;

    context.fillStyle = "rgb(255, 255, 255)";
    context.fillRect(0, 0, SIZE, SIZE);

    context.fillStyle = "rgb(236, 236, 236)";
    for (let x = 0; x < Store.the.width; x += 2) {
        for (let y = 0; y < Store.the.height; y++) {
            context.fillRect((x + (y % 2)) * 50, y * 50, 50, 50);
        }
    }

    paintSelectedTiles();
};

const paintSelectedTiles = () => {
    const selectedTile = Store.the.selectedTile;

    if (selectedTile) {
        let highlightedTiles: Tile[] = [
            selectedTile,
            [selectedTile[0] + 1, selectedTile[1]],
            [selectedTile[0] - 1, selectedTile[1]],
            [selectedTile[0], selectedTile[1] + 1],
            [selectedTile[0], selectedTile[1] - 1],
        ];

        const context = Store.the.context;
        for (let tile of highlightedTiles) {
            if (
                tile[0] >= 0 &&
                tile[0] < Store.the.width &&
                tile[1] >= 0 &&
                tile[1] < Store.the.height
            ) {
                context.lineWidth = 6;
                if ((tile[0] + tile[1]) % 2 == 0) {
                    context.strokeStyle = "rgb(255, 255, 255)";
                } else {
                    context.strokeStyle = "rgb(236, 236, 236)";
                }

                const coords = tileToCoordinates(tile);
                paintRoundedRectangle(coords[0] + 10, coords[1] + 10, 30, 30, 10, false);
            }
        }
    }
};

const paintRoundedRectangle = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    filled: boolean,
) => {
    const context = Store.the.context;

    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
    if (filled) {
        context.fill();
    } else {
        context.stroke();
    }
};

const paintWalls = () => {
    const context = Store.the.context;

    context.strokeStyle = "rgb(210, 210, 206)";

    for (let wall of Store.the.walls) {
        let corners = getWallCorners(wall);

        context.beginPath();
        context.lineWidth = 6;
        context.lineCap = "round";

        context.moveTo(...corners[0]);
        context.lineTo(...corners[1]);
        context.stroke();
    }
};

export const rerender = () => {
    paintBoard();
    paintWalls();
};
