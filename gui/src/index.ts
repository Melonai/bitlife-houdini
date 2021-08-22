import "../assets/index.scss";
import { switchState } from "./state";
import { InitializingBoardState } from "./states/initializing_board";

const initialize = () => {
    switchState(new InitializingBoardState());
};

window.onload = initialize;
