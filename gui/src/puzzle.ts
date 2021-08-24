import { Board, Tile } from "./board";
import { SpecialTiles, TileType } from "./special_tiles";
import { equal } from "./utils";
import { createWall, Wall } from "./wall";

export type Puzzle = {
    people: {
        guard: Tile; // Position
        prisoner: Tile; // Position
    }; // PositionState
    room: {
        width: number; // u8
        height: number; // u8
        rotation: 0; // u8
        exit: Tile; // Position
        walls: {
            from: Tile; // Position
            to: Tile; // Position
        }[]; // Vec<Wall>
    }; // Room
};

export function boardToPuzzle(board: Board): Puzzle {
    const guard = board.specialTiles.findTileOfType(TileType.Guard);
    const prisoner = board.specialTiles.findTileOfType(TileType.Prisoner);
    const exit = board.specialTiles.findTileOfType(TileType.Exit);

    const walls = board.walls.map(wall => {
        return {
            from: wall[0],
            to: wall[1],
        };
    });

    return {
        people: {
            guard: guard || [-1, -1],
            prisoner: prisoner || [-1, -1],
        },
        room: {
            width: board.width,
            height: board.height,
            rotation: 0,
            exit: exit || [-1, -1],
            walls,
        },
    };
}

export function puzzleToBoard(puzzle: Puzzle): Board {
    const specialTiles = new SpecialTiles();
    specialTiles.setTile(puzzle.people.guard, TileType.Guard);
    specialTiles.setTile(puzzle.people.prisoner, TileType.Prisoner);
    specialTiles.setTile(puzzle.room.exit, TileType.Exit);

    const walls: Wall[] = puzzle.room.walls.map(({ from, to }) => [from, to]);

    return new Board(puzzle.room.width, puzzle.room.height, walls, specialTiles);
}

export function rotatePuzzle(puzzle: Puzzle, rotation: number): Puzzle {
    const actualRotation = rotation % 4;
    const width = puzzle.room.width;
    const height = puzzle.room.height;

    const rotateTile = (tile: Tile): Tile => {
        if (actualRotation === 0) {
            return tile;
        }

        const switchComponents = actualRotation % 2 === 1;
        const flipX = actualRotation > 1;
        const flipY = actualRotation > 0 && actualRotation < 3;

        let newX = switchComponents ? tile[1] : tile[0];
        newX = flipX ? width - 1 - newX : newX;

        let newY = switchComponents ? tile[0] : tile[1];
        newY = flipY ? height - 1 - newY : newY;

        return [newX, newY];
    };

    const rotateIfNotFake = (tile: Tile): Tile =>
        equal(tile, [-1, -1]) ? [-1, -1] : rotateTile(tile);

    const rotatedWalls = puzzle.room.walls.map(wall => {
        const normalWall = createWall(rotateTile(wall.from), rotateTile(wall.to));
        return {
            from: normalWall[0],
            to: normalWall[1],
        };
    });

    const newPuzzle: Puzzle = {
        people: {
            guard: rotateIfNotFake(puzzle.people.guard),
            prisoner: rotateIfNotFake(puzzle.people.prisoner),
        },
        room: {
            width,
            height,
            rotation: 0,
            exit: rotateIfNotFake(puzzle.room.exit),
            walls: rotatedWalls,
        },
    };

    return newPuzzle;
}

export function isPuzzleSubsetOfAnother(puzzle: Puzzle, other: Puzzle): boolean {
    if (puzzle.room.width !== other.room.width || puzzle.room.height !== other.room.height) {
        return false;
    }

    const equalOrFake = (a: Tile, b: Tile): boolean => equal(a, [-1, -1]) || equal(a, b);

    if (
        !equalOrFake(puzzle.people.guard, other.people.guard) ||
        !equalOrFake(puzzle.people.prisoner, other.people.prisoner) ||
        !equalOrFake(puzzle.room.exit, other.room.exit)
    ) {
        return false;
    }

    // Check if the puzzle's walls are a subset of the other puzzles walls
    if (
        !puzzle.room.walls.every(wall => {
            return other.room.walls.some(otherWall => {
                return equal(wall, otherWall);
            });
        })
    ) {
        return false;
    }

    return true;
}
