import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from 'src/schemas/transaction.schema';
export declare class TransactionService {
    private transactionModel;
    constructor(transactionModel: Model<TransactionDocument>);
    getTransactionsInMonth(userID: string, month: number, year: number): Promise<{
        income: number;
        expense: number;
        difference: number;
        transactions: Transaction[];
    }>;
    createTransaction(userID: string, type: string, categoryID: string, money: string, description: string, datetime: string): Promise<Transaction>;
    deleteTransaction(userID: string, transactionID: string): Promise<{
        message: string;
    }>;
}
