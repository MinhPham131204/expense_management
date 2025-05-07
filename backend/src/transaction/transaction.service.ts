/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Transaction, TransactionDocument } from 'src/schemas/transaction.schema';

@Injectable()
export class TransactionService {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    ) {}

    async getTransactions(userID: string, year: number): Promise<{ income: number, expense: number, difference: number, transactions: Transaction[] }> {
        const arr = await this.transactionModel.find({ userID, datetime: { $gte: new Date(year, 0, 1), $lt: new Date(year + 1, 0, 1) } }).populate('categoryID').exec();
        const income = arr.reduce((acc, cur) => cur.type === 'Thu nhập' ? acc + parseInt(cur.money) : acc, 0);
        const expense = arr.reduce((acc, cur) => cur.type === 'Chi tiêu' ? acc + parseInt(cur.money) : acc, 0);

        return { income, expense, difference: income - expense, transactions: arr };
    }
    
    async getTransactionsInMonth(userID: string, month: number, year: number): Promise<{ income: number, expense: number, difference: number, transactions: Transaction[] }> {
        let endDate = new Date(year, month, 1);

        if (month < 1 || month > 12) {
            throw new NotFoundException('Tháng không hợp lệ.');
        }
        if (month === 12) {
            endDate = new Date(year + 1, 0, 1);
        }

        const arr = await this.transactionModel.find({ userID, datetime: { $gte: new Date(year, month - 1, 1), $lt: endDate } }).populate('categoryID').exec();
        const income = arr.reduce((acc, cur) => cur.type === 'Thu nhập' ? acc + parseInt(cur.money) : acc, 0);
        const expense = arr.reduce((acc, cur) => cur.type === 'Chi tiêu' ? acc + parseInt(cur.money) : acc, 0);

        return { income, expense, difference: income - expense, transactions: arr };
    }


    async createTransaction(userID: string, type: string, categoryID: string, money: string, description: string, datetime: string ): Promise<Transaction> {
        const newTransaction = new this.transactionModel({ userID, type, categoryID, money, description, datetime });
        return newTransaction.save();
    }

    async deleteTransaction(userID: string, transactionID: string): Promise<{ message: string }> {
        const transaction = await this.transactionModel.findById(transactionID);

        if (!transaction) {
            throw new NotFoundException('Giao dịch không tồn tại.');
        }

        await this.transactionModel.findByIdAndDelete(transactionID);
        return { message: 'Giao dịch đã được xóa thành công.' };
    }

    async analyzeTransByYear(userID: string, year: number): Promise<Array<{ categoryID: string, categoryName: string, totalExpense: number }>> {
        // Get all transactions for the specified year
        const transactions = await this.transactionModel.find({ 
            userID, 
            type: 'Chi tiêu',  // Only expense transactions
            datetime: { 
                $gte: new Date(year, 0, 1), 
                $lt: new Date(year + 1, 0, 1) 
            } 
        }).populate('categoryID').exec();
        
        // Create a map to aggregate expenses by category
        const categoryExpenses = new Map();
        
        // Group transactions by category and sum expenses
        transactions.forEach(transaction => {
            const categoryId = transaction.categoryID["_id"] ? transaction.categoryID["_id"].toString() : transaction.categoryID.toString();
                
            const categoryName = transaction.categoryID.name || 'Unknown Category';
            const amount = parseInt(transaction.money);
            
            if (categoryExpenses.has(categoryId)) {
                const current = categoryExpenses.get(categoryId);
                categoryExpenses.set(categoryId, {
                    categoryID: categoryId,
                    categoryName: categoryName,
                    totalExpense: current.totalExpense + amount
                });
            } else {
                categoryExpenses.set(categoryId, {
                    categoryID: categoryId,
                    categoryName: categoryName,
                    totalExpense: amount
                });
            }
        });
        
        // Convert map to array and sort by totalExpense in descending order
        const result = Array.from(categoryExpenses.values());
        result.sort((a, b) => b.totalExpense - a.totalExpense);
        
        return result;
    }    
}