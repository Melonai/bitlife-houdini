#[macro_use]
extern crate bitflags;

mod directions;
pub mod objects;

use crate::directions::Directions;
use crate::objects::{Position, PositionState, Puzzle, Room};
use std::collections::HashSet;

pub fn solve(puzzle: Puzzle) -> Option<Vec<PositionState>> {
    let mut path = Vec::new();
    path.push(PositionState {
        guard: puzzle.people.guard,
        prisoner: puzzle.people.prisoner,
    });

    let mut known_positions = HashSet::new();
    recursively_solve(
        &puzzle.room,
        puzzle.room.exit,
        &mut known_positions,
        &mut path,
    )
}

fn recursively_solve(
    room: &Room,
    exit: Position,
    known_positions: &mut HashSet<PositionState>,
    path: &mut Vec<PositionState>,
) -> Option<Vec<PositionState>> {
    let PositionState { prisoner, guard } = *path.last().unwrap();

    if exit == prisoner {
        return Some(path.clone());
    }

    known_positions.insert(PositionState::new(guard, prisoner));

    let moves = get_valid_moves(room, prisoner);
    for i in 0..4 {
        let direction = Directions::from_bits(1 << i).unwrap();
        if !(moves & direction).is_empty() {
            let new_prisoner = direction.apply(prisoner).unwrap();
            let new_guard = move_guard(room, guard, new_prisoner);

            if new_prisoner == new_guard
                || known_positions.contains(&PositionState::new(new_guard, new_prisoner))
            {
                continue;
            }

            path.push(PositionState {
                guard: new_guard,
                prisoner: new_prisoner,
            });
            let result = recursively_solve(room, exit, known_positions, path);

            match result {
                Some(path) => return Some(path),
                None => {
                    path.pop();
                }
            }
        }
    }

    None
}

fn get_valid_moves(room: &Room, from: Position) -> Directions {
    let mut valid_moves = Directions::NONE;
    for i in 0..4 {
        let direction = Directions::from_bits(1 << i).unwrap();

        let to_result = direction.apply(from);
        if let Some(to) = to_result {
            if room.is_move_valid(from, to) {
                valid_moves.insert(direction);
            }
        }
    }
    valid_moves
}

fn move_guard(room: &Room, guard: Position, prisoner: Position) -> Position {
    let mut new_guard = guard;

    for _ in 0..2 {
        let horizontal = (prisoner.0 as i8 - new_guard.0 as i8).signum();
        let vertical = (prisoner.1 as i8 - new_guard.1 as i8).signum();

        let moves = get_valid_moves(room, new_guard);

        if (!(moves & Directions::LEFT).is_empty() && horizontal == -1)
            || (!(moves & Directions::RIGHT).is_empty() && horizontal == 1)
        {
            new_guard.0 = (new_guard.0 as i8 + horizontal) as u8;
        } else if (!(moves & Directions::TOP).is_empty() && vertical == -1)
            || (!(moves & Directions::BOTTOM).is_empty() && vertical == 1)
        {
            new_guard.1 = (new_guard.1 as i8 + vertical) as u8;
        } else {
            return new_guard;
        }
    }

    new_guard
}
