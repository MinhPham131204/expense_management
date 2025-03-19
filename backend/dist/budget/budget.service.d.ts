import { Model } from 'mongoose';
import { Budget, BudgetDocument } from 'src/schemas/budget.schema';
import { Transaction, TransactionDocument } from 'src/schemas/transaction.schema';
export declare class BudgetService {
    private budgetModel;
    private transactionModel;
    constructor(budgetModel: Model<BudgetDocument>, transactionModel: Model<TransactionDocument>);
    getBudget(userID: string): Promise<Budget[]>;
    getBudgetById(userID: any, id: string): Promise<{
        budget: Budget;
        remaining: number;
        transactions: Transaction[];
    }>;
    createBudget(userID: string, categoryID: string, budget: string): Promise<Budget | {
        message: string;
    }>;
    updateBudget(id: string, budget: string): Promise<Budget>;
    deleteBudget(id: string): Promise<Budget>;
}
