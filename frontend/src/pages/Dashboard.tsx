import UserInput from '@/components/UserInput'
import SideBar from '../components/Sidebar';
import { BarCharts, PieCharts } from '../components/Charts';
import { useEffect, useState } from 'react';
import { CategoryID, SubCategory, Transaction, TransactionType } from '@/lib/types';
import axios from 'axios';
import { PieChart } from 'lucide-react';
interface Category {
  _id: string;
  name: string;
  subCategory: SubCategory[];
}

const Dashboard = () => {
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
