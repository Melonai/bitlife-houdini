import { InitializingBoardState } from "./states/initializing_board";
import { PlacingObjectsState } from "./states/placing_objects";
import { ShowingSolutionState } from "./states/showing_solution";

export enum StateType {
    InitializingBoard = "initializing-board",
    PlacingObjects = "placing-objects",
    ShowingSolution = "showing-solution",
}

export type State = InitializingBoardState | PlacingObjectsState | ShowingSolutionState;

let state: State;

export function getState(): State {
    return state;
}

export function switchState(newState: State) {
    const app = document.getElementsByClassName("app")[0]!;
    switchElementToState(app, newState);
    state = newState;
}

// Show elements of new state and hide elements of old state, recursively.
function switchElementToState(element: Element, state: State) {
    const states = [
        StateType.InitializingBoard,
        StateType.PlacingObjects,
        StateType.ShowingSolution,
    ];

    let hasToBeShown = false;
    let hasToBeHidden = false;

    for (const stateType of states) {
        if (element.classList.contains(stateType)) {
            if (stateType === state.type) {
                hasToBeShown = true;
                hasToBeHidden = false;
                break;
            } else {
                hasToBeHidden = true;
            }
        }
    }

    if (hasToBeShown) {
        element.classList.remove("hidden");
    }
    if (hasToBeHidden) {
        element.classList.add("hidden");
    } else {
        for (const child of Array.from(element.children)) {
            switchElementToState(child, state);
        }
    }
}
