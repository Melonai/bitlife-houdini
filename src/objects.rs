use serde::Deserialize;

pub type Position = (u8, u8);

#[derive(Deserialize, Debug)]
pub struct Room {
    pub width: u8,
    pub height: u8,
    pub rotation: u8,
    pub exit: Position,
    pub walls: Vec<Wall>,
}

impl Room {
    pub fn is_move_valid(&self, from: Position, to: Position) -> bool {
        if to.0 < self.width && to.1 < self.height {
            for x in self.walls.iter() {
                if x.blocks(from, to) {
                    return false;
                }
            }
            return true;
        }
        false
    }
}

#[derive(Deserialize, Debug)]
pub struct Wall {
    from: Position,
    to: Position,
}

impl Wall {
    pub fn blocks(&self, first: Position, second: Position) -> bool {
        (self.from == first && self.to == second) || (self.from == second && self.to == first)
    }
}

#[derive(PartialEq, Eq, Hash)]
pub struct PositionState {
    guard: Position,
    prisoner: Position,
}

impl PositionState {
    pub fn new(guard: Position, prisoner: Position) -> Self {
        PositionState { guard, prisoner }
    }
}
