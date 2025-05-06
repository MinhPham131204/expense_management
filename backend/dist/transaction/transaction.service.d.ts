import { Model } from 'mongoose';
import { BudgetDocument } from 'src/schemas/budget.schema';
import { Transaction, TransactionDocument } from 'src/schemas/transaction.schema';
export declare class TransactionService {
    private transactionModel;
    private budgetModel;
    constructor(transactionModel: Model<TransactionDocument>, budgetModel: Model<BudgetDocument>);
    getTransactions(userID: string, year: number): Promise<{
        income: number;
        expense: number;
        difference: number;
        transactions: Transaction[];
    }>;
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
    analyzeTransByYear(userID: string, year: number): Promise<Array<{
        categoryID: string;
        categoryName: string;
        totalExpense: number;
    }>>;
}
