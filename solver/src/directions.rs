use crate::objects::Position;

bitflags! {
    pub struct Directions: u8 {
        const NONE = 0b00000000;
        const TOP = 0b00000001;
        const RIGHT = 0b00000010;
        const BOTTOM = 0b00000100;
        const LEFT = 0b00001000;
    }
}

impl Directions {
    pub fn apply(&self, position: Position) -> Option<Position> {
        match *self {
            Directions::NONE => Some(position),
            Directions::TOP => position.1.checked_sub(1).map(|p| (position.0, p)),
            Directions::RIGHT => Some((position.0 + 1, position.1)),
            Directions::BOTTOM => Some((position.0, position.1 + 1)),
            Directions::LEFT => position.0.checked_sub(1).map(|p| (p, position.1)),
            _ => unreachable!(),
        }
    }
}
