export type TransactionType = "Thu nhập" | "Chi tiêu";
export type Timeframe = "latest" | "month" | "year";
export type Period = { year: number; month: number; };
export type SubCategory = { _id: string; name: string; };
export type CategoryID = { _id: string; name: string; superID: string | null;}
export type Transaction = {
    _id: string;
    userID: string;
    categoryID: CategoryID;
    money: string;
    description: string;
    datetime: string;
    type: TransactionType
}

export type Category = {
    _id: string;
    name: string;
    subCategory: SubCategory[];
}
export type BudgetType = {
    _id: string;
    userID: string;
    categoryID: string; //
    budget: string;
    createdTime: Date;
}

export type BudgetDetail = {
    budget: BudgetType;
    remaining: number;
    transactions: Transaction[];
}