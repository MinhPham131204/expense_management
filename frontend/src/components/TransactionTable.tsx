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
import { Timeframe } from '../lib/types';
import axios from "axios";
interface categoryID {
  _id: object;
  name: string;
  superID: categoryID | null;
}

interface Transaction {
  categoryID: categoryID
  category: object;
  description: string;
  datetime: Date;
  type: "Chi tiêu" | "Thu nhập";
  money: number;
  userID: object;
  _id: object;
}

const sampleData: Transaction[] = [
  
];

type SortConfig = {
  key: keyof Transaction;
  direction: "asc" | "desc";
} | null;

const TransactionTable: React.FC = (timeframe) => {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleData);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  console.log(timeframe);
  

  useEffect(() => {
    const fetchTransactions = async () => {
      const url = 'http://localhost:3000/transaction/allInMonth?month=3&year=2025'
      try{

        const response = await axios.get(url, { withCredentials: true })
        console.log(response.data);
        
        setTransactions(response.data.transactions)
      }
      catch(error) {
        console.error("Error fetching transactions:", error);

      }
    }
    fetchTransactions()
  }, [])




  const handleDelete = (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this transaction?")
    ) {
      setTransactions(transactions.filter((t) => t._id !== id));
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
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  const sortedTransactions = useMemo(() => {
    const sortableTransactions = [...transactions];
    if (sortConfig !== null) {
      sortableTransactions.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // For the date column, convert string to timestamp
        if (sortConfig.key === "date") {
          aVal = new Date(aVal as string).getTime();
          bVal = new Date(bVal as string).getTime();
        }

        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTransactions;
  }, [transactions, sortConfig]);

  return (
    <div className="p-4 ">
      <h1 className="text-2xl font-bold mb-4 p-10">Transactions History</h1>
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => requestSort("category")}
            >
              Category{getSortIndicator("category")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => requestSort("description")}
            >
              Description{getSortIndicator("description")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => requestSort("datetime")}
            >
              Date{getSortIndicator("datetime")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => requestSort("type")}
            >
              Type{getSortIndicator("type")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => requestSort("money")}
            >
              Amount{getSortIndicator("money")}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell className="capitalize">
                  {transaction.categoryID.name}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  {new Date(transaction.datetime).toLocaleDateString()}
                </TableCell>
                <TableCell
                  className={`capitalize ${
                    transaction.type === "Thu nhập"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type}
                </TableCell>
                <TableCell>
                  ${transaction.money}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert("Có cần edit không")}
                    className="mr-2"
                  >
                    <span className="text-gray-700">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    <span className="text-red-500">Delete</span>
                    </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No transactions available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
