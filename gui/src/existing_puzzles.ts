import { Puzzle } from "./puzzle";

export const puzzles: Puzzle[] = [
    {
        people: { guard: [0, 1], prisoner: [3, 0] },
        room: {
            width: 5,
            height: 5,
            rotation: 0,
            exit: [1, 0],
            walls: [
                { from: [0, 1], to: [1, 1] },
                { from: [1, 0], to: [1, 1] },
                { from: [0, 3], to: [1, 3] },
                { from: [1, 3], to: [1, 4] },
                { from: [1, 3], to: [2, 3] },
                { from: [1, 2], to: [2, 2] },
                { from: [2, 2], to: [2, 3] },
                { from: [3, 2], to: [3, 3] },
                { from: [2, 1], to: [3, 1] },
                { from: [3, 1], to: [3, 2] },
                { from: [3, 0], to: [4, 0] },
            ],
        },
    },
    {
        people: { guard: [4, 3], prisoner: [0, 1] },
        room: {
            width: 5,
            height: 5,
            rotation: 0,
            exit: [4, 2],
            walls: [
                { from: [0, 1], to: [0, 2] },
                { from: [0, 1], to: [1, 1] },
                { from: [1, 1], to: [1, 2] },
                { from: [1, 0], to: [2, 0] },
                { from: [1, 2], to: [2, 2] },
                { from: [1, 2], to: [1, 3] },
                { from: [2, 2], to: [2, 3] },
                { from: [2, 2], to: [3, 2] },
                { from: [2, 1], to: [3, 1] },
                { from: [3, 1], to: [4, 1] },
                { from: [3, 2], to: [4, 2] },
                { from: [3, 3], to: [4, 3] },
                { from: [4, 1], to: [4, 2] },
                { from: [3, 3], to: [3, 4] },
                { from: [2, 3], to: [2, 4] },
            ],
        },
    },
];
