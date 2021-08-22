import { Tile } from "./types";
import { equal } from "./utils";

export enum TileType {
    Prisoner,
    Guard,
    Exit,
}

export class SpecialTiles {
    readonly tiles: [Tile, TileType][] = [];

    cycleTile(tile: Tile) {
        const index = this.tiles.findIndex(([otherTile]) => equal(tile, otherTile));

        if (index !== -1) {
            const foundTile = this.tiles[index];
            if (foundTile[1] === TileType.Exit) {
                this.tiles.splice(index, 1);
            } else {
                foundTile[1] += 1;
            }
        } else {
            this.tiles.push([tile, TileType.Prisoner]);
        }
    }

    getTileType(tile: Tile): TileType | null {
        const foundTile = this.tiles.find(([otherTile]) => equal(tile, otherTile));

        if (foundTile) {
            return foundTile[1];
        }
        return null;
    }
}
