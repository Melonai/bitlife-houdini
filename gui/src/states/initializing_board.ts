import { Board } from "../board";
import { StateType, switchState } from "../state";
import { PlacingObjectsState } from "./placing_objects";

export class InitializingBoardState {
    readonly type: StateType = StateType.InitializingBoard;

    constructor() {
        const form = <HTMLFormElement>document.getElementById("board-form");

        // TODO: Remove event listener when state is changed.
        form.addEventListener("submit", e => this.onInitializeBoardFormSubmit(e));
    }

    private onInitializeBoardFormSubmit(event: Event) {
        const form = <HTMLFormElement>document.getElementById("board-form");
        event.preventDefault();

        const width = parseInt((<HTMLInputElement>form.elements[0]).value);
        const height = parseInt((<HTMLInputElement>form.elements[1]).value);

        const board = new Board(width, height);

        switchState(new PlacingObjectsState(board));
    }
}
