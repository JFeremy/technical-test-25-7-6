import { Injectable } from '@nestjs/common';
import { LawnService } from './services/lawn/lawn.service';
import { MowerService } from './services/mower/mower.service';
import { Instruction, MowerPosition, Position } from './domain/interfaces';

export type RunOptionsMower = {
  initialPosition: MowerPosition;
  instructions: Instruction[];
};

export type RunOptions = {
  upperRightPosition: Position;
  mowers: RunOptionsMower[];
};

@Injectable()
export class AppService {
  constructor(
    private readonly lawnService: LawnService,
    private readonly mowerService: MowerService,
  ) {}

  async run(options: RunOptions): Promise<MowerPosition[]> {
    await this.lawnService.setLawn(options.upperRightPosition);

    const mowerFinalPosition: MowerPosition[] = [];
    for (const mower of options.mowers) {
      console.log('- - - - -');
      console.log(
        ` # Mow started at ${mower.initialPosition.x} ${mower.initialPosition.y} ${mower.initialPosition.direction} with instructions ${mower.instructions.join(',')}`,
      );
      const mowerPosition = await this.mowerService.mow(
        mower.initialPosition,
        mower.instructions,
      );
      mowerFinalPosition.push(mowerPosition);
    }

    return mowerFinalPosition;
  }
}
