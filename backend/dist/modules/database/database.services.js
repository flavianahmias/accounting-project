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
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '3360'),
                username: 'root',
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true,
            });
            return dataSource.initialize();
        },
    },
];
//# sourceMappingURL=database.services.js.map