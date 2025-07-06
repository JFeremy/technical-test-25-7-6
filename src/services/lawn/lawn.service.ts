import { BadRequestException, Injectable } from '@nestjs/common';
import { Lawn, Position } from 'src/domain/interfaces';
import { LawnContextService } from '../lawn-context/lawn-context.service';

@Injectable()
export class LawnService {
  constructor(private readonly lawnContext: LawnContextService) {}

  public async setLawn(upperRightPosition: Position): Promise<Lawn> {
    if (upperRightPosition.x < 0 || upperRightPosition.y < 0) {
      throw new BadRequestException(
        'Upper top corner can not have negative value.',
      );
    }

    const lawn: Lawn = {
      width: upperRightPosition.x,
      height: upperRightPosition.y,
    };

    await Promise.resolve(this.lawnContext.set(lawn));

    return lawn;
  }

  public isInsideLawn(position: Position): boolean {
    const lawn = this.lawnContext.get();
    if (position.x < 0 || position.y < 0) {
      return false;
    }
    if (position.x > lawn.width || position.y > lawn.height) {
      return false;
    }
    return true;
  }
}
