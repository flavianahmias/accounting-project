"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionProviders = void 0;
const transaction_entity_1 = require("./transaction.entity");
exports.transactionProviders = [
    {
        provide: 'TRANSACTION_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(transaction_entity_1.Transaction),
        inject: ['DATA_SOURCE'],
    },
];
//# sourceMappingURL=transaction.providers.js.map