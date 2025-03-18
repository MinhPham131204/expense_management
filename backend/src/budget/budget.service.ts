/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget, BudgetDocument } from 'src/schemas/budget.schema';

import { Transaction, TransactionDocument } from 'src/schemas/transaction.schema';

@Injectable()
export class BudgetService {
    constructor(
        @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>
    ) {}
    
    async getBudget(userID: string): Promise<Budget[]> {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        return this.budgetModel.find({ userID, createdTime: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } }).exec();
    }

    async getBudgetById(userID, id: string): Promise<{ budget: Budget, transactions: Transaction[] }> {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;

        const temp = await this.budgetModel.find({ _id: id }).exec();
        const arr = await this.transactionModel.find({ userID, categoryID: temp[0]['categoryID'], type: 'Chi tiêu', datetime: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } }).populate('categoryID').exec();

        return { budget: temp[0], transactions: arr };
    }

    async createBudget(userID: string, categoryID: string, budget: string): Promise<Budget | { message: string }> {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const temp = await this.budgetModel.find({ userID, categoryID, createdTime: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } }).exec();
        if(temp.length) {
            return { message: 'Ngân sách cho danh mục này đã tồn tại' };
        } 
        const newBudget = new this.budgetModel({ userID, categoryID, budget, createdTime: new Date() });
        return newBudget.save();
    }

    async updateBudget(id: string, budget: string): Promise<Budget> {
        const updatedBudget = await this.budgetModel.findByIdAndUpdate(id, { budget }, { new: true });
        if (!updatedBudget) {
            throw new Error(`Budget with ID ${id} not found`);
        }
        return updatedBudget;
    }

    async deleteBudget(id: string): Promise<Budget> {
        const deletedBudget = await this.budgetModel.findByIdAndDelete(id);
        if (!deletedBudget) {
            throw new Error(`Budget with ID ${id} not found`);
        }
        return deletedBudget;
    }
}