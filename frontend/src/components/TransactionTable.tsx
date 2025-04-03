import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Timeframe, Transaction, TransactionType } from "../lib/types";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import TransactionSummary from "./TransactionSummary";
import { TRANSACTION_FIELDS } from "@/lib/helper";
import TransactionFilters from "./TransactionFilter";
import { toast } from "sonner";



const sampleData: Transaction[] = [];

type SortConfig = {
  key: keyof Transaction;
  direction: "asc" | "desc";
} | null;

interface TransactionTableProps {
  timeframe: Timeframe;
}

const TransactionTable = ({ timeframe }: TransactionTableProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleData);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "datetime", direction: "desc" });
  const [darkMode, setDarkMode] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: [] as TransactionType[],
    minAmount: "",
    maxAmount: "",
    category: "",
    keyword: "",
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const { startDate, endDate, type, minAmount, maxAmount, category, keyword } = filters;
  
      const transactionDate = new Date(transaction.datetime);
      if (startDate && transactionDate < new Date(startDate)) { return false; }
      if (endDate && transactionDate > new Date(endDate)) { return false; }
  
      if (type.length > 0 && !type.includes(transaction.type)) { return false; }
  
      const money = parseFloat(transaction.money);
      if (minAmount && money < parseFloat(minAmount)) { return false; }
      if (maxAmount && money > parseFloat(maxAmount)) { return false; }
  
      if (category && transaction.categoryID.name !== category) { return false; }
  
      if (keyword && !transaction.description.toLowerCase().includes(keyword.toLowerCase())) { return false; }
  
      return true;
    });
  }, [transactions, filters]);

  const sortedTransactions = useMemo(() => {
    const sortableTransactions = [...filteredTransactions];
    
  
    if (sortConfig !== null) {
      sortableTransactions.sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;
  
        if (sortConfig.key === "datetime") {
          console.log('datetime');
          
          aVal = new Date(a.datetime).getTime();
          bVal = new Date(b.datetime).getTime();
        } else if (sortConfig.key === "categoryID") {
          console.log('categoryID');
          
          aVal = a.categoryID?.name.toLowerCase() ?? "";
          bVal = b.categoryID?.name.toLowerCase() ?? "";
        } else if (sortConfig.key === "money") {
          console.log('money');
          
          aVal = parseInt(a.money) || 0;
          bVal = parseInt(b.money) || 0;
        } else if (typeof a[sortConfig.key] === "string" && typeof b[sortConfig.key] === "string") {
          console.log('string string');
          
          aVal = String(a[sortConfig.key]).toLowerCase();
          bVal = String(b[sortConfig.key]).toLowerCase();
        } else {
          console.log('else');
          
          aVal = a[sortConfig.key];
          bVal = b[sortConfig.key];
        }
  
        if (aVal < bVal) { return sortConfig.direction === "asc" ? -1 : 1; }
        if (aVal > bVal) { return sortConfig.direction === "asc" ? 1 : -1; }
        return 0;
      });
    }
  
    return sortableTransactions;
  }, [ sortConfig, filteredTransactions]);

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 16;

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    return sortedTransactions.slice(startIndex, endIndex);
  }, [sortedTransactions, currentPage]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/transaction?year=2025", { withCredentials: true });
        console.log(response.data.transactions);
        
        setTransactions(response.data.transactions);
        const categories = response.data.transactions
          .filter((t: Transaction) => t.categoryID && typeof t.categoryID.name === "string")
          .map((t: Transaction) => t.categoryID.name) as string[];
        if (categories.length > 0) {
          setAvailableCategories([...new Set(categories)]);
        }
      } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      };
      fetchTransactions();
    }, []);


  const handleEdit = (id: string) => {
    if (window.confirm("Are you sure you want to edit this transaction?")) {
      // setTransactions(transactions.filter((t) => t._id !== id));
      toast.info(`Chỉnh sửa giao dịch có ID: ${id}`, {
        action: {
          label: "Chỉnh sửa",
          onClick: () => console.log(`Edit transaction: ${id}`),
        },
      });
    }
    
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const response = await axios.delete(`http://localhost:3000/transaction/${id}`, { withCredentials: true });
        if (response.status === 200) {
          setTransactions((prev) => prev.filter((t) => t._id !== id));
          toast.success("Giao dịch đã được xóa!");
          console.log(`Delete transaction: ${id}`);
        }
      } catch (error) {
        toast.error("Lỗi khi xóa giao dịch!");
        console.log(error);
      }
    }
  };

  const requestSort = (key: keyof Transaction) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Transaction) => {
    if (!sortConfig || sortConfig.key !== key) { return null; }
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };
  
  

  return (
    <div className={cn(" rounded-lg shadow-lg gap-10 flex w-[90%] h-[920px] m-2 p-4", darkMode ? "bg-gray-900 text-white" : "bg-white flex min-w-1/2  text-gray-900")}> 
      <div className={`flex flex-col items-center gap-6 max-w-1/3 p-4 `}>
        <div className="flex flex-col items-center text-center gap-4 w-full max-w-2xl">
          <h3 className="font-bold text-4xl">Transactions History</h3>
          <TransactionSummary transactions={transactions} />
          <TransactionFilters darkMode={darkMode} onApply={setFilters} availableCategories={availableCategories} />
        </div>
        
        <Button variant="ghost" className="text-red-400 hover:text-blue-400" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4 w-full flex-3 max-w-2/3">
        <Table className="w-full border rounded-lg overflow-hidden">
          <TableHeader className={cn(darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700")}> 
            <TableRow className="n-child:text-center">
              {["Category", "Description", "Date", "Type", "Amount", "Actions"].map((header, index) => {
                const key = TRANSACTION_FIELDS[header]; // Lấy key từ TRANSACTION_FIELDS
                return (
                  <TableHead
                    key={index}
                    className="cursor-pointer p-3 text-blue-700 fill-neutral-200 font-bold pl-2"
                    onClick={() => key && requestSort(key)}
                  >
                    {header}
                    {key ? getSortIndicator(key) : null}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction._id.toString()} className={cn(darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100", "font-medium") }>
                  <TableCell className="font-medium">{transaction.categoryID.name}</TableCell>
                  <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis min-w-[120px] max-w-[120px]">{transaction.description}</TableCell>
                  <TableCell>{new Date(transaction.datetime).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell className={cn(transaction.type === "Thu nhập" ? "text-emerald-500" : "text-red-400")}>
                    {transaction.type}
                  </TableCell>
                  <TableCell>{transaction.money} VNĐ</TableCell>
                  <TableCell>
                    {/* <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEdit(transaction._id)}> <span className={` ${darkMode ? 'text-emerald-700' : 'text-fuchsia-800'}`}>Edit</span></Button> */}
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(transaction._id)}> <span className={` ${darkMode ? 'text-red-600' : 'text-red-400'}`}>Delete</span></Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">No transactions available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-center items-center  space-x-8">
          <Button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            <span className="text-gray-700">Prev</span>
          </Button>
          <span className="font-bold text-lg">Page {currentPage}</span>
          <Button 
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * transactionsPerPage >= sortedTransactions.length}
          >
            <span className="text-gray-700">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
