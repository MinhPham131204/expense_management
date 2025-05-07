import { Request } from 'express';
import { BudgetService } from './budget.service';
export declare class BudgetController {
    private readonly budgetService;
    constructor(budgetService: BudgetService);
    getAllBudgets(request: Request): Promise<import("../schemas/budget.schema").Budget[]>;
    analyzeBudgetByMonth(request: Request): Promise<{
        categoryID: string;
        categoryName: string;
        budget: number;
        remaining: number;
    }[]>;
    createBudget(request: Request, categoryID: string, budget: string): Promise<import("../schemas/budget.schema").Budget | {
        message: string;
    }>;
    updateBudget(id: string, budget: string): Promise<import("../schemas/budget.schema").Budget>;
    getBudgetById(request: Request, params: any): Promise<{
        budget: import("../schemas/budget.schema").Budget;
        remaining: number;
        transactions: import("../schemas/transaction.schema").Transaction[];
    }>;
    deleteBudget(params: any): Promise<import("../schemas/budget.schema").Budget>;
}
