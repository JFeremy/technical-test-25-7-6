import { Test, TestingModule } from '@nestjs/testing';
import { AppService, RunOptions } from './app.service';
import { LawnService } from './services/lawn/lawn.service';
import { MowerService } from './services/mower/mower.service';
import { MowerPosition, Position } from './domain/interfaces';

describe('AppService', () => {
  let service: AppService;
  let lawnService: LawnService;
  let mowerService: MowerService;

  const mockLawnService = {
    setLawn: jest.fn(),
  };
  const mockMowerService = {
    mow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: LawnService,
          useValue: mockLawnService,
        },
        {
          provide: MowerService,
          useValue: mockMowerService,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    lawnService = module.get<LawnService>(LawnService);
    mowerService = module.get<MowerService>(MowerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should run mower instructions and return final positions', async () => {
    const upperRightPosition: Position = { x: 5, y: 5 };
    const initialPosition: MowerPosition = { x: 1, y: 2, direction: 'N' };
    const finalPosition: MowerPosition = { x: 1, y: 3, direction: 'N' };
    const options: RunOptions = {
      upperRightPosition,
      mowers: [
        {
          initialPosition,
          instructions: ['F'],
        },
      ],
    };

    mockMowerService.mow.mockResolvedValue(finalPosition);
    const result = await service.run(options);

    expect(lawnService.setLawn).toHaveBeenCalledWith(upperRightPosition);
    expect(mowerService.mow).toHaveBeenCalledWith(initialPosition, ['F']);
    expect(result).toEqual([finalPosition]);
  });
});
