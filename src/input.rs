use std::fs::File;
use std::io::Read;

use serde::Deserialize;
use toml::de::Error;

use crate::objects::{Position, Room};

#[derive(Deserialize, Debug)]
pub struct Puzzle {
    pub people: StartingPositions,
    pub room: Room,
}

#[derive(Deserialize, Debug)]
pub struct StartingPositions {
    pub guard: Position,
    pub prisoner: Position,
}

pub fn parse_file(mut file: File) -> Result<Puzzle, Error> {
    let mut content = String::new();
    file.read_to_string(&mut content).unwrap();
    toml::from_str(content.as_str())
}
