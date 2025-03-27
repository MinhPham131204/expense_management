import UserInput from '@/components/UserInput'
import SideBar from '../components/Sidebar';
import { BarCharts, PieCharts } from '../components/Charts';
import { useEffect, useState } from 'react';
import { CategoryID, SubCategory, Transaction, TransactionType } from '@/lib/types';
import axios from 'axios';
import "../index.css";
interface Category {
  _id: string;
  name: string;
  subCategory: SubCategory[];
}
import "./pages.css"; 
import { toast } from 'sonner';


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
        setTransData(transactions);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải giao dịch!");
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      setTimeout(() => {
        setLoading(false)
      }, 100)
      
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
        toast.warning("Không thể tải danh mục!");
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


  return ( // lấy latest nên cần sửa transdata lại
    
    <div className='flex items-center justify-between w-screen min-h-screen 
  bg-gradient-to-bl from-blue-100 to-cyan-100 dark:from-gray-900 dark:to-gray-700'>
      <div className='flex-1'>
        <SideBar/>
      </div>
      <div className='flex flex-4 items-center justify-center flex-col w-[80%]'>
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
