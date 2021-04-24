import { rerender } from "./paint";
import { makeContext, onClick } from "./context";
import { Store } from "./store";

const initialize = () => {
    const canvas = <HTMLCanvasElement>document.getElementById("board");
    const context = makeContext(canvas);

    Store.create(context);
    Store.the.setBoardSize(8, 8);

    rerender();

    canvas.addEventListener("click", onClick);
};

initialize();
