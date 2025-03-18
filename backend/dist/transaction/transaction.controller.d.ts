import { Request } from 'express';
import { TransactionService } from './transaction.service';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    getTransactionsInMonth(request: Request, month: number, year: number): Promise<{
        income: number;
        expense: number;
        difference: number;
        transactions: import("../schemas/transaction.schema").Transaction[];
    }>;
    createTransaction(request: Request, type: string, categoryID: string, money: string, description: string, datetime: string): Promise<import("../schemas/transaction.schema").Transaction>;
}
