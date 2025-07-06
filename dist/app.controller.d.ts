import { AppService } from './app.service';
import { UploadFileService } from './services/upload-file/upload-file.service';
export declare class AppController {
    private readonly appService;
    private readonly fileUploadService;
    constructor(appService: AppService, fileUploadService: UploadFileService);
    mowLawn(file: Express.Multer.File): Promise<string>;
}
