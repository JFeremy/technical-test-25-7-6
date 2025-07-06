import { Direction } from './direction.interface';
import { Position } from './position.interface';
export interface MowerPosition extends Position {
    direction: Direction;
}
