import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadFileService } from './services/upload-file/upload-file.service';
import { MowerPosition } from './domain/interfaces';
import { BadRequestException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let uploadFileService: UploadFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            run: jest.fn(),
          },
        },
        {
          provide: UploadFileService,
          useValue: {
            validateFile: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
    uploadFileService = module.get<UploadFileService>(UploadFileService);
  });

  it('should parse file content and return formatted positions', async () => {
    const fileContent = `5 5
1 2 N
LFLFLFLFF`;

    const mockFile = {
      buffer: Buffer.from(fileContent, 'utf-8'),
      mimetype: 'text/plain',
      size: 1024,
    } as Express.Multer.File;

    const expectedPosition: MowerPosition = { x: 1, y: 3, direction: 'N' };
    (appService.run as jest.Mock).mockResolvedValue([expectedPosition]);

    const result = await appController.mowLawn(mockFile);

    expect(uploadFileService.validateFile).toHaveBeenCalledWith(mockFile);
    expect(appService.run).toHaveBeenCalledWith({
      upperRightPosition: { x: 5, y: 5 },
      mowers: [
        {
          initialPosition: { x: 1, y: 2, direction: 'N' },
          instructions: ['L', 'F', 'L', 'F', 'L', 'F', 'L', 'F', 'F'],
        },
      ],
    });
    expect(result).toBe('1 3 N');
  });

  it('should throw 400 [Upper top corner is not valid.] when upper top corner y is missing', async () => {
    const fileContent = `55
1 2 N
LFLFLFLFF`;

    const mockFile = {
      buffer: Buffer.from(fileContent, 'utf-8'),
      mimetype: 'text/plain',
      size: 1024,
    } as Express.Multer.File;

    await expect(
      async () => await appController.mowLawn(mockFile),
    ).rejects.toThrow(
      new BadRequestException('Upper top corner is not valid.'),
    );
  });

  it('should throw 400 [Upper top corner is not valid.] when upper top corner is not number', async () => {
    const fileContent = `A A
1 2 N
LFLFLFLFF`;

    const mockFile = {
      buffer: Buffer.from(fileContent, 'utf-8'),
      mimetype: 'text/plain',
      size: 1024,
    } as Express.Multer.File;

    await expect(
      async () => await appController.mowLawn(mockFile),
    ).rejects.toThrow(
      new BadRequestException('Upper top corner is not valid.'),
    );
  });

  it('should throw 400 [Each mower must have two lines of instructions.] when mower line is missing', async () => {
    const fileContent = `5 5
1 2 N`;

    const mockFile = {
      buffer: Buffer.from(fileContent, 'utf-8'),
      mimetype: 'text/plain',
      size: 1024,
    } as Express.Multer.File;

    await expect(
      async () => await appController.mowLawn(mockFile),
    ).rejects.toThrow(
      new BadRequestException(
        'Each mower must have two lines of instructions.',
      ),
    );
  });

  it('should throw 400 [Each mower must have two lines of instructions.] when mower line is missing', async () => {
    const fileContent = `5 5
12 N
LFLFLFLFF`;

    const mockFile = {
      buffer: Buffer.from(fileContent, 'utf-8'),
      mimetype: 'text/plain',
      size: 1024,
    } as Express.Multer.File;

    await expect(
      async () => await appController.mowLawn(mockFile),
    ).rejects.toThrow(
      new BadRequestException(
        "Invalid mower initial position format at line 2. Expected format: 'X Y D' with D in [N, S, E, W].",
      ),
    );
  });

  it('should throw 400 [Each mower must have two lines of instructions.] when mower line is missing', async () => {
    const fileContent = `5 5
1 2 N
OLFLFLFLFF`;

    const mockFile = {
      buffer: Buffer.from(fileContent, 'utf-8'),
      mimetype: 'text/plain',
      size: 1024,
    } as Express.Multer.File;

    await expect(
      async () => await appController.mowLawn(mockFile),
    ).rejects.toThrow(
      new BadRequestException(
        'Invalid mower instructions at line 3. Only L, R, and F are allowed.',
      ),
    );
  });
});
