import TransactionTable from '../components/TransactionTable';
import SideBar from '../components/Sidebar';
import { Period, Timeframe } from '@/lib/types';


interface Props { 
  period: Period; 
  setPeriod: (period: Period) => void; 
  timeframe: Timeframe; 
  setTimeframe: (timeframe: Timeframe) => void;
}

const History = () => {
  const timeframe: Timeframe = 'month'
  
  return (
    <div className='flex items-center justify-center w-screen min-h-screen'>
      <SideBar/>
      <TransactionTable timeframe={timeframe}/>
    </div>
  )
}

export default History
