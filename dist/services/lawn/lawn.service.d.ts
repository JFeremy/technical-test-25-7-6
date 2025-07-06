import { Lawn, Position } from 'src/domain/interfaces';
import { LawnContextService } from '../lawn-context/lawn-context.service';
export declare class LawnService {
    private readonly lawnContext;
    constructor(lawnContext: LawnContextService);
    setLawn(upperRightPosition: Position): Promise<Lawn>;
    isInsideLawn(position: Position): boolean;
}
