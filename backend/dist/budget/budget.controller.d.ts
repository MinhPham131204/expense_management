import { Request } from 'express';
import { BudgetService } from './budget.service';
export declare class BudgetController {
    private readonly budgetService;
    constructor(budgetService: BudgetService);
    getAllBudgets(request: Request): Promise<import("../schemas/budget.schema").Budget[]>;
    getBudgetById(request: Request, params: any): Promise<{
        budget: import("../schemas/budget.schema").Budget;
        transactions: import("../schemas/transaction.schema").Transaction[];
    }>;
    createBudget(request: Request, categoryID: string, budget: string): Promise<import("../schemas/budget.schema").Budget | {
        message: string;
    }>;
    updateBudget(id: string, budget: string): Promise<import("../schemas/budget.schema").Budget>;
    deleteBudget(params: any): Promise<import("../schemas/budget.schema").Budget>;
}
