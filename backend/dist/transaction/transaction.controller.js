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
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("./transaction.service");
let TransactionController = class TransactionController {
    transactionService;
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    async getTransactionsInMonth(request, month, year) {
        return this.transactionService.getTransactionsInMonth(request.cookies['token'], month, year);
    }
    async createTransaction(request, type, categoryID, money, description, datetime) {
        return this.transactionService.createTransaction(request.cookies['token'], type, categoryID, money, description, datetime);
    }
};
exports.TransactionController = TransactionController;
__decorate([
    (0, common_1.Get)('allInMonth'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('month', new common_1.DefaultValuePipe(new Date().getMonth() + 1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('year', new common_1.DefaultValuePipe(new Date().getFullYear()), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactionsInMonth", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('type')),
    __param(2, (0, common_1.Body)('categoryID')),
    __param(3, (0, common_1.Body)('money')),
    __param(4, (0, common_1.Body)('description')),
    __param(5, (0, common_1.Body)('datetime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "createTransaction", null);
exports.TransactionController = TransactionController = __decorate([
    (0, common_1.Controller)('transaction'),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService])
], TransactionController);
//# sourceMappingURL=transaction.controller.js.map