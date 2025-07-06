import { LawnService } from '../lawn/lawn.service';
import { Instruction, MowerPosition } from 'src/domain/interfaces';
export declare class MowerService {
    private readonly lawnService;
    constructor(lawnService: LawnService);
    private rotate;
    private rotateLeft;
    private rotateRight;
    private moveForward;
    mow(mower: MowerPosition, actions: Instruction[]): Promise<MowerPosition>;
}
