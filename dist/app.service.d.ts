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
export declare class AppService {
    private readonly lawnService;
    private readonly mowerService;
    constructor(lawnService: LawnService, mowerService: MowerService);
    run(options: RunOptions): Promise<MowerPosition[]>;
}
