import { Injectable } from '@nestjs/common';
import { LawnService } from '../lawn/lawn.service';
import { Instruction, Direction, MowerPosition } from 'src/domain/interfaces';

@Injectable()
export class MowerService {
  constructor(private readonly lawnService: LawnService) {}

  private rotate(mowerDirection: Direction, order: Direction[]): Direction {
    const index = order.indexOf(mowerDirection);
    const nextIndex = (index + 1) % order.length;
    return order[nextIndex];
  }

  private rotateLeft(mower: MowerPosition): MowerPosition {
    const directions: Direction[] = ['N', 'W', 'S', 'E'];
    return {
      ...mower,
      direction: this.rotate(mower.direction, directions),
    };
  }

  private rotateRight(mower: MowerPosition): MowerPosition {
    const directions: Direction[] = ['N', 'E', 'S', 'W'];
    return {
      ...mower,
      direction: this.rotate(mower.direction, directions),
    };
  }

  private moveForward(mower: MowerPosition): MowerPosition {
    let newX = mower.x;
    let newY = mower.y;

    switch (mower.direction) {
      case 'N':
        newY++;
        break;
      case 'E':
        newX++;
        break;
      case 'S':
        newY--;
        break;
      case 'W':
        newX--;
        break;
    }

    if (
      this.lawnService.isInsideLawn({
        x: newX,
        y: newY,
      })
    ) {
      return {
        direction: mower.direction,
        x: newX,
        y: newY,
      };
    }

    return mower;
  }

  async mow(
    mower: MowerPosition,
    actions: Instruction[],
  ): Promise<MowerPosition> {
    let mowerPosition = mower;
    for (const action of actions) {
      switch (action) {
        case 'F':
          mowerPosition = await Promise.resolve(
            this.moveForward(mowerPosition),
          );
          break;
        case 'R':
          mowerPosition = await Promise.resolve(
            this.rotateRight(mowerPosition),
          );
          break;
        case 'L':
          mowerPosition = await Promise.resolve(this.rotateLeft(mowerPosition));
          break;
        default:
          mowerPosition = await Promise.resolve(mowerPosition);
          break;
      }
      console.log(
        `Mower (${mower.x} ${mower.y} ${mower.direction}): ${mowerPosition.x} ${mowerPosition.y} ${mowerPosition.direction}}`,
      );
    }
    return mowerPosition;
  }
}
