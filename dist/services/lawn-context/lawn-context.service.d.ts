import { Lawn } from 'src/domain/interfaces';
export declare class LawnContextService {
    private lawn;
    set(lawn: Lawn): void;
    get(): Lawn;
}
