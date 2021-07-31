import "../assets/index.scss";

import { rerender } from "./paint";
import { makeContext, onClick } from "./context";
import { Store } from "./store";

const initialize = () => {
    Store.create();

    import("../../wasm/pkg").then((module) => {
        module.greet();
    })

    const form = <HTMLFormElement>document.getElementById("board-form");

    form.addEventListener("submit", e => {
        e.preventDefault();

        const width = parseInt((<HTMLInputElement>form.elements[0]).value);
        const height = parseInt((<HTMLInputElement>form.elements[1]).value);

        form.style.display = "none";

        const boardHolder = document.getElementById("board-holder");
        boardHolder!.style.display = "";

        const canvas = <HTMLCanvasElement>document.getElementById("board");
        const context = makeContext(canvas, width, height);

        Store.the.createBoard(context, width, height);

        rerender();

        canvas.addEventListener("click", onClick);
    });
};

window.onload = initialize;
