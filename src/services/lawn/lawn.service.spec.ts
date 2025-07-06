import { Test, TestingModule } from '@nestjs/testing';
import { LawnService } from './lawn.service';
import { Lawn, Position } from 'src/domain/interfaces';
import { faker } from '@faker-js/faker';
import { LawnContextService } from '../lawn-context/lawn-context.service';
import { BadRequestException } from '@nestjs/common';

interface SetLawnTestErrorCase {
  label: string;
  input: Position;
  error: Error;
}
interface IsInsideLawnTestCase {
  label: string;
  input: Position;
  output: boolean;
}
describe('LawnService', () => {
  let service: LawnService;
  let lawnContext: LawnContextService;
  const mockLawnContext = {
    set: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LawnService,
        {
          provide: LawnContextService,
          useValue: mockLawnContext,
        },
      ],
    }).compile();

    service = module.get<LawnService>(LawnService);
    lawnContext = module.get<LawnContextService>(LawnContextService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setLawn', () => {
    it('should return the lawn size with positive value', async () => {
      const upperRightPosition: Position = {
        x: faker.number.int({ min: 0 }),
        y: faker.number.int({ min: 0 }),
      };
      const lawnSize: Lawn = {
        height: upperRightPosition.y,
        width: upperRightPosition.x,
      };

      const result = await service.setLawn(upperRightPosition);
      expect(result).toEqual(lawnSize);
      expect(lawnContext.set).toHaveBeenCalledWith(lawnSize);
    });

    describe('should throw Error when ', () => {
      const testCases: SetLawnTestErrorCase[] = [
        {
          label: 'upperRightPosition x is negative',
          input: {
            x: -5,
            y: faker.number.int({ min: 0 }),
          },
          error: new BadRequestException(
            'Upper top corner can not have negative value.',
          ),
        },
        {
          label: 'upperRightPosition y is negative',
          input: {
            x: faker.number.int({ min: 0 }),
            y: -5,
          },
          error: new BadRequestException(
            'Upper top corner can not have negative value.',
          ),
        },
      ];

      for (const testCase of testCases) {
        it(testCase.label, async () => {
          await expect(
            async () => await service.setLawn(testCase.input),
          ).rejects.toThrow(testCase.error);
        });
      }
    });
  });

  describe('isInsideLawn', () => {
    const lawn: Lawn = {
      width: faker.number.int(),
      height: faker.number.int(),
    };
    const testCases: IsInsideLawnTestCase[] = [
      {
        label: 'should return true when the new position is within the lawn',
        input: {
          x: faker.number.int({ min: 0, max: lawn.width }),
          y: faker.number.int({ min: 0, max: lawn.height }),
        },
        output: true,
      },
      {
        label: 'should return false when the x of position is negative',
        input: {
          x: faker.number.int({ min: 0, max: lawn.width }) * -1,
          y: faker.number.int({ min: 0, max: lawn.height }),
        },
        output: false,
      },
      {
        label: 'should return false when the y of position is negative',
        input: {
          x: faker.number.int({ min: 0, max: lawn.width }),
          y: faker.number.int({ min: 0, max: lawn.height }) * -1,
        },
        output: false,
      },
      {
        label: 'should return false when the x of position is outside the lawn',
        input: {
          x: faker.number.int({ min: lawn.width }),
          y: faker.number.int({ min: 0, max: lawn.height }),
        },
        output: false,
      },
      {
        label: 'should return false when the y of position is outside the lawn',
        input: {
          x: faker.number.int({ min: 0, max: lawn.width }),
          y: faker.number.int({ min: lawn.height }),
        },
        output: false,
      },
    ];

    for (const testCase of testCases) {
      it(testCase.label, () => {
        mockLawnContext.get.mockReturnValue(lawn);

        expect(service.isInsideLawn(testCase.input)).toEqual(testCase.output);
        expect(lawnContext.get).toHaveBeenCalled();
      });
    }
  });
});
