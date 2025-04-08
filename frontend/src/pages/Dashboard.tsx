import UserInput from '@/components/UserInput'
import SideBar from '../components/Sidebar';
import { BarCharts, PieCharts } from '../components/Charts';
import { useEffect, useState } from 'react';
import { CategoryID, SubCategory, Transaction, TransactionType, Timeframe } from '@/lib/types';
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
        const response = await axios.get("http://localhost:3000/transaction?year=2025", { withCredentials: true });
        const { difference, expense, income, transactions } = response.data
        // for (let i = 0; i < transactions.length; i++) {
        //   const date = new Date(transactions[i].datetime)
        //   transactions[i].datetime = date.toLocaleString("default", { timeZone: "Asia/Ho_Chi_Minh" });
        // }
        // console.log(transactions);
        
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
        let { data } = response
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
  
  useEffect(() => {
    if (sessionStorage.getItem("isLoggedIn") === "true" && transData.length > 0 && categories.length > 0) {
      setLoading(false);
    }
  }, [transData, categories]);

  // useEffect(() => {
  //   console.log('change', transData);
    
  // }, [transData])

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



  const formattedPieData = (transactions: Transaction[], timeframe: Timeframe) => {
      // Lọc giao dịch theo timeframe nếu cần
      let filteredTransactions = transactions;
      
      if (timeframe === "latest") {
          const today = new Date();
          const lastWeek = new Date();
          lastWeek.setDate(today.getDate() - 6);
          lastWeek.setHours(0,0,0,0)
  
          filteredTransactions = transactions.filter((t) => {
              const transDate = new Date(t.datetime);
              return transDate >= lastWeek && transDate <= today;
          });
  
          
      }
  
      if (timeframe === "month") {
          const today = new Date();
          const currentMonth = today.getMonth();
          const currentYear = today.getFullYear();
  
          filteredTransactions = transactions.filter((t) => {
              const transDate = new Date(t.datetime);
              return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
          });
      }
  
      // Gom nhóm theo danh mục (ăn uống, giải trí, ...)
      const categoryMap = new Map<string, { name: string; money: number; type: string }>();
  
      filteredTransactions.forEach(({ categoryID, money, type }) => {
          if (!categoryMap.has(categoryID.name)) {
              categoryMap.set(categoryID.name, {
                  name: categoryID.name,
                  money: 0,
                  type: type,
              });
          }
          categoryMap.get(categoryID.name)!.money += Number(money);
      });
  
      return Array.from(categoryMap.values());
  };

  const formattedBarData = (transactions: Transaction[], timeframe: Timeframe) => {
          switch (timeframe) {
              case "latest": {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); 
                  const sevenDaysAgo = new Date(today)
                  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); 
                  
                  
                  // Tạo mảng mặc định cho 7 ngày
                  const result = Array.from({ length: 7 }, (_, i) => {
                      const date = new Date(sevenDaysAgo);
                      date.setDate(sevenDaysAgo.getDate() + i);
                      //console.log(date);
                      
                      
              
                      return {
                          date: new Date(date),
                          expense: 0,
                          income: 0,
                      };
                  });
                  
                  //console.log(result);
                  
              
                  // Gộp dữ liệu từ transactions vào mảng 7 ngày gần nhất
                  
                  transactions.forEach((t) => {
                      const transDate = new Date(t.datetime);
                      transDate.setHours(0, 0, 0, 0);
                      
              
                      if (transDate >= sevenDaysAgo && transDate <= today) {
                          const index = Math.floor((transDate.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24)); // Tính vị trí trong mảng
                          
                          if (index >= 0 && index < 7) {
                              if (t.type === "Thu nhập") {
                                  result[index].income += Number(t.money);
                              } else {
                                  result[index].expense += Number(t.money);
                              }
                          }
                      }
                  });
  
                  //console.log(result);
                  
              
                  return result;
              }
              
      
              case "month": {
                  const date = new Date();
                  const year = date.getFullYear();
                  const month = date.getMonth() + 1;
                  
                  // Tạo danh sách ngày trong tháng
                  const daysInMonth = new Date(year, month, 0).getDate();
                  const result = Array.from({ length: daysInMonth }, (_, i) => ({
                      year,
                      month,
                      date: i + 1,
                      expense: 0,
                      income: 0,
                  }));
      
                  // Duyệt qua transactions để gán vào từng ngày tương ứng
                  transactions.forEach((t) => {
                      const transDate = new Date(t.datetime);
                      const transDay = transDate.getDate();
      
                      const index = transDay - 1;
                      if (index >= 0 && index < daysInMonth) {
                          if (t.type === "Thu nhập") {
                              result[index].income += Number(t.money);
                          } else {
                              result[index].expense += Number(t.money);
                          }
                      }
                  });
      
                  return result;
              }
      
              case "year": {
                  const year = new Date().getFullYear();
                  const result = Array.from({ length: 12 }, (_, i) => ({
                      year,
                      month: i + 1,
                      expense: 0,
                      income: 0,
                  }));
      
                  transactions.forEach((t) => {
                      const transDate = new Date(t.datetime);
                      const transMonth = transDate.getMonth();
      
                      if (transDate.getFullYear() === year) {
                          if (t.type === "Thu nhập") {
                              result[transMonth].income += Number(t.money);
                          } else {
                              result[transMonth].expense += Number(t.money);
                          }
                      }
                  });
      
                  return result;
              }
      
              default:
                  return [];
          }
      };


  return (
    
    <div className='flex items-center justify-between w-screen min-h-screen 
  bg-gradient-to-bl from-blue-100 to-cyan-100 dark:from-gray-900 dark:to-gray-700'>

      <div className='flex-1'>
        <SideBar/>
      </div>
      <div className='flex flex-4 items-center justify-center flex-col w-[80%]'>
        <div className='flex items-center justify-center p-10 gap-10'>
          <BarCharts data={formattedBarData(transData, 'latest')} timeframe='latest'/>
          <PieCharts data={formattedPieData(transData, 'latest')}/>
        </div>
        <UserInput transactions={transData} setTransData={setTransData} categories={categories}/>
      </div>
    </div>
  )
}

export default Dashboard
