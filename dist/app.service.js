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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const lawn_service_1 = require("./services/lawn/lawn.service");
const mower_service_1 = require("./services/mower/mower.service");
let AppService = class AppService {
    lawnService;
    mowerService;
    constructor(lawnService, mowerService) {
        this.lawnService = lawnService;
        this.mowerService = mowerService;
    }
    async run(options) {
        await this.lawnService.setLawn(options.upperRightPosition);
        const mowerFinalPosition = [];
        for (const mower of options.mowers) {
            console.log('- - - - -');
            console.log(` # Mow started at ${mower.initialPosition.x} ${mower.initialPosition.y} ${mower.initialPosition.direction} with instructions ${mower.instructions.join(',')}`);
            const mowerPosition = await this.mowerService.mow(mower.initialPosition, mower.instructions);
            mowerFinalPosition.push(mowerPosition);
        }
        return mowerFinalPosition;
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [lawn_service_1.LawnService,
        mower_service_1.MowerService])
], AppService);
//# sourceMappingURL=app.service.js.map