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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getUser() {
        return 'User!';
    }
    async getUserById(id) {
        return this.userRepository.findOne({
            where: { id },
            relations: ['creator'],
        });
    }
    async createUsers(usersFromTransaction) {
        const creators = usersFromTransaction.filter((u) => u.role === user_entity_1.Role.Creator);
        const affiliates = usersFromTransaction.filter((u) => u.role === user_entity_1.Role.Affiliate);
        const creatorUsers = creators.map((c) => new user_entity_1.User({
            balance: 0,
            name: c.username,
            role: c.role,
        }));
        await this.userRepository.insert(creatorUsers);
        const promises = affiliates.map(async (affiliate) => {
            const creator = await this.userRepository.findOne({
                where: { name: affiliate.creatorName },
            });
            return new user_entity_1.User({
                balance: 0,
                creator,
                name: affiliate.username,
                role: affiliate.role,
            });
        });
        const users = await Promise.all(promises);
        return this.userRepository.insert(users);
    }
    async changeBalanceToUser(id, amount) {
        const foundUser = await this.userRepository.findOneOrFail({
            where: {
                id,
            },
        });
        foundUser.balance += amount;
        return this.userRepository.save(foundUser);
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('USER_REPOSITORY')),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map