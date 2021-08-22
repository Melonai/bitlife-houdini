mod utils;

use houdini_solver::objects::Puzzle;
use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn solve(board: &JsValue) -> Result<JsValue, JsValue> {
    set_panic_hook();

    let puzzle: Puzzle = board
        .into_serde()
        .map_err(|_| "Wrong puzzle format".to_string())?;

    let solution = houdini_solver::solve(puzzle);

    Ok(JsValue::from_serde(&solution).unwrap())
}
