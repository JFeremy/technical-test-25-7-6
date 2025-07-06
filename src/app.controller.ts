import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService, RunOptionsMower } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileService } from './services/upload-file/upload-file.service';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('mowers')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly fileUploadService: UploadFileService,
  ) {}

  @Post('/mowers-instructions')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Text file containing mower instructions',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Final positions of the mowers',
    content: {
      'text/plain': {
        example: '1 3 N\n5 1 E',
      },
    },
  })
  async mowLawn(@UploadedFile() file: Express.Multer.File): Promise<string> {
    this.fileUploadService.validateFile(file);

    const content = file.buffer.toString('utf-8');
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const [x, y] = lines[0].split(' ').map(Number);
    if (!x || !y) {
      throw new BadRequestException('Upper top corner is not valid.');
    }

    const mowers: RunOptionsMower[] = [];
    for (let i = 1; i < lines.length; i += 2) {
      const initialPosition = lines[i];
      const instructions = lines[i + 1];
      if (
        !initialPosition ||
        !initialPosition.length ||
        !instructions ||
        !instructions.length
      ) {
        throw new BadRequestException(
          'Each mower must have two lines of instructions.',
        );
      }
      if (!/^\d+ \d+ [NSEW]$/.test(initialPosition)) {
        throw new BadRequestException(
          `Invalid mower initial position format at line ${i + 1}. Expected format: 'X Y D' with D in [N, S, E, W].`,
        );
      }
      if (!/^[LRF]+$/.test(instructions)) {
        throw new BadRequestException(
          `Invalid mower instructions at line ${i + 2}. Only L, R, and F are allowed.`,
        );
      }
      const [posX, posY, dir] = initialPosition.split(' ');
      mowers.push({
        initialPosition: {
          x: Number(posX),
          y: Number(posY),
          direction: dir as 'N' | 'S' | 'E' | 'W',
        },
        instructions: instructions.split('') as ('R' | 'L' | 'F')[],
      });
    }

    const positions = await this.appService.run({
      upperRightPosition: { x, y },
      mowers,
    });
    const positionsFormated = positions.map(
      (mower) => `${mower.x} ${mower.y} ${mower.direction}`,
    );
    return positionsFormated.join('\n');
  }
}
