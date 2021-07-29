extern crate houdini_solver;

use std::fs::File;

mod input;

fn main() {
    let file = File::open("input.toml").unwrap();
    let puzzle = input::parse_file(file).unwrap();

    let solution = houdini_solver::solve(puzzle);

    if let Some(path) = solution {
        println!("Path: {:?}", path);
        println!("Number of moves: {}", path.len());
        println!("Guide:");
        input::show_solution(path);
    } else {
        println!("Couldn't find a solution.");
    }
}
