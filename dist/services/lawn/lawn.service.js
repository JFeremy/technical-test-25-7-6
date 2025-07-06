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
exports.LawnService = void 0;
const common_1 = require("@nestjs/common");
const lawn_context_service_1 = require("../lawn-context/lawn-context.service");
let LawnService = class LawnService {
    lawnContext;
    constructor(lawnContext) {
        this.lawnContext = lawnContext;
    }
    async setLawn(upperRightPosition) {
        if (upperRightPosition.x < 0 || upperRightPosition.y < 0) {
            throw new common_1.BadRequestException('Upper top corner can not have negative value.');
        }
        const lawn = {
            width: upperRightPosition.x,
            height: upperRightPosition.y,
        };
        await Promise.resolve(this.lawnContext.set(lawn));
        return lawn;
    }
    isInsideLawn(position) {
        const lawn = this.lawnContext.get();
        if (position.x < 0 || position.y < 0) {
            return false;
        }
        if (position.x > lawn.width || position.y > lawn.height) {
            return false;
        }
        return true;
    }
};
exports.LawnService = LawnService;
exports.LawnService = LawnService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [lawn_context_service_1.LawnContextService])
], LawnService);
//# sourceMappingURL=lawn.service.js.map