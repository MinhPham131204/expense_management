/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
        return this.budgetModel.find({ userID, createdTime: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } }).populate("categoryID").exec();
    }

    async getBudgetById(userID, id: string): Promise<{ budget: Budget, remaining: number, transactions: Transaction[] }> {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;

        const temp = await this.budgetModel.find({ _id: id }).exec();
        const arr = await this.transactionModel.find({ userID, categoryID: temp[0]['categoryID'], type: 'Chi tiêu', datetime: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } }).populate('categoryID').exec();

        const expense = arr.reduce((acc, cur) => acc + parseInt(cur.money), 0);

        return { budget: temp[0], remaining: Number(temp[0].budget) - expense, transactions: arr };
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

    // async getWarningBudgets(userID: string, month: number, year: number): Promise<Budget[]> {
    //     // Get all budgets for current month
    //     const budgets = await this.budgetModel.find({ 
    //         userID, 
    //         createdTime: { 
    //             $gte: new Date(year, month - 1, 1), 
    //             $lt: new Date(year, month, 1) 
    //         } 
    //     }).populate("categoryID").exec();
        
    //     // Filter budgets where remaining amount is <= 10% of original budget
    //     const warningBudgets = budgets.filter(budget => {
    //         const originalBudget = Number(budget.budget);
    //         const remaining = Number(budget.remaining);
    //         const tenPercentOfBudget = originalBudget * 0.1;
            
    //         return remaining <= tenPercentOfBudget;
    //     });
        
    //     return warningBudgets;
    // }

    async analyzeBudgetByMonth(userID: string, month: number, year: number): Promise<Array<{ categoryID: string, categoryName: string, budget: number, remaining: number }>> {
        // Get budgets for the specified month and year
        const budgets = await this.budgetModel.find({ 
            userID, 
            createdTime: { 
                $gte: new Date(year, month - 1, 1), 
                $lt: new Date(year, month, 1) 
            } 
        }).populate("categoryID").exec();
    
        // Get expense transactions for the specified month and year
        const transactions = await this.transactionModel.find({ 
            userID, 
            type: 'Chi tiêu', 
            datetime: { 
                $gte: new Date(year, month - 1, 1), 
                $lt: new Date(year, month, 1) 
            } 
        }).populate('categoryID').exec();
    
        // Transform data into required format
        const result = budgets.map(budget => {
            // Get the budget category ID for comparison
            const budgetCategoryId = budget.categoryID["_id"] ? budget.categoryID["_id"].toString() : budget.categoryID.toString();
            
            // Find transactions for this category
            const categoryTransactions = transactions.filter(transaction => {
                const transactionCategoryId = transaction.categoryID["_id"] ? transaction.categoryID["_id"].toString() : transaction.categoryID.toString();
                
                return transactionCategoryId === budgetCategoryId;
            });
            
            // Calculate total expenses for this category
            const totalExpenses = categoryTransactions.reduce(
                (sum, transaction) => sum + parseInt(transaction.money), 0
            );
            
            // Get category name from the populated field
            const categoryName = budget.categoryID.name || 'Unknown Category';
            
            // Create and return the formatted object
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
}