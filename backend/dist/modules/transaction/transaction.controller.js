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
exports.TransactionController = void 0;
const platform_express_1 = require("@nestjs/platform-express");
const common_1 = require("@nestjs/common");
const transaction_services_1 = require("./transaction.services");
const user_services_1 = require("../user/user.services");
const transaction_entity_1 = require("./transaction.entity");
const swagger_1 = require("@nestjs/swagger");
let TransactionController = class TransactionController {
    constructor(transactionService, userService) {
        this.transactionService = transactionService;
        this.userService = userService;
    }
    findAll() {
        return this.transactionService.findAll();
    }
    async createFromFile(file, response) {
        const transcriptedTransactions = this.transactionService.readTransactionFile(file);
        const usersFromFile = await this.transactionService.getUsersFromFile(transcriptedTransactions);
        const missingUsers = [];
        const promises = usersFromFile.map((u) => this.transactionService.isActiveUser(u.username).then((found) => {
            if (!found)
                missingUsers.push(u);
        }));
        await Promise.all(promises);
        await this.userService.createUsers(missingUsers);
        const createdTransactions = await this.transactionService.createTransactions(transcriptedTransactions);
        for (const transaction of createdTransactions) {
            switch (transaction.type) {
                case transaction_entity_1.TransactionType.ReceivedComission:
                case transaction_entity_1.TransactionType.CreatorSell:
                    await this.userService.changeBalanceToUser(transaction.seller.id, transaction.value);
                    break;
                case transaction_entity_1.TransactionType.PaidComission:
                    await this.userService.changeBalanceToUser(transaction.seller.id, -transaction.value);
                    break;
                case transaction_entity_1.TransactionType.AffiliateSell:
                    if (transaction.seller.creator)
                        await this.userService.changeBalanceToUser(transaction.seller.creator.id, transaction.value);
            }
        }
        if (createdTransactions) {
            return response
                .status(common_1.HttpStatus.CREATED)
                .send('Successfully created transactions');
        }
        else {
            return response.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTransaction(id) {
        return this.transactionService.getTransactionById(id);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TransactionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "createFromFile", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransaction", null);
TransactionController = __decorate([
    (0, common_1.Controller)('transaction'),
    __metadata("design:paramtypes", [transaction_services_1.TransactionService,
        user_services_1.UserService])
], TransactionController);
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction.controller.js.map