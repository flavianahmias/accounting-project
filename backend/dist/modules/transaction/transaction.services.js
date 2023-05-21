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
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const transaction_entity_1 = require("./transaction.entity");
const user_entity_1 = require("../user/user.entity");
let TransactionService = class TransactionService {
    constructor(transactionRepository, userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }
    async findAll() {
        return this.transactionRepository.find();
    }
    async saveTransaction(transaction) {
        return this.transactionRepository.create(transaction);
    }
    readTransactionFile(file) {
        const data = file.buffer.toString();
        const lines = data.split('\n');
        const fileTransactions = lines
            .filter((l) => l.length > 67)
            .map((line) => ({
            type: parseInt(line.substring(0, 1)),
            date: new Date(line.substring(1, 26)),
            product: line.substring(26, 56).trim(),
            value: parseFloat(line.substring(56, 66)),
            seller: line.substring(66, 86).trim(),
        }));
        return fileTransactions;
    }
    async getUsersFromFile(fileTransactions) {
        const usersFromTransaction = [];
        const verifiedUsers = [];
        fileTransactions
            .filter((f) => {
            if (verifiedUsers.includes(f.seller)) {
                return false;
            }
            else {
                verifiedUsers.push(f.seller);
                return true;
            }
        })
            .forEach((fileTransaction) => {
            switch (fileTransaction.type) {
                case 1:
                case 3:
                    usersFromTransaction.push({
                        role: user_entity_1.Role.Creator,
                        username: fileTransaction.seller,
                        balance: fileTransaction.value,
                    });
                    break;
                case 2:
                case 4:
                    const creator = fileTransactions.find((f) => f.product === fileTransaction.product &&
                        [1, 3].includes(f.type));
                    if (creator) {
                        usersFromTransaction.push({
                            role: user_entity_1.Role.Affiliate,
                            username: fileTransaction.seller,
                            creatorName: creator.seller,
                        });
                    }
                    break;
            }
        });
        return usersFromTransaction;
    }
    async isActiveUser(username) {
        const foundUser = await this.userRepository.findOne({
            where: { name: username },
        });
        return !!foundUser;
    }
    async createTransaction(transactionFile) {
        const user = await this.userRepository.findOneOrFail({
            where: {
                name: transactionFile.seller,
            },
            relations: ['creator'],
        });
        const transaction = new transaction_entity_1.Transaction({
            date: transactionFile.date,
            seller: user,
            type: transactionFile.type,
            product: transactionFile.product,
            value: transactionFile.value,
        });
        await this.transactionRepository.save(transaction);
        return transaction;
    }
    async createTransactions(transactions) {
        const createdTransactions = [];
        for (let transaction of transactions) {
            let created = await this.createTransaction(transaction);
            createdTransactions.push(created);
        }
        return createdTransactions;
    }
    async getTransactionById(id) {
        return this.transactionRepository.findOneOrFail({
            where: { id },
            relations: ['seller'],
        });
    }
};
TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('TRANSACTION_REPOSITORY')),
    __param(1, (0, common_1.Inject)('USER_REPOSITORY')),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.services.js.map