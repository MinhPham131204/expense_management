import UserInput from '@/components/UserInput'
import SideBar from '../components/Sidebar';
import { BarCharts, PieCharts } from '../components/Charts';
import { useEffect, useState } from 'react';
import { CategoryID, SubCategory, Transaction, TransactionType, Timeframe, BudgetType, BudgetDetail } from '@/lib/types';
import axios from 'axios';
import "../index.css";
import { XCircle, X } from "lucide-react";

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
  const [timeframe, setTimeframe] = useState<Timeframe>("month")
  const [selMonth, setSelMonth] = useState<number>(new Date().getMonth() + 1)
  const [selYear, setSelYear] = useState<number>(new Date().getFullYear())

  // ở đầu component:
const [warnings, setWarnings] = useState<BudgetDetail[]>([]);
const [showBanner, setShowBanner] = useState(true);


// thêm useEffect để fetch và lọc
useEffect(() => {
  const fetchBudgetWarnings = async () => {
    try {
      // 1. Lấy danh sách budgets phân tích tháng/ năm hiện tại
      const res = await axios.get<BudgetType[]>(`http://localhost:3000/budget?month=${selMonth}&year=${selYear}`, {
        withCredentials: true,
      });
      const list = res.data;

      // 2. Với mỗi budget, fetch detail (để lấy remaining)
      const detailRes = await Promise.all(
        list.map((b) =>
          axios.get<BudgetDetail>(`http://localhost:3000/budget/${b._id}`, {
            withCredentials: true,
          }).then(r => r.data)
        )
      );

      // 3. Lọc warning
      const today = new Date();
      const dayOfMonth = today.getDate();
      const filtered = detailRes.filter((d) => {
        const budgetAmt = Number(d.budget.budget);
        const rem = d.remaining;
        const remPct = rem / budgetAmt;
        // cảnh báo cạn: <=10%
        if (remPct <= 0.1) return true;
        // dùng quá ít: remaining >=80% và đã quá ngày 15
        if (dayOfMonth > 15 && remPct >= 0.8) return true;
        return false;
      });

      setWarnings(filtered);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải cảnh báo ngân sách");
    }
  };

  fetchBudgetWarnings();
}, [selMonth, selYear]);

  // transactions latest, month, year
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let res
        if (timeframe === 'month') {
          res = await axios.get(`http://localhost:3000/transaction/allInMonth?month=${selMonth}&year=${selYear}`, { withCredentials: true })
        } else {
          // latest and year use full year endpoint
          res = await axios.get(`http://localhost:3000/transaction?year=${selYear}`, { withCredentials: true })
        }
        setTransData(res.data.transactions)
      } catch (err) {
        toast.error('Không thể tải giao dịch!')
      }
    }
    fetchTransactions()
  }, [timeframe, selMonth, selYear])

  // useEffect(() => {
  //   const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  //   if (isLoggedIn) {
  //     setTimeout(() => {
  //       setLoading(false)
  //     }, 100)
      
  //   }
  // }, []);

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
    if (showBanner && warnings.length > 0) {
      const timer = setTimeout(() => setShowBanner(false), 10000); // 10s
      return () => clearTimeout(timer);
    }
  }, [showBanner, warnings]);


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
    if (sessionStorage.getItem("isLoggedIn") === "true" && transData.length > 0 && categories.length > 0 && parentCategories.length > 0) {
      setLoading(false);
    }
  }, [transData, categories, parentCategories]);

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
      
      // console.log(transactions);
      // console.log(timeframe)
      
      

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
    {/* Alert Banner */}
    {showBanner && warnings.length > 0 && (
  <div className="fixed top-4 left-1/2 -translate-x-1/4 z-50 w-full max-w-2xl">
    <div className="flex items-start justify-between bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg">
      <div className="flex-shrink-0">
        <XCircle className="h-6 w-6 text-yellow-600" />
      </div>
      <div className="ml-3 flex-1">
        <p className="font-bold text-yellow-800 text-2xl">
          ⚠️ Có {warnings.length} danh mục ngân sách cần chú ý:
        </p>
        <ul className="mt-2 list-disc list-inside text-xl text-yellow-700 space-y-1">
          {warnings.map((w) => {
            const budgetAmt = Number(w.budget.budget);
            const pct = (w.remaining / budgetAmt) * 100;
            const label = pct < 0
              ? `vượt ${Math.abs(pct).toFixed(0)}%`
              : `còn lại ${pct.toFixed(0)}%`;
            const name =
              categories.find((item) => item._id === w.budget.categoryID)
                ?.name || "Không rõ danh mục";
            return (
              <li key={w.budget._id}>
                <span className="font-medium">{name}</span> — {label}
              </li>
            );
          })}
        </ul>
      </div>
      <div
        onClick={() => setShowBanner(false)}
        className="ml-4 p-1 rounded-full cursor-pointer bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 hover:text-yellow-900 transition-colors"
        aria-label="Đóng cảnh báo"
      >
        <X className="h-7 w-7" />
      </div>
    </div>
  </div>
)}


      <div className='flex-1'>
        <SideBar/>
      </div>
      <div className='flex flex-4 items-center justify-center flex-col w-[80%] h-screen gap-4'>
        <div className='flex items-center justify-center p-10 gap-10 w-full'>
          <BarCharts data={formattedBarData(transData, timeframe)} timeframe={timeframe} />
        </div>

        <div className='flex items-center justify-center w-full gap-0'>
          <div className='flex items-center justify-center w-2/3 h-4/6 px-10'>
            <PieCharts data={formattedPieData(transData, timeframe)}/>
          </div>

          <div className='flex flex-col items-center justify-center w-3/5 gap-10'>
            <div className='flex flex-wrap items-center gap-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg'>
              <label className='text-lg font-semibold text-gray-700 dark:text-gray-100'>Chọn thời gian:</label>
              <select value={timeframe} onChange={e => setTimeframe(e.target.value as Timeframe)} className='text-lg px-4 py-2 rounded-xl bg-blue-50 dark:bg-gray-700 dark:text-white border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                <option value='latest'>7 ngày gần nhất</option>
                <option value='month'>Theo tháng</option>
                <option value='year'>Theo năm</option>
              </select>
              {timeframe === 'month' && (
                <>
                  <select value={selMonth} onChange={e => setSelMonth(+e.target.value)} className='text-lg px-4 py-2 rounded-xl bg-blue-50 dark:bg-gray-700 dark:text-white border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select value={selYear} onChange={e => setSelYear(+e.target.value)} className='text-lg px-4 py-2 rounded-xl bg-blue-50 dark:bg-gray-700 dark:text-white border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                    {[selYear - 1, selYear, selYear + 1].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </>
              )}
              {timeframe === 'year' && (
                <select value={selYear} onChange={e => setSelYear(+e.target.value)} className='text-lg px-4 py-2 rounded-xl bg-blue-50 dark:bg-gray-700 dark:text-white border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                  {[selYear - 1, selYear, selYear + 1].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              )}
            </div>
            <UserInput transactions={transData} setTransData={setTransData} categories={categories}/>
          </div>

        </div>




        
        
      </div>
    </div>
  )
}

export default Dashboard
