"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const platform_express_1 = require("@nestjs/platform-express");
const upload_file_service_1 = require("./services/upload-file/upload-file.service");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    appService;
    fileUploadService;
    constructor(appService, fileUploadService) {
        this.appService = appService;
        this.fileUploadService = fileUploadService;
    }
    async mowLawn(file) {
        this.fileUploadService.validateFile(file);
        const content = file.buffer.toString('utf-8');
        const lines = content
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
        const [x, y] = lines[0].split(' ').map(Number);
        if (!x || !y) {
            throw new common_1.BadRequestException('Upper top corner is not valid.');
        }
        const mowers = [];
        for (let i = 1; i < lines.length; i += 2) {
            const initialPosition = lines[i];
            const instructions = lines[i + 1];
            if (!initialPosition ||
                !initialPosition.length ||
                !instructions ||
                !instructions.length) {
                throw new common_1.BadRequestException('Each mower must have two lines of instructions.');
            }
            if (!/^\d+ \d+ [NSEW]$/.test(initialPosition)) {
                throw new common_1.BadRequestException(`Invalid mower initial position format at line ${i + 1}. Expected format: 'X Y D' with D in [N, S, E, W].`);
            }
            if (!/^[LRF]+$/.test(instructions)) {
                throw new common_1.BadRequestException(`Invalid mower instructions at line ${i + 2}. Only L, R, and F are allowed.`);
            }
            const [posX, posY, dir] = initialPosition.split(' ');
            mowers.push({
                initialPosition: {
                    x: Number(posX),
                    y: Number(posY),
                    direction: dir,
                },
                instructions: instructions.split(''),
            });
        }
        const positions = await this.appService.run({
            upperRightPosition: { x, y },
            mowers,
        });
        const positionsFormated = positions.map((mower) => `${mower.x} ${mower.y} ${mower.direction}`);
        return positionsFormated.join('\n');
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('/mowers-instructions'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Final positions of the mowers',
        content: {
            'text/plain': {
                example: '1 3 N\n5 1 E',
            },
        },
    }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "mowLawn", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('mowers'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        upload_file_service_1.UploadFileService])
], AppController);
//# sourceMappingURL=app.controller.js.map