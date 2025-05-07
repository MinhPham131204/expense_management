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
exports.BudgetService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const budget_schema_1 = require("../schemas/budget.schema");
const transaction_schema_1 = require("../schemas/transaction.schema");
let BudgetService = class BudgetService {
    budgetModel;
    transactionModel;
    constructor(budgetModel, transactionModel) {
        this.budgetModel = budgetModel;
        this.transactionModel = transactionModel;
    }
    async getBudget(userID) {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        return this.budgetModel.find({ userID, createdTime: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } }).populate("categoryID").exec();
    }
    async getBudgetById(userID, id) {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const temp = await this.budgetModel.find({ _id: id }).exec();
        const arr = await this.transactionModel.find({ userID, categoryID: temp[0]['categoryID'], type: 'Chi tiêu', datetime: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } }).populate('categoryID').exec();
        const expense = arr.reduce((acc, cur) => acc + parseInt(cur.money), 0);
        return { budget: temp[0], remaining: Number(temp[0].budget) - expense, transactions: arr };
    }
    async createBudget(userID, categoryID, budget) {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const temp = await this.budgetModel.find({ userID, categoryID, createdTime: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } }).exec();
        if (temp.length) {
            return { message: 'Ngân sách cho danh mục này đã tồn tại' };
        }
        const newBudget = new this.budgetModel({ userID, categoryID, budget, createdTime: new Date() });
        return newBudget.save();
    }
    async updateBudget(id, budget) {
        const updatedBudget = await this.budgetModel.findByIdAndUpdate(id, { budget }, { new: true });
        if (!updatedBudget) {
            throw new Error(`Budget with ID ${id} not found`);
        }
        return updatedBudget;
    }
    async deleteBudget(id) {
        const deletedBudget = await this.budgetModel.findByIdAndDelete(id);
        if (!deletedBudget) {
            throw new Error(`Budget with ID ${id} not found`);
        }
        return deletedBudget;
    }
    async analyzeBudgetByMonth(userID, month, year) {
        const budgets = await this.budgetModel.find({
            userID,
            createdTime: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        }).populate("categoryID").exec();
        const transactions = await this.transactionModel.find({
            userID,
            type: 'Chi tiêu',
            datetime: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        }).populate('categoryID').exec();
        const result = budgets.map(budget => {
            const budgetCategoryId = budget.categoryID["_id"] ? budget.categoryID["_id"].toString() : budget.categoryID.toString();
            const categoryTransactions = transactions.filter(transaction => {
                const transactionCategoryId = transaction.categoryID["_id"] ? transaction.categoryID["_id"].toString() : transaction.categoryID.toString();
                return transactionCategoryId === budgetCategoryId;
            });
            const totalExpenses = categoryTransactions.reduce((sum, transaction) => sum + parseInt(transaction.money), 0);
            const categoryName = budget.categoryID.name || 'Unknown Category';
            return {
                categoryID: budgetCategoryId,
                categoryName: categoryName,
                budget: Number(budget.budget),
                expense: totalExpenses,
                remaining: Number(budget.budget) - totalExpenses
            };
        });
        result.sort((a, b) => b.expense - a.expense);
        return result;
    }
};
exports.BudgetService = BudgetService;
exports.BudgetService = BudgetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(budget_schema_1.Budget.name)),
    __param(1, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], BudgetService);
//# sourceMappingURL=budget.service.js.map