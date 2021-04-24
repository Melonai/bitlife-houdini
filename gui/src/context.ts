import type { Wall } from "./types";
import { Store } from "./store";
import { equal } from "./utils";
import { getRelatedTile } from "./game";
import { rerender } from "./paint";

export const SIZE = 400;

export const makeContext = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
    const context = canvas.getContext("2d");

    canvas.style.width = SIZE + "px";
    canvas.style.height = SIZE + "px";

    const scale = window.devicePixelRatio;
    canvas.width = SIZE * scale;
    canvas.height = SIZE * scale;

    context.scale(scale, scale);
    return context;
};

export const onClick = (e: MouseEvent) => {
    const tile = getRelatedTile(e.offsetX, e.offsetY);
    const otherTile = Store.the.selectedTile;

    if (otherTile) {
        Store.the.deselectTile();

        if (equal(tile, otherTile)) {
            // TODO: Set exit tile.
            return;
        }

        const wall: Wall = [tile, otherTile];

        if (Store.the.wallExists(wall)) {
            Store.the.removeWall(wall);
        } else {
            Store.the.addWall(wall);
        }
    } else {
        Store.the.selectTile(tile);
    }

    rerender();
};
