import { Test, TestingModule } from '@nestjs/testing';
import { LawnContextService } from './lawn-context.service';

describe('LawnContextService', () => {
  let service: LawnContextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LawnContextService],
    }).compile();

    service = await module.resolve<LawnContextService>(LawnContextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should store and retrieve the lawn', () => {
    const lawn = { width: 5, height: 5 };
    service.set(lawn);
    expect(service.get()).toEqual(lawn);
  });

  it('should return undefined if lawn is not set', () => {
    expect(service.get()).toBeUndefined();
  });
});
