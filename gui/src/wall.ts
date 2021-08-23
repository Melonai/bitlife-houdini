import { Tile } from "./board";
import { equal } from "./utils";

export type Wall = [Tile, Tile];

export function createWall(from: Tile, to: Tile): Wall {
    // Make sure the wall isn't placed on the same tile
    if (equal(from, to)) {
        throw new Error("Wall can't go between the same tile.");
    }

    // TODO: Make sure the wall doesn't go through mulitple tiles

    // Make sure wall always has the same orientation
    if (from[0] <= to[0] && from[1] <= to[1]) {
        return [from, to];
    } else {
        return [to, from];
    }
}
