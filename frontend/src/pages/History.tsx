import TransactionTable from '../components/TransactionTable';
import SideBar from '../components/Sidebar';
import { Period, Timeframe } from '@/lib/types';
import "./pages.css"; 
import { useEffect, useState } from 'react';


interface Props { 
  period: Period; 
  setPeriod: (period: Period) => void; 
  timeframe: Timeframe; 
  setTimeframe: (timeframe: Timeframe) => void;
}



const History = () => {
  const timeframe: Timeframe = 'month'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        setLoading(false);
      }
  }, []);

  setTimeout(() => {
    setLoading(false)
  }, 100)

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
  
  return (
    <div className="flex flex-row items-center justify-evenly w-screen min-h-screen 
      bg-gradient-to-bl from-blue-200 to-slate-200 dark:from-gray-900 dark:to-gray-700">
      <div className='flex-1'>
        <SideBar/>
      </div>
      <div className="flex-4">
        <TransactionTable timeframe={timeframe} />
      </div>
    </div>
  )
}

export default History
