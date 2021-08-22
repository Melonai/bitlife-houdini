import "../assets/index.scss";
import { switchState } from "./state";
import { InitializingBoardState } from "./states/initializing_board";

const initialize = () => {
    import("../../wasm/pkg").then(module => {
        module.greet();
    });

    switchState(new InitializingBoardState());
};

window.onload = initialize;
