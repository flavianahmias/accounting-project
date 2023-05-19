"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseServices = void 0;
const typeorm_1 = require("typeorm");
exports.databaseServices = [
    {
        provide: 'DATA_SOURCE',
        useFactory: async () => {
            const dataSource = new typeorm_1.DataSource({
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: '123',
                database: 'db',
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true,
            });
            return dataSource.initialize();
        },
    },
];
//# sourceMappingURL=database.services.js.map