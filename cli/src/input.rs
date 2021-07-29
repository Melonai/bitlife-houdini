use std::fs::File;
use std::io::{stdin, stdout, Read, Write};

use toml::de::Error;

use houdini_solver::objects::{Position, Puzzle};

pub fn parse_file(mut file: File) -> Result<Puzzle, Error> {
    let mut content = String::new();
    file.read_to_string(&mut content).unwrap();
    toml::from_str(content.as_str())
}

pub fn show_solution(mut path: Vec<Position>) {
    let mut last_position = path.remove(0);

    while !path.is_empty() {
        let new_position = path.remove(0);

        if new_position.0 as i8 - last_position.0 as i8 == -1 {
            print!("Left");
        } else if new_position.0 - last_position.0 == 1 {
            print!("Right");
        } else if new_position.1 as i8 - last_position.1 as i8 == -1 {
            print!("Up");
        } else if new_position.1 - last_position.1 == 1 {
            print!("Down");
        }
        last_position = new_position;
        wait_until_input();
    }
}

pub fn wait_until_input() {
    stdout().flush().unwrap();
    stdin().read_exact(&mut [0]).unwrap();
}
