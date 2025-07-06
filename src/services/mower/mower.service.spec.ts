import { Test, TestingModule } from '@nestjs/testing';
import { MowerService } from './mower.service';
import { LawnService } from '../lawn/lawn.service';
import {
  Direction,
  Instruction,
  MowerPosition,
  Position,
} from 'src/domain/interfaces';

describe('MowerService', () => {
  let service: MowerService;
  let lawnService: LawnService;

  const mockLawnService = {
    isInsideLawn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MowerService,
        {
          provide: LawnService,
          useValue: mockLawnService,
        },
      ],
    }).compile();

    service = module.get<MowerService>(MowerService);
    lawnService = module.get<LawnService>(LawnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('_rotate', () => {
    const order: Direction[] = ['N', 'W', 'S', 'E'];

    it('should return W when previous position is N', () => {
      expect(service['rotate']('N', order)).toEqual('W');
    });
    it('should return S when previous position is W', () => {
      expect(service['rotate']('W', order)).toEqual('S');
    });
    it('should return E when previous position is S', () => {
      expect(service['rotate']('S', order)).toEqual('E');
    });
    it('should return N when previous position is E', () => {
      expect(service['rotate']('E', order)).toEqual('N');
    });
  });

  describe('_rotateLeft', () => {
    const mowerPosition: Position = { x: 0, y: 0 };
    it('should return W when previous position is N', () => {
      expect(
        service['rotateLeft']({ ...mowerPosition, direction: 'N' }),
      ).toEqual({ ...mowerPosition, direction: 'W' });
    });
    it('should return S when previous position is W', () => {
      expect(
        service['rotateLeft']({ ...mowerPosition, direction: 'W' }),
      ).toEqual({ ...mowerPosition, direction: 'S' });
    });
    it('should return E when previous position is S', () => {
      expect(
        service['rotateLeft']({ ...mowerPosition, direction: 'S' }),
      ).toEqual({ ...mowerPosition, direction: 'E' });
    });
    it('should return N when previous position is E', () => {
      expect(
        service['rotateLeft']({ ...mowerPosition, direction: 'E' }),
      ).toEqual({ ...mowerPosition, direction: 'N' });
    });
  });

  describe('_rotateRight', () => {
    const mowerPosition: Position = { x: 0, y: 0 };
    it('should return E when previous position is N', () => {
      expect(
        service['rotateRight']({ ...mowerPosition, direction: 'N' }),
      ).toEqual({ ...mowerPosition, direction: 'E' });
    });
    it('should return S when previous position is E', () => {
      expect(
        service['rotateRight']({ ...mowerPosition, direction: 'E' }),
      ).toEqual({ ...mowerPosition, direction: 'S' });
    });
    it('should return W when previous position is S', () => {
      expect(
        service['rotateRight']({ ...mowerPosition, direction: 'S' }),
      ).toEqual({ ...mowerPosition, direction: 'W' });
    });
    it('should return N when previous position is W', () => {
      expect(
        service['rotateRight']({ ...mowerPosition, direction: 'W' }),
      ).toEqual({ ...mowerPosition, direction: 'N' });
    });
  });

  describe('_moveForward', () => {
    const mowerPosition: Position = { x: 2, y: 2 };

    describe('should change position and return', () => {
      for (const testCase of [
        {
          label: 'x+1',
          input: { ...mowerPosition, direction: 'E' },
          output: {
            x: mowerPosition.x + 1,
            y: mowerPosition.y,
          },
        },
        {
          label: 'x-1',
          input: { ...mowerPosition, direction: 'W' },
          output: {
            x: mowerPosition.x - 1,
            y: mowerPosition.y,
          },
        },
        {
          label: 'y+1',
          input: { ...mowerPosition, direction: 'N' },
          output: {
            x: mowerPosition.x,
            y: mowerPosition.y + 1,
          },
        },
        {
          label: 'y-1',
          input: { ...mowerPosition, direction: 'S' },
          output: {
            x: mowerPosition.x,
            y: mowerPosition.y - 1,
          },
        },
      ]) {
        it(`${testCase.label} when position is ${testCase.input.direction}`, () => {
          mockLawnService.isInsideLawn.mockReturnValue(true);
          expect(
            service['moveForward'](testCase.input as MowerPosition),
          ).toEqual({
            ...testCase.output,
            direction: testCase.input.direction,
          });
        });
      }
    });

    describe('should not change position when position is ', () => {
      for (const testCase of ['N', 'E', 'W', 'S']) {
        it(`${testCase}`, () => {
          const expectedPosition = {
            ...mowerPosition,
            direction: testCase,
          } as MowerPosition;
          mockLawnService.isInsideLawn.mockReturnValue(false);
          expect(
            service['moveForward']({
              ...mowerPosition,
              direction: testCase,
            } as MowerPosition),
          ).toEqual(expectedPosition);
        });
      }
    });
  });

  describe('_moveForward', () => {
    it('should return 1 1 N from 1 1 N with LFLFLFLF', async () => {
      const mowerPosition: MowerPosition = { x: 1, y: 1, direction: 'N' };
      const instructions: Instruction[] = [
        'L',
        'F',
        'L',
        'F',
        'L',
        'F',
        'L',
        'F',
      ];
      mockLawnService.isInsideLawn.mockReturnValue(true);

      const result = await service.mow(mowerPosition, instructions);
      expect(result).toEqual(mowerPosition);
    });

    it('should return 1 1 N from 1 1 N with RFRFRFRF', async () => {
      const mowerPosition: MowerPosition = { x: 1, y: 1, direction: 'N' };
      const instructions: Instruction[] = [
        'R',
        'F',
        'R',
        'F',
        'R',
        'F',
        'R',
        'F',
      ];
      mockLawnService.isInsideLawn.mockReturnValue(true);

      const result = await service.mow(mowerPosition, instructions);
      expect(result).toEqual(mowerPosition);
    });
  });
});
