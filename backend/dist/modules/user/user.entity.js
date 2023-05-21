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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Role = void 0;
const typeorm_1 = require("typeorm");
var Role;
(function (Role) {
    Role[Role["Creator"] = 0] = "Creator";
    Role[Role["Affiliate"] = 1] = "Affiliate";
})(Role = exports.Role || (exports.Role = {}));
let User = User_1 = class User {
    constructor(dto) {
        Object.assign(this, dto);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], User.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => User_1, (user) => user.creator),
    __metadata("design:type", Array)
], User.prototype, "affiliates", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => User_1, (user) => {
        user.affiliates;
    }, { nullable: true, cascade: true }),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", User)
], User.prototype, "creator", void 0);
User = User_1 = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map