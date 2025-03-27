/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from 'src/schemas/transaction.schema';

@Injectable()
export class TransactionService {
    constructor(@InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>) {}

    async getTransactionsInMonth(userID: string, month: number, year: number): Promise<{ income: number, expense: number, difference: number, transactions: Transaction[] }> {
        const arr = await this.transactionModel.find({ userID, datetime: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } }).populate('categoryID').exec();
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
}