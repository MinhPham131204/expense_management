import { Transaction } from "@/lib/types";
import { Card } from "./ui/card";

interface TransactionSummaryProps {
  transactions: Transaction[]
}


const TransactionSummary = ( {transactions }: TransactionSummaryProps) => {
    const totalIncome = transactions
      .filter(t => t.type === "Thu nhập")
      .reduce((sum, t) => sum + Number(t.money), 0);
  
    const totalExpense = transactions
      .filter(t => t.type === "Chi tiêu")
      .reduce((sum, t) => sum + Number(t.money), 0);
    return (
      <div className="grid grid-cols-3 gap-4 w-full p-2">
        <Card className="p-4 text-center border-4 border-solid border-cyan-900">
          <h3 className="text-xl font-semibold">💰 Tổng giao dịch</h3>
          <p className="text-lg font-bold">{transactions.length}</p>
        </Card>
        <Card className="p-4 text-center bg-green-100 dark:bg-green-900 border-2 border-solid border-green-500">
          <h3 className="text-xl font-semibold">📈 Tổng thu nhập</h3>
          <p className="text-lg font-bold text-emerald-500 dark:text-green-300">+ 
            {totalIncome.toLocaleString()} VNĐ</p>
        </Card>
        <Card className="p-4 text-center bg-red-100 dark:bg-red-900 border-2 border-solid border-pink-700">
          <h3 className="text-xl font-semibold">📉 Tổng chi tiêu</h3>
          <p className="text-lg font-bold text-red-600 dark:text-red-300">-
            {totalExpense.toLocaleString()} VNĐ</p>
        </Card>
      </div>
    );
    
  };
export default TransactionSummary