import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: number;
  category: string;
  description: string;
  date: string;
  type: "income" | "expense";
  amount: number;
}

const sampleData: Transaction[] = [
  {
    id: 1,
    category: "Food",
    description: "Lunch at restaurant",
    date: "2025-03-19",
    type: "expense",
    amount: 15.99,
  },
  {
    id: 2,
    category: "Salary",
    description: "Monthly salary",
    date: "2025-03-15",
    type: "income",
    amount: 3000.0,
  },
  {
    id: 3,
    category: "Transport",
    description: "Bus ticket",
    date: "2025-03-18",
    type: "expense",
    amount: 2.5,
  },
  // Add more sample transactions as needed
];

type SortConfig = {
  key: keyof Transaction;
  direction: "asc" | "desc";
} | null;

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleData);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const handleDelete = (id: number) => {
    if (
      window.confirm("Are you sure you want to delete this transaction?")
    ) {
      setTransactions(transactions.filter((t) => t.id !== id));
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Transactions Table</h1>
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
              onClick={() => requestSort("date")}
            >
              Date{getSortIndicator("date")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => requestSort("type")}
            >
              Type{getSortIndicator("type")}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => requestSort("amount")}
            >
              Amount{getSortIndicator("amount")}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.length > 0 ? (
            sortedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="capitalize">
                  {transaction.category}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell
                  className={`capitalize ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type}
                </TableCell>
                <TableCell>
                  ${transaction.amount.toFixed(2)}
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
