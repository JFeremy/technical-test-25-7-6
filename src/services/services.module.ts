import { Module } from '@nestjs/common';
import { LawnService } from './lawn/lawn.service';
import { MowerService } from './mower/mower.service';
import { LawnContextService } from './lawn-context/lawn-context.service';
import { UploadFileService } from './upload-file/upload-file.service';

@Module({
  providers: [LawnService, MowerService, LawnContextService, UploadFileService],
  exports: [
    LawnContextService,
    LawnService,
    MowerService,
    LawnContextService,
    UploadFileService,
  ],
})
export class ServicesModule {}
