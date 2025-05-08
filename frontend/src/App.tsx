import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { Transaction, SubCategory, Category } from "@/lib/types";

import LoginSignup from"./pages/LoginSignup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Budget from "./pages/Budget";
import Statistic from "./pages/Statistic";
import { Toaster } from "sonner";
import './index.css'

const sampleData: Transaction[] = [];




function App(): JSX.Element {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const token = sessionStorage.getItem("isLoggedIn") === "true";

  const [transactions, setTransactions] = useState<Transaction[]>(sampleData);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<SubCategory[]>([])
  const [parentCategories, setParentCategories] = useState<Category[]>([])

  // const [categoryTrends, setCategoryTrends] = useState<CategoryTrend[]>([])
  const [transactionsPeriod, setTransactionsPeriod] = useState<{
    month: number,
    year: number, 
    income: number, 
    expense: number, 
    savings: number
  }[]>([]);


  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn, token]);

  // statistic page

  
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/transaction?year=2025", { withCredentials: true });
        // console.log(response.data);
        
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

  useEffect(() => {
    const fetchTransactionsForMonth = async (year: number, month: number) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/transaction/allInMonth?year=${year}&month=${month}`,
          { withCredentials: true }
        );
        
        // Assuming response.data contains income and expense.
        const { income = 0, expense = 0, savings } = response.data;
        
        return {
          year,
          month,
          income,
          expense,
          savings: savings !== undefined ? savings : income - expense,
        };
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return null;
      }
    };
  
    const fetchAllTransactions = async () => {
      let configs = [];
      
      // Adjust the logic for month edge cases
      if (month === 1) {
        // January: get November and December of previous year and January of current year.
        configs = [
          { year: year - 1, month: 11 },
          { year: year - 1, month: 12 },
          { year: year, month: 1 },
        ];
      } else if (month === 2) {
        // February: get December of previous year and January and February of current year.
        configs = [
          { year: year - 1, month: 12 },
          { year: year, month: 1 },
          { year: year, month: 2 },
        ];
      } else {
        // For month 3 and beyond: previous two months and current month.
        configs = [
          { year: year, month: month - 2 },
          { year: year, month: month - 1 },
          { year: year, month: month },
        ];
      }
  
      // Execute all API calls concurrently.
      const responses = await Promise.all(
        configs.map((config) =>
          fetchTransactionsForMonth(config.year, config.month)
        )
      );
  
      // Filter out any failed requests.
      const validResponses = responses.filter((data) => data !== null);
  
      // Update state with the transformed transactions.
      setTransactionsPeriod(validResponses);
    };
  
    fetchAllTransactions();
  }, [month, year]);

  // console.log(transactions);
  
  
  // console.log(transactionsPeriod);


  // categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let response = await axios.get("http://localhost:3000/category/expense", { withCredentials: true });
        let { data } = response
        response = await axios.get("http://localhost:3000/category/income", { withCredentials: true });
        data = data.concat(response.data)
        setParentCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (parentCategories.length > 0) {
      setCategories(
        parentCategories.flatMap((category: Category) =>
          category.subCategory
        )
      );
    }
  }, [parentCategories]);

  // console.log(parentCategories);
  // console.log(categories);

  
  
  

  return (
    
    <ThemeProvider>
      <Toaster 
        position="bottom-right" 
        richColors
        toastOptions={{
          className: "custom-toast",
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginSignup />} />
          <Route path="/history" element={isLoggedIn ? <History /> : <Navigate to="/login" />} />
          <Route path="/budget" element={isLoggedIn ? <Budget categories={categories} /> : <Navigate to="/login" />} />
          <Route path="/statistic" element={isLoggedIn ? <Statistic transactions={transactions} categories={categories} transactionsPeriod={transactionsPeriod} /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
