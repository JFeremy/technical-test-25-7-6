import { Injectable, Scope } from '@nestjs/common';
import { Lawn } from 'src/domain/interfaces';

@Injectable({ scope: Scope.REQUEST })
export class LawnContextService {
  private lawn: Lawn;

  set(lawn: Lawn) {
    this.lawn = lawn;
  }

  get(): Lawn {
    return this.lawn;
  }
}
