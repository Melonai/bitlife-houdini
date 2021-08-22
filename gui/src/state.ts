import { InitializingBoardState } from "./states/initializing_board";
import { PlacingObjectsState } from "./states/placing_objects";
import { ShowingSolutionState } from "./states/showing_solution";

export enum StateType {
    InitializingBoard = "initializing-board",
    PlacingObjects = "placing-objects",
    ShowingSolution = "showing-solution"
}

export type State = InitializingBoardState | PlacingObjectsState | ShowingSolutionState;

let state: State;

export function getState(): State {
    return state;
}

export function switchState(newState: State) {
    const stateType = newState.type;

    const app = document.getElementsByClassName("app")[0]!;
    const stateElements = Array.from(app.children)

    // Show elements of new state and hide elements of old state
    for (const element of stateElements) {
        if(element.classList.contains(stateType)) {
            element.classList.remove("hidden");
        } else {
            element.classList.add("hidden");
        }
    }

    state = newState;
}