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
exports.MowerService = void 0;
const common_1 = require("@nestjs/common");
const lawn_service_1 = require("../lawn/lawn.service");
let MowerService = class MowerService {
    lawnService;
    constructor(lawnService) {
        this.lawnService = lawnService;
    }
    rotate(mowerDirection, order) {
        const index = order.indexOf(mowerDirection);
        const nextIndex = (index + 1) % order.length;
        return order[nextIndex];
    }
    rotateLeft(mower) {
        const directions = ['N', 'W', 'S', 'E'];
        return {
            ...mower,
            direction: this.rotate(mower.direction, directions),
        };
    }
    rotateRight(mower) {
        const directions = ['N', 'E', 'S', 'W'];
        return {
            ...mower,
            direction: this.rotate(mower.direction, directions),
        };
    }
    moveForward(mower) {
        let newX = mower.x;
        let newY = mower.y;
        switch (mower.direction) {
            case 'N':
                newY++;
                break;
            case 'E':
                newX++;
                break;
            case 'S':
                newY--;
                break;
            case 'W':
                newX--;
                break;
        }
        if (this.lawnService.isInsideLawn({
            x: newX,
            y: newY,
        })) {
            return {
                direction: mower.direction,
                x: newX,
                y: newY,
            };
        }
        return mower;
    }
    async mow(mower, actions) {
        let mowerPosition = mower;
        for (const action of actions) {
            switch (action) {
                case 'F':
                    mowerPosition = await Promise.resolve(this.moveForward(mowerPosition));
                    break;
                case 'R':
                    mowerPosition = await Promise.resolve(this.rotateRight(mowerPosition));
                    break;
                case 'L':
                    mowerPosition = await Promise.resolve(this.rotateLeft(mowerPosition));
                    break;
                default:
                    mowerPosition = await Promise.resolve(mowerPosition);
                    break;
            }
            console.log(`Mower (${mower.x} ${mower.y} ${mower.direction}): ${mowerPosition.x} ${mowerPosition.y} ${mowerPosition.direction}}`);
        }
        return mowerPosition;
    }
};
exports.MowerService = MowerService;
exports.MowerService = MowerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [lawn_service_1.LawnService])
], MowerService);
//# sourceMappingURL=mower.service.js.map