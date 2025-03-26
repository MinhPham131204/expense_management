import UserInput from '@/components/UserInput'
import SideBar from '../components/Sidebar';
import { BarCharts, PieCharts } from '../components/Charts';
import { useEffect, useState } from 'react';
import { CategoryID, SubCategory, Transaction, TransactionType } from '@/lib/types';
import axios from 'axios';
interface Category {
  _id: string;
  name: string;
  subCategory: SubCategory[];
}
import "./pages.css"; 

import { motion } from "framer-motion";


const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [transData, setTransData] = useState<Transaction[]>([])
  // transactions latest, month, year
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/transaction/allInMonth", { withCredentials: true });
        const { difference, expense, income, transactions } = response.data
        for (let i = 0; i < transactions.length; i++) {
          const date = new Date(transactions[i].datetime)
          transactions[i].datetime = date.toLocaleString("default", { timeZone: "Asia/Ho_Chi_Minh" });
        }
        console.log(transactions);
        setTransData(transactions);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      setLoading(false);
    }
  }, []);
  
  // categories
  const [categories, setCategories] = useState<SubCategory[]>([])
  const [parentCategories, setParentCategories] = useState<Category[]>([])
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let response = await axios.get("http://localhost:3000/category/expense", { withCredentials: true });
        let data = response.data
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
  //console.log(categories);
  
  useEffect(() => {
    if (sessionStorage.getItem("isLoggedIn") === "true" && transData.length > 0 && categories.length > 0) {
      setLoading(false);
    }
  }, [transData, categories]);

  // if (loading) { 
  //   return (
  //     <div className='w-screen h-screen flex items-center justify-center'>
  //       <motion.div
  //         className="flex items-center justify-center min-h-screen"
  //         initial={{ opacity: 0 }}
  //         animate={{ opacity: 1 }}
  //         exit={{ opacity: 0 }}
  //       >
  //         <motion.div
  //           className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
  //           animate={{ rotate: 360 }}
  //           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  //         />
  //       </motion.div>
  //     </div>
  //   );
  // }


  if (loading) {
    return (
      <div className='w-screen min-h-screen flex items-center justify-center '>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }



if (loading) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
}


  return ( // do lấy latest nên cần sửa transdata lại
    
    <div className='flex items-center justify-between w-screen'>
      <SideBar/>
      <div className='flex items-center justify-center flex-col w-[80%]'>
        <div className='flex items-center justify-center p-10 gap-10'>
          <BarCharts transactions={transData} tf='latest'/>
          <PieCharts transactions={transData} tf='latest'/>
        </div>
       
        <UserInput categories={categories}/>
      </div>
    </div>
  )
}

export default Dashboard
