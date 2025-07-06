import { Test, TestingModule } from '@nestjs/testing';
import { UploadFileService } from './upload-file.service';
import { BadRequestException } from '@nestjs/common';

describe('UploadFileService', () => {
  let service: UploadFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadFileService],
    }).compile();

    service = module.get<UploadFileService>(UploadFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw if no file is provided', () => {
    expect(() => service.validateFile(undefined)).toThrow(BadRequestException);
  });

  it('should throw if mimetype is not text/plain', () => {
    const file = {
      mimetype: 'image/png',
      size: 1024,
    } as Express.Multer.File;
    expect(() => service.validateFile(file)).toThrow(BadRequestException);
  });

  it('should throw if file size is too large', () => {
    const file = {
      mimetype: 'text/plain',
      size: 10 * 1024 * 1024, // 10MB
    } as Express.Multer.File;
    expect(() => service.validateFile(file)).toThrow(BadRequestException);
  });

  it('should pass validation for correct file', () => {
    const file = {
      mimetype: 'text/plain',
      size: 1024,
    } as Express.Multer.File;
    expect(() => service.validateFile(file)).not.toThrow();
  });
});
