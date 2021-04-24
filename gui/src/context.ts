import type { Wall } from "./types";
import { Store } from "./store";
import { equal } from "./utils";
import { getRelatedTile } from "./game";
import { rerender } from "./paint";

export const TILE_SIZE = 50;

export const makeContext = (
    canvas: HTMLCanvasElement,
    width: number,
    heigth: number,
): CanvasRenderingContext2D => {
    const context = canvas.getContext("2d");

    canvas.style.width = width * TILE_SIZE + "px";
    canvas.style.height = heigth * TILE_SIZE + "px";

    const scale = window.devicePixelRatio;
    canvas.width = width * TILE_SIZE * scale;
    canvas.height = heigth * TILE_SIZE * scale;

    context.scale(scale, scale);
    return context;
};

export const onClick = (e: MouseEvent) => {
    const tile = getRelatedTile(e.offsetX, e.offsetY);
    const otherTile = Store.the.selectedTile;

    if (otherTile) {
        Store.the.deselectTile();

        if (equal(tile, otherTile)) {
            Store.the.specialTiles.cycleTile(tile);
        } else {
            const wall: Wall = [tile, otherTile];

            if (Store.the.wallExists(wall)) {
                Store.the.removeWall(wall);
            } else {
                Store.the.addWall(wall);
            }
        }
    } else {
        Store.the.selectTile(tile);
    }

    rerender();
};
