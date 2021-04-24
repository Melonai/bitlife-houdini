import { Tile, Wall } from "./types";
import { equal } from "./utils";
import { Store } from "./store";
import { SIZE } from "./context";

export const prepareWall = (wall: Wall): Wall => {
    if (equal(wall[0], wall[1])) {
        throw new Error("Wall can't go between the same tile.");
    }

    if (wall[0][0] <= wall[1][0] && wall[0][1] <= wall[1][1]) {
        return wall;
    } else {
        return [wall[1], wall[0]];
    }
};

export const getWallCorners = (wall: Wall): [[number, number], [number, number]] => {
    const wallSpace = 7;

    if (wall[0][0] !== wall[1][0]) {
        const x = tileToCoordinates(wall[1])[0];
        const fromY = tileToCoordinates(wall[0])[1] + wallSpace;
        const toY = tileToCoordinates([wall[0][0], wall[0][1] + 1])[1] - wallSpace;

        return [
            [x, fromY],
            [x, toY],
        ];
    } else {
        const y = tileToCoordinates(wall[1])[1];
        const fromX = tileToCoordinates(wall[0])[0] + wallSpace;
        const toX = tileToCoordinates([wall[0][0] + 1, wall[0][1]])[0] - wallSpace;

        return [
            [fromX, y],
            [toX, y],
        ];
    }
};

export const tileToCoordinates = (tile: Tile): [number, number] => {
    const tileSize = 50;
    return [tile[0] * tileSize, tile[1] * tileSize];
};

export const getRelatedTile = (x: number, y: number): Tile => {
    const width = Store.the.width;
    const height = Store.the.height;

    const tilesHorizontal = SIZE / width;
    const tilesVertical = SIZE / height;

    const tileX = Math.floor(x / tilesHorizontal);
    const tileY = Math.floor(y / tilesVertical);

    return [tileX, tileY];
};
